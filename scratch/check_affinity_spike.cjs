async function run() {
  try {
    const res = await fetch(`https://api.warframestat.us/mods?language=pt`);
    const data = await res.json();
    const spike = data.find(m => m.name.toLowerCase().includes('affinity spike') || m.name.toLowerCase().includes('pico de afinidade'));
    const martial = data.find(m => m.name.toLowerCase().includes('air martial') || m.name.toLowerCase().includes('marcial aéreo'));
    console.log('Affinity Spike:', JSON.stringify(spike, null, 2));
    console.log('Air Martial:', JSON.stringify(martial, null, 2));
  } catch (e) {
    console.error(e);
  }
}
run();
