const fs = require('fs');
const lines = fs.readFileSync('c:/Users/Pichau/Projetos/Warframe/src/App.jsx', 'utf8').split('\n');

console.log('=== Matches for activeTab ===');
lines.forEach((line, index) => {
  if (line.includes("activeTab === 'mods'") || line.includes('activeTab === "mods"')) {
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
