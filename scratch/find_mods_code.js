const fs = require('fs');
const lines = fs.readFileSync('c:/Users/Pichau/Projetos/Warframe/src/App.jsx', 'utf8').split('\n');

const searchTokens = ['fetchMods', 'mods', 'setSelectedMod', 'selectedMod', 'AMARSETMOD', 'uniqueName', 'drops', 'drops:', 'dropChance'];

searchTokens.forEach(token => {
  console.log(`\n=== Matches for: ${token} ===`);
  let count = 0;
  lines.forEach((line, index) => {
    if (line.includes(token)) {
      count++;
      if (count <= 40) {
        console.log(`${index + 1}: ${line.trim()}`);
      }
    }
  });
  if (count > 40) {
    console.log(`... and ${count - 40} more matches`);
  }
});
