import { oklchToHex, oklchToRgba, oklchToHsl } from './oklchConversions';

// Test the conversion functions with the example provided by the user
// Note: The object uses 0-1 range for lightness, but CSS strings use percentage
const oklchColor = { l: 0.75, c: 0.15, h: 260, a: 1 };

console.log('Testing Oklch conversion functions with culori...');

const hexColor = oklchToHex(oklchColor);
console.log(`HEX: ${hexColor}`); // Expected: #a188d7

const rgbaColor = oklchToRgba(oklchColor);
console.log(`RGBA: rgba(${rgbaColor.r}, ${rgbaColor.g}, ${rgbaColor.b}, ${rgbaColor.a})`); // Expected: rgba(161, 136, 215, 1)

const hslColor = oklchToHsl(oklchColor);
console.log(`HSL: hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%, ${hslColor.a})`); // Expected: hsl(258, 48%, 69%, 1)

// Test with string parsing functions
import { oklchStringToHex, oklchStringToRgba, oklchStringToHsl, parseOklchString } from './oklchConversions';

const oklchString = 'oklch(75% 0.15 260)';

console.log('\nTesting string parsing functions...');

const hexFromString = oklchStringToHex(oklchString);
console.log(`HEX from string: ${hexFromString}`);

const rgbaFromString = oklchStringToRgba(oklchString);
console.log(`RGBA from string: ${rgbaFromString}`);

const hslFromString = oklchStringToHsl(oklchString);
console.log(`HSL from string: ${hslFromString}`);

// Test parsing function directly
console.log('\nTesting parseOklchString function...');
const parsed = parseOklchString(oklchString);
console.log(`Parsed object:`, parsed);

// Test edge cases
console.log('\nTesting edge cases...');
const edgeCases = [
  'oklch(0% 0 0)',
  'oklch(100% 0.4 360)',
  'oklch(50% 0.2 180)',
  'oklch(25% 0.1 90 0.5)', // with alpha
];

edgeCases.forEach(testCase => {
  console.log(`Testing: ${testCase}`);
  const parsed = parseOklchString(testCase);
  if (parsed) {
    console.log(`  Parsed: l=${parsed.l}, c=${parsed.c}, h=${parsed.h}, a=${parsed.a}`);
    console.log(`  HEX: ${oklchStringToHex(testCase)}`);
  } else {
    console.log(`  Failed to parse`);
  }
});

export { oklchColor, hexColor, rgbaColor, hslColor }; 