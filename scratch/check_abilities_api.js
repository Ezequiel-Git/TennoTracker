async function check() {
  try {
    const res = await fetch('https://api.warframestat.us/warframes?language=pt');
    const data = await res.json();
    console.log(`Fetched ${data.length} warframes.`);
    
    // Let's find warframes that have "<" in their ability descriptions
    const taggedAbilities = [];
    data.forEach(w => {
      if (w.abilities) {
        w.abilities.forEach(a => {
          if (a.description && (a.description.includes('<') || a.description.includes('DT_') || a.description.includes('COLOR'))) {
            taggedAbilities.push({
              warframe: w.name,
              ability: a.name,
              description: a.description
            });
          }
        });
      }
    });

    console.log(`Found ${taggedAbilities.length} tagged abilities.`);
    console.log('Sample tagged abilities (first 15):');
    taggedAbilities.slice(0, 15).forEach((ta, idx) => {
      console.log(`\n--- ${idx + 1}. ${ta.warframe} - ${ta.ability} ---`);
      console.log(ta.description);
    });
  } catch (e) {
    console.error('Error:', e);
  }
}
check();
