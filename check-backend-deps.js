import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function checkBackendDependencies() {
  console.log('🔍 Checking Shades Backend Dependencies...\n');
  
  const backendPath = path.join(__dirname, '..', 'shades-backend');
  
  // Check if backend directory exists
  if (!fs.existsSync(backendPath)) {
    console.log('❌ Backend directory not found at:', backendPath);
    console.log('Make sure you have the shades-backend directory in the same parent folder as shades');
    return;
  }
  
  console.log('✅ Backend directory found at:', backendPath);
  
  // Check package.json
  const packageJsonPath = path.join(backendPath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ Backend package.json not found');
    return;
  }
  
  console.log('✅ Backend package.json found');
  
  // Check node_modules
  const nodeModulesPath = path.join(backendPath, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('❌ Backend node_modules not found');
    console.log('Run: cd shades-backend && npm install');
    return;
  }
  
  console.log('✅ Backend node_modules found');
  
  // Check key dependencies
  const keyDeps = [
    'apollo-server-express',
    'express',
    'graphql',
    'cors'
  ];
  
  console.log('\nChecking key dependencies:');
  keyDeps.forEach(dep => {
    const depPath = path.join(nodeModulesPath, dep);
    if (fs.existsSync(depPath)) {
      console.log(`✅ ${dep}`);
    } else {
      console.log(`❌ ${dep} - missing`);
    }
  });
  
  // Check server.js
  const serverPath = path.join(backendPath, 'server.js');
  if (!fs.existsSync(serverPath)) {
    console.log('\n❌ Backend server.js not found');
    return;
  }
  
  console.log('\n✅ Backend server.js found');
  
  // Check schema and resolvers
  const schemaPath = path.join(backendPath, 'schema.js');
  const resolversPath = path.join(backendPath, 'resolvers.js');
  
  if (!fs.existsSync(schemaPath)) {
    console.log('❌ Backend schema.js not found');
  } else {
    console.log('✅ Backend schema.js found');
  }
  
  if (!fs.existsSync(resolversPath)) {
    console.log('❌ Backend resolvers.js not found');
  } else {
    console.log('✅ Backend resolvers.js found');
  }
  
  console.log('\n🎯 Backend dependency check completed!');
  console.log('\nTo start the backend:');
  console.log('cd shades-backend && npm start');
}

checkBackendDependencies(); 