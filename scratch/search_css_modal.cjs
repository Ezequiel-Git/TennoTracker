const fs = require('fs');
const lines = fs.readFileSync('c:/Users/Pichau/Projetos/Warframe/src/index.css', 'utf8').split('\n');

console.log('=== Modal container and overlay styling ===');
lines.forEach((line, index) => {
  if (line.includes('modal-container') || line.includes('modal-overlay') || line.includes('.main-layout')) {
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
