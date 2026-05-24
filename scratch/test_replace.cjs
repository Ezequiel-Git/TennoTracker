const React = {
  createElement: (type, props, ...children) => {
    if (props && props.dangerouslySetInnerHTML) {
      return { type, html: props.dangerouslySetInnerHTML.__html };
    }
    return { type, props, children };
  }
};

const renderFormattedDescription = (text) => {
  if (!text) return '';
  
  let rawText = '';
  if (Array.isArray(text)) {
    rawText = text.join('\n');
  } else if (typeof text === 'string') {
    rawText = text;
  } else {
    rawText = String(text);
  }

  rawText = rawText
    .replace(/\\n/g, '<br />')
    .replace(/\n/g, '<br />')
    .replace(/\|n/g, '<br />')
    .replace(/\|r/g, '');

  rawText = rawText.replace(/<([^>]+)>/g, (match, tagContent) => {
    const cleanTag = tagContent.trim().toUpperCase();
    if (cleanTag.startsWith('DT_') && cleanTag.endsWith('_COLOR')) {
      return match;
    }
    if (cleanTag === 'BR' || cleanTag === 'BR/') {
      return match;
    }
    return '';
  });

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

  let formatted = rawText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&lt;br\s*\/?&gt;/gi, '<br />');

  console.log('After escaping:', formatted);

  const regex = /&lt;DT_([A-Z0-9_]+)_COLOR&gt;\s*([^\s\<&>,\.\;\!\?\:\"\'\-\+]+)/gi;

  formatted = formatted.replace(regex, (match, tag, word) => {
    console.log(`Matched tag: ${tag}, word: ${word}`);
    const element = tagMap[tag.toUpperCase()];
    if (element) {
      return `<span class="dt-element" style="color: ${element.color}; font-weight: bold; text-shadow: 0 0 4px ${element.color}44;">${element.icon} ${word}</span>`;
    }
    return word;
  });

  return React.createElement('span', { dangerouslySetInnerHTML: { __html: formatted } });
};

const sample = "Alvos atingidos ficarão lentos e sofrerão Dano <DT_VIRAL_COLOR>Viral, com Efeito de Status garantido.";
console.log('Result:', renderFormattedDescription(sample).html);
