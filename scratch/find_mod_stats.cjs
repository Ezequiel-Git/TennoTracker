const fs = require('fs');
const lines = fs.readFileSync('c:/Users/Pichau/Projetos/Warframe/src/App.jsx', 'utf8').split('\n');

console.log('=== Matches for modStats ===');
lines.forEach((line, index) => {
  if (line.includes('modStats')) {
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
