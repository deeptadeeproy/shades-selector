import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3001';
const GRAPHQL_ENDPOINT = `${API_BASE_URL}/graphql`;

async function testPaletteGeneration() {
  const query = `
    query GeneratePalette($hue: Float!, $chroma: Float!, $isLight: Boolean!) {
      generatePalette(hue: $hue, chroma: $chroma, isLight: $isLight) {
        success
        config {
          hue
          chroma
          isLight
        }
        colors {
          name
          value
        }
      }
    }
  `;

  try {
    console.log('Testing palette generation...');
    
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          hue: 265,
          chroma: 0.1,
          isLight: false
        }
      })
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL Errors:', result.errors);
      return;
    }

    console.log('✅ Palette generation successful!');
    console.log('Config:', result.data.generatePalette.config);
    console.log('Colors count:', result.data.generatePalette.colors.length);
    console.log('Sample colors:');
    result.data.generatePalette.colors.slice(0, 3).forEach(color => {
      console.log(`  ${color.name}: ${color.value}`);
    });
    
  } catch (error) {
    console.error('❌ Error testing palette generation:', error.message);
  }
}

// Test health endpoint first
async function testHealth() {
  try {
    console.log('Testing health endpoint...');
    const response = await fetch(`${API_BASE_URL}/health`);
    const result = await response.json();
    console.log('✅ Health check:', result);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
}

async function runTests() {
  console.log('🧪 Testing Shades Backend API...\n');
  
  await testHealth();
  console.log('');
  await testPaletteGeneration();
  
  console.log('\n🎉 Tests completed!');
}

runTests(); 