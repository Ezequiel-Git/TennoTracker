async function run() {
  try {
    const res = await fetch(`https://api.warframestat.us/mods?language=pt`);
    const data = await res.json();
    console.log(`Fetched ${data.length} mods.`);
    
    const parsed = data
      .filter(m => {
        if (!m || !m.name) return false;
        
        const hasDesc = !!(m.description || (Array.isArray(m.description) && m.description.length > 0));
        const hasStats = !!(Array.isArray(m.levelStats) && m.levelStats.length > 0 && m.levelStats.some(s => s.stats && s.stats.length > 0));
        
        const isSetDummy = m.type === 'Mod Set Mod' || 
                           (m.uniqueName && (m.uniqueName.endsWith('SetMod') || m.uniqueName.includes('SetEffects') || m.uniqueName.includes('SetMod'))) ||
                           (m.name && (m.name.toLowerCase().endsWith('setmod') || m.name.toLowerCase().includes('amarsetmod')));
                           
        const untranslated = m.name.startsWith('/Lotus');
        const isPlaceholder = m.name.toLowerCase().includes('placeholder') || m.name.toLowerCase().includes('devtest');
        const isRivenTemplate = m.name.includes('Mod Riven:') || m.name.includes('Riven Mod') || m.name.toLowerCase().includes('riven template') || m.name.toLowerCase().startsWith('hidden ');
        
        return (hasDesc || hasStats) && !isSetDummy && !untranslated && !isPlaceholder && !isRivenTemplate;
      });

    console.log(`Remaining mods: ${parsed.length}`);
    const matchesWeird = parsed.filter(m => {
      const nameLower = m.name.toLowerCase();
      const uniqLower = (m.uniqueName || '').toLowerCase();
      return nameLower.includes('setmod') || nameLower.includes('placeholder') || nameLower.includes('test') || nameLower.includes('dummy') || uniqLower.includes('setmod') || nameLower === 'amarsetmod';
    });
    console.log(`Remaining weird mods:`, matchesWeird.map(m => m.name));
  } catch (e) {
    console.error(e);
  }
}
run();
