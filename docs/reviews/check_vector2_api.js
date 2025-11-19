// Script to extract and compare Vector2 APIs
const fs = require('fs');

// Read the old Vector2 implementation
const oldCode = fs.readFileSync('original_vector2.ts', 'utf8');

// Extract static methods from old code
const staticMethodRegex = /public static (?:readonly\s+)?(\w+)(?:\s*[=(:]\s*|\s+)/g;
const staticMethods = new Set();
let match;
while ((match = staticMethodRegex.exec(oldCode)) !== null) {
  staticMethods.add(match[1]);
}

// Extract instance methods from old code
const instanceMethodRegex = /public\s+(?:get\s+)?(\w+)(?:\s*\(|\s*:)/g;
const instanceMethods = new Set();
while ((match = instanceMethodRegex.exec(oldCode)) !== null) {
  instanceMethods.add(match[1]);
}

// Log results
console.log('=== ORIGINAL VECTOR2 API ===');
console.log('\nStatic Constants and Methods:');
[...staticMethods].sort().forEach(m => console.log(`  - ${m}`));

console.log('\nInstance Methods and Properties:');
[...instanceMethods].sort().forEach(m => console.log(`  - ${m}`));

console.log('\nTotal Static: ', staticMethods.size);
console.log('Total Instance: ', instanceMethods.size);
