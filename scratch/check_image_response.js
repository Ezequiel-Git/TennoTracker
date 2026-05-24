async function test() {
  const url = 'https://cdn.warframestat.us/img/FocusIcon60.jpg';
  const res = await fetch(url);
  console.log('Status:', res.status);
  console.log('Content-Type:', res.headers.get('content-type'));
  const text = await res.text();
  console.log('Body length:', text.length);
  console.log('Body preview:', text.substring(0, 200));
}

test();
