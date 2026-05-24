const { translations } = require('../src/translations.js');
console.log('Translations keys:', Object.keys(translations));
console.log('Sample key (pt):', JSON.stringify(translations.pt, null, 2).substring(0, 500));
