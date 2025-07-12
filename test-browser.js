// Browser-compatible GraphQL test
// Copy and paste this into your browser console when on the frontend

async function testGraphQLInBrowser() {
  console.log('🧪 Testing GraphQL in Browser...\n');
  
  const API_BASE_URL = 'http://localhost:3001';
  
  try {
    console.log('1. Testing GraphQL endpoint...');
    
    const response = await fetch(`${API_BASE_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
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
        `,
        variables: {
          hue: 265,
          chroma: 0.1,
          isLight: false
        }
      })
    });
    
    console.log('Response status:', response.status, response.statusText);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ GraphQL request successful!');
      console.log('Response data:', data);
      
      if (data.data && data.data.generatePalette) {
        const palette = data.data.generatePalette;
        console.log('Palette success:', palette.success);
        console.log('Colors count:', palette.colors.length);
        console.log('Sample colors:');
        palette.colors.slice(0, 3).forEach(color => {
          console.log(`  ${color.name}: ${color.value}`);
        });
      }
    } else {
      const errorText = await response.text();
      console.log('❌ GraphQL request failed');
      console.log('Error response:', errorText);
    }
    
  } catch (error) {
    console.log('❌ GraphQL request error:', error.message);
  }
  
  console.log('\n🎯 Browser GraphQL test completed!');
}

// Run the test
testGraphQLInBrowser(); 