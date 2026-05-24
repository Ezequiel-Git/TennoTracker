async function run() {
  try {
    const res = await fetch(`https://api.warframestat.us/mods?language=pt`);
    const data = await res.json();
    
    console.log("Checking mod descriptions for tags...");
    const withTags = [];
    data.forEach(m => {
      if (!m || !m.name) return;
      const desc = m.description || '';
      if (desc.includes('<') || desc.includes('>') || desc.includes('|')) {
        withTags.push({ name: m.name, desc });
      }
    });
    
    console.log(`Found ${withTags.length} mods with tags in descriptions.`);
    withTags.slice(0, 30).forEach(w => {
      console.log(`- ${w.name}: "${w.desc}"`);
    });
  } catch (e) {
    console.error(e);
  }
}
run();
