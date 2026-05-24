const fs = require('fs');

async function check() {
  try {
    const res = await fetch(`https://api.warframestat.us/mods?language=pt`);
    const data = await res.json();
    
    // Parse
    const parsed = data.filter(m => m && m.name).map(m => ({
      uniqueName: m.uniqueName || m.name,
      name: m.name,
      polarity: (m.polarity || '').toLowerCase(),
      rarity: m.rarity || 'Common',
      baseDrain: m.baseDrain || 0,
      fusionLimit: m.fusionLimit || 0,
      type: m.type || 'Mod',
      wikiaThumbnail: m.wikiaThumbnail,
      wikiaUrl: m.wikiaUrl,
      drops: m.drops || [],
      description: m.description || ''
    }));

    // Filter out set dummy mods & random riven templates first
    const cleanMods = parsed.filter(m => {
      const hasDesc = !!m.description;
      const isSetDummy = m.type === 'Mod Set Mod' || 
                         (m.uniqueName && (m.uniqueName.endsWith('SetMod') || m.uniqueName.includes('SetEffects'))) ||
                         (m.name && m.name.toLowerCase().endsWith('setmod'));
      const untranslated = m.name && m.name.startsWith('/Lotus');
      const isPlaceholder = m.name && (m.name.toLowerCase().includes('placeholder') || m.name.toLowerCase().includes('devtest'));
      const isRivenTemplate = m.name && m.name.includes('Mod Riven:');
      
      return hasDesc && !isSetDummy && !untranslated && !isPlaceholder && !isRivenTemplate;
    });

    // De-duplicate
    const uniqueModsMap = new Map();
    for (const m of cleanMods) {
      const key = (m.name || '').trim().toLowerCase();
      if (!key) continue;
      const existing = uniqueModsMap.get(key);
      if (!existing) {
        uniqueModsMap.set(key, m);
      } else {
        const existingIsPvp = existing.uniqueName && existing.uniqueName.toLowerCase().includes('pvp');
        const currentIsPvp = m.uniqueName && m.uniqueName.toLowerCase().includes('pvp');
        if (existingIsPvp && !currentIsPvp) {
          uniqueModsMap.set(key, m);
          continue;
        }
        if (!existingIsPvp && currentIsPvp) {
          continue;
        }
        if (!existing.wikiaThumbnail && m.wikiaThumbnail) {
          uniqueModsMap.set(key, m);
          continue;
        }
        if (existing.wikiaThumbnail && !m.wikiaThumbnail) {
          continue;
        }
        const existingDescLen = (existing.description || '').length;
        const currentDescLen = (m.description || '').length;
        if (currentDescLen > existingDescLen) {
          uniqueModsMap.set(key, m);
        }
      }
    }
    
    const deDuplicated = Array.from(uniqueModsMap.values());
    console.log(`De-duplicated mods: ${deDuplicated.length}`);
    
    const missing = deDuplicated.filter(m => !m.wikiaThumbnail);
    console.log(`Still missing thumbnails: ${missing.length}`);
    console.log(`Samples of missing thumbnails:`, missing.slice(0, 30).map(m => ({ name: m.name, uniq: m.uniqueName })));
  } catch (err) {
    console.error(err);
  }
}

check();
