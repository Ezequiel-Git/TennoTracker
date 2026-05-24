const fs = require('fs');
const lines = fs.readFileSync('c:/Users/Pichau/Projetos/Warframe/src/App.jsx', 'utf8').split('\n');

const searchTokens = ['fallbackMods', 'modsData'];

searchTokens.forEach(token => {
  console.log(`\n=== Matches for: ${token} ===`);
  lines.forEach((line, index) => {
    if (line.includes(token)) {
      console.log(`${index + 1}: ${line.trim()}`);
    }
  });
});
