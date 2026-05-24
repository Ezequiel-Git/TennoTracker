async function run() {
  try {
    const res = await fetch(`https://api.warframestat.us/warframes?language=pt`);
    const data = await res.json();
    const excal = data.find(w => w.name.toLowerCase() === 'excalibur');
    if (excal) {
      console.log('Excalibur abilities:', JSON.stringify(excal.abilities, null, 2));
    }
  } catch (e) {
    console.error(e);
  }
}
run();
