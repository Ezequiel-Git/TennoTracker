const fs = require('fs');
const lines = fs.readFileSync('c:/Users/Pichau/Projetos/Warframe/src/index.css', 'utf8').split('\n');

console.log('=== Matches for modal-container ===');
lines.forEach((line, index) => {
  if (line.includes('modal-container')) {
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
