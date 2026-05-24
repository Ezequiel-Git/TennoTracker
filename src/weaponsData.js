// Fallback database of popular Warframe weapons with crafting components, image names, and drop locations.
// Used as initial state and when the external API is loading/unreachable.

export const fallbackWeapons = [
  // --- PRIMARIES ---
  {
    id: "braton",
    name: "Braton",
    type: "Primary",
    masteryReq: 0,
    vaulted: false,
    source: "Market (Credits)",
    difficulty: "Easy",
    imageName: "braton.png",
    description: "Um rifle de assalto padrão de cadência rápida, ideal para novos recrutas.",
    components: [
      { name: "Credits", itemCount: 25000 }
    ],
    drops: ["Compre diretamente no Mercado do jogo com Créditos."]
  },
  {
    id: "braton-prime",
    name: "Braton Prime",
    type: "Primary",
    masteryReq: 8,
    vaulted: false,
    source: "Void Relics",
    difficulty: "Medium",
    imageName: "braton-prime.png",
    description: "A versão Prime do clássico rifle Braton, oferecendo maior chance de status e dano cortante.",
    components: [
      { name: "Braton Prime Blueprint", itemCount: 1 },
      { name: "Barrel", itemCount: 1 },
      { name: "Receiver", itemCount: 1 },
      { name: "Stock", itemCount: 1 },
      { name: "Orokin Cell", itemCount: 10 }
    ],
    drops: [
      "Lith W3 (Blueprint)",
      "Meso B7 (Barrel)",
      "Neo T4 (Receiver)",
      "Axi S12 (Stock)"
    ]
  },
  {
    id: "ignis-wraith",
    name: "Ignis Wraith",
    type: "Primary",
    masteryReq: 9,
    vaulted: false,
    source: "Dojo Clan Research",
    difficulty: "Easy",
    imageName: "ignis-wraith.png",
    description: "Um lança-chamas devastador modificado que espalha fogo contínuo em área.",
    components: [
      { name: "Blueprint", itemCount: 1 },
      { name: "Detonite Injector", itemCount: 3 },
      { name: "Plastids", itemCount: 1500 },
      { name: "Nano Spores", itemCount: 10000 },
      { name: "Credits", itemCount: 30000 }
    ],
    drops: ["Pesquisa no Laboratório Chem do Dojo do seu Clã."]
  },
  {
    id: "rubico-prime",
    name: "Rubico Prime",
    type: "Primary",
    masteryReq: 12,
    vaulted: true,
    source: "Void Relics (Vaulted)",
    difficulty: "Hard",
    imageName: "rubico-prime.png",
    description: "O rifle de precisão definitivo. Excelente multiplicador crítico, ideal para caçar Eidolons.",
    components: [
      { name: "Rubico Prime Blueprint", itemCount: 1 },
      { name: "Barrel", itemCount: 1 },
      { name: "Receiver", itemCount: 1 },
      { name: "Stock", itemCount: 1 },
      { name: "Orokin Cell", itemCount: 15 }
    ],
    drops: [
      "Vaulted - Atualmente disponível apenas através de trocas com outros jogadores ou no evento Prime Resurgence."
    ]
  },
  {
    id: "tigris-prime",
    name: "Tigris Prime",
    type: "Primary",
    masteryReq: 13,
    vaulted: true,
    source: "Void Relics (Vaulted)",
    difficulty: "Hard",
    imageName: "tigris-prime.png",
    description: "Uma espingarda duplex de cano duplo que causa um dano cortante assustador a curta distância.",
    components: [
      { name: "Tigris Prime Blueprint", itemCount: 1 },
      { name: "Barrel", itemCount: 1 },
      { name: "Receiver", itemCount: 1 },
      { name: "Stock", itemCount: 1 }
    ],
    drops: [
      "Vaulted - Disponível via trocas entre jogadores."
    ]
  },
  {
    id: "hema",
    name: "Hema",
    type: "Primary",
    masteryReq: 7,
    vaulted: false,
    source: "Dojo Clan Research (Bio)",
    difficulty: "Hard",
    imageName: "hema.png",
    description: "Rifle orgânico que drena a vida do usuário para recarregar e dispara rajadas corrosivas de sangue.",
    components: [
      { name: "Blueprint", itemCount: 1 },
      { name: "Mutagen Sample", itemCount: 5000 },
      { name: "Plastids", itemCount: 10000 },
      { name: "Neurodes", itemCount: 10 }
    ],
    drops: ["Pesquisa no Laboratório Bio do Dojo. Famosa pelo alto custo de Mutagen Samples."]
  },
  {
    id: "soma-prime",
    name: "Soma Prime",
    type: "Primary",
    masteryReq: 7,
    vaulted: true,
    source: "Void Relics (Vaulted)",
    difficulty: "Hard",
    imageName: "soma-prime.png",
    description: "Um rifle de assalto de alta cadência com um carregador massivo e foco extremo em dano crítico.",
    components: [
      { name: "Soma Prime Blueprint", itemCount: 1 },
      { name: "Barrel", itemCount: 1 },
      { name: "Receiver", itemCount: 1 },
      { name: "Stock", itemCount: 1 }
    ],
    drops: ["Vaulted - Obtenha trocando com outros jogadores."]
  },

  // --- SECONDARIES ---
  {
    id: "lato",
    name: "Lato",
    type: "Secondary",
    masteryReq: 0,
    vaulted: false,
    source: "Market (Credits)",
    difficulty: "Easy",
    imageName: "lato.png",
    description: "Uma pistola secundária básica e confiável de tiro semi-automático.",
    components: [
      { name: "Credits", itemCount: 10000 }
    ],
    drops: ["Compre pronta no Mercado por 10.000 Créditos."]
  },
  {
    id: "lex-prime",
    name: "Lex Prime",
    type: "Secondary",
    masteryReq: 8,
    vaulted: false,
    source: "Void Relics",
    difficulty: "Easy",
    imageName: "lex-prime.png",
    description: "Uma pistola pesada de tiro único com altíssima precisão e dano. Freqüentemente chamada de 'Sniper de Bolso'.",
    components: [
      { name: "Lex Prime Blueprint", itemCount: 1 },
      { name: "Barrel", itemCount: 1 },
      { name: "Receiver", itemCount: 1 },
      { name: "Orokin Cell", itemCount: 3 }
    ],
    drops: [
      "Lith Y4 (Blueprint)",
      "Meso A12 (Barrel)",
      "Neo N19 (Receiver)"
    ]
  },
  {
    id: "epitaph",
    name: "Epitaph",
    type: "Secondary",
    masteryReq: 8,
    vaulted: false,
    source: "Railjack Sevagoth Quest",
    difficulty: "Medium",
    imageName: "epitaph.png",
    description: "A pistola de pulso do Sevagoth. Dispara placas lentas de gelo que garantem efeito de Status Frio em área.",
    components: [
      { name: "Epitaph Blueprint", itemCount: 1 },
      { name: "Barrel", itemCount: 1 },
      { name: "Receiver", itemCount: 1 }
    ],
    drops: [
      "Void Storm missions no Railjack (Vênus Proxima, Saturno Proxima)."
    ]
  },
  {
    id: "pyrana-prime",
    name: "Pyrana Prime",
    type: "Secondary",
    masteryReq: 13,
    vaulted: true,
    source: "Void Relics (Vaulted)",
    difficulty: "Hard",
    imageName: "pyrana-prime.png",
    description: "Uma pistola automática escopeta. Ao conseguir mortes rápidas, cria uma segunda Pyrana espectral na outra mão.",
    components: [
      { name: "Pyrana Prime Blueprint", itemCount: 1 },
      { name: "Barrel", itemCount: 1 },
      { name: "Receiver", itemCount: 1 }
    ],
    drops: ["Vaulted - Compre de outros jogadores."]
  },
  {
    id: "laetum",
    name: "Laetum",
    type: "Secondary",
    masteryReq: 14,
    vaulted: false,
    source: "Zariman (Cavalero)",
    difficulty: "Hard",
    imageName: "laetum.png",
    description: "Uma arma Incarnon que se transforma em uma metralhadora lançadora de bombas explosivas após carregar headshots.",
    components: [
      { name: "Laetum Blueprint", itemCount: 1 },
      { name: "Voidgel Orb", itemCount: 20 },
      { name: "Entrati Lanthorn", itemCount: 5 },
      { name: "Thrax Plasm", itemCount: 15 }
    ],
    drops: ["Compre o Blueprint com Cavalero no Zariman e fabrique na Forja."]
  },

  // --- MELEES ---
  {
    id: "skana",
    name: "Skana",
    type: "Melee",
    masteryReq: 0,
    vaulted: false,
    source: "Market",
    difficulty: "Easy",
    imageName: "skana.png",
    description: "Uma espada de corte clássica do Warframe, leve e mortal em mãos habilidosas.",
    components: [
      { name: "Blueprint", itemCount: 1 },
      { name: "Ferrite", itemCount: 1500 },
      { name: "Morphics", itemCount: 1 },
      { name: "Rubedo", itemCount: 450 }
    ],
    drops: ["Mercado (Compre o Blueprint por 15.000 créditos ou compre pronta)."]
  },
  {
    id: "orthos-prime",
    name: "Orthos Prime",
    type: "Melee",
    masteryReq: 12,
    vaulted: false,
    source: "Void Relics",
    difficulty: "Easy",
    imageName: "orthos-prime.png",
    description: "Uma arma de haste elegante com alcance de ataque incrível e alta velocidade de rotação.",
    components: [
      { name: "Orthos Prime Blueprint", itemCount: 1 },
      { name: "Handle", itemCount: 2 },
      { name: "Blade", itemCount: 2 }
    ],
    drops: [
      "Lith O2 (Blueprint)",
      "Meso P4 (Handle)",
      "Neo O7 (Blade)"
    ]
  },
  {
    id: "nikana-prime",
    name: "Nikana Prime",
    type: "Melee",
    masteryReq: 12,
    vaulted: true,
    source: "Void Relics (Vaulted)",
    difficulty: "Hard",
    imageName: "nikana-prime.png",
    description: "Uma katana tradicional de beleza incomparável e cortes críticos letais.",
    components: [
      { name: "Nikana Prime Blueprint", itemCount: 1 },
      { name: "Blade", itemCount: 1 },
      { name: "Hilt", itemCount: 1 }
    ],
    drops: ["Vaulted - Disponível via comércio com outros jogadores."]
  },
  {
    id: "kronen-prime",
    name: "Kronen Prime",
    type: "Melee",
    masteryReq: 12,
    vaulted: true,
    source: "Void Relics (Vaulted)",
    difficulty: "Hard",
    imageName: "kronen-prime.png",
    description: "Tonfas Prime gêmeas de ataque extremamente rápido, foco em efeito de Status Cortante constante.",
    components: [
      { name: "Kronen Prime Blueprint", itemCount: 1 },
      { name: "Blade", itemCount: 2 },
      { name: "Handle", itemCount: 2 }
    ],
    drops: ["Vaulted - Obtenível via trocas."]
  },
  {
    id: "glaive-prime",
    name: "Glaive Prime",
    type: "Melee",
    masteryReq: 10,
    vaulted: true,
    source: "Void Relics (Vaulted)",
    difficulty: "Hard",
    imageName: "glaive-prime.png",
    description: "Uma arma de arremesso que pode ser detonada no ar para causar um dano de efeito cortante forçado massivo.",
    components: [
      { name: "Glaive Prime Blueprint", itemCount: 1 },
      { name: "Blade", itemCount: 2 },
      { name: "Ring", itemCount: 1 }
    ],
    drops: ["Vaulted - Extremamente valorizada no comércio de jogadores."]
  },
  {
    id: "broken-war",
    name: "Broken War",
    type: "Melee",
    masteryReq: 10,
    vaulted: false,
    source: "Quest (The Second Dream)",
    difficulty: "Easy",
    imageName: "broken-war.png",
    description: "Um fragmento da espada War do Hunhow, concedida como recompensa de jornada. Uma das melhores espadas de uma mão.",
    components: [
      { name: "Quest Reward", itemCount: 1 }
    ],
    drops: ["Recompensa automática ao completar a jornada 'O Segundo Sonho'."]
  }
];

// Helper to determine Mastery Points required for a specific rank
export const getMasteryPointsRequired = (rank) => {
  if (rank <= 0) return 0;
  if (rank <= 30) {
    return 2500 * Math.pow(rank, 2);
  }
  // Legendary Ranks (L1 is 31, L2 is 32, etc.)
  const extraRanks = rank - 30;
  return 2250000 + (extraRanks * 147500);
};

// Returns rank name (e.g. "Mastery Rank 15" or "Legendary 1")
export const getRankName = (rank) => {
  if (rank <= 30) return `Mastery Rank ${rank}`;
  return `Legendary ${rank - 30}`;
};
