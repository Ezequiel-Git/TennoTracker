async function run() {
  try {
    const res = await fetch(`https://api.warframestat.us/mods?language=pt`);
    const data = await res.json();
    const match = data.find(m => m.name.toLowerCase().includes('amarsetmod') || m.uniqueName.toLowerCase().includes('amarsetmod'));
    console.log('Amarsetmod API data:', JSON.stringify(match, null, 2));
  } catch (e) {
    console.error(e);
  }
}
run();
