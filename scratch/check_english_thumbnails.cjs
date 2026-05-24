const fs = require('fs');

async function check() {
  try {
    const resPt = await fetch(`https://api.warframestat.us/mods?language=pt`);
    const ptData = await resPt.json();
    
    const resEn = await fetch(`https://api.warframestat.us/mods?language=en`);
    const enData = await resEn.json();
    
    console.log(`PT mods: ${ptData.length}, EN mods: ${enData.length}`);
    
    // Create a map of uniqueName -> wikiaThumbnail from EN data
    const enThumbMap = new Map();
    enData.forEach(m => {
      if (m.uniqueName && m.wikiaThumbnail) {
        enThumbMap.set(m.uniqueName, m.wikiaThumbnail);
      }
    });
    
    // Check how many PT mods that lack thumbnail have it in EN data
    let foundInEnCount = 0;
    const stillMissing = [];
    
    ptData.forEach(m => {
      if (!m.wikiaThumbnail && m.uniqueName) {
        const enThumb = enThumbMap.get(m.uniqueName);
        if (enThumb) {
          foundInEnCount++;
        } else {
          stillMissing.push(m.name);
        }
      }
    });
    
    console.log(`Mods without thumbnail in PT that HAVE it in EN: ${foundInEnCount}`);
    console.log(`Mods still missing thumbnails in both: ${stillMissing.length}`);
    console.log(`First 30 still missing in both:`, stillMissing.slice(0, 30));
  } catch (err) {
    console.error(err);
  }
}

check();
