async function run() {
  try {
    const res = await fetch(`https://api.warframestat.us/warframes?language=pt`);
    const data = await res.json();
    
    console.log("Checking warframe ability descriptions for tags...");
    const withTags = [];
    data.forEach(w => {
      if (!w || !w.abilities) return;
      w.abilities.forEach(a => {
        const desc = a.description || '';
        if (desc.includes('<') || desc.includes('>') || desc.includes('|') || desc.includes('DT_')) {
          withTags.push({ frame: w.name, ability: a.name, desc });
        }
      });
    });
    
    console.log(`Found ${withTags.length} abilities with tags/special chars.`);
    withTags.slice(0, 30).forEach(x => {
      console.log(`- [${x.frame}] ${x.ability}: "${x.desc}"`);
    });
  } catch (e) {
    console.error(e);
  }
}
run();
