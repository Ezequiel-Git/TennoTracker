// Fallback database of popular Warframe weapons with crafting components, image names, and drop locations.
// Used as initial state and when the external API is loading/unreachable.

export const fallbackWeapons = [
  {
    "id": "braton",
    "name": "Braton",
    "type": "Primary",
    "masteryReq": 0,
    "vaulted": false,
    "source": "Market (Credits)",
    "difficulty": "Easy",
    "imageName": "braton.png",
    "description": "Um rifle de assalto padrão de cadência rápida, ideal para novos recrutas.",
    "components": [
      {
        "name": "Credits",
        "itemCount": 25000
      }
    ],
    "drops": [
      "Compre diretamente no Mercado do jogo com Créditos."
    ]
  },
  {
    "id": "braton-prime",
    "name": "Braton Prime",
    "type": "Primary",
    "masteryReq": 8,
    "vaulted": false,
    "source": "Void Relics",
    "difficulty": "Medium",
    "imageName": "braton-prime.png",
    "description": "A versão Prime do clássico rifle Braton, oferecendo maior chance de status e dano cortante.",
    "components": [
      {
        "name": "Braton Prime Blueprint",
        "itemCount": 1
      },
      {
        "name": "Barrel",
        "itemCount": 1
      },
      {
        "name": "Receiver",
        "itemCount": 1
      },
      {
        "name": "Stock",
        "itemCount": 1
      },
      {
        "name": "Orokin Cell",
        "itemCount": 10
      }
    ],
    "drops": [
      "Lith W3 (Blueprint)",
      "Meso B7 (Barrel)",
      "Neo T4 (Receiver)",
      "Axi S12 (Stock)"
    ]
  },
  {
    "id": "ignis-wraith",
    "name": "Ignis Wraith",
    "type": "Primary",
    "masteryReq": 9,
    "vaulted": false,
    "source": "Dojo Clan Research",
    "difficulty": "Easy",
    "imageName": "ignis-wraith.png",
    "description": "Um lança-chamas devastador modificado que espalha fogo contínuo em área.",
    "components": [
      {
        "name": "Blueprint",
        "itemCount": 1
      },
      {
        "name": "Detonite Injector",
        "itemCount": 3
      },
      {
        "name": "Plastids",
        "itemCount": 1500
      },
      {
        "name": "Nano Spores",
        "itemCount": 10000
      },
      {
        "name": "Credits",
        "itemCount": 30000
      }
    ],
    "drops": [
      "Pesquisa no Laboratório Chem do Dojo do seu Clã."
    ]
  },
  {
    "id": "rubico-prime",
    "name": "Rubico Prime",
    "type": "Primary",
    "masteryReq": 12,
    "vaulted": true,
    "source": "Void Relics (Vaulted)",
    "difficulty": "Hard",
    "imageName": "rubico-prime.png",
    "description": "O rifle de precisão definitivo. Excelente multiplicador crítico, ideal para caçar Eidolons.",
    "components": [
      {
        "name": "Rubico Prime Blueprint",
        "itemCount": 1
      },
      {
        "name": "Barrel",
        "itemCount": 1
      },
      {
        "name": "Receiver",
        "itemCount": 1
      },
      {
        "name": "Stock",
        "itemCount": 1
      },
      {
        "name": "Orokin Cell",
        "itemCount": 15
      }
    ],
    "drops": [
      "Vaulted - Atualmente disponível apenas através de trocas com outros jogadores ou no evento Prime Resurgence."
    ]
  },
  {
    "id": "tigris-prime",
    "name": "Tigris Prime",
    "type": "Primary",
    "masteryReq": 13,
    "vaulted": true,
    "source": "Void Relics (Vaulted)",
    "difficulty": "Hard",
    "imageName": "tigris-prime.png",
    "description": "Uma espingarda duplex de cano duplo que causa um dano cortante assustador a curta distância.",
    "components": [
      {
        "name": "Tigris Prime Blueprint",
        "itemCount": 1
      },
      {
        "name": "Barrel",
        "itemCount": 1
      },
      {
        "name": "Receiver",
        "itemCount": 1
      },
      {
        "name": "Stock",
        "itemCount": 1
      }
    ],
    "drops": [
      "Vaulted - Disponível via trocas entre jogadores."
    ]
  },
  {
    "id": "hema",
    "name": "Hema",
    "type": "Primary",
    "masteryReq": 7,
    "vaulted": false,
    "source": "Dojo Clan Research (Bio)",
    "difficulty": "Hard",
    "imageName": "hema.png",
    "description": "Rifle orgânico que drena a vida do usuário para recarregar e dispara rajadas corrosivas de sangue.",
    "components": [
      {
        "name": "Blueprint",
        "itemCount": 1
      },
      {
        "name": "Mutagen Sample",
        "itemCount": 5000
      },
      {
        "name": "Plastids",
        "itemCount": 10000
      },
      {
        "name": "Neurodes",
        "itemCount": 10
      }
    ],
    "drops": [
      "Pesquisa no Laboratório Bio do Dojo. Famosa pelo alto custo de Mutagen Samples."
    ]
  },
  {
    "id": "soma-prime",
    "name": "Soma Prime",
    "type": "Primary",
    "masteryReq": 7,
    "vaulted": true,
    "source": "Void Relics (Vaulted)",
    "difficulty": "Hard",
    "imageName": "soma-prime.png",
    "description": "Um rifle de assalto de alta cadência com um carregador massivo e foco extremo em dano crítico.",
    "components": [
      {
        "name": "Soma Prime Blueprint",
        "itemCount": 1
      },
      {
        "name": "Barrel",
        "itemCount": 1
      },
      {
        "name": "Receiver",
        "itemCount": 1
      },
      {
        "name": "Stock",
        "itemCount": 1
      }
    ],
    "drops": [
      "Vaulted - Obtenha trocando com outros jogadores."
    ]
  },
  {
    "id": "lato",
    "name": "Lato",
    "type": "Secondary",
    "masteryReq": 0,
    "vaulted": false,
    "source": "Market (Credits)",
    "difficulty": "Easy",
    "imageName": "lato.png",
    "description": "Uma pistola secundária básica e confiável de tiro semi-automático.",
    "components": [
      {
        "name": "Credits",
        "itemCount": 10000
      }
    ],
    "drops": [
      "Compre pronta no Mercado por 10.000 Créditos."
    ]
  },
  {
    "id": "lex-prime",
    "name": "Lex Prime",
    "type": "Secondary",
    "masteryReq": 8,
    "vaulted": false,
    "source": "Void Relics",
    "difficulty": "Easy",
    "imageName": "lex-prime.png",
    "description": "Uma pistola pesada de tiro único com altíssima precisão e dano. Freqüentemente chamada de 'Sniper de Bolso'.",
    "components": [
      {
        "name": "Lex Prime Blueprint",
        "itemCount": 1
      },
      {
        "name": "Barrel",
        "itemCount": 1
      },
      {
        "name": "Receiver",
        "itemCount": 1
      },
      {
        "name": "Orokin Cell",
        "itemCount": 3
      }
    ],
    "drops": [
      "Lith Y4 (Blueprint)",
      "Meso A12 (Barrel)",
      "Neo N19 (Receiver)"
    ]
  },
  {
    "id": "epitaph",
    "name": "Epitaph",
    "type": "Secondary",
    "masteryReq": 8,
    "vaulted": false,
    "source": "Railjack Sevagoth Quest",
    "difficulty": "Medium",
    "imageName": "epitaph.png",
    "description": "A pistola de pulso do Sevagoth. Dispara placas lentas de gelo que garantem efeito de Status Frio em área.",
    "components": [
      {
        "name": "Epitaph Blueprint",
        "itemCount": 1
      },
      {
        "name": "Barrel",
        "itemCount": 1
      },
      {
        "name": "Receiver",
        "itemCount": 1
      }
    ],
    "drops": [
      "Void Storm missions no Railjack (Vênus Proxima, Saturno Proxima)."
    ]
  },
  {
    "id": "pyrana-prime",
    "name": "Pyrana Prime",
    "type": "Secondary",
    "masteryReq": 13,
    "vaulted": true,
    "source": "Void Relics (Vaulted)",
    "difficulty": "Hard",
    "imageName": "pyrana-prime.png",
    "description": "Uma pistola automática escopeta. Ao conseguir mortes rápidas, cria uma segunda Pyrana espectral na outra mão.",
    "components": [
      {
        "name": "Pyrana Prime Blueprint",
        "itemCount": 1
      },
      {
        "name": "Barrel",
        "itemCount": 1
      },
      {
        "name": "Receiver",
        "itemCount": 1
      }
    ],
    "drops": [
      "Vaulted - Compre de outros jogadores."
    ]
  },
  {
    "id": "laetum",
    "name": "Laetum",
    "type": "Secondary",
    "masteryReq": 14,
    "vaulted": false,
    "source": "Zariman (Cavalero)",
    "difficulty": "Hard",
    "imageName": "laetum.png",
    "description": "Uma arma Incarnon que se transforma em uma metralhadora lançadora de bombas explosivas após carregar headshots.",
    "components": [
      {
        "name": "Laetum Blueprint",
        "itemCount": 1
      },
      {
        "name": "Voidgel Orb",
        "itemCount": 20
      },
      {
        "name": "Entrati Lanthorn",
        "itemCount": 5
      },
      {
        "name": "Thrax Plasm",
        "itemCount": 15
      }
    ],
    "drops": [
      "Compre o Blueprint com Cavalero no Zariman e fabrique na Forja."
    ]
  },
  {
    "id": "skana",
    "name": "Skana",
    "type": "Melee",
    "masteryReq": 0,
    "vaulted": false,
    "source": "Market",
    "difficulty": "Easy",
    "imageName": "skana.png",
    "description": "Uma espada de corte clássica do Warframe, leve e mortal em mãos habilidosas.",
    "components": [
      {
        "name": "Blueprint",
        "itemCount": 1
      },
      {
        "name": "Ferrite",
        "itemCount": 1500
      },
      {
        "name": "Morphics",
        "itemCount": 1
      },
      {
        "name": "Rubedo",
        "itemCount": 450
      }
    ],
    "drops": [
      "Mercado (Compre o Blueprint por 15.000 créditos ou compre pronta)."
    ]
  },
  {
    "id": "orthos-prime",
    "name": "Orthos Prime",
    "type": "Melee",
    "masteryReq": 12,
    "vaulted": false,
    "source": "Void Relics",
    "difficulty": "Easy",
    "imageName": "orthos-prime.png",
    "description": "Uma arma de haste elegante com alcance de ataque incrível e alta velocidade de rotação.",
    "components": [
      {
        "name": "Orthos Prime Blueprint",
        "itemCount": 1
      },
      {
        "name": "Handle",
        "itemCount": 2
      },
      {
        "name": "Blade",
        "itemCount": 2
      }
    ],
    "drops": [
      "Lith O2 (Blueprint)",
      "Meso P4 (Handle)",
      "Neo O7 (Blade)"
    ]
  },
  {
    "id": "nikana-prime",
    "name": "Nikana Prime",
    "type": "Melee",
    "masteryReq": 12,
    "vaulted": true,
    "source": "Void Relics (Vaulted)",
    "difficulty": "Hard",
    "imageName": "nikana-prime.png",
    "description": "Uma katana tradicional de beleza incomparável e cortes críticos letais.",
    "components": [
      {
        "name": "Nikana Prime Blueprint",
        "itemCount": 1
      },
      {
        "name": "Blade",
        "itemCount": 1
      },
      {
        "name": "Hilt",
        "itemCount": 1
      }
    ],
    "drops": [
      "Vaulted - Disponível via comércio com outros jogadores."
    ]
  },
  {
    "id": "kronen-prime",
    "name": "Kronen Prime",
    "type": "Melee",
    "masteryReq": 12,
    "vaulted": true,
    "source": "Void Relics (Vaulted)",
    "difficulty": "Hard",
    "imageName": "kronen-prime.png",
    "description": "Tonfas Prime gêmeas de ataque extremamente rápido, foco em efeito de Status Cortante constante.",
    "components": [
      {
        "name": "Kronen Prime Blueprint",
        "itemCount": 1
      },
      {
        "name": "Blade",
        "itemCount": 2
      },
      {
        "name": "Handle",
        "itemCount": 2
      }
    ],
    "drops": [
      "Vaulted - Obtenível via trocas."
    ]
  },
  {
    "id": "glaive-prime",
    "name": "Glaive Prime",
    "type": "Melee",
    "masteryReq": 10,
    "vaulted": true,
    "source": "Void Relics (Vaulted)",
    "difficulty": "Hard",
    "imageName": "glaive-prime.png",
    "description": "Uma arma de arremesso que pode ser detonada no ar para causar um dano de efeito cortante forçado massivo.",
    "components": [
      {
        "name": "Glaive Prime Blueprint",
        "itemCount": 1
      },
      {
        "name": "Blade",
        "itemCount": 2
      },
      {
        "name": "Ring",
        "itemCount": 1
      }
    ],
    "drops": [
      "Vaulted - Extremamente valorizada no comércio de jogadores."
    ]
  },
  {
    "id": "broken-war",
    "name": "Broken War",
    "type": "Melee",
    "masteryReq": 10,
    "vaulted": false,
    "source": "Quest (The Second Dream)",
    "difficulty": "Easy",
    "imageName": "broken-war.png",
    "description": "Um fragmento da espada War do Hunhow, concedida como recompensa de jornada. Uma das melhores espadas de uma mão.",
    "components": [
      {
        "name": "Quest Reward",
        "itemCount": 1
      }
    ],
    "drops": [
      "Recompensa automática ao completar a jornada 'O Segundo Sonho'."
    ]
  },
  {
    "id": "amesha",
    "name": "Amesha",
    "type": "Archwing",
    "masteryReq": 0,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Easy",
    "imageName": "Amesha.png",
    "description": "Transform into a winged guardian.",
    "wikiaUrl": "https://wiki.warframe.com/w/Amesha",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Amesha.png?bb937"
  },
  {
    "id": "elytron",
    "name": "Elytron",
    "type": "Archwing",
    "masteryReq": 0,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Easy",
    "imageName": "Elytron.png",
    "description": "This heavy duty Archwing was designed for one purpose, destruction.",
    "wikiaUrl": "https://wiki.warframe.com/w/Elytron",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Elytron.png?95527"
  },
  {
    "id": "itzal",
    "name": "Itzal",
    "type": "Archwing",
    "masteryReq": 0,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Easy",
    "imageName": "Itzal.png",
    "description": "Designed for quick clandestine attacks, the Itzal Archwing excels at striking from the darkness of space.",
    "wikiaUrl": "https://wiki.warframe.com/w/Itzal",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Itzal.png?472fe"
  },
  {
    "id": "odonata",
    "name": "Odonata",
    "type": "Archwing",
    "masteryReq": 0,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Easy",
    "imageName": "Odonata.png",
    "description": "The systems built into this Archwing balance offensive capabilities with defensive countermeasures.",
    "wikiaUrl": "https://wiki.warframe.com/w/Odonata",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Odonata.png?63361"
  },
  {
    "id": "odonata-prime",
    "name": "Odonata Prime",
    "type": "Archwing",
    "masteryReq": 0,
    "vaulted": true,
    "source": "Void Relics",
    "difficulty": "Easy",
    "imageName": "OdonataPrime.png",
    "description": "This enhanced version of the first Archwing prototype takes the design to its theoretical limits.",
    "wikiaUrl": "https://wiki.warframe.com/w/Odonata%2FPrime",
    "wikiaThumbnail": "https://wiki.warframe.com/images/OdonataPrime.png?7b651"
  },
  {
    "id": "arbucep",
    "name": "Arbucep",
    "type": "Arch-Gun",
    "masteryReq": 0,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Easy",
    "imageName": "NokkoArchGun.png",
    "description": "Nokko’s signature archgun fires six homing missiles, each bearing a payload of one of the six combined elements which detonate in an area upon impact.",
    "wikiaUrl": "https://wiki.warframe.com/w/Arbucep",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Arbucep.png?37aa2"
  },
  {
    "id": "cortege",
    "name": "Cortege",
    "type": "Arch-Gun",
    "masteryReq": 14,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Hard",
    "imageName": "ThanotechArchGun.png",
    "description": "An ancient weapon designed by the Entrati for use by their Necramechs. Primary fire siphons life essence from the target to fuel a devastating secondary fire. A heavy flamethrower with surprising range. Secondary fire launches three projectiles in a fan pattern that explode, leaving a damaging area of effect for a short duration.",
    "wikiaUrl": "https://wiki.warframe.com/w/Cortege",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Cortege.png?b7e25"
  },
  {
    "id": "corvas",
    "name": "Corvas",
    "type": "Arch-Gun",
    "masteryReq": 1,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Easy",
    "imageName": "Corvas.png",
    "description": "When fully charged, this flak cannon delivers a devastating shot. Perfect for taking down fast-moving interceptors.",
    "wikiaUrl": "https://wiki.warframe.com/w/Corvas",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Corvas.png?2ae6a"
  },
  {
    "id": "corvas-prime",
    "name": "Corvas Prime",
    "type": "Arch-Gun",
    "masteryReq": 14,
    "vaulted": true,
    "source": "Void Relics",
    "difficulty": "Hard",
    "imageName": "CorvasPrime.png",
    "description": "Flaunting ceremonial beauty, this arch gun flak cannon is even more devastating than its standard issue counterpart.",
    "wikiaUrl": "https://wiki.warframe.com/w/Corvas_Prime_(Atmosphere)",
    "wikiaThumbnail": "https://wiki.warframe.com/images/CorvasPrime.png?290fd"
  },
  {
    "id": "cyngas",
    "name": "Cyngas",
    "type": "Arch-Gun",
    "masteryReq": 4,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Easy",
    "imageName": "Cyngas.png",
    "description": "Unload deadly accurate bursts of mayhem.",
    "wikiaUrl": "https://wiki.warframe.com/w/Cyngas",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Cyngas.png?1a357"
  },
  {
    "id": "dual-decurion",
    "name": "Dual Decurion",
    "type": "Arch-Gun",
    "masteryReq": 1,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Easy",
    "imageName": "DualDecurion.png",
    "description": "Delivering twin streams of highly accurate, rapid-fire ordnance, the Decurion are specifically designed for combat in the vacuum of space.",
    "wikiaUrl": "https://wiki.warframe.com/w/Dual_Decurion",
    "wikiaThumbnail": "https://wiki.warframe.com/images/DualDecurion.png?9569b"
  },
  {
    "id": "fluctus",
    "name": "Fluctus",
    "type": "Arch-Gun",
    "masteryReq": 2,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Easy",
    "imageName": "Fluctus.png",
    "description": "An Archwing energy weapon that sends waves of deadly plasma crashing into enemies.",
    "wikiaUrl": "https://wiki.warframe.com/w/Fluctus",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Fluctus.png?e32bf"
  },
  {
    "id": "grattler",
    "name": "Grattler",
    "type": "Arch-Gun",
    "masteryReq": 4,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Easy",
    "imageName": "Grattler.png",
    "description": "Shatter your targets with explosive shells from this devastating Archwing cannon.",
    "wikiaUrl": "https://wiki.warframe.com/w/Grattler",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Grattler.png?fa336"
  },
  {
    "id": "imperator",
    "name": "Imperator",
    "type": "Arch-Gun",
    "masteryReq": 0,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Easy",
    "imageName": "Imperator.png",
    "description": "A long range rifle capable of firing in space, the Imperator's versatility makes it an ideal weapon for space combat.",
    "wikiaUrl": "https://wiki.warframe.com/w/Imperator",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Imperator.png?3a6f3"
  },
  {
    "id": "imperator-vandal",
    "name": "Imperator Vandal",
    "type": "Arch-Gun",
    "masteryReq": 5,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Easy",
    "imageName": "ImperatorVandal.png",
    "description": "The Imperator Vandal has been customized by the Tenno with a blue-green metallic finish and Lotus branding on the barrel.",
    "wikiaUrl": "https://wiki.warframe.com/w/Imperator_Vandal",
    "wikiaThumbnail": "https://wiki.warframe.com/images/ImperatorVandal.png?a8014"
  },
  {
    "id": "kuva-ayanga",
    "name": "Kuva Ayanga",
    "type": "Arch-Gun",
    "masteryReq": 13,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Hard",
    "imageName": "GrnHeavyGrenadeLauncher.png",
    "description": "Sweep aside hordes of enemies with flaming fury of this powerful, automatic, grenade launching archgun.",
    "wikiaUrl": "https://wiki.warframe.com/w/Kuva_Ayanga",
    "wikiaThumbnail": "https://wiki.warframe.com/images/KuvaAyanga.png?098c6"
  },
  {
    "id": "kuva-grattler",
    "name": "Kuva Grattler",
    "type": "Arch-Gun",
    "masteryReq": 15,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Hard",
    "imageName": "KuvaGrattler.png",
    "description": "Reconfigured for maximum lethality, the Kuva Grattler still shatters targets with explosive shells, but now reaches maximum fire-rate instantaneously.",
    "wikiaUrl": "https://wiki.warframe.com/w/Kuva_Grattler",
    "wikiaThumbnail": "https://wiki.warframe.com/images/KuvaGrattler.png?baf07"
  },
  {
    "id": "larkspur",
    "name": "Larkspur",
    "type": "Arch-Gun",
    "masteryReq": 8,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Medium",
    "imageName": "ShieldFrameArchGun.png",
    "description": "From death blooms the Larkspur. A unique and menacing Archgun with a wild initial attack that locks onto a target then chains other targets close to the first. It also sports an explosive projectile mode. In Hildryn's grip the Larkspur carries more reserve ammo.",
    "wikiaUrl": "https://wiki.warframe.com/w/Larkspur",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Larkspur.png?15f51"
  },
  {
    "id": "larkspur-prime",
    "name": "Larkspur Prime",
    "type": "Arch-Gun",
    "masteryReq": 8,
    "vaulted": true,
    "source": "Void Relics",
    "difficulty": "Medium",
    "imageName": "LarkspurPrime.png",
    "description": "Embrace pandemonium. Chainfire and explosive potential meet in Larkspur Prime. Hildryn packs more ammo when she wields this mighty weapon.",
    "wikiaUrl": "https://wiki.warframe.com/w/Larkspur_Prime",
    "wikiaThumbnail": "https://wiki.warframe.com/images/LarkspurPrime.png?fdc3a"
  },
  {
    "id": "mandonel",
    "name": "Mandonel",
    "type": "Arch-Gun",
    "masteryReq": 10,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Medium",
    "imageName": "TnConcreteArchgun.png",
    "description": "Mandonel fires <DT_RADIATION_COLOR>Radiation Damage projectiles. Partially charged shots release a spread and fully charged shots release a beam that dissolves into a radiation field. Projectiles that pass through the field are empowered.",
    "wikiaUrl": "",
    "wikiaThumbnail": ""
  },
  {
    "id": "mausolon",
    "name": "Mausolon",
    "type": "Arch-Gun",
    "masteryReq": 14,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Hard",
    "imageName": "ThanotechLongGun.png",
    "description": "An ancient weapon designed by the Entrati for use by their Necramechs. Primary fire siphons life essence from the target to fuel a devastating secondary fire. Punishing automatic primary fire and a secondary mode that charges up to unleash a destructive beam of energy with a large explosion at point of impact.",
    "wikiaUrl": "https://wiki.warframe.com/w/Mausolon",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Mausolon.png?65300"
  },
  {
    "id": "morgha",
    "name": "Morgha",
    "type": "Arch-Gun",
    "masteryReq": 15,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Hard",
    "imageName": "ThanoTechGrenadeLauncher.png",
    "description": "Blast through enemies with a double-barreled shot of energized slugs. This siphons their life essence which is then used to generate the secondary fire's massive air-burst mortar. The ancient Entrati weapon was built for Necramechs but also functions as an Archgun.",
    "wikiaUrl": "https://wiki.warframe.com/w/Morgha",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Morgha.png?fc121"
  },
  {
    "id": "phaedra",
    "name": "Phaedra",
    "type": "Arch-Gun",
    "masteryReq": 3,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Easy",
    "imageName": "Phaedra.png",
    "description": "Devastate free-space enemies with Phaedra, the Soma's big-sister.",
    "wikiaUrl": "https://wiki.warframe.com/w/Phaedra",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Phaedra.png?154a1"
  },
  {
    "id": "prisma-dual-decurions",
    "name": "Prisma Dual Decurions",
    "type": "Arch-Gun",
    "masteryReq": 1,
    "vaulted": false,
    "source": "Baro Ki'Teer",
    "difficulty": "Easy",
    "imageName": "PrismaDualDecurion.png",
    "description": "Colder than space and less forgiving, Prisma crystals bring elite efficiency to the already sleek Dual Decurion. Requiring the lightest of touches to reload, these twin archguns prove that heavy weaponry can still possess elegance.",
    "wikiaUrl": "https://wiki.warframe.com/w/Prisma_Dual_Decurions",
    "wikiaThumbnail": "https://wiki.warframe.com/images/PrismaDualDecurions.png?25327"
  },
  {
    "id": "velocitus",
    "name": "Velocitus",
    "type": "Arch-Gun",
    "masteryReq": 0,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Easy",
    "imageName": "Velocitus.png",
    "description": "When fully charged, the magnetized barrel of the Velocitus accelerates a metal slug to tremendous speeds, piercing hulls and obliterating armor.",
    "wikiaUrl": "https://wiki.warframe.com/w/Velocitus",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Velocitus.png?26b5b"
  },
  {
    "id": "agkuza",
    "name": "Agkuza",
    "type": "Arch-Melee",
    "masteryReq": 3,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Easy",
    "imageName": "Agkuza.png",
    "description": "Tear apart incoming enemies with this massive hooked blade.",
    "wikiaUrl": "https://wiki.warframe.com/w/Agkuza",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Agkuza.png?5cbfc"
  },
  {
    "id": "centaur",
    "name": "Centaur",
    "type": "Arch-Melee",
    "masteryReq": 8,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Medium",
    "imageName": "Centaur.png",
    "description": "Part sword, part shield, the Centaur excels at charging headlong into enemy fire.",
    "wikiaUrl": "https://wiki.warframe.com/w/Centaur",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Centaur.png?ad3fd"
  },
  {
    "id": "kaszas",
    "name": "Kaszas",
    "type": "Arch-Melee",
    "masteryReq": 4,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Easy",
    "imageName": "Kaszas.png",
    "description": "Become an angel of death, with this Archwing scythe.",
    "wikiaUrl": "https://wiki.warframe.com/w/Kaszas",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Kaszas.png?9fcb4"
  },
  {
    "id": "knux",
    "name": "Knux",
    "type": "Arch-Melee",
    "masteryReq": 7,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Medium",
    "imageName": "Knux.png",
    "description": "Gallium-alloy gauntlets for close-range Archwing combat. Designed by the infamous Tyl Regor.",
    "wikiaUrl": "https://wiki.warframe.com/w/Knux",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Knux.png?2d0e0"
  },
  {
    "id": "onorix",
    "name": "Onorix",
    "type": "Arch-Melee",
    "masteryReq": 1,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Easy",
    "imageName": "Onorix.png",
    "description": "This laser bladed battle-axe easily hacks through a ship's defenses and the forces protecting it.",
    "wikiaUrl": "https://wiki.warframe.com/w/Onorix",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Onorix.png?f4784"
  },
  {
    "id": "prisma-veritux",
    "name": "Prisma Veritux",
    "type": "Arch-Melee",
    "masteryReq": 8,
    "vaulted": false,
    "source": "Baro Ki'Teer",
    "difficulty": "Medium",
    "imageName": "PrismaVeritux.png",
    "description": "A rare object of beauty, this Archwing sword has been sheathed in prisma crystal and baptized in the Void’s energy.",
    "wikiaUrl": "https://wiki.warframe.com/w/Prisma_Veritux",
    "wikiaThumbnail": "https://wiki.warframe.com/images/PrismaVeritux.png?571f6"
  },
  {
    "id": "rathbone",
    "name": "Rathbone",
    "type": "Arch-Melee",
    "masteryReq": 6,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Medium",
    "imageName": "Rathbone.png",
    "description": "Using Archwing's jets for thrust, this massive hammer crushes anything in its path.",
    "wikiaUrl": "https://wiki.warframe.com/w/Rathbone",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Rathbone.png?255ff"
  },
  {
    "id": "veritux",
    "name": "Veritux",
    "type": "Arch-Melee",
    "masteryReq": 0,
    "vaulted": false,
    "source": "Market (Blueprint) / Dojo Research",
    "difficulty": "Easy",
    "imageName": "Veritux.png",
    "description": "Weightless space turns this impossibly massive sword into an agile instrument of destruction.",
    "wikiaUrl": "https://wiki.warframe.com/w/Veritux",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Veritux.png?e0827"
  },
  {
    "id": "cantic-prism",
    "name": "Cantic Prism",
    "type": "Amp",
    "masteryReq": 0,
    "vaulted": false,
    "source": "Quills (Cetus) / Vox Solaris (Fortuna)",
    "difficulty": "Easy",
    "imageName": "CorpAmpSet1BarrelPartA.png",
    "description": "",
    "wikiaUrl": "https://wiki.warframe.com/w/Cantic_Prism",
    "wikiaThumbnail": "https://wiki.warframe.com/images/CanticPrism.png?decca"
  },
  {
    "id": "granmu-prism",
    "name": "Granmu Prism",
    "type": "Amp",
    "masteryReq": 0,
    "vaulted": false,
    "source": "Quills (Cetus) / Vox Solaris (Fortuna)",
    "difficulty": "Easy",
    "imageName": "SentAmpSet1BarrelPartC.png",
    "description": "",
    "wikiaUrl": "https://wiki.warframe.com/w/Granmu_Prism",
    "wikiaThumbnail": "https://wiki.warframe.com/images/GranmuPrism.png?cfe20"
  },
  {
    "id": "klamora-prism",
    "name": "Klamora Prism",
    "type": "Amp",
    "masteryReq": 0,
    "vaulted": false,
    "source": "Quills (Cetus) / Vox Solaris (Fortuna)",
    "difficulty": "Easy",
    "imageName": "CorpAmpSet1BarrelPartC.png",
    "description": "",
    "wikiaUrl": "https://wiki.warframe.com/w/Klamora_Prism",
    "wikiaThumbnail": "https://wiki.warframe.com/images/KlamoraPrism.png?b4b73"
  },
  {
    "id": "lega-prism",
    "name": "Lega Prism",
    "type": "Amp",
    "masteryReq": 0,
    "vaulted": false,
    "source": "Quills (Cetus) / Vox Solaris (Fortuna)",
    "difficulty": "Easy",
    "imageName": "CorpAmpSet1BarrelPartB.png",
    "description": "",
    "wikiaUrl": "https://wiki.warframe.com/w/Lega_Prism",
    "wikiaThumbnail": "https://wiki.warframe.com/images/LegaPrism.png?30eff"
  },
  {
    "id": "mote-prism",
    "name": "Mote Prism",
    "type": "Amp",
    "masteryReq": 0,
    "vaulted": false,
    "source": "Quills (Cetus) / Vox Solaris (Fortuna)",
    "difficulty": "Easy",
    "imageName": "SentTrainingAmpBarrel.png",
    "description": "",
    "wikiaUrl": "https://wiki.warframe.com/w/Mote_Amp",
    "wikiaThumbnail": "https://wiki.warframe.com/images/MoteAmp.png?a1576"
  },
  {
    "id": "rahn-prism",
    "name": "Rahn Prism",
    "type": "Amp",
    "masteryReq": 0,
    "vaulted": false,
    "source": "Quills (Cetus) / Vox Solaris (Fortuna)",
    "difficulty": "Easy",
    "imageName": "SentAmpSet2BarrelPartA.png",
    "description": "",
    "wikiaUrl": "https://wiki.warframe.com/w/Rahn_Prism",
    "wikiaThumbnail": "https://wiki.warframe.com/images/RahnPrism.png?bd439"
  },
  {
    "id": "raplak-prism",
    "name": "Raplak Prism",
    "type": "Amp",
    "masteryReq": 0,
    "vaulted": false,
    "source": "Quills (Cetus) / Vox Solaris (Fortuna)",
    "difficulty": "Easy",
    "imageName": "SentAmpSet1BarrelPartA.png",
    "description": "",
    "wikiaUrl": "https://wiki.warframe.com/w/Raplak_Prism",
    "wikiaThumbnail": "https://wiki.warframe.com/images/RaplakPrism.png?360b6"
  },
  {
    "id": "shwaak-prism",
    "name": "Shwaak Prism",
    "type": "Amp",
    "masteryReq": 0,
    "vaulted": false,
    "source": "Quills (Cetus) / Vox Solaris (Fortuna)",
    "difficulty": "Easy",
    "imageName": "SentAmpSet1BarrelPartB.png",
    "description": "",
    "wikiaUrl": "https://wiki.warframe.com/w/Shwaak_Prism",
    "wikiaThumbnail": "https://wiki.warframe.com/images/ShwaakPrism.png?29bee"
  },
  {
    "id": "sirocco",
    "name": "Sirocco",
    "type": "Amp",
    "masteryReq": 0,
    "vaulted": false,
    "source": "Quest (The New War)",
    "difficulty": "Easy",
    "imageName": "DrifterPistol.png",
    "description": "A silent, pistol-style Amp for the Drifter. Generates its own ammunition from Void energy. A precisely timed reload over-charges the next shot.",
    "wikiaUrl": "https://wiki.warframe.com/w/Sirocco",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Sirocco.png?76b26"
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


export const fallbackCompanions = [
  {
    "id": "adarza-kavat",
    "name": "Adarza Kavat",
    "type": "Companion",
    "subType": "Kavat",
    "vaulted": false,
    "source": "Kavat Incubator",
    "imageName": "KavatBreedAdarza.png",
    "description": "A vicious and deadly Kavat prized for its combat prowess, offering increased critical chance and punishing those that dare attack it.",
    "wikiaUrl": "https://wiki.warframe.com/w/Adarza_Kavat",
    "wikiaThumbnail": "https://wiki.warframe.com/images/AdarzaKavat.png?c023b"
  },
  {
    "id": "carrier",
    "name": "Carrier",
    "type": "Companion",
    "subType": "Sentinel",
    "vaulted": false,
    "source": "Market (Blueprint)",
    "imageName": "Carrier.png",
    "description": "With 'Assault Mode' and 'Ammo Case' as default Precepts, Carrier is a seeker Sentinel. Carrier also comes with a shotgun weapon.",
    "wikiaUrl": "https://wiki.warframe.com/w/Carrier",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Carrier.png?fb038"
  },
  {
    "id": "carrier-prime",
    "name": "Carrier Prime",
    "type": "Companion",
    "subType": "Sentinel",
    "vaulted": true,
    "source": "Void Relics",
    "imageName": "CarrierPrime.png",
    "description": "This ornate sentinel is an excellent example of late Orokin craftsmanship and styling.",
    "wikiaUrl": "https://wiki.warframe.com/w/Carrier%2FPrime",
    "wikiaThumbnail": "https://wiki.warframe.com/images/CarrierPrime.png?5bad8"
  },
  {
    "id": "chesa-kubrow",
    "name": "Chesa Kubrow",
    "type": "Companion",
    "subType": "Kubrow",
    "vaulted": false,
    "source": "Kubrow Incubator",
    "imageName": "KubrowBreedChesa.png",
    "description": "A clever accomplice, trained to relieve the enemy of both their weapons and their loot caches.",
    "wikiaUrl": "https://wiki.warframe.com/w/Chesa_Kubrow",
    "wikiaThumbnail": "https://wiki.warframe.com/images/ChesaKubrow.png?12edc"
  },
  {
    "id": "crescent-vulpaphyla",
    "name": "Crescent Vulpaphyla",
    "type": "Companion",
    "subType": "Vulpaphyla",
    "vaulted": false,
    "source": "Deimos (Son)",
    "imageName": "KavatBreedCrescentVulpaphyla.png",
    "description": "Fast and foxy, Vulpaphyla are agile allies to bring along on your next adventure.",
    "wikiaUrl": "https://wiki.warframe.com/w/Crescent_Vulpaphyla",
    "wikiaThumbnail": "https://wiki.warframe.com/images/CrescentVulpaphyla.png?e0913"
  },
  {
    "id": "dethcube",
    "name": "Dethcube",
    "type": "Companion",
    "subType": "Sentinel",
    "vaulted": false,
    "source": "Market (Blueprint)",
    "imageName": "Dethcube.png",
    "description": "With 'Assault Mode' and 'Vaporize' as default precepts, Dethcube acts exactly as advertised, as a badass cube of 'deth'. Comes loaded with Deth Machine Rifle weapon.",
    "wikiaUrl": "https://wiki.warframe.com/w/Dethcube",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Dethcube.png?d7366"
  },
  {
    "id": "dethcube-prime",
    "name": "Dethcube Prime",
    "type": "Companion",
    "subType": "Sentinel",
    "vaulted": true,
    "source": "Void Relics",
    "imageName": "DethcubePrime.png",
    "description": "With 'Assault Mode' and 'Vaporize' as default precepts, Dethcube Prime is the apex of lethal support. Comes loaded with Deth Machine Rifle Prime weapon.",
    "wikiaUrl": "https://wiki.warframe.com/w/Dethcube%2FPrime",
    "wikiaThumbnail": "https://wiki.warframe.com/images/DethcubePrime.png?75332"
  },
  {
    "id": "diriga",
    "name": "Diriga",
    "type": "Companion",
    "subType": "Sentinel",
    "vaulted": false,
    "source": "Market (Blueprint)",
    "imageName": "Diriga.png",
    "description": "Diriga shocks nearby enemies, and picks off distant threats, utilizing the Vulklok sniper rifle and the 'Calculated Shot', 'Arc Coil' and 'Electro Pulse' precepts.",
    "wikiaUrl": "https://wiki.warframe.com/w/Diriga",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Diriga.png?95532"
  },
  {
    "id": "djinn",
    "name": "Djinn",
    "type": "Companion",
    "subType": "Sentinel",
    "vaulted": false,
    "source": "Market (Blueprint)",
    "imageName": "Djinn.png",
    "description": "With 'Thumper' and 'Fatal Attraction' as default Precepts, Djinn is a combat Sentinel. Djinn also comes with a poison dart weapon.",
    "wikiaUrl": "https://wiki.warframe.com/w/Djinn",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Djinn.png?2bee3"
  },
  {
    "id": "hec-hound",
    "name": "Hec Hound",
    "type": "Companion",
    "subType": "Hound",
    "vaulted": false,
    "source": "Sisters of Parvos",
    "imageName": "ZanukaPetHeadC.png",
    "description": ""
  },
  {
    "id": "helios",
    "name": "Helios",
    "type": "Companion",
    "subType": "Sentinel",
    "vaulted": false,
    "source": "Market (Blueprint)",
    "imageName": "Helios.png",
    "description": "With 'Investigator' as its unique Precept and 'Deconstructor' as its weapon, the versatile Helios Sentinel acts as both a lethal guardian and an automatic codex scanner. Scans require an equipped Codex Scanner and an available charge.",
    "wikiaUrl": "https://wiki.warframe.com/w/Helios",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Helios.png?a5e25"
  },
  {
    "id": "helios-prime",
    "name": "Helios Prime",
    "type": "Companion",
    "subType": "Sentinel",
    "vaulted": true,
    "source": "Void Relics",
    "imageName": "HeliosPrime.png",
    "description": "This knowledge hungry protector defends its master with Deconstructor Prime.",
    "wikiaUrl": "https://wiki.warframe.com/w/Helios%2FPrime",
    "wikiaThumbnail": "https://wiki.warframe.com/images/HeliosPrime.png?c4d66"
  },
  {
    "id": "helminth-charger",
    "name": "Helminth Charger",
    "type": "Companion",
    "subType": "Helminth Charger",
    "vaulted": false,
    "source": "Incubador (Cisto Helminth)",
    "imageName": "KubrowBreedHelminthCharger.png",
    "description": "An experimental blending of Kubrow and Infestation. Uses maggots and other Infested abilities to inflict damage and control the battlefield.",
    "wikiaUrl": "https://wiki.warframe.com/w/Helminth_Charger",
    "wikiaThumbnail": "https://wiki.warframe.com/images/HelminthCharger.png?b24a1"
  },
  {
    "id": "huras-kubrow",
    "name": "Huras Kubrow",
    "type": "Companion",
    "subType": "Kubrow",
    "vaulted": false,
    "source": "Kubrow Incubator",
    "imageName": "KubrowBreedHuras.png",
    "description": "A stealthy ally, surprising enemies with impressive takedowns of explosive force.",
    "wikiaUrl": "https://wiki.warframe.com/w/Huras_Kubrow",
    "wikiaThumbnail": "https://wiki.warframe.com/images/HurasKubrow.png?a7ddd"
  },
  {
    "id": "lambeo-moa",
    "name": "Lambeo Moa",
    "type": "Companion",
    "subType": "Pets",
    "vaulted": false,
    "source": "Fortuna (Legs)",
    "imageName": "MoaHeadB.png",
    "description": ""
  },
  {
    "id": "medjay-predasite",
    "name": "Medjay Predasite",
    "type": "Companion",
    "subType": "Predasite",
    "vaulted": false,
    "source": "Deimos (Son)",
    "imageName": "KubrowBreedPredasiteMedjay.png",
    "description": "These hard-charging, four-legged predators make formidable companions when in the field.",
    "wikiaUrl": "https://wiki.warframe.com/w/Medjay_Predasite",
    "wikiaThumbnail": "https://wiki.warframe.com/images/MedjayPredasite.png?807ff"
  },
  {
    "id": "nautilus",
    "name": "Nautilus",
    "type": "Companion",
    "subType": "Sentinel",
    "vaulted": false,
    "source": "Market (Blueprint)",
    "imageName": "EmpyreanSentinel.png",
    "description": "With 'Auto Omni' and 'Cordon' as default Precepts, this Sentinel is the ideal companion for long voyages aboard a Railjack.",
    "wikiaUrl": "https://wiki.warframe.com/w/Nautilus",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Nautilus.png?f0f26"
  },
  {
    "id": "nautilus-prime",
    "name": "Nautilus Prime",
    "type": "Companion",
    "subType": "Sentinel",
    "vaulted": false,
    "source": "Void Relics",
    "imageName": "NautilusPrime.png",
    "description": "This brave deckhand defends his crew with Verglas Prime.",
    "wikiaUrl": "https://wiki.warframe.com/w/Nautilus%2FPrime",
    "wikiaThumbnail": "https://wiki.warframe.com/images/NautilusPrime.png?63a43"
  },
  {
    "id": "nychus-moa",
    "name": "Nychus Moa",
    "type": "Companion",
    "subType": "Pets",
    "vaulted": false,
    "source": "Fortuna (Legs)",
    "imageName": "PetMoaMeleeHead.png",
    "description": ""
  },
  {
    "id": "oloro-moa",
    "name": "Oloro Moa",
    "type": "Companion",
    "subType": "Pets",
    "vaulted": false,
    "source": "Fortuna (Legs)",
    "imageName": "MoaHeadC.png",
    "description": ""
  },
  {
    "id": "oxylus",
    "name": "Oxylus",
    "type": "Companion",
    "subType": "Sentinel",
    "vaulted": false,
    "source": "Market (Blueprint)",
    "imageName": "Oxylus.png",
    "description": "With 'Scan Aquatic Lifeforms' and 'Scan Matter' as default Precepts, Oxylus was designed to assist in Search-and-Rescue operations through the harsh landscape around The Orb Vallis. Oxylus also comes with a Multron rifle.",
    "wikiaUrl": "https://wiki.warframe.com/w/Oxylus",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Oxylus.png?464ff"
  },
  {
    "id": "panzer-vulpaphyla",
    "name": "Panzer Vulpaphyla",
    "type": "Companion",
    "subType": "Vulpaphyla",
    "vaulted": false,
    "source": "Deimos (Son)",
    "imageName": "KavatBreedPanzerVulpaphyla.png",
    "description": "Fast and foxy, Vulpaphyla are agile allies to bring along on your next adventure.",
    "wikiaUrl": "https://wiki.warframe.com/w/Panzer_Vulpaphyla",
    "wikiaThumbnail": "https://wiki.warframe.com/images/PanzerVulpaphyla.png?e97bc"
  },
  {
    "id": "para-moa",
    "name": "Para Moa",
    "type": "Companion",
    "subType": "Pets",
    "vaulted": false,
    "source": "Fortuna (Legs)",
    "imageName": "MoaHeadA.png",
    "description": ""
  },
  {
    "id": "pharaoh-predasite",
    "name": "Pharaoh Predasite",
    "type": "Companion",
    "subType": "Predasite",
    "vaulted": false,
    "source": "Deimos (Son)",
    "imageName": "KubrowBreedPredasitePharaoh.png",
    "description": "These hard-charging, four-legged predators make formidable companions when in the field.",
    "wikiaUrl": "https://wiki.warframe.com/w/Pharaoh_Predasite",
    "wikiaThumbnail": "https://wiki.warframe.com/images/PharaohPredasite.png?9de94"
  },
  {
    "id": "prisma-shade",
    "name": "Prisma Shade",
    "type": "Companion",
    "subType": "Sentinel",
    "vaulted": false,
    "source": "Baro Ki'Teer",
    "imageName": "PrismaShade.png",
    "description": "A rare jewel of the void. How could anything so beautiful be crafted for stealth?",
    "wikiaUrl": "https://wiki.warframe.com/w/Prisma_Shade",
    "wikiaThumbnail": "https://wiki.warframe.com/images/PrismaShade.png?4432c"
  },
  {
    "id": "raksa-kubrow",
    "name": "Raksa Kubrow",
    "type": "Companion",
    "subType": "Kubrow",
    "vaulted": false,
    "source": "Kubrow Incubator",
    "imageName": "KubrowBreedRaksa.png",
    "description": "A strong guardian focused on protecting its master by bolstering their defense and by driving away attackers.",
    "wikiaUrl": "https://wiki.warframe.com/w/Raksa_Kubrow",
    "wikiaThumbnail": "https://wiki.warframe.com/images/RaksaKubrow.png?037cd"
  },
  {
    "id": "sahasa-kubrow",
    "name": "Sahasa Kubrow",
    "type": "Companion",
    "subType": "Kubrow",
    "vaulted": false,
    "source": "Kubrow Incubator",
    "imageName": "KubrowBreedSahasa.png",
    "description": "A reliable partner that locates supplies for their Tenno master and while thinning enemy ranks.",
    "wikiaUrl": "https://wiki.warframe.com/w/Sahasa_Kubrow",
    "wikiaThumbnail": "https://wiki.warframe.com/images/SahasaKubrow.png?10a51"
  },
  {
    "id": "shade",
    "name": "Shade",
    "type": "Companion",
    "subType": "Sentinel",
    "vaulted": false,
    "source": "Market (Blueprint)",
    "imageName": "Shade.png",
    "description": "With 'Revenge' and 'Ghost' as default Precepts, Shade is well suited for stealth gameplay. Shade also comes with a burst laser pistol.",
    "wikiaUrl": "https://wiki.warframe.com/w/Shade",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Shade.png?f0319"
  },
  {
    "id": "shade-prime",
    "name": "Shade Prime",
    "type": "Companion",
    "subType": "Sentinel",
    "vaulted": true,
    "source": "Void Relics",
    "imageName": "ShadePrime.png",
    "description": "Shade Prime specializes in stealth and comes locked and loaded with the Burst Laser Prime. Together, you can dominate the shadows.",
    "wikiaUrl": "https://wiki.warframe.com/w/Shade%2FPrime",
    "wikiaThumbnail": "https://wiki.warframe.com/images/ShadePrime.png?31cf5"
  },
  {
    "id": "sly-vulpaphyla",
    "name": "Sly Vulpaphyla",
    "type": "Companion",
    "subType": "Vulpaphyla",
    "vaulted": false,
    "source": "Deimos (Son)",
    "imageName": "KavatBreedSlyVulpaphyla.png",
    "description": "Fast and foxy, Vulpaphyla are agile allies to bring along on your next adventure.",
    "wikiaUrl": "https://wiki.warframe.com/w/Sly_Vulpaphyla",
    "wikiaThumbnail": "https://wiki.warframe.com/images/SlyVulpaphyla.png?14390"
  },
  {
    "id": "smeeta-kavat",
    "name": "Smeeta Kavat",
    "type": "Companion",
    "subType": "Kavat",
    "vaulted": false,
    "source": "Kavat Incubator",
    "imageName": "KavatBreedSmeeta.png",
    "description": "This sly feline is playful yet devious.",
    "wikiaUrl": "https://wiki.warframe.com/w/Smeeta_Kavat",
    "wikiaThumbnail": "https://wiki.warframe.com/images/SmeetaKavat.png?30322"
  },
  {
    "id": "sunika-kubrow",
    "name": "Sunika Kubrow",
    "type": "Companion",
    "subType": "Kubrow",
    "vaulted": false,
    "source": "Kubrow Incubator",
    "imageName": "KubrowBreedSunika.png",
    "description": "Bred by the Orokin for combat. This martial beast lives to create chaos and bring down the most fierce opponents.",
    "wikiaUrl": "https://wiki.warframe.com/w/Sunika_Kubrow",
    "wikiaThumbnail": "https://wiki.warframe.com/images/SunikaKubrow.png?31785"
  },
  {
    "id": "taxon",
    "name": "Taxon",
    "type": "Companion",
    "subType": "Sentinel",
    "vaulted": false,
    "source": "Market (Blueprint)",
    "imageName": "Taxon.png",
    "description": "With 'Assault Mode' and 'Molecular Conversion' as default Precepts, Taxon protects its owner with shield restoration. Equipped with the Artax ice-beam.",
    "wikiaUrl": "https://wiki.warframe.com/w/Taxon",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Taxon.png?fcad2"
  },
  {
    "id": "vasca-kavat",
    "name": "Vasca Kavat",
    "type": "Companion",
    "subType": "Kavat",
    "vaulted": false,
    "source": "Kavat Incubator",
    "imageName": "KavatBreedVasca.png",
    "description": "Now free of the Vasca virus, these Kavats can transfuse life to extend not only their own health but that of their master.",
    "wikiaUrl": "https://wiki.warframe.com/w/Vasca_Kavat",
    "wikiaThumbnail": "https://wiki.warframe.com/images/VascaKavat.png?221f6"
  },
  {
    "id": "vizier-predasite",
    "name": "Vizier Predasite",
    "type": "Companion",
    "subType": "Predasite",
    "vaulted": false,
    "source": "Deimos (Son)",
    "imageName": "KubrowBreedPredasiteVizier.png",
    "description": "These hard-charging, four-legged predators make formidable companions when in the field.",
    "wikiaUrl": "https://wiki.warframe.com/w/Vizier_Predasite",
    "wikiaThumbnail": "https://wiki.warframe.com/images/VizierPredasite.png?8430d"
  },
  {
    "id": "wyrm",
    "name": "Wyrm",
    "type": "Companion",
    "subType": "Sentinel",
    "vaulted": false,
    "source": "Market (Blueprint)",
    "imageName": "Wyrm.png",
    "description": "With 'Assault Mode' and 'Crowd Dispersion' as default Precepts, Wyrm is a highly offensive Sentinel. Wyrm also comes with a laser rifle.",
    "wikiaUrl": "https://wiki.warframe.com/w/Wyrm",
    "wikiaThumbnail": "https://wiki.warframe.com/images/Wyrm.png?8bf39"
  },
  {
    "id": "wyrm-prime",
    "name": "Wyrm Prime",
    "type": "Companion",
    "subType": "Sentinel",
    "vaulted": true,
    "source": "Void Relics",
    "imageName": "WyrmPrime.png",
    "description": "Both bodyguard and status symbol, the Wyrm Prime Sentinel was the last line of defense for high ranking Tenno in the Orokin Era."
  }
];
