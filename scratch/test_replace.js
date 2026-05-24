const tagMap = {
  'VIRAL': { icon: '🦠', color: '#ae35ff' },
  'SLASH': { icon: '🩸', color: '#ff3535' },
  'FIRE': { icon: '🔥', color: '#ff7b00' },
  'HEAT': { icon: '🔥', color: '#ff7b00' },
  'POISON': { icon: '☣️', color: '#35ff35' },
  'TOXIN': { icon: '☣️', color: '#35ff35' },
  'FREEZE': { icon: '❄️', color: '#35d8ff' },
  'COLD': { icon: '❄️', color: '#35d8ff' },
  'SENTIENT': { icon: '🌀', color: '#d4af37' },
  'TAU': { icon: '🌀', color: '#d4af37' },
  'ELECTRICITY': { icon: '⚡', color: '#ffff35' },
  'CORROSIVE': { icon: '🧪', color: '#7cff35' },
  'MAGNETIC': { icon: '🧲', color: '#3585ff' },
  'RADIATION': { icon: '☢️', color: '#ff35d8' },
  'BLAST': { icon: '💥', color: '#ff5e35' },
  'GAS': { icon: '💨', color: '#b5ff9b' },
  'IMPACT': { icon: '🔨', color: '#8e8e8e' },
  'PUNCTURE': { icon: '🎯', color: '#cccccc' },
  'VOID': { icon: '🌌', color: '#00ffff' }
};

function formatDescription(text) {
  if (!text) return '';
  
  // Escape HTML characters except <br> and our DT tags
  let formatted = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&lt;br\s*\/?&gt;/gi, '<br />');

  // Match &lt;DT_([A-Z0-9_]+)_COLOR&gt; followed by optional whitespace and then any characters except spaces/punctuation
  const regex = /&lt;DT_([A-Z0-9_]+)_COLOR&gt;\s*([^\s\<&>,\.\;\!\?\:\"\'\-\+]+)/gi;
  
  formatted = formatted.replace(regex, (match, tag, word) => {
    const element = tagMap[tag.toUpperCase()];
    if (element) {
      return `<span class="dt-element" style="color: ${element.color}; font-weight: bold; text-shadow: 0 0 4px ${element.color}44;">${element.icon} ${word}</span>`;
    }
    return word;
  });

  return formatted;
}

// Let's test
const samples = [
  "Alvos atingidos ficarão lentos e sofrerão Dano <DT_VIRAL_COLOR>Viral, com Efeito de Status garantido.",
  "Dano de Status <DT_SLASH_COLOR>Cortante, <DT_FIRE_COLOR>Ígneo e <DT_POISON_COLOR>Tóxico se acumulará.",
  "JAP: <DT_SLASH_COLOR>切断 ダメージと <DT_FIRE_COLOR>火炎"
];

samples.forEach(s => console.log(formatDescription(s)));
