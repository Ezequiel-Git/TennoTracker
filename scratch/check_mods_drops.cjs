const fs = require('fs');

async function check() {
  try {
    const res = await fetch(`https://api.warframestat.us/mods?language=pt`);
    const data = await res.json();
    console.log(`Total mods: ${data.length}`);
    
    const noDrops = data.filter(m => !m.drops || m.drops.length === 0);
    console.log(`Mods with no drops: ${noDrops.length}`);
    
    // Let's inspect some of them to see if we can group them
    const samples = {};
    noDrops.forEach(m => {
      let category = 'Outros';
      const name = m.name.toLowerCase();
      const uniq = m.uniqueName.toLowerCase();
      
      if (name.includes('primed') || name.includes('prime')) {
        // Wait, check if daily login or Baro
        const loginMods = ['primed fury', 'primed shred', 'primed vigor', 'primed sure footed'];
        if (loginMods.some(lm => name.includes(lm))) {
          category = 'Login Diário (Dia 200, 400, 600, 900)';
        } else {
          category = "Baro Ki'Teer (Void Trader)";
        }
      } else if (name.includes('galvanized') || name.includes('galvanizado')) {
        category = 'Arbitragem (Jornadas de Arbitragem)';
      } else if (name.includes('archon') || name.includes('arconte')) {
        category = "Guarnição do Kahl (Chipper)";
      } else if (uniq.includes('/corrupted/') || name.includes('corrupted')) {
        category = 'Cofres Orokin (Deriva do Void)';
      } else if (uniq.includes('/amalgam/') || name.includes('amalgam')) {
        category = 'Fendas de Termia (Orb Vallis) / Ropo';
      } else if (uniq.includes('/nightmare/') || name.includes('nightmare')) {
        category = 'Modo Pesadelo (Nightmare Mode)';
      } else if (m.isAugment || uniq.includes('/augment/') || uniq.includes('/habilitymod/') || uniq.includes('/powerupgrade/')) {
        category = 'Sindicatos (Syndicates)';
      } else if (name.includes('umbral') || name.includes('sacrificial') || uniq.includes('/excaliburumbral/')) {
        category = 'Jornada "O Sacrifício"';
      } else if (uniq.includes('/requiem/') || name.includes('requiem')) {
        category = 'Relíquias Requiem (Liches)';
      } else if (uniq.includes('/pvp/') || name.includes('conclave')) {
        category = 'Conclave (Teshin)';
      }
      
      if (!samples[category]) samples[category] = [];
      samples[category].push(m.name);
    });
    
    for (const cat in samples) {
      console.log(`\nCategory: ${cat} (${samples[cat].length} mods)`);
      console.log(`Samples:`, samples[cat].slice(0, 8));
    }
  } catch (err) {
    console.error(err);
  }
}

check();
