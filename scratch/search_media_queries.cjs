const fs = require('fs');
const lines = fs.readFileSync('c:/Users/Pichau/Projetos/Warframe/src/index.css', 'utf8').split('\n');

console.log('=== Media Queries in index.css ===');
lines.forEach((line, idx) => {
  if (line.includes('@media')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
