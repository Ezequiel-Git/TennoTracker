const fs = require('fs');

async function check() {
  try {
    const res = await fetch(`https://api.warframestat.us/mods?language=pt`);
    const data = await res.json();
    const target = data.find(m => m.name === 'Gladiator Aegis');
    console.log('Gladiator Aegis:', target);
    
    // Also find AMARSETMOD
    const amar = data.find(m => m.name.toLowerCase().includes('amarsetmod') || m.uniqueName.toLowerCase().includes('amarsetmod'));
    console.log('Amar set mod:', amar);
  } catch (err) {
    console.error(err);
  }
}

check();
