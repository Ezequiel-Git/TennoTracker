const fs = require('fs');
const lines = fs.readFileSync('c:/Users/Pichau/Projetos/Warframe/src/index.css', 'utf8').split('\n');

console.log('=== Mod card lines in index.css ===');
lines.forEach((line, index) => {
  if (line.includes('mod-') || line.includes('mods-')) {
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
