const fs = require('fs');

async function check() {
  try {
    const res = await fetch(`https://api.warframestat.us/mods?language=pt`);
    const data = await res.json();
    
    const filteredOut = data.filter(m => {
      const hasDesc = !!(m.description || (Array.isArray(m.description) && m.description.length > 0));
      const hasStats = !!(Array.isArray(m.levelStats) && m.levelStats.length > 0 && m.levelStats.some(s => s.stats && s.stats.length > 0));
      
      const isSetDummy = m.type === 'Mod Set Mod' || 
                         (m.uniqueName && (m.uniqueName.endsWith('SetMod') || m.uniqueName.includes('SetEffects'))) ||
                         (m.name && m.name.toLowerCase().endsWith('setmod'));
                         
      const untranslated = m.name && m.name.startsWith('/Lotus');
      const isPlaceholder = m.name && (m.name.toLowerCase().includes('placeholder') || m.name.toLowerCase().includes('devtest'));
      const isRivenTemplate = m.name && m.name.includes('Mod Riven:');
      
      // If it lacks both desc & stats, or is a dummy, or untranslated/placeholder
      return (!hasDesc && !hasStats) || isSetDummy || untranslated || isPlaceholder || isRivenTemplate;
    });

    console.log(`Filtered out mods count: ${filteredOut.length}`);
    console.log(`Names of filtered out mods (first 30):`, filteredOut.slice(0, 30).map(m => m.name));
  } catch (err) {
    console.error(err);
  }
}

check();
