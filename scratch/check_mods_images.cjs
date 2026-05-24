const fs = require('fs');

async function check() {
  try {
    const res = await fetch(`https://api.warframestat.us/mods?language=pt`);
    const data = await res.json();
    console.log(`Total mods: ${data.length}`);
    
    const missingThumbnail = data.filter(m => !m.wikiaThumbnail);
    console.log(`Mods with missing wikiaThumbnail: ${missingThumbnail.length}`);
    console.log(`First 20 mods with missing wikiaThumbnail:`, missingThumbnail.slice(0, 20).map(m => m.name));
    
    const hasThumbnail = data.filter(m => m.wikiaThumbnail);
    console.log(`Mods WITH wikiaThumbnail: ${hasThumbnail.length}`);
    console.log(`First 10 wikiaThumbnails:`, hasThumbnail.slice(0, 10).map(m => ({ name: m.name, thumb: m.wikiaThumbnail })));
  } catch (err) {
    console.error(err);
  }
}

check();
