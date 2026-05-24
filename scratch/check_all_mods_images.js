async function test() {
  const res = await fetch('https://api.warframestat.us/mods?language=en');
  const data = await res.json();
  
  const typesMap = {};
  const imageNames = [];
  
  for (const m of data) {
    if (!typesMap[m.type]) typesMap[m.type] = 0;
    typesMap[m.type]++;
    
    if (m.imageName && (m.imageName.includes('Icon') || m.imageName.includes('Placeholder') || m.imageName.includes('Focus'))) {
      imageNames.push({ name: m.name, type: m.type, imageName: m.imageName, wikiaThumbnail: m.wikiaThumbnail });
    }
  }
  
  console.log('Types:', typesMap);
  console.log('Suspicious Image Names (first 30):', imageNames.slice(0, 30));
}

test();
