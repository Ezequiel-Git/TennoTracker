async function run() {
  const tagMapKeys = new Set([
    'VIRAL', 'SLASH', 'FIRE', 'HEAT', 'POISON', 'TOXIN', 'FREEZE', 'COLD',
    'SENTIENT', 'TAU', 'ELECTRICITY', 'CORROSIVE', 'MAGNETIC', 'RADIATION',
    'BLAST', 'GAS', 'IMPACT', 'PUNCTURE', 'VOID'
  ]);

  try {
    const urls = [
      'https://api.warframestat.us/weapons?language=pt',
      'https://api.warframestat.us/warframes?language=pt',
      'https://api.warframestat.us/mods?language=pt'
    ];
    
    const allTags = new Set();
    
    const checkString = (val) => {
      if (!val) return;
      let str = '';
      if (Array.isArray(val)) {
        str = val.join(' ');
      } else if (typeof val === 'string') {
        str = val;
      } else {
        str = String(val);
      }
      
      const matches = str.match(/<DT_[A-Z0-9_]+_COLOR>/gi);
      if (matches) {
        matches.forEach(m => {
          const tag = m.substring(4, m.length - 7).toUpperCase();
          allTags.add(tag);
        });
      }
    };
    
    for (const url of urls) {
      const res = await fetch(url);
      const data = await res.json();
      
      data.forEach(item => {
        if (!item) return;
        checkString(item.description);
        if (item.abilities) {
          item.abilities.forEach(a => checkString(a.description));
        }
        if (item.levelStats) {
          item.levelStats.forEach(s => {
            if (s.stats) s.stats.forEach(checkString);
          });
        }
      });
    }
    
    console.log('All DT tags found in the API:');
    allTags.forEach(t => {
      const isMapped = tagMapKeys.has(t);
      console.log(`- ${t}: ${isMapped ? 'Mapped' : 'NOT MAPPED ❌'}`);
    });
  } catch (e) {
    console.error(e);
  }
}
run();
