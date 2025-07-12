import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3001';

async function test500Error() {
  console.log('🔍 Testing 500 Error...\n');
  
  // Test 1: Simple introspection query
  try {
    console.log('1. Testing GraphQL introspection...');
    const response = await fetch(`${API_BASE_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            __schema {
              queryType {
                name
              }
            }
          }
        `
      })
    });
    
    console.log('Introspection response status:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Introspection successful:', data);
    } else {
      const errorText = await response.text();
      console.log('❌ Introspection failed:', errorText);
    }
  } catch (error) {
    console.log('❌ Introspection error:', error.message);
  }
  
  console.log('');
  
  // Test 2: Simple query without variables
  try {
    console.log('2. Testing simple generatePalette query...');
    const response = await fetch(`${API_BASE_URL}/graphql`, {
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
    
    console.log('Simple query response status:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Simple query successful:', data);
    } else {
      const errorText = await response.text();
      console.log('❌ Simple query failed:', errorText);
    }
  } catch (error) {
    console.log('❌ Simple query error:', error.message);
  }
  
  console.log('');
  
  // Test 3: Query with variables (like frontend)
  try {
    console.log('3. Testing query with variables...');
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
    
    console.log('Variables query response status:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Variables query successful:', data);
    } else {
      const errorText = await response.text();
      console.log('❌ Variables query failed:', errorText);
    }
  } catch (error) {
    console.log('❌ Variables query error:', error.message);
  }
  
  console.log('\n🎯 500 Error test completed!');
}

test500Error(); 