const fs = require('fs');
const lines = fs.readFileSync('c:/Users/Pichau/Projetos/Warframe/src/App.jsx', 'utf8').split('\n');

console.log('=== Matches for filteredMods ===');
lines.forEach((line, index) => {
  if (line.includes('filteredMods')) {
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
