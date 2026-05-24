async function run() {
  try {
    const res = await fetch(`https://api.warframestat.us/mods?language=pt`);
    const data = await res.json();
    console.log(`Fetched ${data.length} mods.`);
    
    const setDummies = [];
    const untranslatedLotus = [];
    const placeholders = [];
    const rivenTemplates = [];
    const noDescNoStats = [];
    const otherWeird = [];
    
    data.forEach(m => {
      if (!m || !m.name) return;
      const nameLower = m.name.toLowerCase();
      const uniqLower = (m.uniqueName || '').toLowerCase();
      
      const hasDesc = !!(m.description || (Array.isArray(m.description) && m.description.length > 0));
      const hasStats = !!(Array.isArray(m.levelStats) && m.levelStats.length > 0 && m.levelStats.some(s => s.stats && s.stats.length > 0));
      
      const isSetDummy = m.type === 'Mod Set Mod' || 
                         uniqLower.endsWith('setmod') || 
                         uniqLower.includes('seteffects') || 
                         uniqLower.includes('setmod') || 
                         nameLower.endsWith('setmod') || 
                         nameLower.includes('setmod') || 
                         nameLower.includes('amarsetmod');
                         
      const untranslated = m.name.startsWith('/Lotus');
      const isPlaceholder = nameLower.includes('placeholder') || nameLower.includes('devtest') || nameLower.includes('testmod') || nameLower.includes('dummy');
      const isRivenTemplate = m.name.includes('Mod Riven:') || m.name.includes('Riven Mod') || nameLower.includes('riven template') || nameLower.startsWith('hidden ');
      
      if (!(hasDesc || hasStats)) {
        noDescNoStats.push(m.name);
      } else if (isSetDummy) {
        setDummies.push(m.name);
      } else if (untranslated) {
        untranslatedLotus.push(m.name);
      } else if (isPlaceholder) {
        placeholders.push(m.name);
      } else if (isRivenTemplate) {
        rivenTemplates.push(m.name);
      } else if (uniqLower.includes('temp') || nameLower.includes('temp') || nameLower.includes('test') || uniqLower.includes('test')) {
        otherWeird.push({ name: m.name, uniq: m.uniqueName });
      }
    });

    console.log(`Set Dummies count: ${setDummies.length}`);
    console.log(`Lotus count: ${untranslatedLotus.length}`);
    console.log(`Placeholders count: ${placeholders.length}`);
    console.log(`Riven templates count: ${rivenTemplates.length}`);
    console.log(`No Desc / No Stats count: ${noDescNoStats.length}`);
    console.log(`Other weird count: ${otherWeird.length}`);
    
    console.log('\nSample Set Dummies:', setDummies.slice(0, 10));
    console.log('\nSample Lotus:', untranslatedLotus.slice(0, 10));
    console.log('\nSample Placeholders:', placeholders.slice(0, 10));
    console.log('\nSample Riven Templates:', rivenTemplates.slice(0, 10));
    console.log('\nSample No Desc No Stats:', noDescNoStats.slice(0, 10));
    console.log('\nSample Other Weird:', otherWeird.slice(0, 10));
    
  } catch (e) {
    console.error(e);
  }
}

run();
