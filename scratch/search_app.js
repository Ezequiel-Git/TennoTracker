const fs = require('fs');
const lines = fs.readFileSync('c:/Users/Pichau/Projetos/Warframe/src/App.jsx', 'utf8').split('\n');

const searchTokens = ['shoppingList', 'shoppingDrawerOpen', 'toggleShoppingItem', 'clearShoppingList', 'shoppingResources', 'worldCycles', 'formatCountdown', 'cetusCycle', 'vallisCycle', 'cambionCycle', 'baro', 'activeTab'];

searchTokens.forEach(token => {
  console.log(`=== Matches for: ${token} ===`);
  lines.forEach((line, index) => {
    if (line.includes(token)) {
      console.log(`${index + 1}: ${line.trim()}`);
    }
  });
});
