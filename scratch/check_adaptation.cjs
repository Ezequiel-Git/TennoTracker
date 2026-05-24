const fs = require('fs');

async function check() {
  try {
    const res = await fetch(`https://api.warframestat.us/mods?language=pt`);
    const data = await res.json();
    const target = data.find(m => m.name.toLowerCase() === 'adaptation' || m.name.toLowerCase() === 'adaptação');
    console.log('Adaptation:', target);
  } catch (err) {
    console.error(err);
  }
}

check();
