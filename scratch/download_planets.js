const https = require('https');
const fs = require('fs');
const path = require('path');

const planets = [
  { name: 'mercury', file: 'MercuryCutout.png' },
  { name: 'venus', file: 'VenusCutout.png' },
  { name: 'earth', file: 'EarthCutout.png' },
  { name: 'mars', file: 'MarsCutout.png' },
  { name: 'phobos', file: 'PhobosCutout.png' },
  { name: 'deimos', file: 'DeimosCutout.png' },
  { name: 'ceres', file: 'CeresCutout.png' },
  { name: 'jupiter', file: 'JupiterCutout.png' },
  { name: 'europa', file: 'EuropaCutout.png' },
  { name: 'saturn', file: 'SaturnCutout.png' },
  { name: 'uranus', file: 'UranusCutout.png' },
  { name: 'neptune', file: 'NeptuneCutout.png' },
  { name: 'pluto', file: 'PlutoCutout.png' },
  { name: 'eris', file: 'ErisCutout.png' },
  { name: 'sedna', file: 'SednaCutout.png' },
  { name: 'void', file: 'VoidCutout.png' },
  { name: 'lua', file: 'LuaCutout.png' },
  { name: 'zariman', file: 'ZarimanCutout.png' },
];

const outDir = 'c:/Users/Pichau/Projetos/Warframe/public/planets';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function download(planet) {
  return new Promise((resolve, reject) => {
    const url = `https://wiki.warframe.com/images/thumb/${planet.file}/140px-${planet.file}`;
    const outPath = path.join(outDir, `${planet.name}.png`);
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
        'Referer': 'https://wiki.warframe.com/',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
      }
    };
    
    https.get(url, options, (res) => {
      console.log(`${planet.name}: status ${res.statusCode}, content-type: ${res.headers['content-type']}`);
      
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Follow redirect
        const redirectUrl = res.headers.location;
        console.log(`Redirecting to: ${redirectUrl}`);
        https.get(redirectUrl, options, (res2) => {
          const file = fs.createWriteStream(outPath);
          res2.pipe(file);
          file.on('finish', () => {
            const stat = fs.statSync(outPath);
            console.log(`Downloaded ${planet.name}: ${stat.size} bytes`);
            resolve();
          });
        }).on('error', reject);
      } else {
        const file = fs.createWriteStream(outPath);
        res.pipe(file);
        file.on('finish', () => {
          const stat = fs.statSync(outPath);
          console.log(`Downloaded ${planet.name}: ${stat.size} bytes`);
          resolve();
        });
      }
    }).on('error', reject);
  });
}

async function main() {
  for (const planet of planets) {
    try {
      await download(planet);
    } catch (err) {
      console.error(`Failed ${planet.name}: ${err.message}`);
    }
  }
  console.log('All done!');
}

main();
