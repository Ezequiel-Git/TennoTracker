const fs = require('fs');

async function check() {
  try {
    const res = await fetch(`https://api.warframestat.us/mods?language=en`);
    const data = await res.json();
    const targets = data.filter(m => m.name.toLowerCase() === 'adaptation' || m.name.toLowerCase() === 'ammo drum');
    console.log('Adaptation & Ammo Drum entries in EN:', targets.map(t => ({
      name: t.name,
      uniqueName: t.uniqueName,
      wikiaThumbnail: t.wikiaThumbnail,
      wikiaUrl: t.wikiaUrl
    })));
  } catch (err) {
    console.error(err);
  }
}

check();
