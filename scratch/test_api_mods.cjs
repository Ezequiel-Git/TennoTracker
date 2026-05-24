const fs = require('fs');

async function check() {
  try {
    const res = await fetch(`https://api.warframestat.us/mods?language=pt`);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    console.log(`Total live mods: ${data.length}`);
    
    // Find mods with no descriptions, or with names like AMARSETMOD, or uniqueName containing SetMod
    const setMods = data.filter(m => m.uniqueName && (m.uniqueName.includes('SetMod') || m.name.includes('SETMOD') || m.uniqueName.includes('SetEffects')));
    console.log(`Set mods count: ${setMods.length}`);
    console.log(`Some set mods:`, setMods.slice(0, 10).map(m => ({ name: m.name, uniqueName: m.uniqueName, desc: m.description, compatibility: m.compatibility })));
    
    const noDesc = data.filter(m => !m.description && (!m.levelStats || m.levelStats.length === 0));
    console.log(`Mods with no description/stats: ${noDesc.length}`);
    console.log(`Some no-desc mods:`, noDesc.slice(0, 10).map(m => ({ name: m.name, uniqueName: m.uniqueName })));

    const testOrBugged = data.filter(m => m.name && (m.name.startsWith('/Lotus') || m.name.toLowerCase().includes('placeholder') || m.name.toLowerCase().includes('dev') || m.name.includes('TEST')));
    console.log(`Test or bugged mods: ${testOrBugged.length}`);
    console.log(`Some test/bugged mods:`, testOrBugged.slice(0, 10).map(m => ({ name: m.name, uniqueName: m.uniqueName })));
  } catch (err) {
    console.error(err);
  }
}

check();
