const fs = require('fs');

async function check() {
  try {
    const res = await fetch(`https://api.warframestat.us/mods?language=pt`);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    
    const filteredOut = data.filter(m => {
      const hasDesc = !!(m.description || (Array.isArray(m.description) && m.description.length > 0));
      const hasStats = !!(Array.isArray(m.levelStats) && m.levelStats.length > 0 && m.levelStats.some(s => s.stats && s.stats.length > 0));
      const isSetMod = m.uniqueName && (m.uniqueName.includes('/Sets/') || m.uniqueName.endsWith('SetMod') || m.uniqueName.includes('SetEffects'));
      const untranslated = m.name && m.name.startsWith('/Lotus');
      const isPlaceholder = m.name && m.name.toLowerCase().includes('placeholder');
      
      return !hasDesc && !hasStats || isSetMod || untranslated || isPlaceholder;
    });

    console.log(`Filtered out mods count: ${filteredOut.length}`);
    console.log(`Names of filtered out mods:`, filteredOut.map(m => m.name));
  } catch (err) {
    console.error(err);
  }
}

check();
