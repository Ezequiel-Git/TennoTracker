async function testUrl(url) {
  try {
    const res = await fetch(url, { method: 'GET' });
    console.log(`URL: ${url}`);
    console.log(`  Final Status: ${res.status}`);
    console.log(`  Redirected: ${res.redirected}`);
    console.log(`  Final URL: ${res.url}`);
  } catch (e) {
    console.log(`URL: ${url} failed with error: ${e.message}`);
  }
}

async function run() {
  await testUrl('https://cdn.warframestat.us/img/AvatarResistanceOnDamageMod.jpg');
  await testUrl('https://cdn.warframestat.us/img/FocusIcon60.jpg');
  await testUrl('https://cdn.warframestat.us/img/DaggerMeleeAutoTargetBonus.jpg');
}
run();
