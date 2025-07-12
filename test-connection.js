import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3001';

async function testConnection() {
  console.log('🔍 Testing connection to Shades Backend...\n');
  
  // Test 1: Health endpoint
  try {
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health endpoint working:', healthData);
    } else {
      console.log('❌ Health endpoint failed:', healthResponse.status, healthResponse.statusText);
    }
  } catch (error) {
    console.log('❌ Health endpoint error:', error.message);
  }
  
  console.log('');
  
  // Test 2: GraphQL endpoint
  try {
    console.log('2. Testing GraphQL endpoint...');
    const graphqlResponse = await fetch(`${API_BASE_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            generatePalette(hue: 265, chroma: 0.1, isLight: false) {
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
        `
      })
    });
    
    if (graphqlResponse.ok) {
      const graphqlData = await graphqlResponse.json();
      console.log('✅ GraphQL endpoint working');
      console.log('Response structure:', Object.keys(graphqlData));
      
      if (graphqlData.data && graphqlData.data.generatePalette) {
        console.log('✅ generatePalette query working');
        console.log('Colors count:', graphqlData.data.generatePalette.colors.length);
      } else {
        console.log('❌ generatePalette query failed');
        console.log('Response:', JSON.stringify(graphqlData, null, 2));
      }
    } else {
      console.log('❌ GraphQL endpoint failed:', graphqlResponse.status, graphqlResponse.statusText);
    }
  } catch (error) {
    console.log('❌ GraphQL endpoint error:', error.message);
  }
  
  console.log('\n🎯 Connection test completed!');
}

testConnection(); 