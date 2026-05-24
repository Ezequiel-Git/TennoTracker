const fs = require('fs');
const lines = fs.readFileSync('c:/Users/Pichau/Projetos/Warframe/src/App.jsx', 'utf8').split('\n');

const query = process.argv[2] || 'renderFormattedDescription';
console.log(`=== Searching for: ${query} ===`);
let count = 0;
lines.forEach((line, index) => {
  if (line.toLowerCase().includes(query.toLowerCase())) {
    count++;
    if (count <= 100) {
      console.log(`${index + 1}: ${line.trim()}`);
    }
  }
});
console.log(`=== Found ${count} matches ===`);
