const fs = require('fs');

async function check() {
  try {
    const res = await fetch(`https://api.warframestat.us/mods?language=en`);
    const data = await res.json();
    const targets = data.filter(m => m.name.toLowerCase().includes('capacitance') || m.uniqueName.toLowerCase().includes('overloadaugment'));
    console.log('Capacitance entries:', targets.map(t => ({
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
