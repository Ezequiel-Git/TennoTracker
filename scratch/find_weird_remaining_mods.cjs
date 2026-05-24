async function run() {
  try {
    const res = await fetch(`https://api.warframestat.us/mods?language=pt`);
    const data = await res.json();
    
    const parsed = data.filter(m => {
      if (!m || !m.name) return false;
      const hasDesc = !!(m.description || (Array.isArray(m.description) && m.description.length > 0));
      const hasStats = !!(Array.isArray(m.levelStats) && m.levelStats.length > 0 && m.levelStats.some(s => s.stats && s.stats.length > 0));
      const isSetDummy = m.type === 'Mod Set Mod' || 
                         (m.uniqueName && (m.uniqueName.endsWith('SetMod') || m.uniqueName.includes('SetEffects') || m.uniqueName.includes('SetMod'))) ||
                         (m.name && (m.name.toLowerCase().endsWith('setmod') || m.name.toLowerCase().includes('amarsetmod')));
      const untranslated = m.name.startsWith('/Lotus');
      const isPlaceholder = m.name.toLowerCase().includes('placeholder') || m.name.toLowerCase().includes('devtest') || m.name.toLowerCase().includes('testmod') || m.name.toLowerCase().includes('dummy');
      const isRivenTemplate = m.name.includes('Mod Riven:') || m.name.includes('Riven Mod') || m.name.toLowerCase().includes('riven template') || m.name.toLowerCase().startsWith('hidden ');
      return (hasDesc || hasStats) && !isSetDummy && !untranslated && !isPlaceholder && !isRivenTemplate;
    });

    console.log(`Parsed ${parsed.length} mods.`);
    
    // Print mods with names that look like system paths, or containing Lotus, or having no real description, or having other weird aspects.
    const weird = parsed.filter(m => {
      const name = m.name.toLowerCase();
      const uniq = (m.uniqueName || '').toLowerCase();
      return name.includes('/') || name.includes('\\') || name.includes('lotus') || uniq.includes('test') || name.includes('test') || name.length <= 2;
    });
    
    console.log(`Weird remaining mods (${weird.length}):`);
    weird.forEach(w => {
      console.log(`- Name: "${w.name}", UniqueName: "${w.uniqueName}", Type: "${w.type}", Rarity: "${w.rarity}"`);
    });
  } catch (e) {
    console.error(e);
  }
}
run();
