async function run() {
  try {
    const urls = [
      'https://api.warframestat.us/weapons?language=pt',
      'https://api.warframestat.us/warframes?language=pt'
    ];
    for (const url of urls) {
      const res = await fetch(url);
      const data = await res.json();
      data.forEach(item => {
        if (item && item.description && (item.description.includes('<') || item.description.includes('DT_'))) {
          console.log(`Found tag in main description of [${item.name}]: "${item.description}"`);
        }
      });
    }
  } catch (e) {
    console.error(e);
  }
}
run();
