import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3001';

async function testBackendStatus() {
  console.log('🔍 Testing Shades Backend Status...\n');
  
  // Test 1: Basic connectivity
  try {
    console.log('1. Testing basic connectivity...');
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend is running and responding');
      console.log('Health data:', data);
    } else {
      console.log('❌ Backend health check failed:', response.status, response.statusText);
      return;
    }
  } catch (error) {
    console.log('❌ Cannot connect to backend:', error.message);
    console.log('Make sure the backend is running with: cd shades-backend && npm start');
    return;
  }
  
  console.log('');
  
  // Test 2: Check if GraphQL endpoint exists
  try {
    console.log('2. Testing GraphQL endpoint availability...');
    const response = await fetch(`${API_BASE_URL}/graphql`, {
      method: 'GET'
    });
    
    console.log('GraphQL endpoint status:', response.status, response.statusText);
    
    if (response.status === 405) {
      console.log('✅ GraphQL endpoint exists (Method Not Allowed is expected for GET)');
    } else if (response.status === 404) {
      console.log('❌ GraphQL endpoint not found - Apollo Server may not be initialized');
    } else {
      console.log('⚠️  Unexpected response from GraphQL endpoint');
    }
  } catch (error) {
    console.log('❌ Error testing GraphQL endpoint:', error.message);
  }
  
  console.log('');
  
  // Test 3: Test GraphQL introspection
  try {
    console.log('3. Testing GraphQL introspection...');
    const response = await fetch(`${API_BASE_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query IntrospectionQuery {
            __schema {
              queryType {
                name
              }
              types {
                name
              }
            }
          }
        `
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ GraphQL introspection successful');
      
      if (data.data && data.data.__schema) {
        const queryType = data.data.__schema.queryType;
        const types = data.data.__schema.types.map(t => t.name);
        
        console.log('Query type:', queryType.name);
        console.log('Available types:', types.filter(t => !t.startsWith('__')).join(', '));
        
        // Check if generatePalette query exists
        if (types.includes('GeneratedPalette')) {
          console.log('✅ generatePalette query type found');
        } else {
          console.log('❌ generatePalette query type not found');
        }
      }
    } else {
      console.log('❌ GraphQL introspection failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.log('❌ GraphQL introspection error:', error.message);
  }
  
  console.log('');
  
  // Test 4: Test actual palette generation
  try {
    console.log('4. Testing palette generation...');
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
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Palette generation successful');
      
      if (data.data && data.data.generatePalette) {
        const palette = data.data.generatePalette;
        console.log('Success:', palette.success);
        console.log('Config:', palette.config);
        console.log('Colors count:', palette.colors.length);
        console.log('Sample colors:');
        palette.colors.slice(0, 3).forEach(color => {
          console.log(`  ${color.name}: ${color.value}`);
        });
      } else {
        console.log('❌ Unexpected response structure:', JSON.stringify(data, null, 2));
      }
    } else {
      console.log('❌ Palette generation failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.log('❌ Palette generation error:', error.message);
  }
  
  console.log('\n🎯 Backend status test completed!');
}

testBackendStatus(); 