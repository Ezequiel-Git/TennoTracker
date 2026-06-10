import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { translations } from './translations';
import { 
  LayoutDashboard, 
  Swords, 
  TrendingUp, 
  Database, 
  Search, 
  Check, 
  Award, 
  Lock, 
  Unlock, 
  Info, 
  X, 
  Upload, 
  Download, 
  AlertCircle,
  ExternalLink,
  UserCheck,
  Users,
  UploadCloud,
  Globe,
  Target,
  Star,
  Share2,
  Copy,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  LayoutGrid,
  Map as MapIcon,
  Milestone
} from 'lucide-react';
import { fallbackWeapons, fallbackCompanions, getMasteryPointsRequired, getRankName } from './weaponsData';
import { weaponSourceMap } from './weaponSourceMap';
import { fallbackMods, fallbackArcanes } from './modsData';

// --- STATIC CONFIGURATIONS FOR SYNDICATES ---
const primarySyndicatesList = [
  {
    key: 'steel_meridian',
    name: 'Steel Meridian',
    translation: 'Meridiano de Aço',
    description: 'Liderados por uma desertora Grineer, defendem os inocentes contra a opressão.',
    descKey: 'desc_steel_meridian',
    color: '#ef4444',
    ally: 'red_veil',
    opposed: 'perrin_sequence',
    enemy: 'new_loka',
    weapons: ['Vaykor Hek', 'Vaykor Marelok', 'Vaykor Sydon']
  },
  {
    key: 'arbiters_hexis',
    name: 'Arbiters of Hexis',
    translation: 'Árbitros de Hexis',
    description: 'Rejeitam a mitologia do Tenno como guerreiro, buscando a excelência disciplinada.',
    descKey: 'desc_arbiters_hexis',
    color: '#e2e8f0',
    ally: 'cephalon_suda',
    opposed: 'red_veil',
    enemy: 'perrin_sequence',
    weapons: ['Telos Boltor', 'Telos Akbolto', 'Telos Boltace']
  },
  {
    key: 'cephalon_suda',
    name: 'Cephalon Suda',
    translation: 'Cephalon Suda',
    description: 'Uma vasta consciência artificial focada puramente na coleta de conhecimento científico e dados.',
    descKey: 'desc_cephalon_suda',
    color: '#06b6d4',
    ally: 'arbiters_hexis',
    opposed: 'new_loka',
    enemy: 'red_veil',
    weapons: ['Synoid Simulor', 'Synoid Gammacor', 'Synoid Heliocor']
  },
  {
    key: 'perrin_sequence',
    name: 'The Perrin Sequence',
    translation: 'A Sequência Perrin',
    description: 'Um grupo dissidente de mercadores Corpus que buscam a paz através de relações comerciais e prosperidade.',
    descKey: 'desc_perrin_sequence',
    color: '#f59e0b',
    ally: 'new_loka',
    opposed: 'arbiters_hexis',
    enemy: 'steel_meridian',
    weapons: ['Secura Penta', 'Secura Dual Cestra', 'Secura Lecta']
  },
  {
    key: 'red_veil',
    name: 'Red Veil',
    translation: 'Véu Vermelho',
    description: 'Acreditam em purgar o sistema solar através de fogo e violência para alcançar uma nova era.',
    descKey: 'desc_red_veil',
    color: '#b91c1c',
    ally: 'steel_meridian',
    opposed: 'arbiters_hexis',
    enemy: 'cephalon_suda',
    weapons: ['Rakta Cernos', 'Rakta Ballistica', 'Rakta Dark Dagger']
  },
  {
    key: 'new_loka',
    name: 'New Loka',
    translation: 'Nova Loka',
    description: 'Buscadores da pureza humana e a restauração da Terra à sua beleza ancestral.',
    descKey: 'desc_new_loka',
    color: '#10b981',
    ally: 'perrin_sequence',
    opposed: 'cephalon_suda',
    enemy: 'steel_meridian',
    weapons: ['Sancti Tigris', 'Sancti Castanas', 'Sancti Magistar']
  }
];

const syndicateMaxStanding = {
  '-2': 44000,
  '-1': 22000,
  '0': 5000,
  '1': 22000,
  '2': 44000,
  '3': 70000,
  '4': 99000,
  '5': 132000
};

const openWorldSyndicatesList = [
  { key: 'ostron', locationKey: 'cetus', maxRank: 5, descKey: 'desc_ostron' },
  { key: 'solaris_united', locationKey: 'fortuna', maxRank: 5, descKey: 'desc_solaris_united' },
  { key: 'vox_solaris', locationKey: 'fortuna', maxRank: 5, descKey: 'desc_vox_solaris' },
  { key: 'entrati', locationKey: 'necralisk', maxRank: 5, descKey: 'desc_entrati' },
  { key: 'necraloid', locationKey: 'necralisk', maxRank: 3, descKey: 'desc_necraloid' },
  { key: 'holdfasts', locationKey: 'zariman', maxRank: 5, descKey: 'desc_holdfasts' },
  { key: 'cavia', locationKey: 'sanctum', maxRank: 5, descKey: 'desc_cavia' }
];

// --- WEAPONS ACQUISITION SOURCES & CATEGORIZATION SETS ---
const chemLabWeapons = new Set([
  'ack & brunt', 'argonak', 'buzlok', 'grattler', 'grinlok', 'ignis', 'ignis wraith', 
  'jat kittag', 'jat kusar', 'javlok', 'kesheg', 'knux', 'kohmak', 'twin kohmak', 
  'marelok', 'nukor', 'ogris', 'sydon', 'twin krohkur', 'twin basolk'
]);

const bioLabWeapons = new Set([
  'acrid', 'bubonico', 'catabolyst', 'caustacyst', 'cerata', 'dual ichor', 'dual toxocyst', 
  'embolist', 'hema', 'mutalist quanta', 'paracyst', 'phage', 'pox', 'pupacyst', 
  'scoliac', 'synapse', 'torid', 'mios'
]);

const energyLabWeapons = new Set([
  'amprex', 'arca plasmor', 'convectrix', 'cyanex', 'falcor', 'glaxion', 'kreska', 
  'lanka', 'obex', 'ocucor', 'opticor', 'spectra', 'staticor', 'supra', 'lenz', 
  'ferrox', 'komorex', 'dera', 'dual cestra', 'flux rifle', 'heliocor'
]);

const tennoLabWeapons = new Set([
  'anku', 'attica', 'baza', 'cassowar', 'daikyu', 'dark split-sword', 'endura', 
  'guandao', 'gunsen', 'lacera', 'nikana', 'okina', 'pyrana', 'scourge', 'shaku', 
  'sybaris', 'tenora', 'tonbo', 'veldt', 'venato', 'venka', 'zakti', 'castanas', 
  'knell', 'pandero', 'kestrel', 'boltace', 'tipedo', 'karyst', 'kronen', 'destreza', 
  'krohkur', 'sarpa', 'redeemer', 'gazal machete', 'silva & aegis', 'ninkondi', 
  'tekko', 'dual kamas', 'spira', 'fusilai', 'talons', 'akjagara', 'aksomati', 
  'akvasto', 'akboltor', 'akmagnus', 'dual keres'
]);

const marketCreditsWeapons = new Set([
  'braton', 'lato', 'skana', 'strun', 'lex', 'sicarus', 'furis', 'kunai', 'bo', 'furax',
  'mk1-braton', 'mk1-paris', 'mk1-strun', 'mk1-kunai', 'mk1-furis', 'mk1-bo', 'mk1-furax'
]);

const questWeapons = new Set([
  'xoris', 'nataruk', 'rumblejack', 'orvius', 'sirocco', 'dex dakra', 'ether daggers', 'broken war'
]);

// Helper to map and unify weapons and warframes payload structure
const mapItemData = (item, isWarframe, lang) => {
  const type = isWarframe ? 'Warframe' : (
    item.category === "Primary" || item.category === "Secondary" || item.category === "Melee" 
      ? item.category 
      : item.type
  );

  const image = item.imageName 
    ? `https://cdn.warframestat.us/img/${item.imageName}` 
    : null;

  const wikiaUrl = item.wikiaUrl || `https://warframe.fandom.com/wiki/${encodeURIComponent((item.name || '').replace(/\s+/g, '_'))}`;

  let isNemesis = false;
  let nemesisType = null;
  let weaponSource;

  if (item.name) {
    const upperName = item.name.toUpperCase();
    if (upperName.includes('KUVA')) {
      isNemesis = true;
      nemesisType = 'Kuva';
      weaponSource = 'Kuva Lich';
    } else if (upperName.includes('TENET')) {
      isNemesis = true;
      nemesisType = 'Tenet';
      weaponSource = 'Sister of Parvos';
    } else if (upperName.includes('CODA')) {
      isNemesis = true;
      nemesisType = 'Coda';
      weaponSource = 'Infested Lich';
    }
  }

  const getRelicTierVal = (name) => {
    const lower = name.toLowerCase();
    if (lower.startsWith('lith')) return 1;
    if (lower.startsWith('meso')) return 2;
    if (lower.startsWith('neo')) return 3;
    if (lower.startsWith('axi')) return 4;
    if (lower.startsWith('requiem')) return 5;
    return 6;
  };

  let mappedComponents = [];
  
  if (!isNemesis) {
    mappedComponents = item.components ? item.components.map(c => {
      const cleanCompDrops = [];
      if (c.drops) {
        const seenRelics = new Set();
        c.drops.forEach(d => {
          if (!d || !d.location) return;
          const cleanLoc = d.location.replace(/\s*\((Intact|Exceptional|Flawless|Radiant)\)/i, '').trim();
          if (!seenRelics.has(cleanLoc)) {
            seenRelics.add(cleanLoc);
            cleanCompDrops.push({
              location: cleanLoc,
              chance: d.chance || null,
              rarity: d.rarity || null
            });
          }
        });
      }

      cleanCompDrops.sort((a, b) => {
        const tierA = getRelicTierVal(a.location);
        const tierB = getRelicTierVal(b.location);
        if (tierA !== tierB) return tierA - tierB;
        return a.location.localeCompare(b.location);
      });

      return {
        name: c.name || 'Component',
        itemCount: c.quantity || c.itemCount || 1,
        drops: cleanCompDrops
      };
    }) : [];
  }

  const allComponentDrops = [];
  const seenWeaponDrops = new Set();
  mappedComponents.forEach(c => {
    if (c.drops) {
      c.drops.forEach(d => {
        if (d.location) {
          if (!seenWeaponDrops.has(d.location)) {
            seenWeaponDrops.add(d.location);
            allComponentDrops.push(d.location);
          }
        }
      });
    }
  });

  allComponentDrops.sort((a, b) => {
    const tierA = getRelicTierVal(a);
    const tierB = getRelicTierVal(b);
    if (tierA !== tierB) return tierA - tierB;
    return a.localeCompare(b);
  });

  let weaponDrops = [];
  
  const hasRelics = allComponentDrops.some(loc => {
    const l = loc.toLowerCase();
    return l.includes('lith') || l.includes('meso') || l.includes('neo') || l.includes('axi');
  });

  if (!isNemesis) {
    const mapLookup = item.uniqueName ? weaponSourceMap[item.uniqueName] : null;

    if (mapLookup) {
      weaponSource = mapLookup;
    } else {
      const hasCustomDrops = item.drops && item.drops.length > 0 && !item.drops.some(d => {
        const loc = typeof d === 'string' ? d : (d.location || '');
        return loc.toLowerCase().includes('codex') || loc.toLowerCase().includes('in-game');
      });

      if (item.vaulted) {
        weaponSource = "Void Relics (Vaulted)";
      } else if (hasRelics) {
        weaponSource = "Void Relics";
      } else if (hasCustomDrops || allComponentDrops.length > 0) {
        weaponSource = "Mission Drops";
      } else {
        // Determine more detailed source
        const nameLower = (item.name || '').toLowerCase();
        const uniqLower = (item.uniqueName || '').toLowerCase();
        const bpUniq = (item.components?.find(c => c.name && c.name.toLowerCase() === 'blueprint')?.uniqueName || '').toLowerCase();

        if (nameLower === 'lato prime' || nameLower === 'skana prime' || nameLower === 'excalibur prime') {
          weaponSource = "Founder Pack";
        } else if (nameLower === 'azima' || nameLower === 'zenistar' || nameLower === 'zenith' || nameLower === 'sigma & octantis') {
          weaponSource = "Daily Login";
        } else if (nameLower === 'broken war') {
          weaponSource = "Quest (Broken War)";
        } else if (questWeapons.has(nameLower)) {
          weaponSource = "Quest";
        } else if (nameLower === 'seer') {
          weaponSource = "Boss Vor Drop";
        } else if (nameLower === 'miter' || nameLower === 'twin gremlins') {
          weaponSource = "Boss Ceres Drop";
        } else if (['laetum', 'phenmor', 'felarx', 'praedos', 'innodem'].includes(nameLower)) {
          weaponSource = "Zariman Cavalero";
        } else if (['syam', 'sampotes', 'azothane', 'edun', 'sun & moon'].includes(nameLower)) {
          weaponSource = "Duviri Acrithis";
        } else if (['trumna', 'sepulchrum'].includes(nameLower)) {
          weaponSource = "Deimos Father";
        } else if (['stropha', 'stahlta'].includes(nameLower)) {
          weaponSource = "Granum Void";
        } else if (nameLower === 'brakk') {
          weaponSource = "Grustrag Three";
        } else if (nameLower === 'detron') {
          weaponSource = "Zanuka Hunter";
        } else if (['glaive', 'dark sword', 'dark dagger', 'ceramic dagger', 'plasma sword', 'jaw sword', 'pangolin sword', 'heat sword', 'heat dagger'].includes(nameLower)) {
          weaponSource = "Nightwave";
        } else if (uniqLower.includes('/clantech/chemical') || bpUniq.includes('/clantech/chemical') || chemLabWeapons.has(nameLower)) {
          weaponSource = "Dojo Chem Lab";
        } else if (uniqLower.includes('/clantech/bio') || bpUniq.includes('/clantech/bio') || bioLabWeapons.has(nameLower)) {
          weaponSource = "Dojo Bio Lab";
        } else if (uniqLower.includes('/clantech/energy') || bpUniq.includes('/clantech/energy') || energyLabWeapons.has(nameLower)) {
          weaponSource = "Dojo Energy Lab";
        } else if (uniqLower.includes('/clantech/tenno') || bpUniq.includes('/clantech/tenno') || tennoLabWeapons.has(nameLower)) {
          weaponSource = "Dojo Tenno Lab";
        } else if (nameLower === 'kompressa' || nameLower === 'yareli') {
          weaponSource = "Dojo Bash Lab";
        } else if (nameLower === 'dorrclave' || nameLower === 'dagath') {
          weaponSource = "Dojo Dagath Hollow";
        } else if (marketCreditsWeapons.has(nameLower)) {
          weaponSource = "Market Credits";
        } else if (item.bpCost && item.bpCost > 0) {
          weaponSource = "Market Blueprint";
        } else {
          weaponSource = isWarframe ? "Boss Drops / Dojo / Quests" : "Market / Dojo Research";
        }
      }
    }
  }

  if (isNemesis) {
    weaponDrops = [`Arma dropada pronta ao derrotar o(a) seu(sua) ${weaponSource}. (Ver aba Liches & Irmãs)`];
  } else {
    if (item.drops && item.drops.length > 0) {
      const isGeneric = item.drops.some(d => {
        const loc = typeof d === 'string' ? d : (d.location || '');
        return loc.toLowerCase().includes('codex') || loc.toLowerCase().includes('in-game');
      });

      if (!isGeneric) {
        weaponDrops = item.drops.map(d => {
          if (typeof d === 'string') return d;
          return d.location ? `${d.location} (${d.chance ? (d.chance * 100).toFixed(1) + '%' : 'Drop'})` : "Drop específico";
        });
      }
    }

    if (weaponDrops.length === 0 && allComponentDrops.length > 0) {
      weaponDrops = allComponentDrops;
    }

    if (weaponDrops.length === 0) {
      const upperName = (item.name || '').toUpperCase();
      if (upperName.includes('PRISMA')) {
        weaponDrops = ["Prisma Weapon Option"];
      } else if (upperName.includes('WRAITH')) {
        weaponDrops = ["Wraith Weapon Option"];
      } else if (upperName.includes('VANDAL')) {
        weaponDrops = ["Vandal Weapon Option"];
      } else if (upperName.includes('DEX')) {
        weaponDrops = ["Dex Weapon Option"];
      } else if (
        upperName.startsWith('VAYKOR ') || 
        upperName.startsWith('TELOS ') || 
        upperName.startsWith('SYNOID ') || 
        upperName.startsWith('SECURA ') || 
        upperName.startsWith('RAKTA ') || 
        upperName.startsWith('SANCTI ')
      ) {
        weaponDrops = ["Syndicate Weapon Option"];
      } else if (weaponSource === "Founder Pack") {
        weaponDrops = ["Founder Pack Option"];
      } else if (weaponSource === "Daily Login") {
        weaponDrops = ["Daily Login Option"];
      } else if (weaponSource === "Quest (Broken War)") {
        weaponDrops = ["Broken War Option"];
      } else if (weaponSource === "Quest") {
        weaponDrops = ["Quest Option"];
      } else if (weaponSource === "Boss Vor Drop") {
        weaponDrops = ["Boss Vor Drop Option"];
      } else if (weaponSource === "Boss Ceres Drop") {
        weaponDrops = ["Boss Ceres Drop Option"];
      } else if (weaponSource === "Zariman Cavalero") {
        weaponDrops = ["Zariman Cavalero Option"];
      } else if (weaponSource === "Duviri Acrithis") {
        weaponDrops = ["Duviri Acrithis Option"];
      } else if (weaponSource === "Deimos Father") {
        weaponDrops = ["Deimos Father Option"];
      } else if (weaponSource === "Granum Void") {
        weaponDrops = ["Granum Void Option"];
      } else if (weaponSource === "Grustrag Three") {
        weaponDrops = ["Grustrag Three Option"];
      } else if (weaponSource === "Zanuka Hunter") {
        weaponDrops = ["Zanuka Hunter Option"];
      } else if (weaponSource === "Nightwave") {
        weaponDrops = ["Nightwave Option"];
      } else if (weaponSource === "Dojo Tenno Lab") {
        weaponDrops = ["Dojo Tenno Lab Option"];
      } else if (weaponSource === "Dojo Bio Lab") {
        weaponDrops = ["Dojo Bio Lab Option"];
      } else if (weaponSource === "Dojo Chem Lab") {
        weaponDrops = ["Dojo Chem Lab Option"];
      } else if (weaponSource === "Dojo Energy Lab") {
        weaponDrops = ["Dojo Energy Lab Option"];
      } else if (weaponSource === "Dojo Bash Lab") {
        weaponDrops = ["Dojo Bash Lab Option"];
      } else if (weaponSource === "Dojo Dagath Hollow") {
        weaponDrops = ["Dojo Dagath Hollow Option"];
      } else if (weaponSource === "Market Credits") {
        weaponDrops = ["Market Credits Option"];
      } else if (weaponSource === "Market Blueprint") {
        weaponDrops = ["Market Blueprint Option"];
      } else if (weaponSource === "Market / Dojo Research") {
        weaponDrops = ["Market / Dojo Research Option"];
      } else if (weaponSource === "Boss Drops / Dojo / Quests") {
        weaponDrops = ["Boss Drops / Dojo / Quests Option"];
      } else if (isWarframe) {
        weaponDrops = item.name.includes("Prime") ? ["Void Relics"] : ["Drops no jogo (Consulte o Codex/Chefe da Missão)."];
      } else {
        weaponDrops = ["Drops no jogo (Consulte o Codex)."];
      }
    }
  }

  return {
    id: item.uniqueName || (item.name ? item.name.toLowerCase().replace(/\s+/g, '-') : Math.random().toString(36).substring(2, 9)),
    name: item.name,
    type: type || (isWarframe ? 'Warframe' : 'Primary'),
    isNemesis: isNemesis,
    nemesisType: nemesisType,
    masteryReq: item.masteryReq || 0,
    vaulted: item.vaulted || false,
    source: weaponSource,
    difficulty: item.masteryReq > 12 ? "Hard" : (item.masteryReq > 6 ? "Medium" : "Easy"),
    description: item.description || (
      lang === 'pt' ? "Nenhuma descrição disponível." :
      lang === 'es' ? "No hay descripción disponible." :
      lang === 'ja' ? "説明はありません。" :
      "No description available."
    ),
    image: image,
    wikiaUrl: wikiaUrl,
    components: mappedComponents,
    drops: weaponDrops,
    critChance: item.criticalChance !== undefined ? item.criticalChance : (item.attacks?.[0]?.crit_chance || 0),
    critMultiplier: item.criticalMultiplier !== undefined ? item.criticalMultiplier : (item.attacks?.[0]?.crit_mult || 0),
    statusChance: item.procChance !== undefined ? item.procChance : (item.attacks?.[0]?.status_chance || 0),
    fireRate: item.fireRate !== undefined ? item.fireRate : (item.attacks?.[0]?.speed || 0),
    disposition: item.disposition !== undefined ? item.disposition : 3,
    damage: item.damage || { total: 0 },
    health: item.health || 100,
    shield: item.shield || 100,
    armor: item.armor || 100,
    power: item.power || item.energy || 100,
    abilities: item.abilities || []
  };
};

const getLocalizedSource = (source, lang) => {
  if (!source) return "";
  if (source.includes("Void Relics (Vaulted)")) {
    if (lang === 'pt') return "Relíquias do Void (Vaulted)";
    if (lang === 'es') return "Reliquias del Vacío (Bóveda)";
    if (lang === 'ja') return "Voidレリック (Vault入り)";
    return "Void Relics (Vaulted)";
  }
  if (source.includes("Void Relics")) {
    if (lang === 'pt') return "Relíquias do Void";
    if (lang === 'es') return "Reliquias del Vacío";
    if (lang === 'ja') return "Voidレリック";
    return "Void Relics";
  }
  if (source.includes("Mission Drops")) {
    if (lang === 'pt') return "Drops de Missão";
    if (lang === 'es') return "Drops de Misión";
    if (lang === 'ja') return "ミッションドロップ";
    return "Mission Drops";
  }
  if (source.includes("Boss Drops / Dojo / Quests")) {
    if (lang === 'pt') return "Drops de Chefe / Dojo / Jornadas";
    if (lang === 'es') return "Drops de Jefe / Dojo / Aventuras";
    if (lang === 'ja') return "ボスドロップ / クランドージョ / クエスト";
    return "Boss Drops / Dojo / Quests";
  }
  if (source.includes("Market / Dojo Research")) {
    if (lang === 'pt') return "Pesquisa do Mercado / Dojo";
    if (lang === 'es') return "Investigación de Mercado / Dojo";
    if (lang === 'ja') return "マーケット / クランドージョ研究";
    return "Market / Dojo Research";
  }
  if (source.includes("Kuva Lich")) {
    if (lang === 'pt') return "Kuva Lich";
    if (lang === 'es') return "Lich Kuva";
    if (lang === 'ja') return "クバ・リッチ";
    return "Kuva Lich";
  }
  if (source.includes("Sister of Parvos")) {
    if (lang === 'pt') return "Irmã de Parvos";
    if (lang === 'es') return "Hermana de Parvos";
    if (lang === 'ja') return "パルボスのシスター";
    return "Sister of Parvos";
  }
  if (source.includes("Infested Lich")) {
    if (lang === 'pt') return "Lich Infestado (Coda)";
    if (lang === 'es') return "Lich Infestado (Coda)";
    if (lang === 'ja') return "感染体リッチ (Coda)";
    return "Infested Lich (Coda)";
  }
  
  // New specific sources
  if (source === "Founder Pack") {
    if (lang === 'pt') return "Pacote do Fundador (Exclusivo/Indisponível)";
    if (lang === 'es') return "Paquete de Fundador (Exclusivo)";
    if (lang === 'ja') return "ファウンダーパック (入手不可)";
    return "Founder Pack (Exclusive)";
  }
  if (source === "Daily Login") {
    if (lang === 'pt') return "Tributo Diário (Login)";
    if (lang === 'es') return "Tributo Diario (Login)";
    if (lang === 'ja') return "デイリーログイン報酬";
    return "Daily Login Reward";
  }
  if (source === "Quest (Broken War)") {
    if (lang === 'pt') return "Jornada: O Segundo Sonho";
    if (lang === 'es') return "Aventura: El Segundo Sueño";
    if (lang === 'ja') return "クエスト: 二番目の夢";
    return "Quest: The Second Dream";
  }
  if (source === "Quest") {
    if (lang === 'pt') return "Recompensa de Jornada";
    if (lang === 'es') return "Recompensa de Aventura";
    if (lang === 'ja') return "クエスト報酬";
    return "Quest Reward";
  }
  if (source === "Boss Vor Drop") {
    if (lang === 'pt') return "Chefe: Captain Vor";
    if (lang === 'es') return "Jefe: Captain Vor";
    if (lang === 'ja') return "ボス: Captain Vor";
    return "Boss: Captain Vor";
  }
  if (source === "Boss Ceres Drop") {
    if (lang === 'pt') return "Chefe: Exta (Ceres)";
    if (lang === 'es') return "Jefe: Exta (Ceres)";
    if (lang === 'ja') return "ボス: Exta (Ceres)";
    return "Boss: Exta (Ceres)";
  }
  if (source === "Zariman Cavalero") {
    if (lang === 'pt') return "Cavalero (Zariman)";
    if (lang === 'es') return "Cavalero (Zariman)";
    if (lang === 'ja') return "Cavalero (Zariman)";
    return "Cavalero (Zariman)";
  }
  if (source === "Duviri Acrithis") {
    if (lang === 'pt') return "Acrithis (Duviri)";
    if (lang === 'es') return "Acrithis (Duviri)";
    if (lang === 'ja') return "Acrithis (Duviri)";
    return "Acrithis (Duviri)";
  }
  if (source === "Deimos Father") {
    if (lang === 'pt') return "Pai (Deimos)";
    if (lang === 'es') return "Padre (Deimos)";
    if (lang === 'ja') return "Father (Deimos)";
    return "Father (Deimos)";
  }
  if (source === "Granum Void") {
    if (lang === 'pt') return "Void de Granum";
    if (lang === 'es') return "Vacío de Granum";
    if (lang === 'ja') return "Granum Void";
    return "Granum Void";
  }
  if (source === "Grustrag Three") {
    if (lang === 'pt') return "Os Três Grustrag";
    if (lang === 'es') return "Los Tres Grustrag";
    if (lang === 'ja') return "Grustrag Three";
    return "Grustrag Three";
  }
  if (source === "Zanuka Hunter") {
    if (lang === 'pt') return "Caçador Zanuka";
    if (lang === 'es') return "Cazador Zanuka";
    if (lang === 'ja') return "Zanuka Hunter";
    return "Zanuka Hunter";
  }
  if (source === "Nightwave") {
    if (lang === 'pt') return "Ofertas da Nightwave";
    if (lang === 'es') return "Ofrendas de Nightwave";
    if (lang === 'ja') return "Nightwave 提供物";
    return "Nightwave Offerings";
  }
  if (source === "Dojo Chem Lab") {
    if (lang === 'pt') return "Dojo: Laboratório Químico";
    if (lang === 'es') return "Dojo: Laboratorio Químico";
    if (lang === 'ja') return "Dojo: 化学ラボ";
    return "Dojo: Chemical Lab";
  }
  if (source === "Dojo Bio Lab") {
    if (lang === 'pt') return "Dojo: Laboratório de Biologia";
    if (lang === 'es') return "Dojo: Laboratorio de Biología";
    if (lang === 'ja') return "Dojo: バイオラボ";
    return "Dojo: Bio Lab";
  }
  if (source === "Dojo Energy Lab") {
    if (lang === 'pt') return "Dojo: Laboratório de Energia";
    if (lang === 'es') return "Dojo: Laboratorio de Energía";
    if (lang === 'ja') return "Dojo: エネルギーラボ";
    return "Dojo: Energy Lab";
  }
  if (source === "Dojo Tenno Lab") {
    if (lang === 'pt') return "Dojo: Laboratório Tenno";
    if (lang === 'es') return "Dojo: Laboratorio Tenno";
    if (lang === 'ja') return "Dojo: Tennoラボ";
    return "Dojo: Tenno Lab";
  }
  if (source === "Dojo Bash Lab") {
    if (lang === 'pt') return "Dojo: Laboratório Ventkids (Bash)";
    if (lang === 'es') return "Dojo: Laboratorio Ventkids (Bash)";
    if (lang === 'ja') return "Dojo: Bashラボ (ベントキッド)";
    return "Dojo: Bash Lab (Ventkids)";
  }
  if (source === "Dojo Dagath Hollow") {
    if (lang === 'pt') return "Dojo: Sepulcro da Dagath";
    if (lang === 'es') return "Dojo: Cripta de Dagath";
    if (lang === 'ja') return "Dojo: Dagathの空洞";
    return "Dojo: Dagath's Hollow";
  }
  if (source === "Market Credits") {
    if (lang === 'pt') return "Mercado: Créditos";
    if (lang === 'es') return "Mercado: Créditos";
    if (lang === 'ja') return "マーケット: クレジット";
    return "Market: Credits";
  }
  if (source === "Market Blueprint") {
    if (lang === 'pt') return "Mercado: Diagrama";
    if (lang === 'es') return "Mercado: Plano";
    if (lang === 'ja') return "マーケット: 設計図";
    return "Market: Blueprint";
  }
  
  return source;
};

const getLocalizedDropText = (dropText, lang, itemName = '') => {
  if (!dropText) return "";
  const displayItemName = itemName || (
    lang === 'pt' ? 'esta arma' :
    lang === 'es' ? 'esta arma' :
    lang === 'ja' ? 'この武器' :
    'this weapon'
  );

  if (dropText.includes("Arma dropada pronta ao derrotar") || dropText.includes("Arma dropada pronta") || dropText.includes("derrotar o(a) seu(sua)")) {
    const isKuva = dropText.toLowerCase().includes("kuva") || dropText.toLowerCase().includes("lich");
    const isSister = dropText.toLowerCase().includes("sister") || dropText.toLowerCase().includes("irmã") || dropText.toLowerCase().includes("parvos");
    
    if (lang === 'pt') {
      const source = isKuva ? "Kuva Lich" : isSister ? "Sister of Parvos" : "Infested Lich";
      return `Arma obtida ao derrotar seu ${source}. (Ver aba Liches & Irmãs)`;
    } else if (lang === 'es') {
      const source = isKuva ? "Lich Kuva" : isSister ? "Hermana de Parvos" : "Lich Infestado";
      return `Arma obtenida al derrotar a tu ${source}. (Ver pestaña Liches y Hermanas)`;
    } else if (lang === 'ja') {
      const source = isKuva ? "クバ・リッチ" : isSister ? "パルボスのシスター" : "感染体リッチ";
      return `${source}を倒すことで入手できます。（ネメシスタブを参照）`;
    } else {
      const source = isKuva ? "Kuva Lich" : isSister ? "Sister of Parvos" : "Infested Lich";
      return `Weapon obtained by defeating your ${source}. (See Liches & Sisters tab)`;
    }
  }
  
  if (dropText.includes("Drops no jogo (Consulte o Codex).") || dropText.includes("Drops no jogo (Consulte o Codex)")) {
    if (lang === 'pt') return `Drops no jogo (Consulte o Codex para obter mais detalhes de ${displayItemName}).`;
    if (lang === 'es') return `Drops en el juego (Consulte el Códice para detalles de ${displayItemName}).`;
    if (lang === 'ja') return `ゲーム内ドロップ（${displayItemName}の詳細についてはコーデックスを参照）。`;
    return `In-game drops (Consult the Codex for details on ${displayItemName}).`;
  }

  if (dropText.includes("Drops no jogo (Consulte o Codex/Chefe da Missão).") || dropText.includes("Drops no jogo (Consulte o Codex/Chefe")) {
    if (lang === 'pt') return `Drops no jogo (Consulte o Codex/Chefe da Missão para obter ${displayItemName}).`;
    if (lang === 'es') return `Drops en el juego (Consulte el Códice/Jefe de Misión para obtener ${displayItemName}).`;
    if (lang === 'ja') return `ゲーム内ドロップ（${displayItemName}の入手方法についてはコーデックス/ミッションボスを参照）。`;
    return `In-game drops (Consult Codex/Mission Boss for ${displayItemName}).`;
  }

  if (dropText === "Void Relics") {
    if (lang === 'pt') return `Relíquias do Void (Abra Relíquias para obter as partes de ${displayItemName}).`;
    if (lang === 'es') return `Reliquias del Vacío (Abra Reliquias para obtener partes de ${displayItemName}).`;
    if (lang === 'ja') return `Voidレリック（レリックを開封して${displayItemName}のパーツを入手）。`;
    return `Void Relics (Open Relics to get parts for ${displayItemName}).`;
  }

  if (dropText === "Void Relics (Vaulted)") {
    if (lang === 'pt') return `Relíquias do Void (No Cofre / Vaulted - Partes de ${displayItemName} indisponíveis em novas relíquias).`;
    if (lang === 'es') return `Reliquias del Vacío (Bóveda / Vaulted - Partes de ${displayItemName} no disponibles en nuevas reliquias).`;
    if (lang === 'ja') return `Voidレリック（Vault入り - 新しいレリックから${displayItemName}のパーツは入手できません）。`;
    return `Void Relics (Vaulted - Parts for ${displayItemName} are no longer available from new relics).`;
  }

  if (dropText === "Prisma Weapon Option") {
    if (lang === 'pt') return `Comprado do Baro Ki'Teer no Void Relay (por Ducados e Créditos) ou através de trocas com outros jogadores.`;
    if (lang === 'es') return `Comprado a Baro Ki'Teer en los Repetidores del Vacío (por Ducados y Créditos) o mediante intercambio con otros jugadores.`;
    if (lang === 'ja') return `VoidリレーのBaro Ki'Teerから購入（デュカットとクレジット）、または他プレイヤーとのトレードで入手。`;
    return `Purchased from Baro Ki'Teer in the Void Relays (for Ducats and Credits) or via trading with other players.`;
  }

  if (dropText === "Wraith Weapon Option" || dropText === "Vandal Weapon Option") {
    if (lang === 'pt') return `Obtido em missões de Invasão (peças/diagramas como recompensa de batalha), no Massacre do Santuário (Sanctuary Onslaught) ou pelo Baro Ki'Teer.`;
    if (lang === 'es') return `Obtenido en misiones de Invasión (partes/planos como recompensa de batalla), Masacre en el Santuario (Sanctuary Onslaught) o Baro Ki'Teer.`;
    if (lang === 'ja') return `侵略ミッション（バトルペイのパーツ/設計図）、聖域交戦（Sanctuary Onslaught）の報酬、またはBaro Ki'Teerから入手。`;
    return `Obtained from Invasion missions (parts/blueprints as battle pay), Sanctuary Onslaught rewards, or Baro Ki'Teer.`;
  }

  if (dropText === "Dex Weapon Option") {
    if (lang === 'pt') return `Recompensa especial de Alertas do Aniversário do Warframe (Março/Abril de cada ano).`;
    if (lang === 'es') return `Recompensa especial de las Alertas de Aniversario de Warframe (Marzo/Abril de cada año).`;
    if (lang === 'ja') return `Warframe周年記念アラートの特別報酬（毎年3月〜4月頃）。`;
    return `Special reward from the Warframe Anniversary Alerts (March/April each year).`;
  }

  if (dropText === "Syndicate Weapon Option") {
    if (lang === 'pt') return `Comprado com Reputação nas Ofertas do Sindicato correspondente (requer Rank 5) ou através de trocas com outros jogadores.`;
    if (lang === 'es') return `Comprado con Reputación en las Ofrendas del Sindicato respectivo (requiere Rango 5) o mediante intercambio con otros jugadores.`;
    if (lang === 'ja') return `対応するシンジケートの提供物から購入（地位ポイント、ランク5が必要）、または他プレイヤーとのトレードで入手。`;
    return `Purchased from the respective Syndicate Offerings (for Standing, requires Rank 5) or via trading with other players.`;
  }

  if (dropText === "Market / Dojo Research Option") {
    if (lang === 'pt') return `O diagrama de ${displayItemName} pode ser comprado no Mercado do jogo (por Créditos) ou pesquisado/obtido nos Laboratórios do Dojo de seu Clã (Tenno, Químico, Bio ou Energia).`;
    if (lang === 'es') return `El plano de ${displayItemName} se puede comprar en el Mercado del juego (por Créditos) o investigarse/replicarse en los Laboratorios del Dojo de tu Clan (Tenno, Químico, Bio o Energía).`;
    if (lang === 'ja') return `${displayItemName}の設計図はゲーム内マーケットで購入（クレジット）、またはクランドージョのラボ（Tenno、化学、バイオ、エネルギー）で研究・複製できます。`;
    return itemName 
      ? `The blueprint for ${itemName} can be purchased from the in-game Market (for Credits) or researched/replicated in your Clan Dojo Labs (Tenno, Bio, Chemical, or Energy).`
      : `The blueprint for this weapon can be purchased from the in-game Market (for Credits) or researched/replicated in your Clan Dojo Labs (Tenno, Bio, Chemical, or Energy).`;
  }

  if (dropText === "Boss Drops / Dojo / Quests Option") {
    if (lang === 'pt') return `Obtido como recompensa de chefes planetários, jornadas principais/secundárias ou pesquisas especiais do Dojo (consulte o Codex ou a Wiki para detalhes específicos).`;
    if (lang === 'es') return `Obtenido como recompensa de jefes planetarios, aventuras principales/secundarias o investigaciones especiales del Dojo (consulte el Códice o la Wiki para más detalles).`;
    if (lang === 'ja') return `惑星ボスからのドロップ、メイン/サブクエストの報酬、または特殊なクランドージョ研究（詳細についてはコーデックスまたはWikiを参照）。`;
    return `Obtained as a drop from planetary bosses, main/side quests, or special Dojo research (consult the Codex or Wiki for specific details).`;
  }

  if (dropText === "Founder Pack Option") {
    if (lang === 'pt') return `Exclusivo dos Pacotes de Fundador originais (Excalibur Prime, Lato Prime e Skana Prime). Não podem mais ser obtidos.`;
    if (lang === 'es') return `Exclusivo de los paquetes de fundador originales (Excalibur Prime, Lato Prime, Skana Prime). Ya no se puede obtener.`;
    if (lang === 'ja') return `初代ファウンダーパック（Excalibur Prime、Lato Prime、Skana Prime）の限定品。現在は入手不可能です。`;
    return `Exclusive to the original Founders Packs (Excalibur Prime, Lato Prime, Skana Prime). No longer obtainable.`;
  }
  if (dropText === "Daily Login Option") {
    if (lang === 'pt') return `Recompensa por atingir marcos de Login Diário (Tributo Diário) no jogo (ex: 100, 300, 500, 700 dias).`;
    if (lang === 'es') return `Recompensa por alcanzar hitos de inicio de sesión diario (Tributo diario) en el juego (por ejemplo, 100, 300, 500, 700 días).`;
    if (lang === 'ja') return `ゲーム内デイリーログインボーナス（デイリートリビュート）のマイルストーン報酬（例: 100日、300日、500日、700日など）。`;
    return `Reward for reaching Daily Login milestones (Daily Tribute) in-game (e.g., 100, 300, 500, 700 days).`;
  }
  if (dropText === "Broken War Option") {
    if (lang === 'pt') return `Entregue como recompensa de quest ao completar a jornada principal 'O Segundo Sonho'. Também pode dropar de Shadow Stalker.`;
    if (lang === 'es') return `Otorgado como recompensa al completar la aventura principal 'El Segundo Sueño'. También puede caer del Shadow Stalker.`;
    if (lang === 'ja') return `メインクエスト「二番目の夢」のクリア報酬として入手。Shadow Stalkerからドロップすることもあります。`;
    return `Awarded as a quest reward upon completing 'The Second Dream' main quest. Can also drop from the Shadow Stalker.`;
  }
  if (dropText === "Quest Option") {
    if (lang === 'pt') return `Obtido como recompensa direta ao completar a jornada relacionada (Ex: Nataruk na jornada 'A Nova Guerra').`;
    if (lang === 'es') return `Obtenido como recompensa directa al completar la aventura relacionada (Ej: Nataruk en la aventura 'La Nueva Guerra').`;
    if (lang === 'ja') return `関連クエストの完了報酬として直接入手（例: クエスト「新たな大戦」のNatarukなど）。`;
    return `Obtained as a direct reward upon completing the related quest (e.g., Nataruk in 'The New War' quest).`;
  }
  if (dropText === "Boss Vor Drop Option") {
    if (lang === 'pt') return `O diagrama de ${displayItemName} dropa ao derrotar o chefe Captain Vor em Mercúrio (Tolstoj) ou Ceres (Exta).`;
    if (lang === 'es') return `El plano de ${displayItemName} cae al derrotar al jefe Capitán Vor en Mercurio (Tolstoj) o Ceres (Exta).`;
    if (lang === 'ja') return `水星のボス「Captain Vor」（Tolstoj）またはケレス（Exta）を倒すと、${displayItemName}の設計図がドロップします。`;
    return itemName 
      ? `The blueprint for ${itemName} drops upon defeating Captain Vor on Mercury (Tolstoj) or Ceres (Exta).`
      : `The blueprint for this weapon drops upon defeating Captain Vor on Mercury (Tolstoj) or Ceres (Exta).`;
  }
  if (dropText === "Boss Ceres Drop Option") {
    if (lang === 'pt') return `O diagrama de ${displayItemName} dropa ao derrotar Lt. Lech Kril & Captain Vor na missão Exta em Ceres. Componentes adicionais requerem fabricação.`;
    if (lang === 'es') return `El plano de ${displayItemName} cae al derrotar al Tte. Lech Kril y al Capitán Vor en la misión Exta de Ceres. Los componentes adicionales requieren fabricación.`;
    if (lang === 'ja') return `ケレスのボス「Lt. Lech Kril & Captain Vor」（Exta）を倒すと、${displayItemName}の設計図がドロップします。その他のパーツは製作が必要です。`;
    return itemName 
      ? `The blueprint for ${itemName} drops upon defeating Lt. Lech Kril & Captain Vor on Exta, Ceres. Additional components require crafting.`
      : `The blueprint for this weapon drops upon defeating Lt. Lech Kril & Captain Vor on Exta, Ceres. Additional components require crafting.`;
  }
  if (dropText === "Zariman Cavalero Option") {
    if (lang === 'pt') return `O diagrama de ${displayItemName} é vendido pelo Cavalero na nave Zariman Ten Zero por Reputação dos Retidos (Holdfasts). Requer materiais da Zariman.`;
    if (lang === 'es') return `Planos de ${displayItemName} vendidos por Cavalero en la nave Zariman Ten Zero por Reputación de Los Retenidos. Requiere materiales de la Zariman.`;
    if (lang === 'ja') return `Zariman Ten Zero船内のCavaleroから、Holdfastsの地位ポイントで${displayItemName}の設計図を購入できます（Zarimanの素材が必要）。`;
    return `Blueprints sold by Cavalero on the Zariman Ten Zero ship for Holdfasts Standing. Requires Zariman materials.`;
  }
  if (dropText === "Duviri Acrithis Option") {
    if (lang === 'pt') return `${itemName ? `A arma ${itemName}` : 'Esta arma'} pode ser comprada com a comerciante Acrithis em Duviri usando Garras de Pathos (Pathos Clamps), obtidas ao derrotar o Orowyrm.`;
    if (lang === 'es') return `El arma se puede comprar a la comerciante Acrithis en Duviri usando Abrazaderas de Pathos (Pathos Clamps), obtenidas al derrotar al Orowyrm.`;
    if (lang === 'ja') return `デュヴィリの商人Acrithisから、Orowyrm討伐で手に入るPathos Clampを使用して購入できます。`;
    return `Purchased from the merchant Acrithis in Duviri using Pathos Clamps, which are obtained by defeating the Orowyrm.`;
  }
  if (dropText === "Deimos Father Option") {
    if (lang === 'pt') return `O diagrama de ${displayItemName} é vendido pelo Pai (Father) no Necralisk em Deimos por Reputação da Família Entrati. Requer recursos locais.`;
    if (lang === 'es') return `Planos de ${displayItemName} vendidos por Padre en el Necralisk de Deimos por Reputación Entrati. Requiere recursos locales de Deimos.`;
    if (lang === 'ja') return `DeimosのNecraliskにいるFatherから、Entratiの地位ポイントで${displayItemName}の設計図を購入できます（Deimosの資源が必要）。`;
    return `Blueprints sold by Father in the Necralisk on Deimos for Entrati Standing. Requires local Deimos resources.`;
  }
  if (dropText === "Granum Void Option") {
    if (lang === 'pt') return `Componentes e diagramas de ${displayItemName} dropam como recompensa de rotação nas missões do Void de Granum (acessado através dos consoles de Mão Dourada em naves Corpus).`;
    if (lang === 'es') return `Los componentes y planos de ${displayItemName} caen como recompensa de rotación en el Vacío de Granum (se accede a través de las consolas de la Mano Dorada en naves Corpus).`;
    if (lang === 'ja') return `${displayItemName}のパーツや設計図は、Granum Void（コーパスシップミッションの黄金の手コンソールから進入）のローテーション報酬としてドロップします。`;
    return `Components and blueprints for ${displayItemName} drop as rotation rewards in the Granum Void (accessed via Golden Hand consoles on Corpus Ship missions).`;
  }
  if (dropText === "Grustrag Three Option") {
    if (lang === 'pt') return `Pode dropar as partes e diagrama de ${displayItemName} ao ser invadido pelos Três Grustrag (aparecem se você estiver marcado por apoiar Corpus contra Grineer).`;
    if (lang === 'es') return `Las partes y el plano de ${displayItemName} pueden caer al ser invadido por los Tres Grustrag.`;
    if (lang === 'ja') return `${displayItemName}のパーツや設計図は、侵略ミッションのマーク出現で出現するGrustrag Threeからドロップします。`;
    return `Parts and blueprint for ${displayItemName} can drop when invaded by the Grustrag Three (they spawn in regular missions if you are marked for supporting Corpus against Grineer).`;
  }
  if (dropText === "Zanuka Hunter Option") {
    if (lang === 'pt') return `Pode dropar partes e diagrama de ${displayItemName} ao ser invadido pelo Caçador Zanuka (aparece se você estiver marcado por apoiar Grineer contra Corpus).`;
    if (lang === 'es') return `Las partes y el plano de ${displayItemName} pueden caer al ser invadido por el Cazador Zanuka.`;
    if (lang === 'ja') return `${displayItemName}のパーツや設計図は、侵略ミッションのマーク出現で出現するZanuka Hunterからドロップします。`;
    return `Parts and blueprint for ${displayItemName} can drop when invaded by the Zanuka Hunter (spawns in regular missions if you are marked for supporting Grineer against Corpus).`;
  }
  if (dropText === "Nightwave Option") {
    if (lang === 'pt') return `O diagrama de ${displayItemName} é comprado na loja de Credores da Nightwave por Crédito da temporada atual. A seleção de armas rotaciona semanalmente.`;
    if (lang === 'es') return `El plano de ${displayItemName} se compra en la tienda de Ofrendas de Respeto de Nightwave usando créditos de temporada. La selección rota semanalmente.`;
    if (lang === 'ja') return `${displayItemName}の設計図はNightwaveのクレド提供物ストアからシーズンクレジットで購入できます（週替わりローテーション）。`;
    return `Blueprint for ${displayItemName} purchased from the Nightwave Cred Offerings store using season credits. Weapon inventory rotates weekly.`;
  }
  if (dropText === "Dojo Chem Lab Option") {
    if (lang === 'pt') return `O diagrama de ${displayItemName} pode ser pesquisado e replicado no Laboratório Químico (Chem Lab) no Dojo do seu Clã por Créditos.`;
    if (lang === 'es') return `El plano de ${displayItemName} se puede investigar y replicar en el Laboratorio Químico (Chem Lab) en el Dojo de tu Clan por Créditos.`;
    if (lang === 'ja') return `${displayItemName}の設計図は所属クランのドージョー内「化学ラボ（Chem Lab）」で研究・複製できます（クレジットが必要）。`;
    return itemName
      ? `The blueprint for ${itemName} can be researched and replicated from the Chemical Lab (Chem Lab) in your Clan Dojo for Credits.`
      : `The blueprint for this weapon can be researched and replicated from the Chemical Lab (Chem Lab) in your Clan Dojo for Credits.`;
  }
  if (dropText === "Dojo Bio Lab Option") {
    if (lang === 'pt') return `O diagrama de ${displayItemName} pode ser pesquisado e replicado no Laboratório de Biologia (Bio Lab) no Dojo do seu Clã por Créditos.`;
    if (lang === 'es') return `El plano de ${displayItemName} se puede investigar y replicar en el Laboratorio de Biología (Bio Lab) en el Dojo de tu Clan por Créditos.`;
    if (lang === 'ja') return `${displayItemName}の設計図は所属クランのドージョー内「バイオラボ（Bio Lab）」で研究・複製できます（クレジットが必要）。`;
    return itemName
      ? `The blueprint for ${itemName} can be researched and replicated from the Biology Lab (Bio Lab) in your Clan Dojo for Credits.`
      : `The blueprint for this weapon can be researched and replicated from the Biology Lab (Bio Lab) in your Clan Dojo for Credits.`;
  }
  if (dropText === "Dojo Energy Lab Option") {
    if (lang === 'pt') return `O diagrama de ${displayItemName} pode ser pesquisado e replicado no Laboratório de Energia (Energy Lab) no Dojo do seu Clã por Créditos.`;
    if (lang === 'es') return `El plano de ${displayItemName} se puede investigar y replicar en el Laboratorio de Energía en el Dojo de tu Clan por Créditos.`;
    if (lang === 'ja') return `${displayItemName}の設計図は所属クランのドージョー内「エネルギーラボ」で研究・複製できます（クレジットが必要）。`;
    return itemName
      ? `The blueprint for ${itemName} can be researched and replicated from the Energy Lab in your Clan Dojo for Credits.`
      : `The blueprint for this weapon can be researched and replicated from the Energy Lab in your Clan Dojo for Credits.`;
  }
  if (dropText === "Dojo Tenno Lab Option") {
    if (lang === 'pt') return `O diagrama de ${displayItemName} pode ser pesquisado e replicado no Laboratório Tenno (Tenno Lab) no Dojo do seu Clã por Créditos.`;
    if (lang === 'es') return `El plano de ${displayItemName} se puede investigar y replicar en el Laboratorio Tenno en el Dojo de tu Clan por Créditos.`;
    if (lang === 'ja') return `${displayItemName}の設計図は所属クランのドージョー内「Tennoラボ」で研究・複製できます（クレジットが必要）。`;
    return itemName
      ? `The ${itemName}'s blueprint can be researched and replicated from the Tenno Lab in your Clan Dojo for Credits.`
      : `The blueprint for this weapon can be researched and replicated from the Tenno Lab in your Clan Dojo for Credits.`;
  }
  if (dropText === "Dojo Bash Lab Option") {
    if (lang === 'es') return "Plano replicado en el Laboratorio de Ventilación (Bash Lab) del Dojo de tu Clan por Créditos (usado para Yareli e Kompressa).";
    if (lang === 'ja') return "所属クランのドージョー内「Bashラボ（ベントキッド・ラボ）」で複製（クレジット）。YareliやKompressaが対象です。";
    return "Blueprint replicated from the Bash Lab (Ventkids Lab) in your Clan Dojo for Credits (used for Yareli and Kompressa).";
  }
  if (dropText === "Dojo Dagath Hollow Option") {
    if (lang === 'pt') return "Diagrama e componentes replicados no Sepulcro da Dagath (Dagath's Hollow) no Dojo do seu Clã por Créditos (usado para Dagath e Dorrclave).";
    if (lang === 'es') return "Plano y componentes replicados en la Cripta de Dagath (Dagath's Hollow) del Dojo de tu Clan por Créditos (usado para Dagath y Dorrclave).";
    if (lang === 'ja') return "所属クランのドージョー内「Dagathの空洞」で設計図とパーツを複製（クレジット）。DagathやDorrclaveが対象です。";
    return "Blueprint and components replicated from Dagath's Hollow room in your Clan Dojo for Credits (used for Dagath and Dorrclave).";
  }
  if (dropText === "Market Credits Option") {
    if (lang === 'pt') return "Esta arma pode ser comprada diretamente pronta para uso na loja do Mercado do jogo usando apenas Créditos (não requer fabricação).";
    if (lang === 'es') return "Esta arma se puede comprar directamente completamente construida en la tienda del Mercado del juego usando Créditos (no requiere fabricación).";
    if (lang === 'ja') return "ゲーム内マーケットからクレジットで直接完成品を購入できます（製作不要）。";
    return "This weapon can be purchased directly fully-built from the in-game Market store using Credits (no crafting required).";
  }
  if (dropText === "Market Blueprint Option") {
    if (lang === 'pt') return "Diagrama comprado diretamente na loja do Mercado do jogo por Créditos. A fabricação deve ser feita na Forja do seu Orbitador.";
    if (lang === 'es') return "Plano comprado directamente en la tienda del Mercado del juego por Créditos. La fabricación se debe hacer en la Fundición de tu Orbitador.";
    if (lang === 'ja') return "ゲーム内マーケットから設計図をクレジットで購入。オービターのファウンドリで製作する必要があります。";
    return "Blueprint purchased directly from the in-game Market store using Credits. Crafting must be done in your Orbiter Foundry.";
  }

  return dropText;
};


// --- HELPER FUNCTIONS FOR MODS AND WORLD CYCLES ---
const stripXml = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '');
};

const renderFormattedDescription = (text) => {
  if (!text) return '';
  
  // Safe normalization of text argument in case it is an array or object
  let rawText = '';
  if (Array.isArray(text)) {
    rawText = text.join('\n');
  } else if (typeof text === 'string') {
    rawText = text;
  } else {
    rawText = String(text);
  }

  // Normalize layout strings and backslash-n to real newlines or br
  rawText = rawText
    .replace(/\\n/g, '<br />')
    .replace(/\n/g, '<br />')
    .replace(/\|n/g, '<br />')
    .replace(/\|r/g, '');

  // Strip unwanted XML tags (e.g. <LOWER_IS_BETTER>, etc.) but keep DT and br tags
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
    'RADIANT': { icon: '☢️', color: '#ff35d8' },
    'BLAST': { icon: '💥', color: '#ff5e35' },
    'EXPLOSION': { icon: '💥', color: '#ff5e35' },
    'GAS': { icon: '💨', color: '#b5ff9b' },
    'IMPACT': { icon: '🔨', color: '#8e8e8e' },
    'PUNCTURE': { icon: '🎯', color: '#cccccc' },
    'VOID': { icon: '🌌', color: '#00ffff' }
  };

  // Escape HTML characters except <br> and DT tags
  let formatted = rawText
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

  return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
};

const getPolarityName = (polarity, lang) => {
  if (!polarity) return '';
  const pol = polarity.toLowerCase();
  
  const ptNames = {
    madurai: 'Madurai',
    naramon: 'Naramon',
    vazarin: 'Vazarin',
    zenurik: 'Zenurik',
    unairu: 'Unairu',
    penjaga: 'Penjaga',
    umbra: 'Umbra',
    galvanized: 'Galvanizado',
    universal: 'Universal'
  };

  const enNames = {
    madurai: 'Madurai',
    naramon: 'Naramon',
    vazarin: 'Vazarin',
    zenurik: 'Zenurik',
    unairu: 'Unairu',
    penjaga: 'Penjaga',
    umbra: 'Umbra',
    galvanized: 'Galvanized',
    universal: 'Universal'
  };

  const esNames = {
    madurai: 'Madurai',
    naramon: 'Naramon',
    vazarin: 'Vazarin',
    zenurik: 'Zenurik',
    unairu: 'Unairu',
    penjaga: 'Penjaga',
    umbra: 'Umbra',
    galvanized: 'Galvanizado',
    universal: 'Universal'
  };

  const jaNames = {
    madurai: 'マドゥライ (Madurai)',
    naramon: 'ナラモン (Naramon)',
    vazarin: 'ヴァザリン (Vazarin)',
    zenurik: 'ゼヌリック (Zenurik)',
    unairu: 'ウナイリ (Unairu)',
    penjaga: 'ペンジャガ (Penjaga)',
    umbra: 'ウインブラ (Umbra)',
    galvanized: '亜鉛メッキ (Galvanized)',
    universal: 'ユニバーサル (Universal)'
  };

  if (lang === 'pt') return ptNames[pol] || polarity;
  if (lang === 'es') return esNames[pol] || polarity;
  if (lang === 'ja') return jaNames[pol] || polarity;
  return enNames[pol] || polarity;
};

const renderPolarityIcon = (polarity, size = 16) => {
  if (!polarity) return null;
  const pol = polarity.toLowerCase().trim();
  
  const polarityFiles = {
    madurai: 'Madurai_Pol.svg',
    naramon: 'Naramon_Pol.svg',
    vazarin: 'Vazarin_Pol.svg',
    zenurik: 'Zenurik_Pol.svg',
    unairu: 'Unairu_Pol.svg',
    penjaga: 'Penjaga_Pol.svg',
    umbra: 'Umbra_Pol.svg',
    galvanized: 'Koneksi_Pol.svg',
    universal: 'Any_Pol.svg'
  };

  const fileName = polarityFiles[pol];
  if (fileName) {
    return (
      <img 
        src={`https://warframe.fandom.com/wiki/Special:FilePath/${fileName}`} 
        alt={polarity}
        className="polarity-wiki-icon"
        style={{ width: `${size}px`, height: `${size}px`, display: 'inline-block', verticalAlign: 'middle' }}
        loading="lazy"
      />
    );
  }
  return <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }} className="polarity-text-fallback">{polarity.toUpperCase()}</span>;
};

const renderFusionStars = (limit) => {
  const maxStars = Math.min(10, limit || 0);
  if (maxStars <= 0) return null;
  return (
    <div className="mod-stars-row">
      {[...Array(maxStars)].map((_, idx) => (
        <svg key={idx} width="8" height="8" viewBox="0 0 24 24" fill="currentColor" className="mod-star-svg" style={{ color: 'var(--gold)' }}>
          <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
        </svg>
      ))}
    </div>
  );
};

const normalizeMod = (m) => {
  if (!m) return null;
  let description = '';
  if (Array.isArray(m.description)) {
    description = m.description.join('\n');
  } else if (typeof m.description === 'string') {
    description = m.description;
  }
  
  if (!description && Array.isArray(m.levelStats) && m.levelStats.length > 0) {
    const maxStatsObj = m.levelStats[m.levelStats.length - 1];
    if (maxStatsObj && Array.isArray(maxStatsObj.stats) && maxStatsObj.stats.length > 0) {
      description = maxStatsObj.stats.join(', ');
    }
  }
  return {
    ...m,
    description
  };
};

const starChartPlanets = [
  { id: 'earth', namePt: 'Terra', nameEn: 'Earth', maxNodes: 12 },
  { id: 'venus', namePt: 'Vênus', nameEn: 'Venus', maxNodes: 16 },
  { id: 'mercury', namePt: 'Mercúrio', nameEn: 'Mercury', maxNodes: 10 },
  { id: 'mars', namePt: 'Marte', nameEn: 'Mars', maxNodes: 17 },
  { id: 'phobos', namePt: 'Phobos', nameEn: 'Phobos', maxNodes: 5 },
  { id: 'ceres', namePt: 'Ceres', nameEn: 'Ceres', maxNodes: 13 },
  { id: 'jupiter', namePt: 'Júpiter', nameEn: 'Jupiter', maxNodes: 16 },
  { id: 'europa', namePt: 'Europa', nameEn: 'Europa', maxNodes: 12 },
  { id: 'saturn', namePt: 'Saturno', nameEn: 'Saturn', maxNodes: 13 },
  { id: 'uranus', namePt: 'Urano', nameEn: 'Uranus', maxNodes: 14 },
  { id: 'neptune', namePt: 'Netuno', nameEn: 'Neptune', maxNodes: 17 },
  { id: 'pluto', namePt: 'Plutão', nameEn: 'Pluto', maxNodes: 11 },
  { id: 'eris', namePt: 'Eris', nameEn: 'Eris', maxNodes: 17 },
  { id: 'sedna', namePt: 'Sedna', nameEn: 'Sedna', maxNodes: 19 },
  { id: 'void', namePt: 'Void', nameEn: 'Void', maxNodes: 12 },
  { id: 'deimos', namePt: 'Deimos', nameEn: 'Deimos', maxNodes: 21 },
  { id: 'lua', namePt: 'Lua', nameEn: 'Lua', maxNodes: 7 },
  { id: 'zariman', namePt: 'Zariman', nameEn: 'Zariman', maxNodes: 5 },
  { id: 'sanctum', namePt: 'Sanctum Anatomica', nameEn: 'Sanctum Anatomica', maxNodes: 5 }
];

const starChartJunctionsList = [
  { id: 'venus_junc', namePt: 'Junção de Vênus (Terra)', nameEn: 'Venus Junction (Earth)', planetId: 'earth' },
  { id: 'mars_junc', namePt: 'Junção de Marte (Terra)', nameEn: 'Mars Junction (Earth)', planetId: 'earth' },
  { id: 'mercury_junc', namePt: 'Junção de Mercúrio (Vênus)', nameEn: 'Mercury Junction (Venus)', planetId: 'venus' },
  { id: 'phobos_junc', namePt: 'Junção de Phobos (Marte)', nameEn: 'Phobos Junction (Mars)', planetId: 'mars' },
  { id: 'ceres_junc', namePt: 'Junção de Ceres (Marte)', nameEn: 'Ceres Junction (Mars)', planetId: 'mars' },
  { id: 'jupiter_junc', namePt: 'Junção de Júpiter (Ceres)', nameEn: 'Jupiter Junction (Ceres)', planetId: 'ceres' },
  { id: 'europa_junc', namePt: 'Junção de Europa (Júpiter)', nameEn: 'Europa Junction (Jupiter)', planetId: 'jupiter' },
  { id: 'saturn_junc', namePt: 'Junção de Saturno (Júpiter)', nameEn: 'Saturn Junction (Jupiter)', planetId: 'jupiter' },
  { id: 'uranus_junc', namePt: 'Junção de Urano (Saturno)', nameEn: 'Uranus Junction (Saturn)', planetId: 'saturn' },
  { id: 'neptune_junc', namePt: 'Junção de Netuno (Urano)', nameEn: 'Neptune Junction (Uranus)', planetId: 'uranus' },
  { id: 'pluto_junc', namePt: 'Junção de Plutão (Netuno)', nameEn: 'Pluto Junction (Neptune)', planetId: 'neptune' },
  { id: 'eris_junc', namePt: 'Junção de Eris (Plutão)', nameEn: 'Eris Junction (Pluto)', planetId: 'pluto' },
  { id: 'sedna_junc', namePt: 'Junção de Sedna (Plutão)', nameEn: 'Sedna Junction (Pluto)', planetId: 'pluto' }
];

const planetCoordinates = {
  sedna: { x: 50, y: 10, color: 'linear-gradient(135deg, #cc6666 0%, #5e2626 100%)' },
  deimos: { x: 52, y: 30, color: 'linear-gradient(135deg, #bf4343 0%, #420f0f 100%)' },
  mars: { x: 60, y: 34, color: 'linear-gradient(135deg, #e35a3b 0%, #8c2a14 100%)' },
  phobos: { x: 64, y: 22, color: 'linear-gradient(135deg, #876756 0%, #423027 100%)' },
  eris: { x: 74, y: 28, color: 'linear-gradient(135deg, #517a58 0%, #203d25 100%)' },
  pluto: { x: 84, y: 48, color: 'linear-gradient(135deg, #c7a48f 0%, #5c4436 100%)' },
  earth: { x: 63, y: 49, color: 'linear-gradient(135deg, #4287f5 0%, #1b4d3e 100%)' },
  lua: { x: 66, y: 53, color: 'linear-gradient(135deg, #a1a8b8 0%, #4f535c 100%)' },
  venus: { x: 54, y: 66, color: 'linear-gradient(135deg, #f5a442 0%, #8c561b 100%)' },
  neptune: { x: 72, y: 76, color: 'linear-gradient(135deg, #3252a8 0%, #14285c 100%)' },
  uranus: { x: 50, y: 86, color: 'linear-gradient(135deg, #8ae2eb 0%, #3c7d85 100%)' },
  saturn: { x: 36, y: 74, color: 'linear-gradient(135deg, #e6c58e 0%, #7d653f 100%)' },
  mercury: { x: 44, y: 58, color: 'linear-gradient(135deg, #999999 0%, #444444 100%)' },
  jupiter: { x: 30, y: 48, color: 'linear-gradient(135deg, #d99a6c 0%, #6e4428 100%)' },
  europa: { x: 22, y: 49, color: 'linear-gradient(135deg, #a6d8f0 0%, #3d6e87 100%)' },
  void: { x: 12, y: 46, color: 'linear-gradient(135deg, #fceda2 0%, #a38d28 100%)' },
  ceres: { x: 40, y: 26, color: 'linear-gradient(135deg, #b0a39d 0%, #544c48 100%)' },
  zariman: { x: 88, y: 26, color: 'linear-gradient(135deg, #bfb48f 0%, #544e38 100%)' },
  sanctum: { x: 48, y: 33, color: 'linear-gradient(135deg, #9966cc 0%, #442266 100%)' }
};

const planetConnections = [
  ['earth', 'venus'],
  ['earth', 'mars'],
  ['earth', 'lua'],
  ['venus', 'mercury'],
  ['mars', 'phobos'],
  ['mars', 'ceres'],
  ['ceres', 'jupiter'],
  ['jupiter', 'europa'],
  ['jupiter', 'saturn'],
  ['saturn', 'uranus'],
  ['uranus', 'neptune'],
  ['neptune', 'pluto'],
  ['neptune', 'void'],
  ['pluto', 'eris'],
  ['pluto', 'sedna'],
  ['ceres', 'deimos'],
  ['eris', 'zariman'],
  ['mars', 'sanctum']
];

const railjackProximas = [
  { id: 'earth_proxima', namePt: 'Próxima da Terra', nameEn: 'Earth Proxima', maxNodes: 6 },
  { id: 'venus_proxima', namePt: 'Próxima de Vênus', nameEn: 'Venus Proxima', maxNodes: 5 },
  { id: 'saturn_proxima', namePt: 'Próxima de Saturno', nameEn: 'Saturn Proxima', maxNodes: 6 },
  { id: 'neptune_proxima', namePt: 'Próxima de Netuno', nameEn: 'Neptune Proxima', maxNodes: 5 },
  { id: 'pluto_proxima', namePt: 'Próxima de Plutão', nameEn: 'Pluto Proxima', maxNodes: 6 },
  { id: 'veil_proxima', namePt: 'Próxima do Véu', nameEn: 'Veil Proxima', maxNodes: 6 }
];

const railjackCoordinates = {
  earth_proxima: { x: 50, y: 55, color: 'linear-gradient(135deg, #1b4d3e 0%, #0d261e 100%)' },
  venus_proxima: { x: 42, y: 40, color: 'linear-gradient(135deg, #8c561b 0%, #462b0d 100%)' },
  saturn_proxima: { x: 30, y: 65, color: 'linear-gradient(135deg, #7d653f 0%, #3e321f 100%)' },
  neptune_proxima: { x: 58, y: 75, color: 'linear-gradient(135deg, #14285c 0%, #0a142e 100%)' },
  pluto_proxima: { x: 70, y: 45, color: 'linear-gradient(135deg, #5c4436 0%, #2e221b 100%)' },
  veil_proxima: { x: 80, y: 25, color: 'linear-gradient(135deg, #4b145c 0%, #260a2e 100%)' }
};

const railjackConnections = [
  ['earth_proxima', 'venus_proxima'],
  ['venus_proxima', 'saturn_proxima'],
  ['saturn_proxima', 'neptune_proxima'],
  ['neptune_proxima', 'pluto_proxima'],
  ['pluto_proxima', 'veil_proxima']
];

const getInferredThumbnail = (wikiaUrl, name) => {
  if (wikiaUrl) {
    try {
      const parts = wikiaUrl.split('/wiki/');
      if (parts.length > 1) {
        let pageName = decodeURIComponent(parts[1]);
        pageName = pageName.replace(/[\s_\-\(\)'"!]/g, '');
        if (pageName) {
          pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
          return `https://wiki.warframe.com/images/${pageName}Mod.png`;
        }
      }
    } catch (e) {
      // ignore
    }
  }
  if (name) {
    const cleanName = name.replace(/[\s_\-\(\)'"!]/g, '');
    if (cleanName) {
      const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      return `https://wiki.warframe.com/images/${formattedName}Mod.png`;
    }
  }
  return null;
};

const translateDropLocation = (loc, lang) => {
  if (!loc || typeof loc !== 'string') return loc;
  if (lang === 'en') return loc;

  let translated = loc;

  const dictPt = [
    [/Rotation ([A-C])/gi, 'Rotação $1'],
    [/Tier ([0-9])/gi, 'Nível $1'],
    [/Defense/gi, 'Defesa'],
    [/Survival/gi, 'Sobrevivência'],
    [/Spy/gi, 'Espionagem'],
    [/Interception/gi, 'Interceptação'],
    [/Excavation/gi, 'Escavação'],
    [/Sabotage/gi, 'Sabotagem'],
    [/Defection/gi, 'Deserção'],
    [/Assassination/gi, 'Assassinato'],
    [/Rescue/gi, 'Resgate'],
    [/Disruption/gi, 'Rompimento'],
    [/Orphix/gi, 'Órfix'],
    [/Bounties/gi, 'Contratos'],
    [/Bounty/gi, 'Contrato'],
    [/Endless/gi, 'Infinito'],
    [/Steel Meridian/gi, 'Meridiano de Aço'],
    [/Red Veil/gi, 'Véu Vermelho'],
    [/The Perrin Sequence/gi, 'A Sequência Perrin'],
    [/New Loka/gi, 'Nova Loka'],
    [/Arbiters of Hexis/gi, 'Árbitros de Hexis'],
    [/Cephalon Suda/gi, 'Cefalão Suda'],
    [/General/gi, 'Geral'],
    [/Exalted/gi, 'Exaltado'],
    [/Partner/gi, 'Parceiro'],
    [/Flawless/gi, 'Impecável'],
    [/Maxim/gi, 'Máximo'],
    [/Genius/gi, 'Gênio'],
    [/Mistral/gi, 'Mistral'],
    [/Rewards/gi, 'Recompensas'],
    [/Reward/gi, 'Recompensa'],
    [/Earth/gi, 'Terra'],
    [/Mercury/gi, 'Mercúrio'],
    [/Venus/gi, 'Vênus'],
    [/Mars/gi, 'Marte'],
    [/Jupiter/gi, 'Júpiter'],
    [/Saturn/gi, 'Saturno'],
    [/Uranus/gi, 'Urano'],
    [/Neptune/gi, 'Netuno'],
    [/Pluto/gi, 'Plutão'],
    [/Void/gi, 'Void'],
    [/Duviri/gi, 'Duviri'],
    [/Corrupted/gi, 'Corrompido'],
    [/Heavy Gunner/gi, 'Artilheira Pesada'],
    [/Lancer/gi, 'Lanceiro'],
    [/Butcher/gi, 'Açougueiro'],
    [/Elite/gi, 'Elite'],
    [/Trooper/gi, 'Soldado'],
    [/Shield Osprey/gi, 'Osprey de Escudo'],
    [/Attack Drone/gi, 'Drone de Ataque'],
    [/Oxium Osprey/gi, 'Osprey de Oxium'],
    [/Moa/gi, 'Moa'],
    [/Crewman/gi, 'Tripulante'],
    [/Sniper/gi, 'Atirador'],
    [/Ranger/gi, 'Patrulheiro'],
    [/Shockwave/gi, 'Onda de Choque'],
    [/Railgun/gi, 'Arma de Trilho'],
    [/Laser/gi, 'Laser']
  ];

  const dictEs = [
    [/Rotation ([A-C])/gi, 'Rotación $1'],
    [/Tier ([0-9])/gi, 'Nivel $1'],
    [/Defense/gi, 'Defensa'],
    [/Survival/gi, 'Supervivencia'],
    [/Spy/gi, 'Espionaje'],
    [/Interception/gi, 'Interceptación'],
    [/Excavation/gi, 'Excavación'],
    [/Sabotage/gi, 'Sabotaje'],
    [/Defection/gi, 'Deserción'],
    [/Assassination/gi, 'Asesinato'],
    [/Rescue/gi, 'Rescate'],
    [/Disruption/gi, 'Interrupción'],
    [/Orphix/gi, 'Órfix'],
    [/Bounties/gi, 'Contratos'],
    [/Bounty/gi, 'Contrato'],
    [/Endless/gi, 'Infinito'],
    [/Steel Meridian/gi, 'Meridiano de Acero'],
    [/Red Veil/gi, 'Velo Rojo'],
    [/The Perrin Sequence/gi, 'La Secuencia Perrin'],
    [/New Loka/gi, 'Nueva Loka'],
    [/Arbiters of Hexis/gi, 'Árbitros de Hexis'],
    [/Cephalon Suda/gi, 'Cefalón Suda'],
    [/General/gi, 'General'],
    [/Exalted/gi, 'Exaltado'],
    [/Partner/gi, 'Socio'],
    [/Flawless/gi, 'Impecable'],
    [/Maxim/gi, 'Máximo'],
    [/Genius/gi, 'Genio'],
    [/Mistral/gi, 'Mistral'],
    [/Rewards/gi, 'Recompensas'],
    [/Reward/gi, 'Recompensa'],
    [/Earth/gi, 'Tierra'],
    [/Mercury/gi, 'Mercurio'],
    [/Venus/gi, 'Venus'],
    [/Mars/gi, 'Marte'],
    [/Jupiter/gi, 'Júpiter'],
    [/Saturn/gi, 'Saturno'],
    [/Uranus/gi, 'Urano'],
    [/Neptune/gi, 'Neptuno'],
    [/Pluto/gi, 'Plutón'],
    [/Void/gi, 'Vacío'],
    [/Duviri/gi, 'Duviri'],
    [/Corrupted/gi, 'Corrupto'],
    [/Heavy Gunner/gi, 'Artillera Pesada'],
    [/Lancer/gi, 'Lancero'],
    [/Butcher/gi, 'Carnicero'],
    [/Elite/gi, 'Elite'],
    [/Trooper/gi, 'Soldado de Asalto'],
    [/Shield Osprey/gi, 'Osprey de Escudo'],
    [/Attack Drone/gi, 'Dron de Ataque'],
    [/Oxium Osprey/gi, 'Osprey de Oxium'],
    [/Moa/gi, 'Moa'],
    [/Crewman/gi, 'Tripulante'],
    [/Sniper/gi, 'Francotirador']
  ];

  const dictJa = [
    [/Rotation ([A-C])/gi, 'ローテーション$1'],
    [/Tier ([0-9])/gi, 'ティア$1'],
    [/Defense/gi, '防衛'],
    [/Survival/gi, '耐久'],
    [/Spy/gi, '潜入'],
    [/Interception/gi, '傍受'],
    [/Excavation/gi, '掘削'],
    [/Sabotage/gi, '土工作戦'],
    [/Defection/gi, '脱出'],
    [/Assassination/gi, '暗殺'],
    [/Rescue/gi, '救出'],
    [/Disruption/gi, '分裂'],
    [/Bounties/gi, '依頼'],
    [/Bounty/gi, '依頼'],
    [/Endless/gi, 'エンドレス'],
    [/Steel Meridian/gi, 'スティール・メリディアン'],
    [/Red Veil/gi, 'レッド・ベール'],
    [/The Perrin Sequence/gi, 'ペリン・シークエンス'],
    [/New Loka/gi, 'ニュー・ロカ'],
    [/Arbiters of Hexis/gi, 'アビターズ・オブ・ヘクシス'],
    [/Cephalon Suda/gi, 'セファロン・スーダ'],
    [/Earth/gi, '地球'],
    [/Mercury/gi, '水星'],
    [/Venus/gi, '金星'],
    [/Mars/gi, '火星'],
    [/Jupiter/gi, '木星'],
    [/Saturn/gi, '土星'],
    [/Uranus/gi, '天王星'],
    [/Neptune/gi, '海王星'],
    [/Pluto/gi, '冥王星'],
    [/Void/gi, 'Void'],
    [/Corrupted/gi, 'コラプト'],
    [/Heavy Gunner/gi, 'ヘビーガンナー'],
    [/Lancer/gi, 'ランサー'],
    [/Butcher/gi, 'ブッチャー']
  ];

  const dict = lang === 'pt' ? dictPt : lang === 'es' ? dictEs : lang === 'ja' ? dictJa : [];

  for (const [regex, replacement] of dict) {
    translated = translated.replace(regex, replacement);
  }

  return translated;
};

const getModSourceText = (mod, lang) => {
  if (!mod) return '';
  const name = (mod.name || '').toLowerCase();
  const uniq = (mod.uniqueName || '').toLowerCase();

  const sourcesPt = {
    dailyLogin: "Login Diário (Dia 200, 400, 600, 900)",
    baro: "Baro Ki'Teer (Mercador do Void)",
    arbitration: "Arbitragem (Ofertas de Essência Vitus)",
    kahl: "Guarnição do Kahl (Chipper)",
    orokinVault: "Cofres Orokin (Deriva de Deimos - Requer Chaves de Dragão)",
    thermia: "Fendas de Termia (Orb Vallis) / Ropalolyst",
    nightmare: "Missões do Modo Pesadelo",
    syndicate: "Ofertas de Sindicatos",
    sacrifice: "Jornada 'O Sacrifício'",
    requiem: "Relíquias Requiem (Caça ao Kuva Lich)",
    conclave: "Conclave (Ofertas do Teshin)",
    general: "Drop de missão, Fendas do Void ou consulte o Codex do jogo"
  };

  const sourcesEn = {
    dailyLogin: "Daily Login (Day 200, 400, 600, 900)",
    baro: "Baro Ki'Teer (Void Trader)",
    arbitration: "Arbitration (Vitus Essence Offerings)",
    kahl: "Kahl's Garrison (Chipper)",
    orokinVault: "Orokin Vaults (Deimos - Dragon Key Required)",
    thermia: "Thermia Fractures (Orb Vallis) or Ropalolyst",
    nightmare: "Nightmare Mode Missions",
    syndicate: "Syndicate Offerings",
    sacrifice: "\"The Sacrifice\" Quest",
    requiem: "Requiem Relics (Kuva Lich / Sister of Parvos Hunt)",
    conclave: "Conclave (Teshin Offerings)",
    general: "In-game drops, Void Fissures, or Codex check"
  };

  const sourcesEs = {
    dailyLogin: "Inicio de sesión diario (Día 200, 400, 600, 900)",
    baro: "Baro Ki'Teer (Comerciante del Vacío)",
    arbitration: "Arbitraje (Ofrendas de Esencia Vitus)",
    kahl: "Guarnición de Kahl (Chipper)",
    orokinVault: "Bóvedas Orokin (Deimos - Requiere Llave de Dragón)",
    thermia: "Fracturas de Thermia (Valles del Orbe) o Ropalolyst",
    nightmare: "Misiones de Modo Pesadilla",
    syndicate: "Ofrendas de Sindicatos",
    sacrifice: "Aventura \"El Sacrificio\"",
    requiem: "Reliquias Requiem (Cacería de Liche de Kuva)",
    conclave: "Cónclave (Ofrendas de Teshin)",
    general: "Drops en misiones, Fisuras del Vacío o Códice"
  };

  const sourcesJa = {
    dailyLogin: "デイリーログイン報酬 (200, 400, 600, 900日目)",
    baro: "Baro Ki'Teer (Voidの商人)",
    arbitration: "仲裁ミッション (ビタス・エッセンス交換)",
    kahl: "Kahlの駐屯地 (Chipper)",
    orokinVault: "オロキン保管庫 (ダイモス - ドラゴンキーが必要)",
    thermia: "サーミアの裂け目 (オーブの渓谷) または ロパロリスト",
    nightmare: "ナイトメアミッション報酬",
    syndicate: "シンジケート提供物",
    sacrifice: "クエスト「サクリファイス」",
    requiem: "レクイエム・レリック (クバ・リッチ候補者)",
    conclave: "コンクラーベ (Teshin提供物)",
    general: "ミッションドロップ、Void亀裂、またはコーデックスを確認"
  };

  const s = lang === 'pt' ? sourcesPt : lang === 'es' ? sourcesEs : lang === 'ja' ? sourcesJa : sourcesEn;

  if (name.includes('primed') || name.includes('prime')) {
    const loginMods = ['primed fury', 'primed shred', 'primed vigor', 'primed sure footed', 'fúria primed', 'retalhar primed', 'vigor primed', 'pés firmes primed'];
    if (loginMods.some(lm => name.includes(lm))) {
      return s.dailyLogin;
    }
    return s.baro;
  }

  if (name.includes('galvanized') || name.includes('galvanizado') || name.includes('galvanizada') || name.includes('galvanizados')) {
    return s.arbitration;
  }

  if (name.includes('archon') || name.includes('arconte')) {
    return s.kahl;
  }

  if (uniq.includes('/corrupted/') || name.includes('corrupted') || name.includes('corrompido') || name.includes('corrompida')) {
    return s.orokinVault;
  }

  if (uniq.includes('/amalgam/') || name.includes('amalgam') || name.includes('amálgama')) {
    return s.thermia;
  }

  if (uniq.includes('/nightmare/') || name.includes('nightmare') || name.includes('pesadelo')) {
    return s.nightmare;
  }

  if (mod.isAugment || uniq.includes('/augment/') || uniq.includes('/habilitymod/') || uniq.includes('/powerupgrade/') || name.includes('augment')) {
    return s.syndicate;
  }

  if (name.includes('umbral') || name.includes('sacrificial') || uniq.includes('/excaliburumbral/')) {
    return s.sacrifice;
  }

  if (uniq.includes('/requiem/') || name.includes('requiem')) {
    return s.requiem;
  }

  if (uniq.includes('/pvp/') || name.includes('conclave')) {
    return s.conclave;
  }

  if (mod.drops && mod.drops.length > 0) {
    return mod.drops.slice(0, 3).map(d => translateDropLocation(d.location, lang)).join(', ');
  }

  return s.general;
};

const getExtrapolatedCycles = (cycles) => {
  if (!cycles) return null;
  const now = Date.now();
  
  // Cetus
  let cetus = { ...cycles.cetus };
  if (cetus && cetus.expiry) {
    const expiryTime = new Date(cetus.expiry).getTime();
    if (now >= expiryTime) {
      const diff = now - expiryTime;
      const period = 9000000; // 150m
      const elapsed = diff % period;
      const wasDay = cetus.state === 'day' || cetus.isDay;
      if (wasDay) {
        if (elapsed < 3000000) {
          cetus.isDay = false;
          cetus.state = 'night';
          cetus.extrapolatedRemaining = 3000000 - elapsed;
        } else {
          cetus.isDay = true;
          cetus.state = 'day';
          cetus.extrapolatedRemaining = period - elapsed;
        }
      } else {
        if (elapsed < 6000000) {
          cetus.isDay = true;
          cetus.state = 'day';
          cetus.extrapolatedRemaining = 6000000 - elapsed;
        } else {
          cetus.isDay = false;
          cetus.state = 'night';
          cetus.extrapolatedRemaining = period - elapsed;
        }
      }
    } else {
      cetus.extrapolatedRemaining = expiryTime - now;
    }
  }

  // Orb Vallis
  let vallis = { ...cycles.vallis };
  if (vallis && vallis.expiry) {
    const expiryTime = new Date(vallis.expiry).getTime();
    if (now >= expiryTime) {
      const diff = now - expiryTime;
      const period = 2000000; // 2000s
      const elapsed = diff % period;
      const wasWarm = vallis.state === 'warm' || vallis.isWarm;
      if (wasWarm) {
        if (elapsed < 1600000) {
          vallis.isWarm = false;
          vallis.state = 'cold';
          vallis.extrapolatedRemaining = 1600000 - elapsed;
        } else {
          vallis.isWarm = true;
          vallis.state = 'warm';
          vallis.extrapolatedRemaining = period - elapsed;
        }
      } else {
        if (elapsed < 400000) {
          vallis.isWarm = true;
          vallis.state = 'warm';
          vallis.extrapolatedRemaining = 400000 - elapsed;
        } else {
          vallis.isWarm = false;
          vallis.state = 'cold';
          vallis.extrapolatedRemaining = period - elapsed;
        }
      }
    } else {
      vallis.extrapolatedRemaining = expiryTime - now;
    }
  }

  // Cambion Drift
  let cambion = { ...cycles.cambion };
  if (cambion && cambion.expiry) {
    const expiryTime = new Date(cambion.expiry).getTime();
    if (now >= expiryTime) {
      const diff = now - expiryTime;
      const period = 9000000; // 150m
      const elapsed = diff % period;
      const wasFass = cambion.state === 'fass';
      if (wasFass) {
        if (elapsed < 3000000) {
          cambion.state = 'vome';
          cambion.extrapolatedRemaining = 3000000 - elapsed;
        } else {
          cambion.state = 'fass';
          cambion.extrapolatedRemaining = period - elapsed;
        }
      } else {
        if (elapsed < 6000000) {
          cambion.state = 'fass';
          cambion.extrapolatedRemaining = 6000000 - elapsed;
        } else {
          cambion.state = 'vome';
          cambion.extrapolatedRemaining = period - elapsed;
        }
      }
    } else {
      cambion.extrapolatedRemaining = expiryTime - now;
      if (!cambion.state && cambion.active) {
        cambion.state = cambion.active;
      }
    }
  }

  // Baro Ki'Teer
  let baro = { ...cycles.baro };
  if (baro && baro.activation && baro.expiry) {
    const activationTime = new Date(baro.activation).getTime();
    const expiryTime = new Date(baro.expiry).getTime();
    const isActive = now >= activationTime && now < expiryTime;
    baro.active = isActive;
    baro.extrapolatedRemaining = isActive ? (expiryTime - now) : Math.max(0, activationTime - now);
  }

  return { cetus, vallis, cambion, baro };
};

// --- STAR CHART NODES CONFIGURATION ---
const planetNodesList = {
  earth: ['E-Prime', 'Mariana', 'Mantle', 'Gaia', 'Pacific', 'Cambria', 'Lith', 'Aris', 'Oro', 'Everest', 'Tikal', 'Coba'],
  venus: ['Undine', 'Tessera', 'Linea', 'Vesper', 'Aphrodite', 'Ishtar', 'Cytherean', 'Fossa', 'Kiliken', 'Romula', 'Venera', 'Montes', 'Apollodorus', 'Bursa', 'Sudar', 'Valle'],
  mercury: ['Elion', 'Lares', 'MPrime', 'Caloris', 'Tolstoj', 'Suisei', 'Pantheon', 'Verdi', 'Apollodorus', 'Boethius'],
  mars: ['Ara', 'Spear', 'Gradivus', 'Quirinus', 'Ares', 'Tharsis', 'Alator', 'Kadesh', 'Wahiba', 'Olympus', 'Hellas', 'War', 'Martialis', 'Agastya', 'Ultor', 'Arsia', 'Syrtis'],
  phobos: ['Drury', 'Gulliver', 'Monolith', 'Roche', 'Iliad'],
  ceres: ['Elara', 'Cinxia', 'Kiste', 'Ludi', 'Bode', 'Pallas', 'Lex', 'Seimeni', 'Gabii', 'Ker', 'Draco', 'Exta', 'Nue'],
  jupiter: ['Adrastea', 'Ananke', 'Carpo', 'Elara', 'Themisto', 'Metis', 'Ganymede', 'Alator', 'Io', 'Sinipe', 'Galilea', 'Cameria', 'Himalia', 'Karpo', 'Leda', 'Eris'],
  europa: ['Armaros', 'Gokstad', 'Kokabiel', 'Ose', 'Valac', 'Abaddon', 'Morax', 'Sorath', 'Taranis', 'Baal', 'Phoebe', 'Crete'],
  saturn: ['Caracol', 'Cassini', 'Dione', 'Febe', 'Keeler', 'Mimas', 'Pisces', 'Rhea', 'Tethys', 'Titan', 'Telesto', 'Calypso', 'Helene'],
  uranus: ['Ariel', 'Caelus', 'Caliban', 'Desdemona', 'Miranda', 'Ophelia', 'Puck', 'Rosalind', 'Sycorax', 'Titania', 'Umbriel', 'Stephano', 'Cressida', 'Pacifica'],
  neptune: ['Triton', 'Laomedia', 'Nereid', 'Proteus', 'Psamathe', 'Galatea', 'Larissa', 'Halimede', 'Sao', 'Neso', 'Despina', 'Thalassa', 'Naiad', 'Yursa', 'Alas', 'Salacia', 'Kelashin'],
  pluto: ['Acheron', 'Hades', 'Narcissus', 'Oceanum', 'Outer Terminus', 'Palus', 'Regna', 'Cerberus', 'Nirvana', 'Sechura', 'Minthe'],
  eris: ['Akkad', 'Gnathia', 'Histo', 'Isos', 'Kala-azar', 'Lysithea', 'Nimus', 'Oestrus', 'Phalan', 'Saxis', 'Solaria', 'Spore', 'Xini', 'Mutalist Alad V', 'Jordas Precept', 'Hesperia', 'Sargas'],
  sedna: ['Amarna', 'Berehynia', 'Charybdis', 'Graea', 'Hydra', 'Kappa', 'Kelpie', 'Marid', 'Merrow', 'Nakki', 'Rusalka', 'Sangumu', 'Selkie', 'Undine', 'Vodyanoi', 'Yela', 'Adaro', 'Abyssal', 'Vanth'],
  void: ['Teshub', 'Hepit', 'Taranis', 'Tiwaz', 'Stribog', 'Ani', 'Belenus', 'Mot', 'Aten', 'Mithra', 'Marduk', 'Void Gate'],
  deimos: ['Horend', 'Phlegyas', 'Fass', 'Vome', 'Nekralisk', 'Cambion Drift', 'Kullervo', 'Hiri', 'Alastor', 'Boreas', 'Thymos', 'Khora', 'Xaku', 'Zymos', 'Nidus', 'Necraloid', 'Deimos Gate', 'Loid', 'Otak', 'Mother', 'Son'],
  lua: ['Copernicus', 'Apollo', 'Grimaldi', 'Pavlov', 'Zeuxis', 'Stöfler', 'Tycho'],
  zariman: ['Halako Perimeter', 'Gyre', 'Angel', 'Zariman Bridge', 'Everlasting'],
  sanctum: ['Anatomica', 'Fibonacci', 'Tagfer', 'Bird3', 'Cavia'],
  earth_proxima: ['Free Flight', 'Jareer\'s Reef', 'Sovereign Strait', 'Posit Cluster', 'Korm\'s Belt', 'Ovington Gold'],
  venus_proxima: ['Vesper Strait', 'Linea Girdle', 'Aphrodite Waters', 'Cytherean Ridge', 'Orphix Resurgence'],
  saturn_proxima: ['Cassini\'s Hope', 'Dione Crossing', 'Febe Anchor', 'Keeler Basin', 'Mimas Reach', 'Nebra Sector'],
  neptune_proxima: ['Triton Graveyard', 'Nereid Deep', 'Proteus Outpost', 'Galatea Depot', 'Salacia Gate'],
  pluto_proxima: ['Acheron Ruins', 'Hades Foothills', 'Regna Vault', 'Cerberus Station', 'Outer Terminus', 'Styx Nebula'],
  veil_proxima: ['Gian Point', 'Flexa', 'R-9 Cloud', 'H-2 Cloud', 'Nsu Grid', 'Gox Basin']
};

// Generates coordinates for nodes in a winding, organic constellation path around a central zoomed-in planet
const getNodeCoords = (idx, total) => {
  const angle = (idx / (total - 1 || 1)) * 1.65 * Math.PI - 0.825 * Math.PI;
  const radius = 28 + Math.sin(idx * 1.8) * 6; // wavy spiral radius
  return {
    x: 50 + radius * Math.cos(angle) * 1.45, // stretched X for canvas aspect ratio
    y: 50 + radius * Math.sin(angle)
  };
};

// Backward-compatible helper to count completed nodes of a planet
const getPlanetCompletedNodesCount = (planetId, starChartState) => {
  const val = starChartState[planetId];
  if (!val) return 0;
  if (typeof val === 'number') return val;
  if (Array.isArray(val)) return val.length;
  if (typeof val === 'object') {
    return Object.values(val).filter(Boolean).length;
  }
  return 0;
};

// Checks if a specific planet's node is completed
const isPlanetNodeCompleted = (planetId, nodeName, starChartState) => {
  const val = starChartState[planetId];
  if (!val) return false;
  if (typeof val === 'number') {
    const nodeList = planetNodesList[planetId] || [];
    const nodeIndex = nodeList.indexOf(nodeName);
    return nodeIndex !== -1 && nodeIndex < val;
  }
  if (typeof val === 'object') {
    return !!val[nodeName];
  }
  return false;
};

// Toggles the completion state of a specific node
const togglePlanetNode = (planetId, nodeName, starChartState, setStarChartState) => {
  setStarChartState(prev => {
    const val = prev[planetId];
    let currentMap = {};
    if (typeof val === 'number') {
      const nodeList = planetNodesList[planetId] || [];
      nodeList.forEach((name, idx) => {
        if (idx < val) currentMap[name] = true;
      });
    } else if (typeof val === 'object' && val !== null) {
      currentMap = { ...val };
    }
    
    currentMap[nodeName] = !currentMap[nodeName];
    return {
      ...prev,
      [planetId]: currentMap
    };
  });
};

const formatPrimeSetParts = (type, lang) => {
  const count = type === 'Warframe' ? 4 : (type === 'Melee' ? 3 : 4);
  
  let partsStr = '';
  let typeStr = '';
  
  if (lang === 'pt') {
    partsStr = `${count} partes de`;
    if (type === 'Warframe') typeStr = 'Warframe';
    else if (type === 'Primary') typeStr = 'Arma Primária';
    else if (type === 'Secondary') typeStr = 'Arma Secundária';
    else if (type === 'Melee') typeStr = 'Arma Corpo a Corpo';
    else typeStr = type;
  } else if (lang === 'es') {
    partsStr = `${count} partes de`;
    if (type === 'Warframe') typeStr = 'Warframe';
    else if (type === 'Primary') typeStr = 'Arma Primaria';
    else if (type === 'Secondary') typeStr = 'Arma Secundaria';
    else if (type === 'Melee') typeStr = 'Arma Cuerpo a Cuerpo';
    else typeStr = type;
  } else if (lang === 'ja') {
    partsStr = `${count}つのパーツ`;
    if (type === 'Warframe') typeStr = 'Warframe';
    else if (type === 'Primary') typeStr = 'プライマリ';
    else if (type === 'Secondary') typeStr = 'セカンダリ';
    else if (type === 'Melee') typeStr = '近接';
    else typeStr = type;
    return `${typeStr} · ${partsStr}`;
  } else {
    partsStr = `${count} parts of`;
    typeStr = type;
  }
  
  return `${partsStr} · ${typeStr}`;
};

// --- ANIMATED COUNTER COMPONENT ---
function AnimatedCounter({ value, duration = 800, decimals = 0, suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(value);
    if (isNaN(end) || end === 0) {
      setCount(value);
      return;
    }
    
    const startTime = performance.now();
    
    const updateCount = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quad
      const easeProgress = progress * (2 - progress);
      const currentVal = easeProgress * end;
      
      setCount(currentVal.toFixed(decimals));
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end.toFixed(decimals));
      }
    };
    
    requestAnimationFrame(updateCount);
  }, [value, duration, decimals]);

  return <>{Number(count).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>;
}

// --- GLYPH AVATARS DATA ---
const GLYPHS = {
  excalibur: {
    name: 'Excalibur',
    emoji: '⚔️',
    color: '#e5e7eb',
    svg: (
      <svg viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="50" r="45" fill="rgba(255,255,255,0.05)" stroke="currentColor" strokeWidth="2"/>
        <path d="M50,15 L62,45 L50,40 L38,45 Z" fill="currentColor"/>
        <path d="M50,40 L50,85" stroke="currentColor" strokeWidth="4"/>
        <path d="M35,60 L50,55 L65,60" fill="none" stroke="currentColor" strokeWidth="3"/>
      </svg>
    )
  },
  lotus: {
    name: 'Lotus',
    emoji: '🌸',
    color: '#d8b4fe',
    svg: (
      <svg viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="50" r="45" fill="rgba(139,92,246,0.05)" stroke="currentColor" strokeWidth="2"/>
        <path d="M50,20 Q62,45 80,45 Q62,55 50,80 Q38,55 20,45 Q38,45 50,20 Z" fill="currentColor"/>
        <circle cx="50" cy="48" r="6" fill="#030305"/>
        <circle cx="50" cy="48" r="3" fill="currentColor"/>
      </svg>
    )
  },
  baro: {
    name: "Baro Ki'Teer",
    emoji: '💎',
    color: '#dfb858',
    svg: (
      <svg viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="50" r="45" fill="rgba(204,163,75,0.05)" stroke="currentColor" strokeWidth="2"/>
        <polygon points="50,22 72,50 50,78 28,50" fill="none" stroke="currentColor" strokeWidth="3"/>
        <polygon points="50,32 64,50 50,68 36,50" fill="currentColor"/>
        <circle cx="50" cy="50" r="4" fill="#030305"/>
      </svg>
    )
  },
  teshin: {
    name: 'Teshin',
    emoji: '🏮',
    color: '#ef4444',
    svg: (
      <svg viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="50" r="45" fill="rgba(239,68,68,0.05)" stroke="currentColor" strokeWidth="2"/>
        <path d="M25,25 L75,75 M75,25 L25,75" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M50,25 A25,25 0 0,0 50,75 A25,25 0 0,0 50,25" fill="none" stroke="currentColor" strokeWidth="4"/>
        <circle cx="50" cy="50" r="8" fill="currentColor"/>
      </svg>
    )
  },
  clem: {
    name: 'Clem',
    emoji: '🔫',
    color: '#f97316',
    svg: (
      <svg viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="50" r="45" fill="rgba(249,115,22,0.05)" stroke="currentColor" strokeWidth="2"/>
        <rect x="42" y="30" width="16" height="35" rx="8" fill="currentColor"/>
        <circle cx="47" cy="40" r="3" fill="#030305"/>
        <circle cx="53" cy="40" r="3" fill="#030305"/>
        <line x1="33" y1="45" x2="33" y2="70" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
        <line x1="67" y1="45" x2="67" y2="70" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
      </svg>
    )
  },
  stalker: {
    name: 'Stalker',
    emoji: '💀',
    color: '#ef4444',
    svg: (
      <svg viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="50" r="45" fill="rgba(153,27,27,0.05)" stroke="currentColor" strokeWidth="2"/>
        <path d="M30,30 L70,30 L50,75 Z" fill="currentColor"/>
        <path d="M38,42 L62,42" stroke="#ef4444" strokeWidth="4" strokeLinecap="round"/>
        <path d="M50,30 L50,55" stroke="#030305" strokeWidth="2"/>
      </svg>
    )
  }
};

// --- SPACE PARTICLE BACKGROUND CANVAS ---
function SpaceParticlesCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.2;
        this.speed = Math.random() * 0.15 + 0.05;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.pulseSpeed = Math.random() * 0.01 + 0.005;
        this.pulseDir = Math.random() > 0.5 ? 1 : -1;
      }

      update() {
        this.y -= this.speed;
        if (this.y < 0) {
          this.y = height;
          this.x = Math.random() * width;
        }

        this.opacity += this.pulseSpeed * this.pulseDir;
        if (this.opacity > 0.85 || this.opacity < 0.15) {
          this.pulseDir *= -1;
        }
      }

      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class ShootingStar {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * (height / 2);
        this.len = Math.random() * 80 + 30;
        this.speedX = Math.random() * 5 + 4;
        this.speedY = Math.random() * 2 + 1;
        this.thickness = Math.random() * 1.5 + 0.5;
        this.active = false;
        this.delay = Math.random() * 400 + 100;
      }

      update() {
        if (!this.active) {
          this.delay--;
          if (this.delay <= 0) {
            this.active = true;
          }
          return;
        }

        this.x -= this.speedX;
        this.y += this.speedY;

        if (this.x < -this.len || this.y > height + this.len) {
          this.reset();
        }
      }

      draw() {
        if (!this.active) return;
        
        const style = getComputedStyle(document.body);
        const glowColor = style.getPropertyValue('--border-glow').trim() || '#cca34b';
        ctx.strokeStyle = glowColor;

        ctx.lineWidth = this.thickness;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.len, this.y - (this.len * (this.speedY / this.speedX)));
        ctx.stroke();
      }
    }

    const particles = Array.from({ length: 70 }, () => new Particle());
    const shootingStars = Array.from({ length: 2 }, () => new ShootingStar());

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      shootingStars.forEach((s) => {
        s.update();
        s.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -2,
        pointerEvents: 'none'
      }}
    />
  );
}

export default function App() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [username, setUsername] = useState(() => localStorage.getItem('wf_username') || 'Tenno');
  const [platform, setPlatform] = useState(() => localStorage.getItem('wf_platform') || 'PC');
  const [uiTheme, setUiTheme] = useState(() => localStorage.getItem('wf_ui_theme') || 'orokin');
  const [userAvatar, setUserAvatar] = useState(() => localStorage.getItem('wf_user_avatar') || 'excalibur');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [masteryRank, setMasteryRank] = useState(() => Number(localStorage.getItem('wf_mastery_rank')) || 1);
  const [isAutoDetected, setIsAutoDetected] = useState(false);
  const [importPreview, setImportPreview] = useState(null);

  // Sync theme selection to body class
  useEffect(() => {
    localStorage.setItem('wf_ui_theme', uiTheme);
    // Remove all theme classes first
    document.body.classList.remove('theme-orokin', 'theme-lotus', 'theme-corpus', 'theme-grineer', 'theme-infested');
    // Add current theme class
    document.body.classList.add(`theme-${uiTheme}`);
  }, [uiTheme]);

  useEffect(() => {
    localStorage.setItem('wf_user_avatar', userAvatar);
  }, [userAvatar]);

  // Language state
  const [lang, setLang] = useState(() => localStorage.getItem('wf_lang') || 'pt');
  const t = translations[lang] || translations['pt'];
  useEffect(() => { localStorage.setItem('wf_lang', lang); }, [lang]);
  
  // User inventory state: { weaponName: { owned: boolean, mastered: boolean } }
  const [inventory, setInventory] = useState(() => {
    try {
      const stored = localStorage.getItem('wf_inventory');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Syndicate standing state: { syndicateKey: { rank: number, standing: number } }
  const [syndicates, setSyndicates] = useState(() => {
    try {
      const stored = localStorage.getItem('wf_syndicates');
      return stored ? JSON.parse(stored) : {
        'steel_meridian': { rank: 0, standing: 0 },
        'arbiters_hexis': { rank: 0, standing: 0 },
        'cephalon_suda': { rank: 0, standing: 0 },
        'perrin_sequence': { rank: 0, standing: 0 },
        'red_veil': { rank: 0, standing: 0 },
        'new_loka': { rank: 0, standing: 0 }
      };
    } catch {
      return {
        'steel_meridian': { rank: 0, standing: 0 },
        'arbiters_hexis': { rank: 0, standing: 0 },
        'cephalon_suda': { rank: 0, standing: 0 },
        'perrin_sequence': { rank: 0, standing: 0 },
        'red_veil': { rank: 0, standing: 0 },
        'new_loka': { rank: 0, standing: 0 }
      };
    }
  });

  // Star Chart node completion state: { planetId: completedNodesCount }
  const [starChartNormal, setStarChartNormal] = useState(() => {
    try {
      const stored = localStorage.getItem('wf_starchart_normal');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [starChartSteelPath, setStarChartSteelPath] = useState(() => {
    try {
      const stored = localStorage.getItem('wf_starchart_steelpath');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Completed Junctions state: [junctionId1, junctionId2, ...]
  const [starChartJunctions, setStarChartJunctions] = useState(() => {
    try {
      const stored = localStorage.getItem('wf_starchart_junctions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wf_starchart_normal', JSON.stringify(starChartNormal));
  }, [starChartNormal]);

  useEffect(() => {
    localStorage.setItem('wf_starchart_steelpath', JSON.stringify(starChartSteelPath));
  }, [starChartSteelPath]);

  useEffect(() => {
    localStorage.setItem('wf_starchart_junctions', JSON.stringify(starChartJunctions));
  }, [starChartJunctions]);

  // Railjack completion state: { proximaId: { nodeName: boolean } }
  const [railjackCompletion, setRailjackCompletion] = useState(() => {
    try {
      const stored = localStorage.getItem('wf_starchart_railjack');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('wf_starchart_railjack', JSON.stringify(railjackCompletion));
  }, [railjackCompletion]);

  // Warp transition overlay state
  const [isWarping, setIsWarping] = useState(false);

  const triggerWarpTransition = (callback) => {
    setIsWarping(true);
    setTimeout(() => {
      if (callback) callback();
    }, 400);
    setTimeout(() => {
      setIsWarping(false);
    }, 800);
  };

  // Current active mode (normal / steelpath) in Star Chart tab
  const [starChartMode, setStarChartMode] = useState('normal');
  const [selectedPlanetId, setSelectedPlanetId] = useState('earth');

  const [weapons, setWeapons] = useState(() => [...fallbackWeapons, ...fallbackCompanions]);
  const [loadingApi, setLoadingApi] = useState(false);
  const [isLiveLoaded, setIsLiveLoaded] = useState(false);
  
  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVault, setFilterVault] = useState('all');
  const [sortBy, setSortBy] = useState(() => {
    const saved = localStorage.getItem('wf_sort_by');
    if (saved === 'status-unmastered') return 'unmastered-first';
    if (saved === 'status-mastered') return 'mastered-first';
    return saved || 'name-asc';
  });
  const [hideLockedByMR, setHideLockedByMR] = useState(() => localStorage.getItem('wf_hide_locked') === 'true');

  // Save search & filters preferences
  useEffect(() => {
    localStorage.setItem('wf_sort_by', sortBy);
  }, [sortBy]);

  useEffect(() => {
    localStorage.setItem('wf_hide_locked', String(hideLockedByMR));
  }, [hideLockedByMR]);

  // Modal State
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [activeShardEditor, setActiveShardEditor] = useState(null);


  // Import / Export State
  const [importJson, setImportJson] = useState('');
  const [syncStatus, setSyncStatus] = useState(null); // { type: 'success'|'error', message: '' }
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // MODULE 1: World Cycles State
  const [worldCycles, setWorldCycles] = useState(null);
  const [cycleTick, setCycleTick] = useState(0); // increments every second for countdown
  const cyclesFetchRef = useRef(null);

  // MODULE 2: MR Simulator State
  const [simTargetMR, setSimTargetMR] = useState(() => {
    const stored = localStorage.getItem('wf_sim_target_mr');
    return stored ? Number(stored) : masteryRank + 1;
  });

  // Arsenal Weapon/Warframe expansion state
  const [expandedCards, setExpandedCards] = useState({});

  // MODULE 3: Mods Tracker State
  const [mods, setMods] = useState(() => fallbackMods.map(normalizeMod));
  const [loadingMods, setLoadingMods] = useState(false);
  const [modInventory, setModInventory] = useState(() => {
    try {
      const stored = localStorage.getItem('wf_mod_inventory');
      return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
  });
  
  // Mods Filter States
  const [modSearch, setModSearch] = useState('');
  const [modFilterRarity, setModFilterRarity] = useState('all');
  const [modFilterType, setModFilterType] = useState('all');
  const [modFilterStatus, setModFilterStatus] = useState('all');
  const [modSortBy, setModSortBy] = useState('name-asc');
  
  const [modsSubTab, setModsSubTab] = useState('mods'); // 'mods' or 'arcanes'
  const [arcaneInventory, setArcaneInventory] = useState(() => {
    try {
      const stored = localStorage.getItem('tennoTracker_arcanes');
      return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
  });
  const [arcaneSearch, setArcaneSearch] = useState('');
  const [arcaneFilterCategory, setArcaneFilterCategory] = useState('all');

  useEffect(() => {
    localStorage.setItem('tennoTracker_arcanes', JSON.stringify(arcaneInventory));
  }, [arcaneInventory]);
  
  const [warframeShards, setWarframeShards] = useState(() => {
    try {
      const stored = localStorage.getItem('tennoTracker_warframe_shards');
      return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem('tennoTracker_warframe_shards', JSON.stringify(warframeShards));
  }, [warframeShards]);
  
  // Performance: Lazy Loading Mods Grid
  const [visibleModsCount, setVisibleModsCount] = useState(80);
  
  useEffect(() => {
    setVisibleModsCount(80);
  }, [modSearch, modFilterRarity, modFilterType, modFilterStatus, modSortBy]);
  
  // Mod Details Modal
  const [selectedMod, setSelectedMod] = useState(null);
  const [imgErrors, setImgErrors] = useState({});

  // MODULE 4: Dojo Research Tracker State
  const [dojoResearch, setDojoResearch] = useState(() => {
    try {
      const stored = localStorage.getItem('wf_dojo_research');
      // Default: all labs are researched
      return stored ? JSON.parse(stored) : {
        tenno: true, chem: true, bio: true, energy: true, bash: true, dagath: true
      };
    } catch {
      return { tenno: true, chem: true, bio: true, energy: true, bash: true, dagath: true };
    }
  });
  const [hideUnresearched, setHideUnresearched] = useState(() => {
    return localStorage.getItem('wf_hide_unresearched') === 'true';
  });

  // MODULE 6: Share Card State
  const [showShareCard, setShowShareCard] = useState(false);
  const [shareCardCopied, setShareCardCopied] = useState(false);


  // 1. Electron IPC: Auto-detect active Warframe Account name from EE.log
  useEffect(() => {
    const detectAccountName = async () => {
      if (window.electronAPI && typeof window.electronAPI.getWarframeAccountName === 'function') {
        try {
          const detected = await window.electronAPI.getWarframeAccountName();
          if (detected) {
            console.log('Account auto-detected via EE.log:', detected);
            setIsAutoDetected(true);
            setUsername(detected);
            
            // Try loading account-specific profile & inventory & syndicates & mods
            const savedInv = localStorage.getItem(`wf_inventory_${detected}`);
            if (savedInv) {
              setInventory(JSON.parse(savedInv));
            }
            const savedMR = localStorage.getItem(`wf_mastery_rank_${detected}`);
            if (savedMR) {
              setMasteryRank(Number(savedMR));
            }
            const savedSynd = localStorage.getItem(`wf_syndicates_${detected}`);
            if (savedSynd) {
              setSyndicates(JSON.parse(savedSynd));
            }
            const savedMods = localStorage.getItem(`wf_mod_inventory_${detected}`);
            if (savedMods) {
              setModInventory(JSON.parse(savedMods));
            } else {
              setModInventory({});
            }
          }
        } catch (err) {
          console.error('Failed to auto-detect account name:', err);
        }
      }
    };
    
    // Detect once on load
    detectAccountName();
    
    // Periodically poll the logs (e.g. every 10 seconds) to check for account switches
    const interval = setInterval(detectAccountName, 10000);
    return () => clearInterval(interval);
  }, []);

  // Save profile to localStorage (general and account-specific)
  useEffect(() => {
    localStorage.setItem('wf_username', username);
    localStorage.setItem('wf_platform', platform);
    localStorage.setItem('wf_mastery_rank', String(masteryRank));
    if (username && username !== 'Tenno') {
      localStorage.setItem(`wf_mastery_rank_${username}`, String(masteryRank));
    }
  }, [username, platform, masteryRank]);

  // Save inventory to localStorage (general and account-specific)
  useEffect(() => {
    localStorage.setItem('wf_inventory', JSON.stringify(inventory));
    if (username && username !== 'Tenno') {
      localStorage.setItem(`wf_inventory_${username}`, JSON.stringify(inventory));
    }
  }, [inventory, username]);

  // Save syndicates to localStorage (general and account-specific)
  useEffect(() => {
    localStorage.setItem('wf_syndicates', JSON.stringify(syndicates));
    if (username && username !== 'Tenno') {
      localStorage.setItem(`wf_syndicates_${username}`, JSON.stringify(syndicates));
    }
  }, [syndicates, username]);

  // Save modInventory to localStorage (general and account-specific)
  useEffect(() => {
    localStorage.setItem('wf_mod_inventory', JSON.stringify(modInventory));
    if (username && username !== 'Tenno') {
      localStorage.setItem(`wf_mod_inventory_${username}`, JSON.stringify(modInventory));
    }
  }, [modInventory, username]);

  useEffect(() => {
    localStorage.setItem('wf_dojo_research', JSON.stringify(dojoResearch));
  }, [dojoResearch]);

  useEffect(() => {
    localStorage.setItem('wf_hide_unresearched', String(hideUnresearched));
  }, [hideUnresearched]);

  useEffect(() => {
    localStorage.setItem('wf_sim_target_mr', String(simTargetMR));
  }, [simTargetMR]);

  // MODULE 1: Fetch World Cycles from WarframeStat API
  const fetchWorldCycles = useCallback(async () => {
    try {
      const platformLower = platform ? platform.toLowerCase() : 'pc';
      let apiPlatform = 'pc';
      if (platformLower === 'xbox') apiPlatform = 'xb1';
      else if (platformLower === 'psn' || platformLower === 'playstation') apiPlatform = 'ps4';
      else if (platformLower === 'nintendo' || platformLower === 'switch') apiPlatform = 'swi';
      
      const res = await fetch(`https://api.warframestat.us/${apiPlatform}`);
      if (!res.ok) throw new Error('API response not OK');
      const worldstate = await res.json();
      
      setWorldCycles({
        cetus: worldstate.cetusCycle,
        vallis: worldstate.vallisCycle,
        cambion: worldstate.cambionCycle,
        baro: worldstate.voidTrader,
        fetchedAt: Date.now()
      });
    } catch (err) {
      console.warn('Failed to fetch world cycles:', err);
    }
  }, [platform]);

  useEffect(() => {
    fetchWorldCycles();
    // Refetch every 60 seconds
    const refetchInterval = setInterval(fetchWorldCycles, 60000);
    // Tick every second for live countdown
    const tickInterval = setInterval(() => setCycleTick(t => t + 1), 1000);
    return () => {
      clearInterval(refetchInterval);
      clearInterval(tickInterval);
    };
  }, [fetchWorldCycles]);


  // Fetch Live Weapons & Warframes from WarframeStat API
  useEffect(() => {
    const fetchItems = async () => {
      setLoadingApi(true);
      try {
        const [weaponsRes, warframesRes] = await Promise.all([
          fetch(`https://api.warframestat.us/weapons?language=${lang}`),
          fetch(`https://api.warframestat.us/warframes?language=${lang}`)
        ]);
        if (!weaponsRes.ok || !warframesRes.ok) throw new Error('API response not OK');
        
        const weaponsData = await weaponsRes.json();
        const warframesData = await warframesRes.json();
        
        let parsedWeapons = [];
        let parsedWarframes = [];
        
        if (Array.isArray(weaponsData)) {
          parsedWeapons = weaponsData
            .filter(item => 
              item &&
              item.name &&
              (item.category === "Primary" || 
               item.category === "Secondary" || 
               item.category === "Melee" ||
               item.type === "Primary" ||
               item.type === "Secondary" ||
               item.type === "Melee")
            )
            .map(item => mapItemData(item, false, lang));
        }
        
        if (Array.isArray(warframesData)) {
          parsedWarframes = warframesData
            .filter(item => 
              item &&
              item.name &&
              item.category === 'Warframes'
            )
            .map(item => mapItemData(item, true, lang));
        }
        
        const fallbackOthers = fallbackWeapons.filter(w => 
          w.type === 'Archwing' || 
          w.type === 'Arch-Gun' || 
          w.type === 'Arch-Melee' || 
          w.type === 'Amp'
        );
        const merged = [...parsedWeapons, ...parsedWarframes, ...fallbackCompanions, ...fallbackOthers];
        // Sort by name
        merged.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        setWeapons(merged);
        setIsLiveLoaded(true);
      } catch (err) {
        console.error('Failed to fetch live Warframe items, using fallback data:', err);
        setWeapons([...fallbackWeapons, ...fallbackCompanions]);
        setIsLiveLoaded(false);
      } finally {
        setLoadingApi(false);
      }
    };

    fetchItems();
  }, [lang]);

  // Fetch Live Mods from WarframeStat API
  useEffect(() => {
    const fetchMods = async () => {
      setLoadingMods(true);
      try {
        const res = await fetch(`https://api.warframestat.us/mods?language=${lang}`);
        if (!res.ok) throw new Error('API response not OK');
        const data = await res.json();
        if (Array.isArray(data)) {
          const parsed = data
            .filter(m => {
              if (!m || !m.name) return false;
              
              const hasDesc = !!(m.description || (Array.isArray(m.description) && m.description.length > 0));
              const hasStats = !!(Array.isArray(m.levelStats) && m.levelStats.length > 0 && m.levelStats.some(s => s.stats && s.stats.length > 0));
              
              const isSetDummy = m.type === 'Mod Set Mod' || 
                                 (m.uniqueName && (m.uniqueName.toLowerCase().includes('setmod') || m.uniqueName.toLowerCase().includes('seteffects'))) ||
                                 (m.name && m.name.toLowerCase().includes('setmod'));
                                 
              const untranslated = m.name.startsWith('/Lotus');
              const isPlaceholder = m.name.toLowerCase().includes('placeholder') || m.name.toLowerCase().includes('devtest');
              const isRivenTemplate = m.name.includes('Mod Riven:') || m.name.includes('Riven Mod');
              
              return (hasDesc || hasStats) && !isSetDummy && !untranslated && !isPlaceholder && !isRivenTemplate;
            })
            .map(m => {
              const rawPol = m.polarity || '';
              const isFocusWay = m.type === 'Focus Way' || (m.imageName && m.imageName.includes('FocusIcon'));
              const inferredTh = isFocusWay ? null : (m.wikiaThumbnail || getInferredThumbnail(m.wikiaUrl, m.name));
              
              return normalizeMod({
                uniqueName: m.uniqueName || m.name,
                name: m.name,
                polarity: rawPol.toLowerCase(),
                rarity: m.rarity || 'Common',
                baseDrain: m.baseDrain || 0,
                fusionLimit: m.fusionLimit || 0,
                type: m.type || 'Mod',
                levelStats: Array.isArray(m.levelStats) ? m.levelStats.map(s => ({
                  stats: Array.isArray(s.stats) ? s.stats : []
                })) : [],
                wikiaThumbnail: inferredTh,
                wikiaUrl: m.wikiaUrl,
                imageName: isFocusWay ? '' : (m.imageName || ''),
                drops: Array.isArray(m.drops) ? m.drops.map(d => ({
                  location: d.location,
                  chance: typeof d.chance === 'number' ? d.chance / 100 : 0
                })) : [],
                description: m.description || ''
              });
            });

          // De-duplicate parsed mods by name, preferring PvE, having thumbnails, and having longer descriptions
          const uniqueModsMap = new Map();
          for (const m of parsed) {
            const key = (m.name || '').trim().toLowerCase();
            if (!key) continue;
            const existing = uniqueModsMap.get(key);
            if (!existing) {
              uniqueModsMap.set(key, m);
            } else {
              const existingIsPvp = existing.uniqueName && existing.uniqueName.toLowerCase().includes('pvp');
              const currentIsPvp = m.uniqueName && m.uniqueName.toLowerCase().includes('pvp');
              if (existingIsPvp && !currentIsPvp) {
                uniqueModsMap.set(key, m);
                continue;
              }
              if (!existingIsPvp && currentIsPvp) {
                continue;
              }
              if (!existing.wikiaThumbnail && m.wikiaThumbnail) {
                uniqueModsMap.set(key, m);
                continue;
              }
              if (existing.wikiaThumbnail && !m.wikiaThumbnail) {
                continue;
              }
              const existingDescLen = (existing.description || '').length;
              const currentDescLen = (m.description || '').length;
              if (currentDescLen > existingDescLen) {
                uniqueModsMap.set(key, m);
              }
            }
          }
          const deDuplicated = Array.from(uniqueModsMap.values());
          setMods(deDuplicated);
        }
      } catch (err) {
        console.error('Failed to fetch live Mods, using fallback data:', err);
        setMods(fallbackMods.map(normalizeMod));
      } finally {
        setLoadingMods(false);
      }
    };
    fetchMods();
  }, [lang]);

  // --- ACTIONS ---
  const handleToggleOwned = (weaponName, weaponId) => {
    setInventory(prev => {
      const key = weaponId || weaponName;
      const current = prev[key] || prev[weaponName] || { owned: false, mastered: false };
      const newOwned = !current.owned;
      const newMastered = newOwned ? current.mastered : false;
      const updated = {
        ...prev,
        [key]: { ...current, owned: newOwned, mastered: newMastered }
      };
      if (weaponId && weaponName && weaponId !== weaponName && updated[weaponName]) {
        delete updated[weaponName];
      }
      return updated;
    });
  };

  const handleToggleMastered = (weaponName, weaponId) => {
    setInventory(prev => {
      const key = weaponId || weaponName;
      const current = prev[key] || prev[weaponName] || { owned: false, mastered: false };
      const newMastered = !current.mastered;
      const newOwned = newMastered ? true : current.owned;
      const updated = {
        ...prev,
        [key]: { ...current, owned: newOwned, mastered: newMastered }
      };
      if (weaponId && weaponName && weaponId !== weaponName && updated[weaponName]) {
        delete updated[weaponName];
      }
      return updated;
    });
  };

  const handleSetAllMasteredState = (weaponName, weaponId, state) => {
    setInventory(prev => {
      const key = weaponId || weaponName;
      const current = prev[key] || prev[weaponName] || { owned: false, mastered: false };
      const updated = {
        ...prev,
        [key]: { ...current, owned: state, mastered: state }
      };
      if (weaponId && weaponName && weaponId !== weaponName && updated[weaponName]) {
        delete updated[weaponName];
      }
      return updated;
    });
  };

  const handleNemesisUpdate = (weaponName, weaponId, data) => {
    setInventory(prev => {
      const key = weaponId || weaponName;
      const current = prev[key] || prev[weaponName] || { owned: false, mastered: false };
      const updated = {
        ...prev,
        [key]: { ...current, ...data }
      };
      if (weaponId && weaponName && weaponId !== weaponName && updated[weaponName]) {
        delete updated[weaponName];
      }
      return updated;
    });
  };

  const handleAdjustStanding = (syndKey, amount, propagate = true) => {
    setSyndicates(prev => {
      const next = JSON.parse(JSON.stringify(prev)); // Deep copy
      
      const adjustSingle = (key, amt) => {
        if (!next[key]) return;
        
        let rank = next[key].rank ?? 0;
        let standing = next[key].standing ?? 0;
        let remaining = amt;
        
        while (remaining !== 0) {
          const cap = syndicateMaxStanding[String(rank)] || 132000;
          
          if (remaining > 0) {
            // Gaining positive standing
            if (rank >= 0) {
              const space = cap - standing;
              if (remaining <= space) {
                standing += remaining;
                remaining = 0;
              } else {
                standing = cap;
                remaining = 0; // Cap at positive rank ceiling (requires manual sacrifice/level up)
              }
            } else {
              // Negative rank: positive standing reduces the negative standing depth
              if (remaining <= standing) {
                standing -= remaining;
                remaining = 0;
              } else {
                // Clear this negative rank and rank up towards neutral
                remaining -= standing;
                standing = 0;
                if (rank === -2) {
                  rank = -1;
                  standing = syndicateMaxStanding['-1'] || 22000; // Starts at max depth of -1
                } else if (rank === -1) {
                  rank = 0;
                  standing = 0; // Starts at 0 depth of Rank 0 (Neutral)
                }
              }
            }
          } else {
            // Losing standing (remaining is negative, e.g. gaining negative depth)
            const loss = -remaining;
            
            if (rank > 0) {
              if (loss <= standing) {
                standing -= loss;
                remaining = 0;
              } else {
                // Rank down to previous positive rank
                const used = standing;
                remaining += used;
                rank = rank - 1;
                standing = syndicateMaxStanding[String(rank)] || 22000;
              }
            } else if (rank === 0) {
              if (loss <= standing) {
                standing -= loss;
                remaining = 0;
              } else {
                // Rank down to Rank -1
                const used = standing;
                remaining += used;
                rank = -1;
                standing = 0; // Opposed rank starts at 0 depth
              }
            } else {
              // Negative rank: losing standing pushes us deeper into negative depth
              const space = cap - standing;
              if (loss <= space) {
                standing += loss;
                remaining = 0;
              } else {
                if (rank === -1) {
                  // Rank down to Rank -2
                  remaining += space;
                  rank = -2;
                  standing = 0; // Enemy rank starts at 0 depth
                } else if (rank === -2) {
                  // Absolute bottom cap
                  standing = cap;
                  remaining = 0;
                }
              }
            }
          }
        }
        
        next[key].rank = rank;
        next[key].standing = standing;
      };

      // Adjust main syndicate
      adjustSingle(syndKey, amount);

      if (propagate) {
        const syndicateDef = primarySyndicatesList.find(s => s.key === syndKey);
        if (syndicateDef) {
          if (syndicateDef.ally) {
            adjustSingle(syndicateDef.ally, Math.round(amount * 0.5));
          }
          if (syndicateDef.opposed) {
            adjustSingle(syndicateDef.opposed, Math.round(amount * -0.5));
          }
          if (syndicateDef.enemy) {
            adjustSingle(syndicateDef.enemy, Math.round(amount * -1.0));
          }
        }
      }

      return next;
    });
  };

  const handleSetRank = (syndKey, newRank) => {
    setSyndicates(prev => ({
      ...prev,
      [syndKey]: {
        ...prev[syndKey],
        rank: Number(newRank),
        standing: 0
      }
    }));
  };

  // MODULE 1: Countdown formatter
  const formatCountdown = (ms) => {
    if (!ms || ms <= 0) return '00:00:00';
    const totalSec = Math.floor(ms / 1000);
    const d = Math.floor(totalSec / 86400);
    const h = Math.floor((totalSec % 86400) / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    
    if (d > 0) {
      return `${d}d ${h}h ${m}m`;
    }
    if (h > 0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };

  const getRemainingMs = (expiryStr) => {
    if (!expiryStr) return 0;
    return Math.max(0, new Date(expiryStr).getTime() - Date.now());
  };

  // Arsenal card expansion action
  const toggleCardExpanded = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // MODULE 3: Mod Tracker actions
  const handleToggleModObtained = (modName, modUniqueName) => {
    setModInventory(prev => {
      const key = modUniqueName || modName;
      const current = prev[key] || { obtained: false };
      const updated = {
        ...prev,
        [key]: { obtained: !current.obtained }
      };
      return updated;
    });
  };

  // MODULE 4: Dojo source -> lab mapping helper
  const getDojoLabKey = (source) => {
    if (!source) return null;
    if (source.includes('Tenno Lab')) return 'tenno';
    if (source.includes('Chem Lab')) return 'chem';
    if (source.includes('Bio Lab')) return 'bio';
    if (source.includes('Energy Lab')) return 'energy';
    if (source.includes('Bash Lab')) return 'bash';
    if (source.includes('Dagath Hollow')) return 'dagath';
    return null;
  };

  // MODULE 5: Prime sets analyzer
  const primeSetsAnalysis = useMemo(() => {
    // Well-known Prime set names and their components
    const knownPrimeSets = {};
    weapons.forEach(w => {
      if (!w.name || !w.name.includes('Prime')) return;
      const state = inventory[w.id] || inventory[w.name] || { owned: false, mastered: false };
      if (!state.owned) return;
      // Extract base name (e.g., "Saryn Prime" -> "Saryn")
      const baseName = w.name.replace(' Prime', '').trim();
      const setName = `${baseName} Prime`;
      if (!knownPrimeSets[setName]) {
        knownPrimeSets[setName] = { items: [], type: w.type };
      }
      knownPrimeSets[setName].items.push(w);
    });

    return Object.entries(knownPrimeSets).map(([setName, data]) => {
      const marketSlug = setName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      return {
        setName,
        items: data.items,
        type: data.type,
        marketUrl: `https://warframe.market/items/${marketSlug}_set`
      };
    }).sort((a, b) => a.setName.localeCompare(b.setName));
  }, [weapons, inventory]);

  // MODULE 6: Generate share card markdown
  const generateShareMarkdown = () => {
    const completion = ((stats.masteredCount / stats.totalCount) * 100 || 0).toFixed(1);
    const lines = [
      `## 🎮 Warframe Tenno Profile`,
      `**${username}** | MR ${masteryRank} - ${getRankName(masteryRank)} | ${platform}`,
      ``,
      `📊 **Coleção:** ${stats.masteredCount}/${stats.totalCount} itens dominados (${completion}%)`,
      `⚔️ **Primárias:** ${stats.primaryMastered}/${stats.primaryCount}`,
      `🗡️ **Secundárias:** ${stats.secondaryMastered}/${stats.secondaryCount}`,
      `🔪 **Corpo a Corpo:** ${stats.meleeMastered}/${stats.meleeCount}`,
      `🎭 **Warframes:** ${stats.warframeMastered}/${stats.warframeCount}`,
      `🐾 **Companheiros:** ${stats.companionMastered}/${stats.companionCount}`,
      `👹 **Nêmesis:** ${stats.nemesisMastered}/${stats.nemesisCount}`,
      ``,
      `*Gerado pelo Warframe Mastery Tracker*`
    ];
    return lines.join('\n');
  };

  // Mapping of common materials to their best farming planets
  const resourceLocations = {

    pt: {
      "orokin cell": "Ceres, Saturno, Deimos (Chefes de Assassinato têm maior chance)",
      "orokin cells": "Ceres, Saturno, Deimos (Chefes de Assassinato têm maior chance)",
      "argon crystal": "Void (Missões de Captura/Extermínio - Atenção: expira do inventário após 24h!)",
      "argon crystals": "Void (Missões de Captura/Extermínio - Atenção: expira do inventário após 24h!)",
      "neurodes": "Terra, Eris, Deimos, Lua (Mariana na Terra ou sobrevivência em Deimos)",
      "neural sensors": "Júpiter, Fortalezas Kuva (Alator em Júpiter é uma boa escolha)",
      "morphics": "Mercúrio, Marte, Phobos, Europa, Plutão (Chefes em Marte)",
      "control module": "Void, Europa, Netuno (Muito comum no Void)",
      "control modules": "Void, Europa, Netuno (Muito comum no Void)",
      "gallium": "Marte, Urano (Assur em Urano)",
      "plastids": "Saturno, Urano, Phobos, Plutão, Eris (Piscinas em Saturno ou Assur em Urano são excelentes)",
      "polymer bundle": "Mercúrio, Vênus, Urano (Sobrevivência Ophelia em Urano)",
      "polymer bundles": "Mercúrio, Vênus, Urano (Sobrevivência Ophelia em Urano)",
      "nano spores": "Saturno, Netuno, Eris, Deimos (Sobrevivência de Deimos ou Eris)",
      "ferrite": "Mercúrio, Terra, Netuno, Void",
      "alloy plate": "Vênus, Phobos, Ceres, Júpiter, Plutão, Sedna",
      "rubedo": "Terra, Phobos, Europa, Plutão, Sedna, Void (Void é muito bom)",
      "salvage": "Marte, Júpiter, Sedna",
      "credits": "Index (Netuno), Missões de Fenda (Fissures) ou Missões Diárias",
      "detonite injector": "Pesquisa do Laboratório Chem (Dojo de Clã) ou Invasões",
      "fieldron": "Pesquisa do Laboratório Energy (Dojo de Clã) ou Invasões",
      "mutagen mass": "Pesquisa do Laboratório Bio (Dojo de Clã) ou Invasões",
      "oxium": "Galpões de Corpus (Missão IO em Júpiter - Destrua Oxium Ospreys antes que se explodam)",
      "tellurium": "Sobrevivência no Railjack ou Missões Subaquáticas de Urano (Ophelia)",
      "cryotic": "Missões de Escavação (Hieracon em Plutão é ideal)"
    },
    en: {
      "orokin cell": "Ceres, Saturn, Deimos (Assassination bosses have highest drop rate)",
      "orokin cells": "Ceres, Saturn, Deimos (Assassination bosses have highest drop rate)",
      "argon crystal": "Void (Capture/Extermination missions - Warning: expires in 24h!)",
      "argon crystals": "Void (Capture/Extermination missions - Warning: expires in 24h!)",
      "neurodes": "Earth, Eris, Deimos, Lua (Mariana on Earth or survival on Deimos)",
      "neural sensors": "Jupiter, Kuva Fortress (Alator on Jupiter is a good choice)",
      "morphics": "Mercury, Mars, Phobos, Europa, Pluto (Bosses on Mars)",
      "control module": "Void, Europa, Neptune (Very common in the Void)",
      "control modules": "Void, Europa, Neptune (Very common in the Void)",
      "gallium": "Mars, Uranus (Assur on Uranus)",
      "plastids": "Saturn, Uranus, Phobos, Pluto, Eris (Piscinas on Saturn or Assur on Uranus are excellent)",
      "polymer bundle": "Mercury, Venus, Uranus (Ophelia survival on Uranus)",
      "polymer bundles": "Mercury, Venus, Uranus (Ophelia survival on Uranus)",
      "nano spores": "Saturn, Neptune, Eris, Deimos (Deimos or Eris survival)",
      "ferrite": "Mercury, Earth, Neptune, Void",
      "alloy plate": "Venus, Phobos, Ceres, Jupiter, Pluto, Sedna",
      "rubedo": "Earth, Phobos, Europa, Pluto, Sedna, Void (Void is very good)",
      "salvage": "Mars, Jupiter, Sedna",
      "credits": "The Index (Neptune), Void Fissures or Daily Missions",
      "detonite injector": "Chem Lab Research (Clan Dojo) or Invasions",
      "fieldron": "Energy Lab Research (Clan Dojo) or Invasions",
      "mutagen mass": "Bio Lab Research (Clan Dojo) or Invasions",
      "oxium": "Corpus tilesets (IO on Jupiter - Destroy Oxium Ospreys before they self-destruct)",
      "tellurium": "Railjack Survival or Uranus Submersible missions (Ophelia)",
      "cryotic": "Excavation Missions (Hieracon on Pluto is ideal)"
    },
    es: {
      "orokin cell": "Ceres, Saturno, Deimos (Los jefes de asesinato tienen mayor probabilidad)",
      "orokin cells": "Ceres, Saturno, Deimos (Los jefes de asesinato tienen mayor probabilidad)",
      "argon crystal": "Vacío (Misiones de Captura/Exterminio - ¡Atención: expira en 24h!)",
      "argon crystals": "Vacío (Misiones de Captura/Exterminio - ¡Atención: expira en 24h!)",
      "neurodes": "Tierra, Eris, Deimos, Lua (Mariana en la Tierra o supervivencia en Deimos)",
      "neural sensors": "Júpiter, Fortaleza Kuva (Alator en Júpiter es una buena opción)",
      "morphics": "Mercurio, Marte, Fobos, Europa, Plutón (Jefes en Marte)",
      "control module": "Vacío, Europa, Neptuno (Muy común en el Vacío)",
      "control modules": "Vacío, Europa, Neptuno (Muy común en el Vacío)",
      "gallium": "Marte, Urano (Assur en Urano)",
      "plastids": "Saturno, Urano, Fobos, Plutón, Eris (Piscinas en Saturno o Assur en Urano son excelentes)",
      "polymer bundle": "Mercurio, Venus, Urano (Supervivencia Ophelia en Urano)",
      "polymer bundles": "Mercurio, Venus, Urano (Supervivencia Ophelia en Urano)",
      "nano spores": "Saturno, Neptuno, Eris, Deimos (Supervivencia en Deimos o Eris)",
      "ferrite": "Mercurio, Tierra, Neptuno, Vacío",
      "alloy plate": "Venus, Fobos, Ceres, Júpiter, Plutón, Sedna",
      "rubedo": "Tierra, Fobos, Europa, Plutón, Sedna, Vacío (El Vacío es muy bueno)",
      "salvage": "Marte, Júpiter, Sedna",
      "credits": "El Índice (Neptuno), Fisuras del Vacío o Misiones Diarias",
      "detonite injector": "Investigación del Laboratorio Químico (Dojo) o Invasiones",
      "fieldron": "Investigación del Laboratorio de Energía (Dojo) o Invasiones",
      "mutagen mass": "Investigación del Laboratorio Biológico (Dojo) o Invasiones",
      "oxium": "Sectores Corpus (IO en Júpiter - Destruye los Halcones de Oxium antes de que se autodestruyan)",
      "tellurium": "Supervivencia en Railjack o misiones sumergibles de Urano (Ophelia)",
      "cryotic": "Misiones de Excavación (Hieracon en Plutón es ideal)"
    },
    ja: {
      "orokin cell": "ケレス、土星、ダイモス（暗殺ボスが最もドロップしやすい）",
      "orokin cells": "ケレス、土星、ダイモス（暗殺ボスが最もドロップしやすい）",
      "argon crystal": "Void（捕獲/掃滅ミッション - 注意: 24時間で消滅します！）",
      "argon crystals": "Void（捕獲/掃滅ミッション - 注意: 24時間で消滅します！）",
      "neurodes": "地球、エリス、ダイモス、ルア（地球のMarianaまたはダイモスの生存）",
      "neural sensors": "木星、クバ要塞（木星のAlatorがおすすめ）",
      "morphics": "水星、火星、フォボス、エウロパ、冥王星（火星のボス）",
      "control module": "Void、エウロパ、海王星（Voidで非常に一般的）",
      "control modules": "Void、エウロパ、海王星（Voidで非常に一般的）",
      "gallium": "火星、天王星（天王星のAssur）",
      "plastids": "土星、天王星、フォボス、冥王星、エリス（土星のPiscinasまたは天王星のAssurが最適）",
      "polymer bundle": "水星、金星、天王星（天王星のOphelia生存）",
      "polymer bundles": "水星、金星、天王星（天王星のOphelia生存）",
      "nano spores": "土星、海王星、エリス、ダイモス（ダイモスまたはエリスの生存）",
      "ferrite": "水星、地球、海王星、Void",
      "alloy plate": "金星、フォボス、ケレス、木星、冥王星、セドナ",
      "rubedo": "地球、フォボス、エウロパ、冥王星、セドナ、Void（Voidが非常におすすめ）",
      "salvage": "火星、木星、セドナ",
      "credits": "インデックス（海王星）、Void亀裂またはデイリーミッション",
      "detonite injector": "化学ラボ研究（クランドージョ）または侵略ミッション",
      "fieldron": "エネルギーラボ研究（クランドージョ）または侵略ミッション",
      "mutagen mass": "バイオラボ研究（クランドージョ）または侵略ミッション",
      "oxium": "コーパスミッション（木星のIO - 自爆前にオキシウム・オスプレイを破壊する）",
      "tellurium": "レールジャック生存または天王星の水中ミッション（Ophelia）",
      "cryotic": "発掘ミッション（冥王星のHieraconが最適）"
    }
  };

  // Helper to determine the best farming node for a Relic
  const getRelicFarmLocation = (relicName) => {
    if (!relicName) return "";
    const name = relicName.toLowerCase();
    if (name.includes("lith")) {
      if (lang === 'pt') return "Hepit (Void - Captura)";
      if (lang === 'es') return "Hepit (Vacío - Captura)";
      if (lang === 'ja') return "Hepit (Void - 捕獲)";
      return "Hepit (Void - Capture)";
    } else if (name.includes("meso")) {
      if (lang === 'pt') return "Ukko (Void - Captura) ou Io (Júpiter - Defesa)";
      if (lang === 'es') return "Ukko (Vacío - Captura) o Io (Júpiter - Defensa)";
      if (lang === 'ja') return "Ukko (Void - 捕獲) または Io (木星 - 防衛)";
      return "Ukko (Void - Capture) or Io (Jupiter - Defense)";
    } else if (name.includes("neo")) {
      if (lang === 'pt') return "Ukko (Void - Captura) ou Ur (Urano - Interrupção)";
      if (lang === 'es') return "Ukko (Vacío - Captura) o Ur (Urano - Interrupción)";
      if (lang === 'ja') return "Ukko (Void - 捕獲) または Ur (天王星 - 撹乱)";
      return "Ukko (Void - Capture) or Ur (Uranus - Disruption)";
    } else if (name.includes("axi")) {
      if (lang === 'pt') return "Apollo (Lua - Interrupção) ou Xini (Eris - Interceptação)";
      if (lang === 'es') return "Apollo (Lua - Interrupción) o Xini (Eris - Interceptación)";
      if (lang === 'ja') return "Apollo (ルア - 撹乱) または Xini (エリス - 傍受)";
      return "Apollo (Lua - Disruption) or Xini (Eris - Interception)";
    } else if (name.includes("requiem")) {
      if (lang === 'pt') return "Sifões ou Inundações de Kuva";
      if (lang === 'es') return "Sifones o Inundaciones de Kuva";
      if (lang === 'ja') return "クバサイフォンまたはクバ氾濫";
      return "Kuva Siphons or Kuva Floods";
    }
    return "";
  };

  // Helper to determine relic class based on name
  const getRelicTierClass = (relicLoc) => {
    if (!relicLoc) return 'relic-default';
    const lower = relicLoc.toLowerCase();
    if (lower.includes('lith')) return 'relic-lith';
    if (lower.includes('meso')) return 'relic-meso';
    if (lower.includes('neo')) return 'relic-neo';
    if (lower.includes('axi')) return 'relic-axi';
    if (lower.includes('requiem')) return 'relic-requiem';
    return 'relic-default';
  };

  // Helper to get Wiki URL (with fallback)
  const getWikiLink = (w) => {
    if (!w) return 'https://warframe.fandom.com/wiki/';
    return w.wikiaUrl || `https://warframe.fandom.com/wiki/${encodeURIComponent((w.name || '').replace(/\s+/g, '_'))}`;
  };

  // Helper to get Image URL (with fallback to CDN)
  const getWeaponImage = (w) => {
    if (!w) return '';
    if (w.wikiaThumbnail) return w.wikiaThumbnail;
    if (w.image) return w.image;
    if (w.imageName) return `https://cdn.warframestat.us/img/${w.imageName}`;
    if (w.name) {
      return `https://cdn.warframestat.us/img/${w.name.toLowerCase().replace(/\s+prime/g, '-prime').replace(/\s+wraith/g, '-wraith').replace(/\s+vandal/g, '-vandal').replace(/\s+/g, '-')}.png`;
    }
    return '';
  };

  const stats = useMemo(() => {
    let totalCount = weapons.length;
    let ownedCount = 0;
    let masteredCount = 0;
    let primaryCount = 0;
    let primaryMastered = 0;
    let secondaryCount = 0;
    let secondaryMastered = 0;
    let meleeCount = 0;
    let meleeMastered = 0;
    let warframeCount = 0;
    let warframeMastered = 0;
    let companionCount = 0;
    let companionMastered = 0;
    let nemesisCount = 0;
    let nemesisMastered = 0;
    let weaponMasteryPoints = 0;

    weapons.forEach(e => {
      if (!e || !e.name) return;
      let o = inventory[e.id] || inventory[e.name] || { owned: false, mastered: false };
      if (o.owned) ownedCount++;
      if (o.mastered) {
        masteredCount++;
        if (e.type === 'Warframe' || e.type === 'Companion' || e.type === 'Archwing') {
          weaponMasteryPoints += 6000;
        } else if (e.isNemesis) {
          weaponMasteryPoints += 4000;
        } else {
          weaponMasteryPoints += 3000;
        }
      }
      if (e.isNemesis) {
        nemesisCount++;
        if (o.mastered) nemesisMastered++;
      }
      if (e.type === 'Primary') {
        primaryCount++;
        if (o.mastered) primaryMastered++;
      } else if (e.type === 'Secondary') {
        secondaryCount++;
        if (o.mastered) secondaryMastered++;
      } else if (e.type === 'Melee') {
        meleeCount++;
        if (o.mastered) meleeMastered++;
      } else if (e.type === 'Warframe') {
        warframeCount++;
        if (o.mastered) warframeMastered++;
      } else if (e.type === 'Companion') {
        companionCount++;
        if (o.mastered) companionMastered++;
      }
    });

    // Calculate Star Chart Mastery XP
    const normalCompletedNodes = starChartPlanets.reduce((acc, p) => acc + getPlanetCompletedNodesCount(p.id, starChartNormal), 0);
    const steelPathCompletedNodes = starChartPlanets.reduce((acc, p) => acc + getPlanetCompletedNodesCount(p.id, starChartSteelPath), 0);
    const railjackCompletedNodes = railjackProximas.reduce((acc, p) => acc + getPlanetCompletedNodesCount(p.id, railjackCompletion), 0);
    const normalNodesXp = Math.min(27519, Math.round((normalCompletedNodes / 252) * 27519));
    const steelPathNodesXp = Math.min(27519, Math.round((steelPathCompletedNodes / 252) * 27519));
    const railjackXp = railjackCompletedNodes * 100;
    const starChartNodesXp = normalNodesXp + steelPathNodesXp + railjackXp;
    const junctionsXp = (starChartJunctions || []).length * 1000;
    
    const totalMasteryPoints = weaponMasteryPoints + starChartNodesXp + junctionsXp;

    let currentRankXP = getMasteryPointsRequired(masteryRank);
    let nextRankXP = getMasteryPointsRequired(masteryRank + 1);
    let diff = nextRankXP - currentRankXP;
    let pointsInCurrent = Math.max(0, totalMasteryPoints - currentRankXP);
    let progressPercent = Math.min(100, (pointsInCurrent / diff) * 100);
    let pointsToNextRank = Math.max(0, nextRankXP - totalMasteryPoints);
    let weaponsToNextRank = Math.ceil(pointsToNextRank / 3000);

    return {
      totalCount,
      ownedCount,
      masteredCount,
      weaponMasteryPoints: totalMasteryPoints,
      rawItemMasteryPoints: weaponMasteryPoints,
      starChartXp: starChartNodesXp,
      starChartNodesXp,
      junctionsXp,
      normalCompletedNodes,
      steelPathCompletedNodes,
      railjackCompletedNodes,
      progressPercent,
      pointsToNextRank,
      weaponsToNextRank,
      primaryCount,
      primaryMastered,
      secondaryCount,
      secondaryMastered,
      meleeCount,
      meleeMastered,
      warframeCount,
      warframeMastered,
      companionCount,
      companionMastered,
      nemesisCount,
      nemesisMastered
    };
  }, [weapons, inventory, masteryRank, starChartNormal, starChartSteelPath, starChartJunctions, railjackCompletion]);

  const filteredWeapons = useMemo(() => {
    return weapons.filter(w => {
      const state = inventory[w.id] || inventory[w.name] || { owned: false, mastered: false };
      
      const localizedSource = getLocalizedSource(w.source, lang) || "";
      const matchesSearch = 
        (w.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (w.source || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        localizedSource.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesType = filterType === 'all' || w.type === filterType;
      
      let matchesStatus = true;
      if (filterStatus === 'mastered') {
        matchesStatus = state.mastered;
      } else if (filterStatus === 'notMastered') {
        matchesStatus = !state.mastered;
      } else if (filterStatus === 'owned') {
        matchesStatus = state.owned && !state.mastered;
      } else if (filterStatus === 'notOwned') {
        matchesStatus = !state.owned && !state.mastered;
      }
      
      let matchesVault = true;
      if (filterVault === 'vaulted') {
        matchesVault = w.vaulted;
      } else if (filterVault === 'obtainable') {
        matchesVault = !w.vaulted;
      }
      
      const matchesMR = !hideLockedByMR || w.masteryReq <= masteryRank;

      // MODULE 4: Dojo filter — hide weapons whose lab is not researched
      let matchesDojo = true;
      if (hideUnresearched) {
        const labKey = getDojoLabKey(w.source);
        if (labKey && dojoResearch[labKey] === false) {
          matchesDojo = false;
        }
      }
      
      return matchesSearch && matchesType && matchesStatus && matchesVault && matchesMR && matchesDojo;
    }).sort((a, b) => {
      if (sortBy === 'name-asc') {
        return (a.name || '').localeCompare(b.name || '');
      }
      if (sortBy === 'name-desc') {
        return (b.name || '').localeCompare(a.name || '');
      }
      if (sortBy === 'mr-asc') {
        if (a.masteryReq !== b.masteryReq) return a.masteryReq - b.masteryReq;
        return (a.name || '').localeCompare(b.name || '');
      }
      if (sortBy === 'mr-desc') {
        if (a.masteryReq !== b.masteryReq) return b.masteryReq - a.masteryReq;
        return (a.name || '').localeCompare(b.name || '');
      }
      if (sortBy === 'mastered-first') {
        const stateA = inventory[a.id] || inventory[a.name] || { owned: false, mastered: false };
        const stateB = inventory[b.id] || inventory[b.name] || { owned: false, mastered: false };
        const scoreA = stateA.mastered ? 2 : (stateA.owned ? 1 : 0);
        const scoreB = stateB.mastered ? 2 : (stateB.owned ? 1 : 0);
        if (scoreA !== scoreB) return scoreB - scoreA;
        return (a.name || '').localeCompare(b.name || '');
      }
      if (sortBy === 'unmastered-first') {
        const stateA = inventory[a.id] || inventory[a.name] || { owned: false, mastered: false };
        const stateB = inventory[b.id] || inventory[b.name] || { owned: false, mastered: false };
        const scoreA = stateA.mastered ? 2 : (stateA.owned ? 1 : 0);
        const scoreB = stateB.mastered ? 2 : (stateB.owned ? 1 : 0);
        if (scoreA !== scoreB) return scoreA - scoreB;
        return (a.name || '').localeCompare(b.name || '');
      }
      return 0;
    });
  }, [weapons, inventory, searchQuery, filterType, filterStatus, filterVault, hideLockedByMR, masteryRank, sortBy, lang, hideUnresearched, dojoResearch]);

  // --- MODS MEMOS ---
  const filteredMods = useMemo(() => {
    let list = [...mods];
    if (modSearch) {
      const q = modSearch.toLowerCase();
      list = list.filter(m => 
        (m.name || '').toLowerCase().includes(q) || 
        (m.description || '').toLowerCase().includes(q)
      );
    }
    if (modFilterRarity !== 'all') {
      list = list.filter(m => (m.rarity || '').toLowerCase() === modFilterRarity.toLowerCase());
    }
    if (modFilterType !== 'all') {
      const typeLower = modFilterType.toLowerCase();
      list = list.filter(m => (m.type || '').toLowerCase().includes(typeLower));
    }
    if (modFilterStatus !== 'all') {
      list = list.filter(m => {
        const key = m.uniqueName || m.name;
        const obtained = !!modInventory[key]?.obtained;
        return modFilterStatus === 'obtained' ? obtained : !obtained;
      });
    }
    list.sort((a, b) => {
      if (modSortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
      if (modSortBy === 'name-desc') return (b.name || '').localeCompare(a.name || '');
      if (modSortBy === 'drain-asc') return (a.baseDrain || 0) - (b.baseDrain || 0);
      if (modSortBy === 'drain-desc') return (b.baseDrain || 0) - (a.baseDrain || 0);
      if (modSortBy === 'rank-asc') return (a.fusionLimit || 0) - (b.fusionLimit || 0);
      if (modSortBy === 'rank-desc') return (b.fusionLimit || 0) - (a.fusionLimit || 0);
      return 0;
    });
    return list;
  }, [mods, modSearch, modFilterRarity, modFilterType, modFilterStatus, modSortBy, modInventory]);

  const modStats = useMemo(() => {
    const totalCount = mods.length;
    const obtainedCount = Object.values(modInventory).filter(x => x.obtained).length;
    const progressPercent = totalCount > 0 ? (obtainedCount / totalCount) * 100 : 0;
    return { totalCount, obtainedCount, progressPercent };
  }, [mods, modInventory]);

  // --- RECOMMENDATIONS (PLANNER) ---
  const plannerRecommendations = useMemo(() => {
    const readyToMaster = [];
    const easyToGet = [];
    const bossAndQuests = [];
    const voidRelics = [];
    const missionDrops = [];
    const nemesisWeapons = [];

    weapons.forEach(w => {
      if (!w || !w.name) return;
      const state = inventory[w.id] || inventory[w.name] || { owned: false, mastered: false };
      
      // If already mastered, don't recommend
      if (state.mastered) return;

      // Filter by current mastery rank (must be equipable)
      if (w.masteryReq > masteryRank) return;

      if (state.owned) {
        readyToMaster.push(w);
      } else {
        if (w.isNemesis) {
          nemesisWeapons.push(w);
        } else if (
          w.source === "Market / Dojo Research" ||
          w.source === "Dojo Chem Lab" ||
          w.source === "Dojo Bio Lab" ||
          w.source === "Dojo Energy Lab" ||
          w.source === "Dojo Tenno Lab" ||
          w.source === "Dojo Bash Lab" ||
          w.source === "Dojo Dagath Hollow" ||
          w.source === "Market Credits" ||
          w.source === "Market Blueprint"
        ) {
          easyToGet.push(w);
        } else if (
          w.source === "Boss Drops / Dojo / Quests" ||
          w.source === "Boss Vor Drop" ||
          w.source === "Boss Ceres Drop" ||
          w.source === "Quest (Broken War)" ||
          w.source === "Quest"
        ) {
          bossAndQuests.push(w);
        } else if (w.source === "Void Relics" || w.source === "Void Relics (Vaulted)") {
          voidRelics.push(w);
        } else {
          missionDrops.push(w);
        }
      }
    });

    const sortRecommendations = (list) => {
      const difficultyWeights = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
      return list.sort((a, b) => {
        const diffA = difficultyWeights[a.difficulty] || 2;
        const diffB = difficultyWeights[b.difficulty] || 2;
        if (diffA !== diffB) return diffA - diffB;
        if (a.masteryReq !== b.masteryReq) return a.masteryReq - b.masteryReq;
        return (a.name || '').localeCompare(b.name || '');
      });
    };

    return {
      readyToMaster: sortRecommendations(readyToMaster),
      easyToGet: sortRecommendations(easyToGet).slice(0, 8),
      bossAndQuests: sortRecommendations(bossAndQuests).slice(0, 8),
      voidRelics: sortRecommendations(voidRelics).slice(0, 8),
      missionDrops: sortRecommendations(missionDrops).slice(0, 8),
      nemesisWeapons: sortRecommendations(nemesisWeapons).slice(0, 8)
    };
  }, [weapons, inventory, masteryRank]);

  // --- EXPORT JSON ---
  const handleExportData = () => {
    const exportObject = {
      generator: "Warframe Inventory Tracker",
      version: "1.0",
      username,
      platform,
      masteryRank,
      inventory,
      syndicates,
      modInventory,
      starChartNormal,
      starChartSteelPath,
      starChartJunctions,
      railjackCompletion,
      arcanes: arcaneInventory,
      warframeShards
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportObject, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `warframe_tracker_${username.toLowerCase()}_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const analyzeImportData = (jsonText) => {
    setSyncStatus(null);
    try {
      const parsed = JSON.parse(jsonText);
      
      if (!parsed || typeof parsed !== 'object') {
        const invalidJsonError = lang === 'pt'
          ? 'Formato JSON inválido.'
          : lang === 'es'
          ? 'Formato JSON no válido.'
          : lang === 'ja'
          ? '無効なJSONフォーマットです。'
          : 'Invalid JSON format.';
        throw new Error(invalidJsonError);
      }

      // Direct TennoTracker backup format
      if (parsed.inventory && typeof parsed.inventory === 'object') {
        const weaponsCount = Object.keys(parsed.inventory).length;
        const modsCount = parsed.modInventory ? Object.keys(parsed.modInventory).length : 0;
        const syndicatesCount = parsed.syndicates ? Object.keys(parsed.syndicates).length : 0;
        const arcanesCount = parsed.arcanes ? Object.keys(parsed.arcanes).length : 0;
        
        return {
          type: 'direct',
          username: parsed.username || '',
          platform: parsed.platform || 'PC',
          masteryRank: parsed.masteryRank || 1,
          weaponsCount,
          modsCount,
          syndicatesCount,
          arcanesCount,
          rawData: parsed
        };
      } else {
        // Smart importer for AlecaFrame or generic JSON array/object
        const newInventory = { ...inventory };
        let importCount = 0;

        const scanObject = (obj) => {
          if (!obj) return;
          if (Array.isArray(obj)) {
            obj.forEach(item => {
              if (typeof item === 'string') {
                const found = weapons.find(w => w.name.toLowerCase() === item.toLowerCase() || w.id.toLowerCase() === item.toLowerCase());
                if (found) {
                  const key = found.id || found.name;
                  newInventory[key] = { owned: true, mastered: true };
                  importCount++;
                }
              } else if (item && typeof item === 'object') {
                scanObject(item);
              }
            });
          } else if (typeof obj === 'object') {
            if (obj.name && typeof obj.name === 'string') {
              const found = weapons.find(w => w.name.toLowerCase() === obj.name.toLowerCase() || w.id.toLowerCase() === obj.name.toLowerCase());
              if (found) {
                const key = found.id || found.name;
                const isMastered = obj.mastered !== undefined ? !!obj.mastered : (obj.mastery === 30 || obj.rank === 30 || true);
                newInventory[key] = { owned: true, mastered: isMastered };
                importCount++;
              }
            }
            Object.keys(obj).forEach(key => {
              const found = weapons.find(w => w.name.toLowerCase() === key.toLowerCase() || w.id.toLowerCase() === key.toLowerCase());
              if (found) {
                const itemKey = found.id || found.name;
                const val = obj[key];
                const isMastered = typeof val === 'object' ? (val.mastered || val.rank === 30) : !!val;
                newInventory[itemKey] = { owned: true, mastered: isMastered };
                importCount++;
              }
              scanObject(obj[key]);
            });
          }
        };

        scanObject(parsed);
        
        if (importCount > 0) {
          return {
            type: 'smart',
            username: parsed.username || username || '',
            platform: parsed.platform || platform || 'PC',
            masteryRank: parsed.masteryRank || masteryRank || 1,
            weaponsCount: importCount,
            modsCount: 0,
            syndicatesCount: 0,
            rawData: {
              inventory: newInventory,
              username: parsed.username || username,
              platform: parsed.platform || platform,
              masteryRank: parsed.masteryRank || masteryRank
            }
          };
        } else {
          const noItemsError = lang === 'pt'
            ? 'Nenhum item conhecido encontrado no JSON importado. Certifique-se de que os nomes coincidem.'
            : lang === 'es'
            ? 'No se encontraron objetos conocidos en el JSON importado. Asegúrese de que los nombres coinciden.'
            : lang === 'ja'
            ? 'インポートされたJSONに既知のアイテムが見つかりません。名前が一致しているか確認してください。'
            : 'No known items found in the imported JSON. Make sure the names match.';
          throw new Error(noItemsError);
        }
      }
    } catch (err) {
      const errorLabel = lang === 'pt' ? 'Erro ao importar JSON' : lang === 'es' ? 'Error al importar JSON' : lang === 'ja' ? 'JSONインポートエラー' : 'Error importing JSON';
      setSyncStatus({ type: 'error', message: `${errorLabel}: ${err.message}` });
      return null;
    }
  };

  const handleImportAttempt = (jsonText) => {
    const preview = analyzeImportData(jsonText);
    if (preview) {
      setImportPreview(preview);
    }
  };

  const handleImportData = (e) => {
    e.preventDefault();
    handleImportAttempt(importJson);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      handleImportAttempt(text);
    };
    reader.onerror = () => {
      const readErrorMsg = lang === 'pt' 
        ? 'Erro ao ler o arquivo selecionado.' 
        : lang === 'es' 
        ? 'Error al leer el archivo seleccionado.' 
        : lang === 'ja' 
        ? '選択したファイルの読み込みエラー。' 
        : 'Error reading the selected file.';
      setSyncStatus({ type: 'error', message: readErrorMsg });
    };
    reader.readAsText(file);
  };



  return (
    <>
      <SpaceParticlesCanvas />
      {/* HEADER */}
      <header className="app-header">
        <div className="header-container">
          <div className="logo-section">
            <Swords className="glow-cyan" size={28} style={{ color: 'var(--cyan)' }} />
            <h1>TennoTracker</h1>
          </div>

          <nav className="main-nav">
            <button 
              className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={16} /> {t.nav.dashboard}
            </button>
            <button 
              className={`nav-btn ${activeTab === 'weapons' ? 'active' : ''}`}
              onClick={() => setActiveTab('weapons')}
            >
              <Swords size={16} /> {t.nav.weapons}
            </button>
            <button 
              className={`nav-btn ${activeTab === 'mods' ? 'active' : ''}`}
              onClick={() => setActiveTab('mods')}
            >
              <LayoutGrid size={16} /> {t.nav.mods || (lang === 'pt' ? 'Mods' : 'Mods')}
            </button>
            <button 
              className={`nav-btn ${activeTab === 'starchart' ? 'active' : ''}`}
              onClick={() => setActiveTab('starchart')}
            >
              <MapIcon size={16} /> {t.nav.starchart || (lang === 'pt' ? 'Mapa Estelar' : 'Star Chart')}
            </button>
            <button 
              className={`nav-btn ${activeTab === 'junctions' ? 'active' : ''}`}
              onClick={() => setActiveTab('junctions')}
            >
              <Milestone size={16} /> {t.nav.junctions || (lang === 'pt' ? 'Terminais' : 'Junctions')}
            </button>
            <button 
              className={`nav-btn ${activeTab === 'syndicates' ? 'active' : ''}`}
              onClick={() => setActiveTab('syndicates')}
            >
              <Users size={16} /> {t.nav.syndicates}
            </button>
            <button 
              className={`nav-btn ${activeTab === 'planner' ? 'active' : ''}`}
              onClick={() => setActiveTab('planner')}
            >
              <TrendingUp size={16} /> {t.nav.planner}
            </button>
            <button 
              className={`nav-btn ${activeTab === 'nemesis' ? 'active' : ''}`}
              onClick={() => setActiveTab('nemesis')}
            >
              <Award size={16} /> {t.nav.nemesis}
            </button>
            <button 
              className={`nav-btn ${activeTab === 'sync' ? 'active' : ''}`}
              onClick={() => setActiveTab('sync')}
            >
              <Database size={16} /> {t.nav.sync}
            </button>
          </nav>

          {/* LANGUAGE SELECTOR */}
          <div className="header-controls">
            {[
              {code:'pt', flag:'🇧🇷'},
              {code:'en', flag:'🇺🇸'},
              {code:'es', flag:'🇪🇸'},
              {code:'ja', flag:'🇯🇵'}
            ].map(({code, flag}) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                title={code.toUpperCase()}
                style={{
                  background: lang === code ? 'rgba(204,163,75,0.25)' : 'rgba(255,255,255,0.04)',
                  border: lang === code ? '2px solid var(--gold)' : '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '0.25rem 0.4rem',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  lineHeight: 1,
                  transition: 'all 0.2s ease',
                  transform: lang === code ? 'scale(1.15)' : 'scale(1)',
                  filter: lang === code ? 'drop-shadow(0 0 6px var(--gold))' : 'none'
                }}
              >
                {flag}
              </button>
            ))}

            {/* DISCORD BUTTON */}
            <a
              href="https://discord.gg/R9a3n9KMsn"
              target="_blank"
              rel="noopener noreferrer"
              className="discord-btn"
              title={lang === 'pt' ? 'Entrar no Discord' : 'Join Discord'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                background: 'rgba(88, 101, 242, 0.12)',
                border: '1px solid rgba(88, 101, 242, 0.45)',
                borderRadius: '6px',
                padding: '0.45rem 0.85rem',
                color: '#5865F2',
                fontFamily: 'var(--font-display)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textDecoration: 'none',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                marginLeft: '0.5rem',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#5865F2';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(88, 101, 242, 0.45)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(88, 101, 242, 0.12)';
                e.currentTarget.style.color = '#5865F2';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 127.14 96.36"
                fill="currentColor"
                style={{ display: 'block' }}
              >
                <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.4-5c.87-.64,1.71-1.32,2.51-2a75.46,75.46,0,0,0,72.63,0c.8.71,1.64,1.39,2.51,2a68.43,68.43,0,0,1-10.4,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31-18.83C129.92,50.75,123.63,27.87,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
              </svg>
              <span>DISCORD</span>
            </a>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="main-content">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="tab-pane-fade">
            {/* USER PROFILE & STATS PANEL */}
            <div className="mastery-panel glass-panel">
              <div className="mastery-header">
                <div className="profile-summary-container">
                  <div 
                    onClick={() => setShowAvatarModal(true)}
                    style={{ 
                      width: '64px', 
                      height: '64px', 
                      borderRadius: '50%', 
                      border: '2px solid var(--cyan)', 
                      cursor: 'pointer',
                      color: GLYPHS[userAvatar]?.color || 'var(--cyan)',
                      boxShadow: '0 0 12px var(--cyan-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}
                    className="avatar-container-hover"
                    title={t.general.avatarLabel}
                  >
                    {GLYPHS[userAvatar]?.svg || GLYPHS['excalibur'].svg}
                  </div>

                  <div className="profile-info-container">
                    <h2 className="glow-purple profile-title">
                      {t.dashboard.profile}
                    </h2>
                    <div className="user-profile-row">
                      <div className="username-input-wrapper">
                        <input 
                          type="text" 
                          value={username}
                          onChange={(e) => {
                            const newName = e.target.value;
                            setUsername(newName);
                            setIsAutoDetected(false); // Reset visual auto-detect tag on manual edit
                            if (newName) {
                              const savedInv = localStorage.getItem(`wf_inventory_${newName}`);
                              if (savedInv) setInventory(JSON.parse(savedInv));
                              else setInventory({});
                              
                              const savedMR = localStorage.getItem(`wf_mastery_rank_${newName}`);
                              if (savedMR) setMasteryRank(Number(savedMR));
                              else setMasteryRank(1);
                              
                              const savedSynd = localStorage.getItem(`wf_syndicates_${newName}`);
                              if (savedSynd) setSyndicates(JSON.parse(savedSynd));
                              else setSyndicates({
                                'steel_meridian': { rank: 0, standing: 0 },
                                'arbiters_hexis': { rank: 0, standing: 0 },
                                'cephalon_suda': { rank: 0, standing: 0 },
                                'perrin_sequence': { rank: 0, standing: 0 },
                                'red_veil': { rank: 0, standing: 0 },
                                'new_loka': { rank: 0, standing: 0 }
                              });
                              
                              const savedMods = localStorage.getItem(`wf_mod_inventory_${newName}`);
                              if (savedMods) setModInventory(JSON.parse(savedMods));
                              else setModInventory({});
                            }
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid var(--border-color)',
                            color: 'var(--text-bright)',
                            fontSize: '1.15rem',
                            fontWeight: '700',
                            outline: 'none',
                            padding: '0.1rem 2rem 0.1rem 0.2rem',
                            width: '100%'
                          }}
                          title={lang === 'pt' ? "Nome de usuário do Warframe" :
                                 lang === 'es' ? "Nombre de usuario de Warframe" :
                                 lang === 'ja' ? "Warframe de usuário no jogo" :
                                 "Warframe username"}
                        />
                        {isAutoDetected && (
                          <UserCheck 
                            size={16} 
                            style={{ color: 'var(--cyan)', position: 'absolute', right: '0.25rem' }} 
                            title={lang === 'pt' ? "Sincronizado automaticamente com o jogo (EE.log)" :
                                   lang === 'es' ? "Sincronizado automáticamente con el juego (EE.log)" :
                                   lang === 'ja' ? "実行中のゲームと自動同期 (EE.log)" :
                                   "Auto-synced with running game (EE.log)"}
                          />
                        )}
                      </div>
                      
                      <div className="profile-selects-container">
                        <select 
                          value={platform} 
                          onChange={(e) => setPlatform(e.target.value)}
                          className="mr-select platform-select-el"
                        >
                          <option value="PC">PC</option>
                          <option value="XBOX">XBOX</option>
                          <option value="PSN">PLAYSTATION</option>
                          <option value="NINTENDO">SWITCH</option>
                        </select>

                        <select
                          value={uiTheme}
                          onChange={(e) => setUiTheme(e.target.value)}
                          className="mr-select theme-select-el"
                          title={t.general.themeLabel}
                        >
                          <option value="orokin">⚜️ Orokin</option>
                          <option value="lotus">🌸 Lotus</option>
                          <option value="corpus">🟦 Corpus</option>
                          <option value="grineer">🟥 Grineer</option>
                          <option value="infested">☣️ Infested</option>
                        </select>
                      </div>
                    </div>
                    {isAutoDetected && (
                      <div className="auto-detect-badge">
                        ✓ {t.general.autoDetected}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mr-selector-wrapper">
                  <label htmlFor="mr-selector">{t.dashboard.mastery}:</label>
                  <select 
                    id="mr-selector"
                    value={masteryRank} 
                    onChange={(e) => setMasteryRank(Number(e.target.value))}
                    className="mr-select"
                  >
                    {[...Array(30)].map((_, i) => (
                      <option key={i+1} value={i+1}>MR {i+1} - {getRankName(i+1)}</option>
                    ))}
                    <option value={31}>L1 - Legendary 1</option>
                    <option value={32}>L2 - Legendary 2</option>
                    <option value={33}>L3 - Legendary 3</option>
                    <option value={34}>L4 - Legendary 4</option>
                  </select>
                </div>
              </div>

              {/* Progress toward next MR */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span>{t.dashboard.nextRank} {getRankName(masteryRank + 1)}</span>
                  <span className="glow-cyan" style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>
                    <AnimatedCounter value={stats.progressPercent} decimals={1} suffix="%" />
                  </span>
                </div>
                <div className="mastery-progress-bar-container">
                  <div className="mastery-progress-bar-fill" style={{ width: `${stats.progressPercent}%` }}></div>
                  <span className="progress-text-absolute">
                    {stats.weaponMasteryPoints.toLocaleString()} / {getMasteryPointsRequired(masteryRank + 1).toLocaleString()} XP
                  </span>
                </div>
                <div className="mastery-meta">
                  <span>{t.dashboard.xpAccum}: <strong>{stats.weaponMasteryPoints.toLocaleString()} XP</strong></span>
                  {stats.pointsToNextRank > 0 ? (
                    <span>{t.dashboard.needXp} <strong>{stats.pointsToNextRank.toLocaleString()} XP</strong> (~{stats.weaponsToNextRank} {t.dashboard.needXpSuffix}</span>
                  ) : (
                    <span style={{ color: 'var(--color-owned)' }}>{t.dashboard.rankReady}</span>
                  )}
                </div>
              </div>
            </div>

            {/* QUICK STATS CARDS */}
            <div className="stats-grid">
              <div className="stat-card glass-panel">
                <div className="stat-icon" style={{ color: 'var(--cyan)' }}>
                  <TrendingUp size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-label">{t.dashboard.stats}</div>
                  <div className="stat-value">
                    <AnimatedCounter value={stats.masteredCount} /> <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {stats.totalCount}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    <AnimatedCounter value={(stats.masteredCount / stats.totalCount) * 100 || 0} decimals={1} suffix="%" /> {t.dashboard.masteredOf}
                  </div>
                </div>
              </div>

              <div className="stat-card glass-panel">
                <div className="stat-icon" style={{ color: 'var(--color-owned)' }}>
                  <Check size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-label">{t.dashboard.weaponsOwned}</div>
                  <div className="stat-value">
                    <AnimatedCounter value={stats.ownedCount} /> <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {stats.totalCount}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {t.dashboard.readyToLevel}: <AnimatedCounter value={stats.ownedCount - stats.masteredCount} />
                  </div>
                </div>
              </div>

              <div className="stat-card glass-panel">
                <div className="stat-icon" style={{ color: 'var(--purple)' }}>
                  <Award size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-label">{t.dashboard.mastery}</div>
                  <div className="stat-value">
                    {getRankName(Math.floor(Math.sqrt(stats.weaponMasteryPoints / 2500)) || 1)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {t.dashboard.estimatedRank}
                  </div>
                </div>
              </div>

              <div className="stat-card glass-panel" style={{ borderTop: '2px solid #991b1b' }}>
                <div className="stat-icon" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                  <Swords size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-label">{t.dashboard.nemesisProgress}</div>
                  <div className="stat-value">
                    <AnimatedCounter value={stats.nemesisMastered} /> <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {stats.nemesisCount}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {t.dashboard.nemesisSub}
                  </div>
                </div>
              </div>
            </div>

            {/* CATEGORIES PROGRESS SECTION */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', textTransform: 'uppercase', color: 'var(--purple)' }}>
                {t.dashboard.categoryProgress}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Warframes */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span>Warframes ({stats.warframeMastered} / {stats.warframeCount})</span>
                    <span>{((stats.warframeMastered / stats.warframeCount) * 100 || 0).toFixed(0)}%</span>
                  </div>
                  <div className="mastery-progress-bar-container" style={{ height: '12px' }}>
                    <div className="mastery-progress-bar-fill warframe-progress-fill" style={{ width: `${(stats.warframeMastered / stats.warframeCount) * 100 || 0}%` }}></div>
                  </div>
                </div>

                {/* Primaries */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span>{t.dashboard.primaryWeapons} ({stats.primaryMastered} / {stats.primaryCount})</span>
                    <span>{((stats.primaryMastered / stats.primaryCount) * 100 || 0).toFixed(0)}%</span>
                  </div>
                  <div className="mastery-progress-bar-container" style={{ height: '12px' }}>
                    <div className="mastery-progress-bar-fill" style={{ width: `${(stats.primaryMastered / stats.primaryCount) * 100 || 0}%` }}></div>
                  </div>
                </div>

                {/* Secondaries */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span>{t.dashboard.secondaryWeapons} ({stats.secondaryMastered} / {stats.secondaryCount})</span>
                    <span>{((stats.secondaryMastered / stats.secondaryCount) * 100 || 0).toFixed(0)}%</span>
                  </div>
                  <div className="mastery-progress-bar-container" style={{ height: '12px' }}>
                    <div className="mastery-progress-bar-fill" style={{ width: `${(stats.secondaryMastered / stats.secondaryCount) * 100 || 0}%` }}></div>
                  </div>
                </div>

                {/* Melees */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span>{t.dashboard.meleeWeapons} ({stats.meleeMastered} / {stats.meleeCount})</span>
                    <span>{((stats.meleeMastered / stats.meleeCount) * 100 || 0).toFixed(0)}%</span>
                  </div>
                  <div className="mastery-progress-bar-container" style={{ height: '12px' }}>
                    <div className="mastery-progress-bar-fill" style={{ width: `${(stats.meleeMastered / stats.meleeCount) * 100 || 0}%` }}></div>
                  </div>
                </div>

                {/* Companions */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span>{lang === 'pt' ? 'Companheiros' : lang === 'es' ? 'Compañeros' : lang === 'ja' ? 'センチネル/ペット' : 'Companions'} ({stats.companionMastered} / {stats.companionCount})</span>
                    <span>{((stats.companionMastered / stats.companionCount) * 100 || 0).toFixed(0)}%</span>
                  </div>
                  <div className="mastery-progress-bar-container" style={{ height: '12px' }}>
                    <div className="mastery-progress-bar-fill companion-progress-fill" style={{ width: `${(stats.companionMastered / stats.companionCount) * 100 || 0}%` }}></div>
                  </div>
                </div>

                {/* Star Chart Nodes */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span>{t.nav.starchart || (lang === 'pt' ? 'Mapa Estelar' : 'Star Chart')} ({stats.starChartNodesXp.toLocaleString()} / 58,438 XP)</span>
                    <span>{((stats.starChartNodesXp / 58438) * 100 || 0).toFixed(0)}%</span>
                  </div>
                  <div className="mastery-progress-bar-container" style={{ height: '12px' }}>
                    <div className="mastery-progress-bar-fill starchart-progress-fill" style={{ width: `${(stats.starChartNodesXp / 58438) * 100 || 0}%` }}></div>
                  </div>
                </div>

                {/* Junctions */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span>{t.nav.junctions || (lang === 'pt' ? 'Terminais' : 'Junctions')} ({stats.junctionsXp.toLocaleString()} / 13,000 XP)</span>
                    <span>{((stats.junctionsXp / 13000) * 100 || 0).toFixed(0)}%</span>
                  </div>
                  <div className="mastery-progress-bar-container" style={{ height: '12px' }}>
                    <div className="mastery-progress-bar-fill junctions-progress-fill" style={{ width: `${(stats.junctionsXp / 13000) * 100 || 0}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* MODULE 1: WORLD CYCLES */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div className="module-section-header">
                <Globe size={18} style={{ color: 'var(--cyan)' }} />
                <span className="module-section-title">{t.cycles?.title || 'World Cycles'}</span>
                <div className="module-section-divider" />
                <button
                  onClick={fetchWorldCycles}
                  className="btn-secondary"
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  title="Refresh"
                >
                  <RefreshCw size={12} />
                </button>
              </div>
              {!worldCycles ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                  {t.cycles?.loading || 'Loading...'}
                </div>
              ) : (
                (() => {
                  const extrapolated = getExtrapolatedCycles(worldCycles);
                  if (!extrapolated) return null;
                  
                  const cetus = extrapolated.cetus;
                  const vallis = extrapolated.vallis;
                  const cambion = extrapolated.cambion;
                  const baro = extrapolated.baro;
                  
                  return (
                    <div className="cycles-grid">
                      {/* Cetus */}
                      <div className="cycle-card-premium">
                        <div className="cycle-card-info">
                          <div>
                            <span className="cycle-title">
                              {t.cycles?.cetus || 'Cetus'}
                            </span>
                            <h4 className="cycle-state">
                              {cetus.isDay ? (t.cycles?.day || 'Day') : (t.cycles?.night || 'Night')}
                            </h4>
                          </div>
                          <div>
                            <div className="cycle-timer" style={{ color: cetus.isDay ? 'var(--gold)' : 'var(--cyan)' }}>
                              {formatCountdown(cetus.extrapolatedRemaining)}
                            </div>
                            <span className="cycle-subtitle">{t.cycles?.timeLeft || 'Time Remaining'}</span>
                          </div>
                        </div>
                        <div className="cycle-card-visual-panel">
                          {cetus.isDay ? (
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-day-sun">
                              <circle cx="12" cy="12" r="5" fill="#f59e0b" fillOpacity="0.3" />
                              <line x1="12" y1="1" x2="12" y2="3" />
                              <line x1="12" y1="21" x2="12" y2="23" />
                              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                              <line x1="1" y1="12" x2="3" y2="12" />
                              <line x1="21" y1="12" x2="23" y2="12" />
                              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                          ) : (
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-night-stars">
                              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#6366f1" fillOpacity="0.3" />
                              <circle cx="18" cy="5" r="1" fill="#fff" stroke="none" />
                              <circle cx="6" cy="18" r="1.2" fill="#fff" stroke="none" />
                              <circle cx="20" cy="19" r="0.8" fill="#fff" stroke="none" />
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Orb Vallis */}
                      <div className="cycle-card-premium">
                        <div className="cycle-card-info">
                          <div>
                            <span className="cycle-title">
                              {t.cycles?.vallis || 'Orb Vallis'}
                            </span>
                            <h4 className="cycle-state">
                              {vallis.isWarm ? (t.cycles?.warm || 'Warm') : (t.cycles?.cold || 'Cold')}
                            </h4>
                          </div>
                          <div>
                            <div className="cycle-timer" style={{ color: vallis.isWarm ? '#ef4444' : '#06b6d4' }}>
                              {formatCountdown(vallis.extrapolatedRemaining)}
                            </div>
                            <span className="cycle-subtitle">{t.cycles?.timeLeft || 'Time Remaining'}</span>
                          </div>
                        </div>
                        <div className="cycle-card-visual-panel">
                          {vallis.isWarm ? (
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-warm-thermometer">
                              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" fill="#ef4444" fillOpacity="0.3" />
                              <circle cx="11.5" cy="17.5" r="2.5" fill="#ef4444" />
                              <path d="M11.5 8.5v6" stroke="#ef4444" strokeWidth="2" />
                            </svg>
                          ) : (
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-cold-snowflake">
                              <line x1="12" y1="2" x2="12" y2="22" />
                              <line x1="2" y1="12" x2="22" y2="12" />
                              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                              <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
                              <path d="M10 4l2 2 2-2M10 20l2-2 2 2M20 10l-2 2 2 2M4 10l2 2-2 2" />
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Cambion Drift */}
                      <div className="cycle-card-premium">
                        <div className="cycle-card-info">
                          <div>
                            <span className="cycle-title">
                              {t.cycles?.cambion || 'Cambion Drift'}
                            </span>
                            <h4 className="cycle-state" style={{ textTransform: 'capitalize' }}>
                              {cambion.state === 'fass' ? (t.cycles?.fass || 'Fass') : (t.cycles?.vome || 'Vome')}
                            </h4>
                          </div>
                          <div>
                            <div className="cycle-timer" style={{ color: cambion.state === 'fass' ? '#f97316' : '#3b82f6' }}>
                              {formatCountdown(cambion.extrapolatedRemaining)}
                            </div>
                            <span className="cycle-subtitle">{t.cycles?.timeLeft || 'Time Remaining'}</span>
                          </div>
                        </div>
                        <div className="cycle-card-visual-panel">
                          {cambion.state === 'fass' ? (
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" className="svg-drift-fass">
                              <circle cx="12" cy="12" r="5" fill="#f97316" fillOpacity="0.3" />
                              <circle cx="6" cy="7" r="2" fill="#ea580c" stroke="none" />
                              <circle cx="17" cy="6" r="2.5" fill="#ea580c" stroke="none" />
                              <circle cx="8" cy="17" r="1.5" fill="#ea580c" stroke="none" />
                              <circle cx="16" cy="15" r="2" fill="#ea580c" stroke="none" />
                            </svg>
                          ) : (
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" className="svg-drift-vome">
                              <circle cx="12" cy="12" r="5" fill="#3b82f6" fillOpacity="0.3" />
                              <circle cx="7" cy="6" r="1.5" fill="#2563eb" stroke="none" />
                              <circle cx="17" cy="16" r="2" fill="#2563eb" stroke="none" />
                              <path d="M12 12c-2-2-4-1-5-5" stroke="#2563eb" strokeWidth="1.5" />
                              <path d="M12 12c2 2 4 1 5 4" stroke="#2563eb" strokeWidth="1.5" />
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Baro Ki'Teer */}
                      <div className="cycle-card-premium baro-card">
                        <div className="cycle-card-info">
                          <div>
                            <span className="cycle-title">
                              💎 {t.cycles?.baro || "Baro Ki'Teer"}
                            </span>
                            <h4 className="cycle-state" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={baro.location}>
                              {baro.active ? (t.cycles?.active || 'Active') : (t.cycles?.inactive || 'Inactive')}
                              {baro.active && baro.location && <span style={{ fontSize: '0.75rem', color: 'var(--cyan)', marginLeft: '0.25rem' }}>· {baro.location}</span>}
                            </h4>
                          </div>
                          <div>
                            <div className="cycle-timer" style={{ color: baro.active ? 'var(--gold)' : 'var(--text-muted)' }}>
                              {formatCountdown(baro.extrapolatedRemaining)}
                            </div>
                            <span className="cycle-subtitle">
                              {baro.active ? (t.cycles?.leaves || 'Leaves in') : (t.cycles?.arrives || 'Arrives in')}
                            </span>
                          </div>
                        </div>
                        <div className="cycle-card-visual-panel">
                          {baro.active ? (
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" className="svg-void-portal">
                              <circle cx="12" cy="12" r="9" strokeWidth="1" strokeDasharray="3 3" />
                              <path d="M12 3a9 9 0 0 1 9 9M12 21a9 9 0 0 1-9-9" strokeWidth="2.5" />
                              <path d="M12 9a3 3 0 0 1 3 3" strokeWidth="2" fill="#a855f7" fillOpacity="0.4" />
                            </svg>
                          ) : (
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" className="svg-void-portal-inactive">
                              <circle cx="12" cy="12" r="9" strokeDasharray="4 4" />
                              <circle cx="12" cy="12" r="5" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            {/* MODULE 2: MR SIMULATOR */}
            <div className="glass-panel mr-simulator">
              <div className="module-section-header">
                <Target size={18} style={{ color: 'var(--cyan)' }} />
                <span className="module-section-title">{t.mrSim?.title || 'MR Simulator'}</span>
                <div className="module-section-divider" />
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {t.mrSim?.desc || 'Calculate items needed to reach your target Mastery Rank.'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.mrSim?.targetMR || 'Target MR'}:</label>
                  <select
                    value={simTargetMR}
                    onChange={(e) => setSimTargetMR(Number(e.target.value))}
                    className="mr-select"
                    style={{ minWidth: '120px' }}
                  >
                    {[...Array(30)].map((_, i) => (
                      <option key={i+1} value={i+1}>MR {i+1} — {getRankName(i+1)}</option>
                    ))}
                    <option value={31}>L1 — Legendary 1</option>
                    <option value={32}>L2 — Legendary 2</option>
                  </select>
                </div>
              </div>
              {(() => {
                const currentXP = stats.weaponMasteryPoints;
                const targetXP = getMasteryPointsRequired(simTargetMR);
                const currentRankXP = getMasteryPointsRequired(masteryRank);
                const xpGap = Math.max(0, targetXP - currentXP);
                const warframesNeeded = Math.ceil(xpGap / 6000);
                const weaponsNeeded = Math.ceil(xpGap / 3000);
                const alreadyThere = xpGap === 0;
                return alreadyThere ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--color-owned)', fontSize: '1rem', fontWeight: '600' }}>
                    ✅ {t.mrSim?.alreadyThere || 'Already at this rank!'}
                  </div>
                ) : (
                  <>
                    <div className="mr-simulator-grid">
                      <div className="mr-sim-stat">
                        <span className="mr-sim-stat-value">{xpGap.toLocaleString()}</span>
                        <div className="mr-sim-stat-label">{t.mrSim?.xpGap || 'XP Remaining'}</div>
                      </div>
                      <div className="mr-sim-stat">
                        <span className="mr-sim-stat-value" style={{ color: 'var(--gold)' }}>{targetXP.toLocaleString()}</span>
                        <div className="mr-sim-stat-label">{t.mrSim?.xpNeeded || 'Target XP'}</div>
                      </div>
                    </div>
                    <div className="mr-sim-items">
                      <div className="mr-sim-item-card">
                        <span className="mr-sim-item-icon">🎭</span>
                        <div>
                          <div className="mr-sim-item-count">{warframesNeeded}</div>
                          <div className="mr-sim-item-desc">{t.mrSim?.warframesNeeded || 'Warframes (6,000 XP)'}</div>
                        </div>
                      </div>
                      <div className="mr-sim-item-card">
                        <span className="mr-sim-item-icon">⚔️</span>
                        <div>
                          <div className="mr-sim-item-count">{weaponsNeeded}</div>
                          <div className="mr-sim-item-desc">{t.mrSim?.weaponsNeeded || 'Weapons (3,000 XP)'}</div>
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                      💡 {t.mrSim?.mixed || 'Or a mix of weapons and Warframes'}
                    </p>
                  </>
                );
              })()}
            </div>

            {/* MODULE 6: SHARE CARD BUTTON */}
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Share2 size={16} style={{ color: 'var(--gold)' }} />
                  <span style={{ fontWeight: '700', color: 'var(--text-bright)', fontSize: '0.95rem' }}>
                    {t.shareCard?.title || 'Profile Share Card'}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {t.shareCard?.desc || 'Generate a shareable summary of your profile stats.'}
                </p>
              </div>
              <button className="btn-primary" onClick={() => setShowShareCard(true)}>
                {t.shareCard?.generate || 'Generate Card'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: ARSENAL & CHECKLIST */}
        {activeTab === 'weapons' && (
          <div className="tab-pane-fade">
            {/* TOOLBAR FILTERS */}
            <div className="toolbar">
              <div className="search-input-wrapper">
                <Search className="search-icon-svg" size={18} />
                <input 
                  type="text" 
                  placeholder={t.arsenal.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="all">{t.arsenal.allTiers}</option>
                <option value="Warframe">Warframes</option>
                <option value="Primary">{lang === 'pt' ? 'Primárias' : lang === 'es' ? 'Primarias' : lang === 'ja' ? 'プライマリ' : 'Primary'}</option>
                <option value="Secondary">{lang === 'pt' ? 'Secundárias' : lang === 'es' ? 'Secundarias' : lang === 'ja' ? 'セカンダリ' : 'Secondary'}</option>
                <option value="Melee">{lang === 'pt' ? 'Corpo a Corpo' : lang === 'es' ? 'Cuerpo a Cuerpo' : lang === 'ja' ? '近接' : 'Melee'}</option>
                <option value="Archwing">{lang === 'pt' ? 'Archwing' : lang === 'es' ? 'Archwing' : lang === 'ja' ? 'アーチウイング' : 'Archwing'}</option>
                <option value="Arch-Gun">{lang === 'pt' ? 'Arch-Gun' : lang === 'es' ? 'Arch-Gun' : lang === 'ja' ? 'アーチガン' : 'Arch-Gun'}</option>
                <option value="Arch-Melee">{lang === 'pt' ? 'Arch-Melee' : lang === 'es' ? 'Arch-Melee' : lang === 'ja' ? 'アーチ近接' : 'Arch-Melee'}</option>
                <option value="Amp">{lang === 'pt' ? 'Amp' : lang === 'es' ? 'Amp' : lang === 'ja' ? 'アンプ' : 'Amp'}</option>
                <option value="Companion">{lang === 'pt' ? 'Companheiro' : lang === 'es' ? 'Compañero' : lang === 'ja' ? 'センチネル/ペット' : 'Companion'}</option>
              </select>

              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">{t.arsenal.statusOptions.all}</option>
                <option value="owned">{t.arsenal.statusOptions.owned}</option>
                <option value="notOwned">{t.arsenal.statusOptions.notOwned}</option>
                <option value="mastered">{t.arsenal.statusOptions.mastered}</option>
                <option value="notMastered">{t.arsenal.statusOptions.notMastered}</option>
              </select>

              <select 
                value={filterVault} 
                onChange={(e) => setFilterVault(e.target.value)}
                className="filter-select"
              >
                <option value="all">{t.arsenal.vaultOptions.all}</option>
                <option value="obtainable">{t.arsenal.vaultOptions.obtainable}</option>
                <option value="vaulted">{t.arsenal.vaultOptions.vaulted}</option>
              </select>

              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name-asc">{t.arsenal.sortNameAz}</option>
                <option value="name-desc">{t.arsenal.sortNameZa}</option>
                <option value="mr-asc">{t.arsenal.sortMrAsc}</option>
                <option value="mr-desc">{t.arsenal.sortMrDesc}</option>
                <option value="mastered-first">{t.arsenal.sortMastered}</option>
                <option value="unmastered-first">{t.arsenal.sortUnmastered}</option>
                <option value="vaulted-first">{t.arsenal.sortVaulted}</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', padding: '0 0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={hideLockedByMR} 
                  onChange={(e) => setHideLockedByMR(e.target.checked)} 
                  style={{ cursor: 'pointer' }}
                />
                {t.arsenal.hideLocked}
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={hideUnresearched} 
                  onChange={(e) => setHideUnresearched(e.target.checked)} 
                  style={{ cursor: 'pointer' }}
                />
                {t.dojo?.filterLabel || 'Esconder armas não pesquisadas no Dojo'}
              </label>

              <div style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {filteredWeapons.length} {t.arsenal.itemsFound}
              </div>
            </div>

            {filteredWeapons.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <AlertCircle size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
                <h3>{t.arsenal.noItems}</h3>
                <p style={{ marginTop: '0.5rem' }}>{t.arsenal.noItemsSub}</p>
              </div>
            ) : (
              <div className="weapons-grid">
                {filteredWeapons.map((w, idx) => {
                  const state = inventory[w.id] || inventory[w.name] || { owned: false, mastered: false };
                  const isLocked = w.masteryReq > masteryRank;

                  return (
                    <div 
                      key={w.id} 
                      className={`weapon-card glass-panel ${state.mastered ? 'mastered' : (state.owned ? 'owned' : '')}`}
                      style={{
                        opacity: isLocked ? 0.8 : 1,
                        borderColor: isLocked ? 'rgba(239, 68, 68, 0.15)' : '',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        animationDelay: `${Math.min(idx, 20) * 0.03}s`
                      }}
                    >
                      <div>
                        {/* Weapon Image Container */}
                        <div className="weapon-card-img-container" onClick={() => setSelectedWeapon(w)}>
                          <img 
                            src={getWeaponImage(w)} 
                            alt={w.name} 
                            className="weapon-card-img"
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          {/* Top tags over image */}
                          <div className="weapon-badge-tags">
                            {state.mastered && <span className="tag-status mastered" title={t.arsenal.tagMastered}>🏆 {t.arsenal.tagMastered}</span>}
                            {state.owned && !state.mastered && <span className="tag-status owned" title={t.arsenal.tagOwned}>📦 {t.arsenal.tagOwned}</span>}
                            {w.vaulted && <span className="tag-vaulted">Vaulted</span>}
                          </div>
                        </div>

                        <div className="weapon-card-header" style={{ marginTop: '0.75rem' }}>
                          <div>
                            <h4 
                              className="weapon-name"
                              onClick={() => setSelectedWeapon(w)}
                            >
                              {w.name}
                            </h4>
                            <span className="weapon-type-badge">{w.type}</span>
                          </div>
                          <div 
                            className="weapon-mr-badge"
                            style={{ 
                              color: isLocked ? 'var(--color-vaulted)' : 'var(--text-bright)',
                              borderColor: isLocked ? 'var(--color-vaulted)' : '',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.2rem'
                            }}
                            title={isLocked ? `Bloqueado: Requer Rank de Maestria ${w.masteryReq}` : `Requer MR ${w.masteryReq}`}
                          >
                            {isLocked ? <Lock size={10} /> : <Unlock size={10} />}
                            MR {w.masteryReq}
                          </div>
                        </div>

                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                          <strong>{t.nemesis.origin}:</strong> {getLocalizedSource(w.source, lang)}
                        </p>

                        {/* Inline stats panel if expanded */}
                        {expandedCards[w.id] && (
                          <div className="weapon-expanded-stats-panel">
                            <div className="weapon-quick-stats-grid">
                              {w.type === 'Warframe' ? (
                                <>
                                  <div className="weapon-quick-stat-item">
                                    <span className="weapon-quick-stat-label">{lang === 'pt' ? 'Vida' : 'Health'}</span>
                                    <span className="weapon-quick-stat-val">{w.health || '-'}</span>
                                  </div>
                                  <div className="weapon-quick-stat-item">
                                    <span className="weapon-quick-stat-label">{lang === 'pt' ? 'Escudo' : 'Shield'}</span>
                                    <span className="weapon-quick-stat-val">{w.shield || '-'}</span>
                                  </div>
                                  <div className="weapon-quick-stat-item">
                                    <span className="weapon-quick-stat-label">{lang === 'pt' ? 'Armadura' : 'Armor'}</span>
                                    <span className="weapon-quick-stat-val">{w.armor || '-'}</span>
                                  </div>
                                  <div className="weapon-quick-stat-item">
                                    <span className="weapon-quick-stat-label">{lang === 'pt' ? 'Energia' : 'Power'}</span>
                                    <span className="weapon-quick-stat-val">{w.power || '-'}</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="weapon-quick-stat-item">
                                    <span className="weapon-quick-stat-label">{lang === 'pt' ? 'Dano' : lang === 'es' ? 'Daño' : lang === 'ja' ? 'ダメージ' : 'Damage'}</span>
                                    <span className="weapon-quick-stat-val">{w.damage?.total || '-'}</span>
                                  </div>
                                  <div className="weapon-quick-stat-item">
                                    <span className="weapon-quick-stat-label">{lang === 'pt' ? 'Crítico' : lang === 'es' ? 'Crítico' : lang === 'ja' ? 'クリティカル' : 'Crit'}</span>
                                    <span className="weapon-quick-stat-val">
                                      {w.critChance !== undefined ? `${(w.critChance * 100).toFixed(0)}%` : '-'}
                                    </span>
                                  </div>
                                  <div className="weapon-quick-stat-item">
                                    <span className="weapon-quick-stat-label">{lang === 'pt' ? 'Mult. Crítico' : lang === 'es' ? 'Mult. Crítico' : lang === 'ja' ? '倍率' : 'Crit Mult'}</span>
                                    <span className="weapon-quick-stat-val">
                                      {w.critMultiplier !== undefined ? `${Number(w.critMultiplier).toFixed(1)}x` : '-'}
                                    </span>
                                  </div>
                                  <div className="weapon-quick-stat-item">
                                    <span className="weapon-quick-stat-label">Status</span>
                                    <span className="weapon-quick-stat-val">
                                      {w.statusChance !== undefined ? `${(w.statusChance * 100).toFixed(0)}%` : '-'}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="weapon-quick-drop-source">
                              <span className="weapon-quick-drop-label">{lang === 'pt' ? 'Como Obter' : lang === 'es' ? 'Cómo Obtener' : lang === 'ja' ? '入手方法' : 'How to Obtain'}</span>
                              <div className="weapon-quick-drop-content">
                                {w.drops && w.drops.length > 0 ? (
                                  <span className="glow-cyan" style={{ fontSize: '0.7rem' }}>
                                    {getLocalizedDropText(w.drops[0], lang, w.name)}
                                  </span>
                                ) : (
                                  <span style={{ fontSize: '0.7rem' }}>
                                    {getLocalizedSource(w.source, lang)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="weapon-actions" style={{ marginTop: '0.75rem' }}>
                        <button 
                          className={`action-btn ${state.owned ? 'owned-active' : ''}`}
                          onClick={() => handleToggleOwned(w.name, w.id)}
                          title={t.modal.markOwned}
                          style={{ flex: 1 }}
                        >
                          {t.modal.markOwned}
                        </button>
                        <button 
                          className={`action-btn ${state.mastered ? 'mastered-active' : ''}`}
                          onClick={() => handleToggleMastered(w.name, w.id)}
                          title={t.modal.markMastered}
                          style={{ flex: 1 }}
                        >
                          {t.modal.markMastered}
                        </button>
                        <button
                          className="info-btn"
                          onClick={(e) => { e.stopPropagation(); setSelectedWeapon(w); }}
                          title={t.general?.info || 'Info'}
                          style={{
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            color: 'var(--text-bright)',
                            padding: '0.4rem 0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Info size={14} />
                        </button>
                        <button
                          className={`chevron-btn ${expandedCards[w.id] ? 'expanded' : ''}`}
                          onClick={(e) => { e.stopPropagation(); toggleCardExpanded(w.id); }}
                          title={expandedCards[w.id] ? (lang === 'pt' ? 'Recolher Atributos' : 'Collapse Stats') : (lang === 'pt' ? 'Ver Atributos Rápidos' : 'Expand Quick Stats')}
                          style={{
                            background: expandedCards[w.id] ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                            border: expandedCards[w.id] ? '1px solid var(--cyan)' : '1px solid var(--border-color)',
                            borderRadius: '6px',
                            color: expandedCards[w.id] ? 'var(--cyan)' : 'var(--text-bright)',
                            padding: '0.4rem 0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {expandedCards[w.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB: MODS CATALOG */}
        {activeTab === 'mods' && (
          <div className="tab-pane-fade">
            {/* SUB-TABS SELECTOR */}
            <div className="sub-tabs-container" style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginBottom: '1.5rem', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)', 
              paddingBottom: '0.5rem' 
            }}>
              <button 
                onClick={() => setModsSubTab('mods')}
                className={`sub-tab-btn ${modsSubTab === 'mods' ? 'active' : ''}`}
                style={{
                  background: 'none',
                  border: 'none',
                  color: modsSubTab === 'mods' ? 'var(--gold)' : 'var(--text-muted)',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem',
                  borderBottom: modsSubTab === 'mods' ? '2px solid var(--gold)' : '2px solid transparent',
                  transition: 'all var(--transition-fast)'
                }}
              >
                ✨ Mods
              </button>
              <button 
                onClick={() => setModsSubTab('arcanes')}
                className={`sub-tab-btn ${modsSubTab === 'arcanes' ? 'active' : ''}`}
                style={{
                  background: 'none',
                  border: 'none',
                  color: modsSubTab === 'arcanes' ? 'var(--gold)' : 'var(--text-muted)',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem',
                  borderBottom: modsSubTab === 'arcanes' ? '2px solid var(--gold)' : '2px solid transparent',
                  transition: 'all var(--transition-fast)'
                }}
              >
                🔮 {lang === 'pt' ? 'Arcanos' : 'Arcanes'}
              </button>
            </div>

            {modsSubTab === 'mods' ? (
              <div style={{ display: 'contents' }}>
                {/* TOOLBAR FILTERS */}
                <div className="toolbar">
              <div className="search-input-wrapper">
                <Search className="search-icon-svg" size={18} />
                <input 
                  type="text" 
                  placeholder={lang === 'pt' ? "Buscar mods por nome ou descrição..." : "Search mods by name or description..."}
                  value={modSearch}
                  onChange={(e) => setModSearch(e.target.value)}
                  className="search-input"
                />
              </div>

              <select 
                value={modFilterRarity} 
                onChange={(e) => setModFilterRarity(e.target.value)}
                className="filter-select"
              >
                <option value="all">{lang === 'pt' ? "Todas as Raridades" : "All Rarities"}</option>
                <option value="common">{lang === 'pt' ? "Comum" : "Common"}</option>
                <option value="uncommon">{lang === 'pt' ? "Incomum" : "Uncommon"}</option>
                <option value="rare">{lang === 'pt' ? "Raro" : "Rare"}</option>
                <option value="legendary">{lang === 'pt' ? "Lendário" : "Legendary"}</option>
                <option value="riven">Riven</option>
                <option value="peculiar">Peculiar</option>
              </select>

              <select 
                value={modFilterType} 
                onChange={(e) => setModFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="all">{lang === 'pt' ? "Todos os Tipos" : "All Types"}</option>
                <option value="warframe">Warframe</option>
                <option value="rifle">Rifle</option>
                <option value="shotgun">{lang === 'pt' ? "Escopeta" : "Shotgun"}</option>
                <option value="pistol">{lang === 'pt' ? "Pistola" : "Pistol"}</option>
                <option value="melee">{lang === 'pt' ? "Corpo a Corpo" : "Melee"}</option>
                <option value="aura">Aura</option>
                <option value="stance">{lang === 'pt' ? "Postura" : "Stance"}</option>
                <option value="companion">{lang === 'pt' ? "Companheiro" : "Companion"}</option>
              </select>

              <select 
                value={modFilterStatus} 
                onChange={(e) => setModFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">{lang === 'pt' ? "Todos os Mods" : "All Status"}</option>
                <option value="obtained">{lang === 'pt' ? "Obtidos (✔)" : "Obtained (✔)"}</option>
                <option value="unobtained">{lang === 'pt' ? "Não Obtidos (❌)" : "Not Obtained (❌)"}</option>
              </select>

              <select 
                value={modSortBy} 
                onChange={(e) => setModSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name-asc">{t.arsenal.sortNameAz || "Nome (A-Z)"}</option>
                <option value="name-desc">{t.arsenal.sortNameZa || "Nome (Z-A)"}</option>
                <option value="drain-asc">{lang === 'pt' ? "Dreno (Menor)" : "Drain (Asc)"}</option>
                <option value="drain-desc">{lang === 'pt' ? "Dreno (Maior)" : "Drain (Desc)"}</option>
                <option value="rank-asc">{lang === 'pt' ? "Rank Max (Menor)" : "Max Rank (Asc)"}</option>
                <option value="rank-desc">{lang === 'pt' ? "Rank Max (Maior)" : "Max Rank (Desc)"}</option>
              </select>
            </div>

            {/* PROGRESS BAR */}
            <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: '600' }}>{lang === 'pt' ? "Coleção de Mods" : "Mods Collection"}</span>
                <span className="glow-cyan" style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>
                  {modStats.obtainedCount} / {modStats.totalCount} ({modStats.progressPercent.toFixed(1)}%)
                </span>
              </div>
              <div className="mastery-progress-bar-container" style={{ height: '10px' }}>
                <div 
                  className="mastery-progress-bar-fill" 
                  style={{ 
                    width: `${modStats.progressPercent}%`,
                    background: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)'
                  }}
                ></div>
              </div>
            </div>

            {/* RESULTS COUNT */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {filteredMods.length} {lang === 'pt' ? "mods encontrados" : "mods found"}
              </span>
            </div>

            {/* MODS GRID */}
            {loadingMods ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <RefreshCw className="svg-day-sun" size={48} style={{ color: 'var(--cyan)' }} />
                <p style={{ marginTop: '1rem' }}>{lang === 'pt' ? "Carregando catálogo de mods..." : "Loading mods catalog..."}</p>
              </div>
            ) : filteredMods.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <AlertCircle size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
                <h3>{lang === 'pt' ? "Nenhum mod encontrado" : "No mods found"}</h3>
                <p style={{ marginTop: '0.5rem' }}>{lang === 'pt' ? "Tente ajustar seus critérios de busca ou filtros." : "Try adjusting your search criteria or filters."}</p>
              </div>
            ) : (
              <div style={{ display: 'contents' }}>
                <div className="weapons-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))' }}>
                {filteredMods.slice(0, visibleModsCount).map((m, idx) => {
                  const key = m.uniqueName || m.name;
                  const state = modInventory[key] || { obtained: false };
                  const rarityClass = `rarity-${(m.rarity || 'common').toLowerCase()}`;
                  
                  return (
                    <div 
                      key={key} 
                      className={`mod-card ${rarityClass} ${state.obtained ? 'obtained' : ''}`}
                      onClick={() => setSelectedMod(m)}
                      style={{ cursor: 'pointer', animationDelay: `${Math.min(idx, 20) * 0.03}s` }}
                    >
                      <div className="card-shine" />
                      <div className="mod-card-top">
                        <span className="mod-drain-badge">⬡ {m.baseDrain}</span>
                        {m.polarity && (
                          <span className="mod-polarity-icon" title={`Polaridade: ${getPolarityName(m.polarity, lang)}`}>
                            {renderPolarityIcon(m.polarity, 14)}
                          </span>
                        )}
                      </div>

                      <div className="mod-card-img-container">
                        {m.wikiaThumbnail && !imgErrors[key] ? (
                          <img 
                            src={m.wikiaThumbnail} 
                            alt={m.name} 
                            className="mod-card-img" 
                            loading="lazy" 
                            onError={(e) => {
                              if (e.target.src.endsWith('Mod.png')) {
                                e.target.src = e.target.src.replace('Mod.png', '.png');
                              } else if (m.imageName && !e.target.src.includes('cdn.warframestat.us')) {
                                e.target.src = `https://cdn.warframestat.us/img/${m.imageName}`;
                              } else {
                                setImgErrors(prev => ({ ...prev, [key]: true }));
                              }
                            }}
                          />
                        ) : m.imageName && !imgErrors[key] ? (
                          <img 
                            src={`https://cdn.warframestat.us/img/${m.imageName}`} 
                            alt={m.name} 
                            className="mod-card-img" 
                            loading="lazy" 
                            onError={(e) => {
                              setImgErrors(prev => ({ ...prev, [key]: true }));
                            }}
                          />
                        ) : (
                          <div className="mod-card-img-placeholder">
                            <span className="mod-card-placeholder-question-mark">?</span>
                          </div>
                        )}
                      </div>

                      <div className="mod-card-mid">
                        <div className="mod-card-name">{m.name}</div>
                        <div className="mod-card-summary">
                          {renderFormattedDescription(m.description) || (lang === 'pt' ? 'Nenhuma descrição disponível' : 'No description available')}
                        </div>
                      </div>

                      <div className="mod-card-bottom">
                        {renderFusionStars(m.fusionLimit)}
                        <span className="mod-card-type-label">
                          {m.type}
                        </span>
                        <div className="mod-card-actions">
                          <button
                            className={`mod-btn-obtained ${state.obtained ? 'is-obtained' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleModObtained(m.name, m.uniqueName);
                            }}
                          >
                            {state.obtained ? `✔ ${lang === 'pt' ? 'Obtido' : 'Obtained'}` : (lang === 'pt' ? 'Marcar Obtido' : 'Mark Obtained')}
                          </button>
                          <button
                            className="mod-btn-info"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMod(m);
                            }}
                            title={lang === 'pt' ? 'Detalhes' : 'Details'}
                          >
                            <Info size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {filteredMods.length > visibleModsCount && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', marginBottom: '1rem' }}>
                  <button 
                    className="btn-secondary" 
                    onClick={() => setVisibleModsCount(prev => prev + 80)}
                    style={{ padding: '0.65rem 2.5rem', fontSize: '0.85rem' }}
                  >
                    {lang === 'pt' ? 'Carregar Mais' : 'Load More'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
              <div>
                {/* ARCANES TOOLBAR */}
                <div className="toolbar" style={{ marginBottom: '1.5rem' }}>
                  <div className="search-input-wrapper">
                    <Search className="search-icon-svg" size={18} />
                    <input 
                      type="text" 
                      placeholder={lang === 'pt' ? "Buscar arcanos..." : "Search arcanes..."}
                      value={arcaneSearch}
                      onChange={(e) => setArcaneSearch(e.target.value)}
                      className="search-input"
                    />
                  </div>

                  <select 
                    value={arcaneFilterCategory} 
                    onChange={(e) => setArcaneFilterCategory(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">{lang === 'pt' ? "Todas as Categorias" : "All Categories"}</option>
                    <option value="Warframe">Warframe</option>
                    <option value="Primary">{lang === 'pt' ? "Primária" : "Primary"}</option>
                    <option value="Secondary">{lang === 'pt' ? "Secundária" : "Secondary"}</option>
                    <option value="Operator">Operator</option>
                  </select>
                </div>

                {/* ARCANES GRID */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.25rem'
                }}>
                  {fallbackArcanes
                    .filter(a => {
                      const matchesSearch = a.name.toLowerCase().includes(arcaneSearch.toLowerCase()) || 
                                            a.description.toLowerCase().includes(arcaneSearch.toLowerCase());
                      const matchesCategory = arcaneFilterCategory === 'all' || a.category === arcaneFilterCategory;
                      return matchesSearch && matchesCategory;
                    })
                    .map(a => {
                      const currentRank = arcaneInventory[a.id] || 0; // Rank 0 (not owned) to Rank 5 (maxed)
                      
                      // Mastery-like card design
                      let rarityColor = a.rarity === 'Legendary' ? 'var(--gold)' : a.rarity === 'Rare' ? '#a855f7' : '#3b82f6';
                      
                      // Calculate required copies
                      const copyCounts = [0, 1, 3, 6, 10, 21];
                      const currentCopies = copyCounts[currentRank];

                      const handleRankChange = (newRank) => {
                        setArcaneInventory(prev => {
                          const copy = { ...prev };
                          if (newRank === 0) {
                            delete copy[a.id];
                          } else {
                            copy[a.id] = newRank;
                          }
                          return copy;
                        });
                      };

                      return (
                        <div key={a.id} className="arcane-card glass-panel" style={{
                          padding: '1.25rem',
                          borderTop: `3px solid ${rarityColor}`,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          position: 'relative'
                        }}>
                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            {a.imageName && (
                              <img 
                                src={`https://cdn.warframestat.us/img/${a.imageName}`} 
                                alt={a.name}
                                style={{ width: '48px', height: '48px', objectFit: 'contain', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', padding: '2px', border: '1px solid rgba(255,255,255,0.06)' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            )}
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                                <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-bright)' }}>{a.name}</h4>
                                <span style={{ 
                                  fontSize: '0.65rem', 
                                  padding: '0.15rem 0.35rem', 
                                  borderRadius: '3px', 
                                  background: 'rgba(255,255,255,0.05)', 
                                  color: rarityColor,
                                  textTransform: 'uppercase',
                                  fontWeight: 700,
                                  whiteSpace: 'nowrap'
                                }}>{a.category}</span>
                              </div>
                              <p style={{ 
                                fontSize: '0.75rem', 
                                color: 'var(--text-muted)', 
                                margin: '0.5rem 0 0 0',
                                lineHeight: '1.3' 
                              }}>{a.description}</p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                {lang === 'pt' ? 'Rank Atual:' : 'Current Rank:'} <strong style={{ color: currentRank === 5 ? 'var(--gold)' : 'var(--text-bright)', fontSize: '0.8rem' }}>{currentRank === 0 ? 'N/A' : `Rank ${currentRank}`}</strong>
                              </span>
                              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                {currentRank > 0 && `(${currentCopies} ${lang === 'pt' ? 'cópias' : 'copies'})`}
                              </span>
                            </div>

                            {/* Rank selector button dots */}
                            <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', justifyContent: 'space-between' }}>
                              <button 
                                onClick={() => handleRankChange(0)}
                                style={{
                                  background: currentRank === 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.02)',
                                  border: `1px solid ${currentRank === 0 ? '#ef4444' : 'rgba(255,255,255,0.05)'}`,
                                  color: currentRank === 0 ? '#ef4444' : 'var(--text-muted)',
                                  fontSize: '0.65rem',
                                  padding: '0.2rem 0.4rem',
                                  borderRadius: '3px',
                                  cursor: 'pointer'
                                }}
                              >
                                {lang === 'pt' ? 'Nenhum' : 'None'}
                              </button>
                              {[1, 2, 3, 4, 5].map((rank) => (
                                <button
                                  key={rank}
                                  onClick={() => handleRankChange(rank)}
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: currentRank >= rank ? 'var(--accent)' : 'rgba(255,255,255,0.02)',
                                    border: `1px solid ${currentRank >= rank ? 'var(--accent-light)' : 'rgba(255,255,255,0.08)'}`,
                                    color: currentRank >= rank ? '#000' : 'var(--text-muted)',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  {rank}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MASTERY PLANNER */}
        {activeTab === 'planner' && (() => {
          const hasAnyRecommendations = 
            plannerRecommendations.readyToMaster.length > 0 ||
            plannerRecommendations.easyToGet.length > 0 ||
            plannerRecommendations.bossAndQuests.length > 0 ||
            plannerRecommendations.voidRelics.length > 0 ||
            plannerRecommendations.missionDrops.length > 0;

          const renderSection = (title, list, isReadySection = false) => {
            if (list.length === 0) return null;
            return (
              <div className="planner-section">
                <div className="planner-section-header">
                  <h3 className="planner-section-title">
                    {isReadySection ? '📦 ' : '⚡ '}
                    {title}
                  </h3>
                  <span className="planner-section-count">
                    {list.length} {lang === 'pt' ? (list.length === 1 ? 'item' : 'itens') :
                                   lang === 'es' ? (list.length === 1 ? 'objeto' : 'objetos') :
                                   lang === 'ja' ? '件' :
                                   (list.length === 1 ? 'item' : 'items')}
                  </span>
                </div>
                <div className="suggestions-list">
                  {list.map((w, idx) => {
                    const state = inventory[w.id] || inventory[w.name] || { owned: false, mastered: false };
                    return (
                      <div 
                        key={w.id} 
                        className={`suggestion-row ${isReadySection ? 'ready-to-master-row' : ''}`}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span className="glow-gold" style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: 'var(--gold)', fontWeight: 'bold', minWidth: '24px' }}>
                            #{idx + 1}
                          </span>
                          <img 
                            src={getWeaponImage(w)} 
                            alt={w.name} 
                            style={{ width: '45px', height: '45px', objectFit: 'contain', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                          <div className="suggestion-details">
                            <span className="suggestion-name">{w.name}</span>
                            <div className="suggestion-meta">
                              <span>{t.planner.category}: <strong>{w.type}</strong></span>
                              <span>{t.planner.requirement}: <strong>MR {w.masteryReq}</strong></span>
                              <span>{t.planner.difficulty}: <strong style={{ color: w.difficulty === 'Easy' ? 'var(--color-owned)' : (w.difficulty === 'Medium' ? 'var(--gold)' : 'var(--color-vaulted)') }}>{w.difficulty === 'Easy' ? t.planner.diffEasy : w.difficulty === 'Medium' ? t.planner.diffMed : t.planner.diffHard}</strong></span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            <strong>{t.planner.howToGet}:</strong> {getLocalizedSource(w.source, lang)}
                          </div>

                          <span className="suggestion-action-badge">
                            +{w.type === 'Warframe' || w.type === 'Companion' || w.type === 'Archwing' ? '6000' : '3000'} XP
                          </span>

                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              className="btn-secondary" 
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                              onClick={() => setSelectedWeapon(w)}
                            >
                              <Info size={12} /> {t.general.info}
                            </button>
                            
                            {!state.owned && (
                              <button 
                                className="btn-secondary" 
                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderColor: 'var(--color-owned)', color: 'var(--color-owned)' }}
                                onClick={() => handleToggleOwned(w.name, w.id)}
                              >
                                {t.planner.markOwned}
                              </button>
                            )}

                            <button 
                              className="btn-primary" 
                              style={{ 
                                padding: '0.35rem 0.75rem', 
                                fontSize: '0.75rem',
                                background: isReadySection ? 'linear-gradient(135deg, var(--color-owned) 0%, #059669 100%)' : '' 
                              }}
                              onClick={() => handleSetAllMasteredState(w.name, w.id, true)}
                            >
                              <Check size={12} /> {t.planner.markMastered}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          };

          return (
            <div className="planner-panel glass-panel tab-pane-fade">
              <div className="planner-intro">
                <h2 className="glow-cyan" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                  {t.planner.title}
                </h2>
                <p>{t.planner.desc}</p>
              </div>

              {!hasAnyRecommendations ? (
                <div style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-muted)' }}>
                  <Award size={48} style={{ color: 'var(--cyan)', marginBottom: '1rem' }} />
                  <h3>{t.planner.congrats}</h3>
                  <p style={{ marginTop: '0.5rem' }}>{t.planner.congratsSub}</p>
                </div>
              ) : (
                <>
                  {renderSection(t.planner.ready, plannerRecommendations.readyToMaster, true)}
                  {renderSection(t.planner.easy, plannerRecommendations.easyToGet)}
                  {renderSection(t.planner.boss, plannerRecommendations.bossAndQuests)}
                  {renderSection(t.planner.mission, plannerRecommendations.missionDrops)}
                  {renderSection(t.planner.nemesis, plannerRecommendations.nemesisWeapons)}
                  {renderSection(t.planner.relics, plannerRecommendations.voidRelics)}
                </>
              )}
            </div>
          );
        })()}

        {/* TAB: STAR CHART (MAPA ESTELAR) */}
        {activeTab === 'starchart' && (
          <div className="starchart-tab-container tab-pane-fade">
            <div className="planner-intro" style={{ marginBottom: '2.5rem' }}>
              <h2 className="glow-cyan" style={{ fontSize: '1.8rem', marginBottom: '0.5rem', textShadow: '0 0 10px rgba(0, 240, 255, 0.4)' }}>
                {t.starchart.title}
              </h2>
              <p style={{ color: 'var(--text-bright)', fontSize: '0.95rem' }}>
                {t.starchart.desc}
              </p>
            </div>

            {/* Mode & Stats Dashboard Panel */}
            <div className="starchart-header-panel glass-panel">
              <div className="starchart-mode-selectors">
                <button 
                  className={`starchart-mode-btn mode-normal ${starChartMode === 'normal' ? 'active' : ''}`}
                  onClick={() => {
                    if (starChartMode !== 'normal') {
                      triggerWarpTransition(() => {
                        setStarChartMode('normal');
                        if (selectedPlanetId && selectedPlanetId.includes('proxima')) {
                          setSelectedPlanetId(null);
                        }
                      });
                    }
                  }}
                >
                  {t.starchart.modeNormal}
                </button>
                <button 
                  className={`starchart-mode-btn mode-steelpath ${starChartMode === 'steelpath' ? 'active' : ''}`}
                  onClick={() => {
                    if (starChartMode !== 'steelpath') {
                      triggerWarpTransition(() => {
                        setStarChartMode('steelpath');
                        if (selectedPlanetId && selectedPlanetId.includes('proxima')) {
                          setSelectedPlanetId(null);
                        }
                      });
                    }
                  }}
                >
                  {t.starchart.modeSteelPath}
                </button>
                <button 
                  className={`starchart-mode-btn mode-railjack ${starChartMode === 'railjack' ? 'active' : ''}`}
                  onClick={() => {
                    if (starChartMode !== 'railjack') {
                      triggerWarpTransition(() => {
                        setStarChartMode('railjack');
                        if (selectedPlanetId && !selectedPlanetId.includes('proxima')) {
                          setSelectedPlanetId(null);
                        }
                      });
                    }
                  }}
                >
                  {t.starchart.modeRailjack}
                </button>
              </div>

              <div className="starchart-stats-summary">
                <div className="starchart-stat-box">
                  <span className="stat-value text-cyan">
                    {starChartMode === 'normal' 
                      ? `${stats.normalCompletedNodes} / 252` 
                      : starChartMode === 'railjack'
                        ? `${stats.railjackCompletedNodes} / 34`
                        : `${stats.steelPathCompletedNodes} / 252`}
                  </span>
                  <span className="stat-label">{t.starchart.completedNodes}</span>
                </div>
                <div className="starchart-stat-box">
                  <span className="stat-value text-cyan">
                    {(() => {
                      if (starChartMode === 'normal') {
                        return Math.min(27519, Math.round((stats.normalCompletedNodes / 252) * 27519)).toLocaleString();
                      } else if (starChartMode === 'steelpath') {
                        return Math.min(27519, Math.round((stats.steelPathCompletedNodes / 252) * 27519)).toLocaleString();
                      } else {
                        return (stats.railjackCompletedNodes * 100).toLocaleString();
                      }
                    })()} XP
                  </span>
                  <span className="stat-label">{t.starchart.totalEarned}</span>
                </div>
              </div>
            </div>

            <div className="starchart-interactive-layout">
              {/* Left Side: Interactive Planet Map */}
              <div className={`starchart-map-container ${isWarping ? 'warp-shake' : ''}`} style={{ position: 'relative' }}>
                <div className="starchart-map-canvas">
                  {isWarping && (
                    <div className="starchart-warp-overlay">
                      {Array.from({ length: 40 }).map((_, i) => {
                        const angle = Math.random() * 2 * Math.PI;
                        const distance = 50 + Math.random() * 150; // Start distance
                        const size = 1 + Math.random() * 2; // Width in px
                        const length = 40 + Math.random() * 120; // Length in px
                        const delay = Math.random() * 0.3; // Random delay up to 0.3s
                        const duration = 0.3 + Math.random() * 0.4; // Random duration 0.3s to 0.7s
                        
                        const style = {
                          '--angle': `${angle}rad`,
                          '--distance': `${distance}px`,
                          '--size': `${size}px`,
                          '--length': `${length}px`,
                          animationDelay: `${delay}s`,
                          animationDuration: `${duration}s`
                        };
                        return <div key={i} className="warp-star" style={style} />;
                      })}
                    </div>
                  )}
                  {selectedPlanetId ? (
                    /* Zoomed-in Planet Detail View */
                    <div className="starchart-zoom-view">
                      {/* Floating Back Button */}
                      <button 
                        className="zoom-back-btn" 
                        onClick={() => triggerWarpTransition(() => setSelectedPlanetId(null))}
                      >
                        <ChevronLeft size={16} />
                        <span>{lang === 'pt' ? 'SISTEMA SOLAR' : 'SOLAR SYSTEM'}</span>
                      </button>

                      {/* Large Center Planet */}
                      <div className="zoom-center-planet animate-fade-in" data-id={selectedPlanetId}>
                        <div 
                          className="planet-sphere large" 
                          style={{
                            boxShadow: `0 0 50px ${
                              starChartMode === 'steelpath' 
                                ? 'rgba(255, 59, 48, 0.45)' 
                                : starChartMode === 'railjack'
                                  ? 'rgba(120, 20, 255, 0.45)'
                                  : 'rgba(0, 240, 255, 0.45)'
                            }`,
                            background: starChartMode === 'railjack'
                              ? railjackCoordinates[selectedPlanetId]?.color
                              : undefined
                          }}
                        />
                        <span className="zoom-planet-title">
                          {(() => {
                            const p = starChartMode === 'railjack'
                              ? railjackProximas.find(p => p.id === selectedPlanetId)
                              : starChartPlanets.find(p => p.id === selectedPlanetId);
                            return p ? (lang === 'pt' ? p.namePt : p.nameEn) : '';
                          })()}
                        </span>

                        {(selectedPlanetId === 'deimos' || selectedPlanetId === 'sanctum') && (
                          <div className="deimos-subtabs-container">
                            <button
                              className={`deimos-subtab-btn ${selectedPlanetId === 'deimos' ? 'active' : ''}`}
                              onClick={() => setSelectedPlanetId('deimos')}
                            >
                              {lang === 'pt' ? 'Superfície (Deimos)' : 'Surface (Deimos)'}
                            </button>
                            <button
                              className={`deimos-subtab-btn ${selectedPlanetId === 'sanctum' ? 'active' : ''}`}
                              onClick={() => setSelectedPlanetId('sanctum')}
                            >
                              {lang === 'pt' ? 'Subsolo (Sanctum)' : 'Subsurface (Sanctum)'}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* SVG Connections between Nodes */}
                      <svg className="starchart-node-connections" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {(() => {
                          const nodes = planetNodesList[selectedPlanetId] || [];
                          const lines = [];
                          for (let i = 0; i < nodes.length - 1; i++) {
                            const c1 = getNodeCoords(i, nodes.length);
                            const c2 = getNodeCoords(i + 1, nodes.length);
                            const isN1Completed = isPlanetNodeCompleted(
                              selectedPlanetId, 
                              nodes[i], 
                              starChartMode === 'railjack' 
                                ? railjackCompletion 
                                : (starChartMode === 'normal' ? starChartNormal : starChartSteelPath)
                            );
                            const isN2Completed = isPlanetNodeCompleted(
                              selectedPlanetId, 
                              nodes[i + 1], 
                              starChartMode === 'railjack' 
                                ? railjackCompletion 
                                : (starChartMode === 'normal' ? starChartNormal : starChartSteelPath)
                            );
                            const isActive = isN1Completed && isN2Completed;
                            
                            lines.push(
                              <line
                                key={i}
                                x1={`${c1.x}%`}
                                y1={`${c1.y}%`}
                                x2={`${c2.x}%`}
                                y2={`${c2.y}%`}
                                className={`node-connection-line ${isActive ? 'active' : ''} ${
                                  starChartMode === 'steelpath' ? 'steelpath' : starChartMode === 'railjack' ? 'railjack' : ''
                                }`}
                              />
                            );
                          }
                          return lines;
                        })()}
                      </svg>

                      {/* Mission Node Buttons */}
                      {(() => {
                        const nodes = planetNodesList[selectedPlanetId] || [];
                        return nodes.map((nodeName, idx) => {
                          const coords = getNodeCoords(idx, nodes.length);
                          const isCompleted = isPlanetNodeCompleted(
                            selectedPlanetId, 
                            nodeName, 
                            starChartMode === 'railjack' 
                              ? railjackCompletion 
                              : (starChartMode === 'normal' ? starChartNormal : starChartSteelPath)
                          );
                          
                          return (
                            <button
                              key={nodeName}
                              className={`map-mission-node ${isCompleted ? 'completed' : ''} ${
                                starChartMode === 'steelpath' ? 'steelpath' : starChartMode === 'railjack' ? 'railjack' : ''
                              }`}
                              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                              onClick={() => togglePlanetNode(
                                selectedPlanetId, 
                                nodeName, 
                                starChartMode === 'railjack' 
                                  ? railjackCompletion 
                                  : (starChartMode === 'normal' ? starChartNormal : starChartSteelPath), 
                                starChartMode === 'railjack' 
                                  ? setRailjackCompletion 
                                  : (starChartMode === 'normal' ? setStarChartNormal : setStarChartSteelPath)
                              )}
                              title={`${nodeName} (${isCompleted ? (lang === 'pt' ? 'Concluído' : 'Completed') : (lang === 'pt' ? 'Pendente' : 'Pending')})`}
                            >
                              <div className="node-dot" />
                              <span className="node-label-text">{nodeName}</span>
                            </button>
                          );
                        });
                      })()}
                    </div>
                  ) : (
                    /* Regular Full Solar Map View / Railjack Proxima Map View */
                    <>
                      {starChartMode === 'railjack' ? (
                        <>
                          {/* Railjack cosmic core overlay */}
                          <div className="starchart-map-core railjack-core">
                            <div className="core-glow railjack-glow"></div>
                          </div>

                          {/* SVG Railjack connections */}
                          <svg className="starchart-map-connections" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {/* Subtle grid lines for cockpit radar effect */}
                            <circle cx="50" cy="50" r="15" className="orbit-ring railjack-grid" />
                            <circle cx="50" cy="50" r="30" className="orbit-ring railjack-grid" />
                            <circle cx="50" cy="50" r="45" className="orbit-ring railjack-grid" />
                            {railjackConnections.map(([start, end], idx) => {
                              const startCoord = railjackCoordinates[start];
                              const endCoord = railjackCoordinates[end];
                              if (!startCoord || !endCoord) return null;

                              const isStartCompleted = getPlanetCompletedNodesCount(start, railjackCompletion) === railjackProximas.find(p => p.id === start)?.maxNodes;
                              const isEndCompleted = getPlanetCompletedNodesCount(end, railjackCompletion) === railjackProximas.find(p => p.id === end)?.maxNodes;
                              const isActive = isStartCompleted && isEndCompleted;

                              return (
                                <line 
                                  key={idx}
                                  x1={`${startCoord.x}%`} 
                                  y1={`${startCoord.y}%`} 
                                  x2={`${endCoord.x}%`} 
                                  y2={`${endCoord.y}%`} 
                                  className={`connection-line ${isActive ? 'active' : ''} railjack`}
                                />
                              );
                            })}
                          </svg>

                          {/* Interactive Proxima Nodes */}
                          {railjackProximas.map(proxima => {
                            const coords = railjackCoordinates[proxima.id];
                            if (!coords) return null;

                            const currentNodes = getPlanetCompletedNodesCount(proxima.id, railjackCompletion);
                            const isCompleted = currentNodes === proxima.maxNodes;
                            const percent = Math.round((currentNodes / proxima.maxNodes) * 100 || 0);
                            const isSelected = selectedPlanetId === proxima.id;
                            const bobDelay = `${((coords.x + coords.y) % 5) * -1.2}s`;

                            return (
                              <button
                                key={proxima.id}
                                data-id={proxima.id}
                                className={`map-planet-node railjack-planet-node ${isSelected ? 'selected' : ''} ${isCompleted ? 'completed' : ''}`}
                                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                                onClick={() => triggerWarpTransition(() => setSelectedPlanetId(proxima.id))}
                                title={`${lang === 'pt' ? proxima.namePt : proxima.nameEn} (${currentNodes}/${proxima.maxNodes})`}
                              >
                                <div className="planet-wrapper-bobbing" style={{ animationDelay: bobDelay }}>
                                  <div 
                                    className="planet-sphere" 
                                    style={{ 
                                      background: coords.color,
                                      boxShadow: isSelected 
                                        ? `0 0 20px rgba(120, 20, 255, 0.8)`
                                        : isCompleted
                                          ? `0 0 10px rgba(120, 20, 255, 0.5)`
                                          : 'none'
                                    }}
                                  />
                                </div>
                                <span className="planet-label">
                                  {lang === 'pt' ? proxima.namePt : proxima.nameEn}
                                  <span className="planet-badge railjack-badge">{percent}%</span>
                                </span>
                              </button>
                            );
                          })}
                        </>
                      ) : (
                        <>
                          {/* Central Core Portal */}
                          <div className="starchart-map-core">
                            <div className="core-glow"></div>
                          </div>

                          {/* SVG Progression Lines */}
                          <svg className="starchart-map-connections" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {/* Concentric Orbit Rings */}
                            <circle cx="50" cy="50" r="10" className="orbit-ring" />
                            <circle cx="50" cy="50" r="18" className="orbit-ring" />
                            <circle cx="50" cy="50" r="26" className="orbit-ring" />
                            <circle cx="50" cy="50" r="34" className="orbit-ring" />
                            <circle cx="50" cy="50" r="42" className="orbit-ring" />
                            <circle cx="50" cy="50" r="50" className="orbit-ring" />
                            {planetConnections.filter(([start, end]) => start !== 'sanctum' && end !== 'sanctum').map(([start, end], idx) => {
                              const startCoord = planetCoordinates[start];
                              const endCoord = planetCoordinates[end];
                              if (!startCoord || !endCoord) return null;

                              const isStartCompleted = getPlanetCompletedNodesCount(start, starChartMode === 'normal' ? starChartNormal : starChartSteelPath) === starChartPlanets.find(p => p.id === start)?.maxNodes;
                              const isEndCompleted = getPlanetCompletedNodesCount(end, starChartMode === 'normal' ? starChartNormal : starChartSteelPath) === starChartPlanets.find(p => p.id === end)?.maxNodes;
                              const isActive = isStartCompleted && isEndCompleted;

                              return (
                                <line 
                                  key={idx}
                                  x1={`${startCoord.x}%`} 
                                  y1={`${startCoord.y}%`} 
                                  x2={`${endCoord.x}%`} 
                                  y2={`${endCoord.y}%`} 
                                  className={`connection-line ${isActive ? 'active' : ''} ${starChartMode === 'steelpath' ? 'steelpath' : ''}`}
                                />
                              );
                            })}
                          </svg>

                          {/* Interactive Planet Nodes */}
                          {starChartPlanets.filter(planet => planet.id !== 'sanctum').map(planet => {
                            const coords = planetCoordinates[planet.id];
                            if (!coords) return null;

                            const currentNodes = getPlanetCompletedNodesCount(planet.id, starChartMode === 'normal' ? starChartNormal : starChartSteelPath);
                            const isCompleted = currentNodes === planet.maxNodes;
                            const percent = Math.round((currentNodes / planet.maxNodes) * 100 || 0);
                            const isSelected = selectedPlanetId === planet.id;
                            const bobDelay = `${((coords.x + coords.y) % 5) * -1.2}s`;

                            return (
                              <button
                                key={planet.id}
                                data-id={planet.id}
                                className={`map-planet-node ${isSelected ? 'selected' : ''} ${isCompleted ? 'completed' : ''}`}
                                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                                onClick={() => triggerWarpTransition(() => setSelectedPlanetId(planet.id))}
                                title={`${lang === 'pt' ? planet.namePt : planet.nameEn} (${currentNodes}/${planet.maxNodes})`}
                              >
                                <div className="planet-wrapper-bobbing" style={{ animationDelay: bobDelay }}>
                                  <div 
                                    className="planet-sphere" 
                                    style={{ 
                                      boxShadow: isSelected 
                                        ? `0 0 20px ${starChartMode === 'steelpath' ? '#ff3b30' : 'var(--cyan)'}`
                                        : isCompleted
                                          ? `0 0 10px ${starChartMode === 'steelpath' ? '#d4af37' : '#007aff'}`
                                          : 'none'
                                    }}
                                  />
                                </div>
                                <span className="planet-label">
                                  {lang === 'pt' ? planet.namePt : planet.nameEn}
                                  <span className="planet-badge">{percent}%</span>
                                </span>
                              </button>
                            );
                          })}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Right Side: Planet Control Sidebar */}
              <div className="starchart-control-sidebar glass-panel">
                {(() => {
                  const planet = starChartMode === 'railjack'
                    ? railjackProximas.find(p => p.id === selectedPlanetId)
                    : starChartPlanets.find(p => p.id === selectedPlanetId);
                  if (!planet) {
                    return (
                      <div className="sidebar-empty-state">
                        <MapIcon size={32} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                        <p>{lang === 'pt' ? 'Selecione um planeta no mapa.' : 'Select a planet on the map.'}</p>
                      </div>
                    );
                  }

                  const currentNodes = getPlanetCompletedNodesCount(
                    planet.id, 
                    starChartMode === 'railjack' 
                      ? railjackCompletion 
                      : (starChartMode === 'normal' ? starChartNormal : starChartSteelPath)
                  );
                  const isCompleted = currentNodes === planet.maxNodes;
                  const percent = Math.min(100, Math.round((currentNodes / planet.maxNodes) * 100));

                  const handleTogglePlanet = (checked) => {
                    const nodeList = planetNodesList[planet.id] || [];
                    const currentMap = {};
                    if (checked) {
                      nodeList.forEach(name => {
                        currentMap[name] = true;
                      });
                    }
                    if (starChartMode === 'railjack') {
                      setRailjackCompletion(prev => ({ ...prev, [planet.id]: currentMap }));
                    } else if (starChartMode === 'normal') {
                      setStarChartNormal(prev => ({ ...prev, [planet.id]: currentMap }));
                    } else {
                      setStarChartSteelPath(prev => ({ ...prev, [planet.id]: currentMap }));
                    }
                  };

                  const handleIncrement = (val) => {
                    const nodeList = planetNodesList[planet.id] || [];
                    const newCount = Math.max(0, Math.min(planet.maxNodes, currentNodes + val));
                    const currentMap = {};
                    nodeList.forEach((name, idx) => {
                      if (idx < newCount) currentMap[name] = true;
                    });
                    
                    if (starChartMode === 'railjack') {
                      setRailjackCompletion(prev => ({ ...prev, [planet.id]: currentMap }));
                    } else if (starChartMode === 'normal') {
                      setStarChartNormal(prev => ({ ...prev, [planet.id]: currentMap }));
                    } else {
                      setStarChartSteelPath(prev => ({ ...prev, [planet.id]: currentMap }));
                    }
                  };

                  return (
                    <div className="sidebar-active-planet">
                      <div className="planet-details-header">
                        <h3 className={`planet-title ${
                          starChartMode === 'steelpath' ? 'glow-red' : starChartMode === 'railjack' ? 'glow-purple' : 'glow-cyan'
                        }`} style={{ 
                          textShadow: starChartMode === 'steelpath' 
                            ? '0 0 8px rgba(255, 59, 48, 0.4)' 
                            : starChartMode === 'railjack'
                              ? '0 0 8px rgba(120, 20, 255, 0.4)'
                              : '0 0 8px rgba(0, 240, 255, 0.4)' 
                        }}>
                          {lang === 'pt' ? planet.namePt : planet.nameEn}
                        </h3>
                        <span className="planet-node-stats text-muted">
                          {currentNodes} / {planet.maxNodes} {t.starchart.nodesCount}
                        </span>
                      </div>

                      {/* Mode Indicator Badge */}
                      <div className={`planet-mode-badge ${
                        starChartMode === 'steelpath' ? 'steelpath' : starChartMode === 'railjack' ? 'railjack' : 'normal'
                      }`}>
                        {starChartMode === 'normal' 
                          ? t.starchart.modeNormal 
                          : starChartMode === 'railjack' 
                            ? t.starchart.modeRailjack 
                            : t.starchart.modeSteelPath}
                      </div>

                      {/* Progress section */}
                      <div className="sidebar-progress-container">
                        <div className="sidebar-progress-info">
                          <span className="label">{lang === 'pt' ? 'Progresso do Setor' : 'Sector Progress'}</span>
                          <span className="value">{percent}%</span>
                        </div>
                        <div className="mastery-progress-bar-container" style={{ height: '10px' }}>
                          <div 
                            className="mastery-progress-bar-fill" 
                            style={{ 
                              width: `${percent}%`,
                              background: starChartMode === 'steelpath' 
                                ? 'linear-gradient(90deg, #d4af37, #ff3b30)' 
                                : starChartMode === 'railjack'
                                  ? 'linear-gradient(90deg, #b026ff, #4b145c)'
                                  : 'linear-gradient(90deg, var(--cyan), #007aff)'
                            }}
                          />
                        </div>
                      </div>

                      {/* Interactive Controls */}
                      <div className="sidebar-actions-panel">
                        <label className={`sidebar-completed-checkbox-row ${isCompleted ? 'active' : ''}`}>
                          <input 
                            type="checkbox" 
                            checked={isCompleted}
                            onChange={(e) => handleTogglePlanet(e.target.checked)}
                            className="planet-completed-checkbox"
                          />
                          <span style={{ fontWeight: 600 }}>{t.starchart.planetCompleted}</span>
                        </label>

                        <div className="sidebar-nodes-adjuster">
                          <span className="adjuster-label">{lang === 'pt' ? 'Ajustar Nós' : 'Adjust Nodes'}</span>
                          <div className="adjuster-controls">
                            <button 
                              className="adjust-btn minus"
                              onClick={() => handleIncrement(-1)}
                              disabled={currentNodes <= 0}
                              style={{ width: '36px', height: '36px', fontSize: '1.2rem' }}
                            >
                              -
                            </button>
                            <span className="adjuster-value">{currentNodes}</span>
                            <button 
                              className="adjust-btn plus"
                              onClick={() => handleIncrement(1)}
                              disabled={currentNodes >= planet.maxNodes}
                              style={{ width: '36px', height: '36px', fontSize: '1.2rem' }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Scrollable checklist of individual nodes */}
                      <div className="sidebar-nodes-list-container">
                        <span className="nodes-list-title">{lang === 'pt' ? 'Lista de Nós' : 'Node List'}</span>
                        <div className="sidebar-nodes-scroll">
                          {(planetNodesList[planet.id] || []).map(nodeName => {
                            const isNodeDone = isPlanetNodeCompleted(
                              planet.id, 
                              nodeName, 
                              starChartMode === 'railjack' 
                                ? railjackCompletion 
                                : (starChartMode === 'normal' ? starChartNormal : starChartSteelPath)
                            );
                            return (
                              <label key={nodeName} className={`sidebar-node-item ${isNodeDone ? 'done' : ''}`}>
                                <input
                                  type="checkbox"
                                  checked={isNodeDone}
                                  onChange={() => togglePlanetNode(
                                    planet.id, 
                                    nodeName, 
                                    starChartMode === 'railjack' 
                                      ? railjackCompletion 
                                      : (starChartMode === 'normal' ? starChartNormal : starChartSteelPath), 
                                    starChartMode === 'railjack' 
                                      ? setRailjackCompletion 
                                      : (starChartMode === 'normal' ? setStarChartNormal : setStarChartSteelPath)
                                  )}
                                />
                                <span className="node-item-name">{nodeName}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Starchart Guide Panel */}
            <div className="starchart-guide-panel glass-panel" style={{ marginTop: '2rem' }}>
              <h4 className="guide-title text-cyan">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Info size={16} /> {t.starchart.guideTitle}
                </span>
              </h4>
              <p className="guide-desc" style={{ fontSize: '0.85rem', lineHeight: '1.4', color: 'var(--text-muted)' }}>
                {t.starchart.guideText}
              </p>
            </div>
          </div>
        )}

        {/* TAB: JUNCTIONS (TERMINAIS) */}
        {activeTab === 'junctions' && (
          <div className="junctions-tab-container tab-pane-fade">
            <div className="planner-intro" style={{ marginBottom: '2.5rem' }}>
              <h2 className="glow-gold" style={{ fontSize: '1.8rem', marginBottom: '0.5rem', textShadow: '0 0 10px rgba(212, 175, 55, 0.4)' }}>
                {t.junctions.title}
              </h2>
              <p style={{ color: 'var(--text-bright)', fontSize: '0.95rem' }}>
                {t.junctions.desc}
              </p>
            </div>

            {/* Stats Dashboard Panel */}
            <div className="starchart-header-panel glass-panel">
              <div className="starchart-stats-summary" style={{ marginLeft: 0 }}>
                <div className="starchart-stat-box">
                  <span className="stat-value text-gold">
                    {starChartJunctions.length} / {starChartJunctionsList.length}
                  </span>
                  <span className="stat-label">
                    {t.junctions.title}
                  </span>
                </div>
                <div className="starchart-stat-box">
                  <span className="stat-value text-gold">
                    {stats.junctionsXp.toLocaleString()} XP
                  </span>
                  <span className="stat-label">{t.junctions.totalEarned}</span>
                </div>
              </div>
            </div>

            <div className="junctions-content-layout" style={{ marginTop: '1.5rem' }}>
              {/* Junctions Checklist */}
              <div className="junctions-list-container glass-panel" style={{ width: '100%', maxWidth: 'none' }}>
                <div className="junctions-progress-header" style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem' }}>
                  <span className="text-gold" style={{ fontSize: '1rem', fontWeight: 600 }}>
                    {t.junctions.completedCount.replace('{count}', starChartJunctions.length).replace('{total}', starChartJunctionsList.length).replace('{percent}', Math.round((starChartJunctions.length / starChartJunctionsList.length) * 100 || 0))}
                  </span>
                </div>

                <div className="junctions-grid-list">
                  {starChartJunctionsList.map(junc => {
                    const isCompleted = starChartJunctions.includes(junc.id);
                    
                    const handleToggleJunc = (checked) => {
                      if (checked) {
                        setStarChartJunctions(prev => [...prev, junc.id]);
                      } else {
                        setStarChartJunctions(prev => prev.filter(id => id !== junc.id));
                      }
                    };

                    return (
                      <label key={junc.id} className={`junction-item-row ${isCompleted ? 'active' : ''}`}>
                        <input 
                          type="checkbox" 
                          checked={isCompleted}
                          onChange={(e) => handleToggleJunc(e.target.checked)}
                          className="junction-checkbox"
                        />
                        <span className="junction-name">
                          {lang === 'pt' ? junc.namePt : junc.nameEn}
                        </span>
                        <span className="junction-xp-badge text-gold">+1,000 XP</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Junctions Guide Panel */}
              <div className="starchart-guide-panel glass-panel" style={{ marginTop: '2rem' }}>
                <h4 className="guide-title text-gold">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Info size={16} /> {t.junctions.guideTitle}
                  </span>
                </h4>
                <p className="guide-desc" style={{ fontSize: '0.85rem', lineHeight: '1.4', color: 'var(--text-muted)' }}>
                  {t.junctions.guideText}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SINDICATOS */}
        {activeTab === 'syndicates' && (
          <div className="tab-pane-fade">
            <div className="planner-intro" style={{ marginBottom: '2rem' }}>
              <h2 className="glow-cyan" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {t.syndicates.title}
              </h2>
              <p>
                {t.syndicates.desc}
              </p>
            </div>

            {/* PROPAGATION OPTION */}
            <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input 
                type="checkbox" 
                id="propagate-checkbox"
                defaultChecked={true}
                style={{ cursor: 'pointer', width: '18px', height: '18px', accentColor: 'var(--cyan)' }}
              />
              <label htmlFor="propagate-checkbox" style={{ fontSize: '0.9rem', color: 'var(--text-bright)', cursor: 'pointer', fontWeight: 'bold' }}>
                {t.syndicates.propagate}
              </label>
            </div>

            {/* PRIMARY SYNDICATES */}
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', textTransform: 'uppercase', color: 'var(--cyan)' }}>{t.syndicates.primary}</h3>
            
            <div className="syndicates-grid">
              {primarySyndicatesList.map(synd => {
                const state = syndicates[synd.key] || { rank: 0, standing: 0 };
                const maxStd = syndicateMaxStanding[String(state.rank)] || 132000;
                const progressPct = Math.min(100, (state.standing / maxStd) * 100);
                
                // Find relationships
                const allyDef = primarySyndicatesList.find(s => s.key === synd.ally);
                const opposedDef = primarySyndicatesList.find(s => s.key === synd.opposed);
                const enemyDef = primarySyndicatesList.find(s => s.key === synd.enemy);

                return (
                  <div key={synd.key} className="syndicate-card glass-panel" style={{ borderTop: `4px solid ${synd.color}` }}>
                    <div>
                      {/* Title & Description */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1.15rem', color: 'var(--text-bright)' }}>{t.syndicates.names[synd.key] || synd.translation}</h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{synd.name}</span>
                        </div>
                        <span className={`syndicate-rank-badge ${state.rank >= 0 ? 'positive' : 'negative'}`}>
                          {t.syndicates.rank} {state.rank}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem', minHeight: '48px', lineHeight: '1.4' }}>
                        {t.syndicates[synd.descKey] || synd.description}
                      </p>

                      {/* Rank Selector */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.syndicates.rank}:</span>
                        <select 
                          value={state.rank}
                          onChange={(e) => handleSetRank(synd.key, Number(e.target.value))}
                          className="mr-select"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                        >
                          {[-2,-1,0,1,2,3,4,5].map(r => (
                            <option key={r} value={r}>{t.syndicates.rankNames[String(r)]}</option>
                          ))}
                        </select>
                      </div>

                      {/* Standing Progress */}
                      <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                          <span>{t.syndicates.standing}</span>
                          <span>{state.standing.toLocaleString()} / {maxStd.toLocaleString()}</span>
                        </div>
                        <div className="mastery-progress-bar-container" style={{ height: '12px', marginBottom: '0.5rem' }}>
                          <div 
                            className="mastery-progress-bar-fill" 
                            style={{ 
                              width: `${progressPct}%`, 
                              background: state.rank >= 0 ? `linear-gradient(90deg, ${synd.color} 0%, var(--cyan) 100%)` : `linear-gradient(90deg, var(--color-vaulted) 0%, ${synd.color} 100%)`,
                              boxShadow: `0 0 8px ${synd.color}aa`
                            }}
                          ></div>
                        </div>
                        {/* Standing Quick adjustment buttons */}
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button 
                            className="action-btn" 
                            style={{ padding: '0.2rem', fontSize: '0.65rem' }}
                            onClick={() => {
                              const propagate = document.getElementById('propagate-checkbox')?.checked;
                              handleAdjustStanding(synd.key, -5000, propagate);
                            }}
                          >
                            -5k
                          </button>
                          <button 
                            className="action-btn" 
                            style={{ padding: '0.2rem', fontSize: '0.65rem' }}
                            onClick={() => {
                              const propagate = document.getElementById('propagate-checkbox')?.checked;
                              handleAdjustStanding(synd.key, -1000, propagate);
                            }}
                          >
                            -1k
                          </button>
                          <button 
                            className="action-btn" 
                            style={{ padding: '0.2rem', fontSize: '0.65rem' }}
                            onClick={() => {
                              const propagate = document.getElementById('propagate-checkbox')?.checked;
                              handleAdjustStanding(synd.key, 1000, propagate);
                            }}
                          >
                            +1k
                          </button>
                          <button 
                            className="action-btn" 
                            style={{ padding: '0.2rem', fontSize: '0.65rem' }}
                            onClick={() => {
                              const propagate = document.getElementById('propagate-checkbox')?.checked;
                              handleAdjustStanding(synd.key, 5000, propagate);
                            }}
                          >
                            +5k
                          </button>
                        </div>
                      </div>

                      {/* Relations */}
                      <div style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '0.6rem', borderRadius: '6px', marginBottom: '1.25rem' }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--text-bright)', marginBottom: '0.35rem' }}>{t.syndicates.relations}:</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <div>🟢 <span style={{ color: 'var(--color-owned)' }}>{t.syndicates.ally} (+50%):</span> {allyDef ? t.syndicates.names[allyDef.key] : ''}</div>
                          <div>🟡 <span style={{ color: 'var(--gold)' }}>{t.syndicates.opposed} (-50%):</span> {opposedDef ? t.syndicates.names[opposedDef.key] : ''}</div>
                          <div>🔴 <span style={{ color: 'var(--color-vaulted)' }}>{t.syndicates.enemy} (-100%):</span> {enemyDef ? t.syndicates.names[enemyDef.key] : ''}</div>
                        </div>
                      </div>
                    </div>

                    {/* Exclusive Weapons Tracker */}
                    <div>
                      <h5 style={{ fontSize: '0.8rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem', marginBottom: '0.5rem', color: 'var(--cyan)', textTransform: 'uppercase' }}>
                        {t.syndicates.weapons}
                      </h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {synd.weapons.map(wName => {
                          const cleanName = wName.replace(/\s+/g, '').toLowerCase();
                          const foundWeapon = weapons.find(w => 
                            w.id.toLowerCase().endsWith(cleanName) || 
                            (w.name && w.name.toLowerCase() === wName.toLowerCase())
                          );
                          const weaponId = foundWeapon ? foundWeapon.id : wName;
                          const displayName = foundWeapon ? foundWeapon.name : wName;
                          const wState = inventory[weaponId] || inventory[wName] || { owned: false, mastered: false };
                          return (
                            <div key={wName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', background: 'rgba(255,255,255,0.01)', padding: '0.3rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                              <span style={{ fontWeight: wState.mastered ? 'bold' : 'normal', color: wState.mastered ? 'var(--color-mastered)' : 'var(--text-main)' }}>{displayName}</span>
                              <div style={{ display: 'flex', gap: '0.35rem' }}>
                                <button 
                                  onClick={() => handleToggleOwned(displayName, weaponId)}
                                  className={`action-btn ${wState.owned ? 'owned-active' : ''}`}
                                  style={{ padding: '0.15rem 0.3rem', fontSize: '0.6rem', border: 'none', background: wState.owned ? '' : 'rgba(255,255,255,0.03)' }}
                                  title={t.modal.markOwned}
                                >
                                  📦
                                </button>
                                <button 
                                  onClick={() => handleToggleMastered(displayName, weaponId)}
                                  className={`action-btn ${wState.mastered ? 'mastered-active' : ''}`}
                                  style={{ padding: '0.15rem 0.3rem', fontSize: '0.6rem', border: 'none', background: wState.mastered ? '' : 'rgba(255,255,255,0.03)' }}
                                  title={t.modal.markMastered}
                                >
                                  ✔
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* OPEN WORLD SYNDICATES */}
            <h3 style={{ fontSize: '1.25rem', marginTop: '2.5rem', marginBottom: '1rem', textTransform: 'uppercase', color: 'var(--cyan)' }}>{t.syndicates.openWorld}</h3>
            
            <div className="syndicates-grid">
              {openWorldSyndicatesList.map(synd => {
                const state = syndicates[synd.key] || { rank: 0 };
                
                return (
                  <div key={synd.key} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1.1rem', color: 'var(--text-bright)' }}>{t.syndicates.names[synd.key] || synd.key}</h4>
                          <span style={{ fontSize: '0.7rem', color: 'var(--cyan)' }}>{t.syndicates.locations[synd.locationKey] || synd.locationKey}</span>
                        </div>
                        <span className="syndicate-rank-badge positive">
                          {t.syndicates.rank} {state.rank}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: '1.4' }}>
                        {t.syndicates[synd.descKey] || synd.key}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.syndicates.rank}:</span>
                      <select 
                        value={state.rank}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setSyndicates(prev => ({
                            ...prev,
                            [synd.key]: { rank: val }
                          }));
                        }}
                        className="mr-select"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        {Array.from({ length: synd.maxRank + 1 }).map((_, rIdx) => (
                          <option key={rIdx} value={rIdx}>{t.syndicates.rank} {rIdx}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BEGINNER GUIDE SECTION */}
            <div className="glass-panel" style={{ padding: '2rem', marginTop: '2.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', textTransform: 'uppercase', color: 'var(--purple)' }}>
                {t.syndicates.guide.title}
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', fontSize: '0.85rem', lineHeight: '1.5' }}>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
                  <h4 style={{ color: 'var(--cyan)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{t.syndicates.guide.pledgeTitle}</h4>
                  <p style={{ color: 'var(--text-main)' }}>
                    {t.syndicates.guide.pledgeText}
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
                  <h4 style={{ color: 'var(--cyan)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{t.syndicates.guide.dailyTitle}</h4>
                  <p style={{ color: 'var(--text-main)' }}>
                    {t.syndicates.guide.dailyText}
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
                  <h4 style={{ color: 'var(--cyan)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{t.syndicates.guide.sacrificeTitle}</h4>
                  <p style={{ color: 'var(--text-main)' }}>
                    {t.syndicates.guide.sacrificeText}
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB: NEMESIS (Liches & Irmãs) */}
        {activeTab === 'nemesis' && (
          <div className="nemesis-panel glass-panel tab-pane-fade">
            <h2 className="glow-cyan" style={{ fontSize: '1.5rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
              {t.nemesis.title}
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {/* KUVA LICHES */}
              <div style={{ background: 'rgba(153, 27, 27, 0.1)', border: '1px solid #991b1b', borderRadius: '8px', padding: '1.25rem' }}>
                <h3 style={{ color: '#ef4444', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>🩸</span> {t.nemesis.kuvaTitle}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                  <strong>{t.nemesis.origin}:</strong> {t.nemesis.kuvaDesc}
                </p>
              </div>

              {/* SISTERS OF PARVOS */}
              <div style={{ background: 'rgba(2, 132, 199, 0.1)', border: '1px solid #0284c7', borderRadius: '8px', padding: '1.25rem' }}>
                <h3 style={{ color: '#38bdf8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>💼</span> {t.nemesis.tenetTitle}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                  <strong>{t.nemesis.origin}:</strong> {t.nemesis.tenetDesc}
                </p>
              </div>

              {/* CODA (INFESTADOS) */}
              <div style={{ background: 'rgba(21, 128, 61, 0.1)', border: '1px solid #15803d', borderRadius: '8px', padding: '1.25rem' }}>
                <h3 style={{ color: '#4ade80', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>🦠</span> {t.nemesis.codaTitle}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                  <strong>{t.nemesis.origin}:</strong> {t.nemesis.codaDesc}
                </p>
              </div>
            </div>

            <h3 style={{ fontSize: '1.2rem', color: 'var(--gold)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              {t.nemesis.trackerTitle}
            </h3>

            <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
              <h4 style={{ color: 'var(--cyan)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{t.nemesis.progenitors}</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.75rem' }}>
                <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}><strong style={{ color: '#10b981' }}>{t.nemesis.toxin}:</strong> Saryn, Khora, Ivara, Atlas, Nidus, Nekros...</span>
                <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}><strong style={{ color: '#ef4444' }}>{t.nemesis.heat}:</strong> Ember, Wisp, Chroma, Protea, Nezha...</span>
                <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}><strong style={{ color: '#38bdf8' }}>{t.nemesis.cold}:</strong> Frost, Titania, Revenant, Gara, Koumei...</span>
                <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}><strong style={{ color: '#8b5cf6' }}>{t.nemesis.electric}:</strong> Volt, Nova, Banshee, Gyre, Excalibur...</span>
                <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}><strong style={{ color: '#f59e0b' }}>{t.nemesis.impact}:</strong> Rhino, Wukong, Gauss, Dante, Baruuk...</span>
                <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}><strong style={{ color: '#3b82f6' }}>{t.nemesis.magnetic}:</strong> Mesa, Mag, Harrow, Citrine, Xaku...</span>
                <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}><strong style={{ color: '#f43f5e' }}>{t.nemesis.radiation}:</strong> Mirage, Equinox, Loki, Ash, Qorvex...</span>
              </div>
            </div>
            
            <div className="nemesis-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {weapons.filter(w => w.isNemesis).map(w => {
                const wState = inventory[w.id] || inventory[w.name] || { owned: false, mastered: false, element: '', bonus: 25 };
                let factionColor = w.nemesisType === 'Kuva' ? '#ef4444' : w.nemesisType === 'Tenet' ? '#38bdf8' : '#4ade80';
                
                return (
                  <div key={w.id} className="nemesis-card glass-panel" style={{ 
                    padding: '1rem', 
                    borderTop: `3px solid ${factionColor}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Background faint faction label */}
                    <div style={{
                      position: 'absolute',
                      right: '8px',
                      top: '6px',
                      fontSize: '0.6rem',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      color: factionColor,
                      opacity: 0.15,
                      pointerEvents: 'none',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {w.nemesisType}
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      {/* Image Thumbnail */}
                      <div className="nemesis-weapon-thumb-container" style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '6px',
                        background: 'rgba(0, 0, 0, 0.25)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        overflow: 'hidden',
                        cursor: 'pointer'
                      }} onClick={() => setSelectedWeapon(w)}>
                        <img 
                          src={getWeaponImage(w)} 
                          alt={w.name} 
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            transition: 'transform var(--transition-fast)'
                          }}
                          className="nemesis-thumb-img"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>

                      {/* Title & Faction info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-bright)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.name}</h4>
                        <span style={{ fontSize: '0.65rem', color: factionColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {w.nemesisType === 'Kuva' ? '🩸 Kuva' : w.nemesisType === 'Tenet' ? '💼 Tenet' : '🦠 Coda'}
                        </span>
                      </div>

                      {/* Checklist buttons */}
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button 
                          onClick={() => handleToggleOwned(w.name, w.id)}
                          className={`action-btn ${wState.owned ? 'owned-active' : ''}`}
                          style={{ padding: '0.25rem 0.45rem', fontSize: '0.75rem' }}
                          title={t.general.obtained || 'Obtido'}
                        >
                          📦
                        </button>
                        <button 
                          onClick={() => handleToggleMastered(w.name, w.id)}
                          className={`action-btn ${wState.mastered ? 'mastered-active' : ''}`}
                          style={{ padding: '0.25rem 0.45rem', fontSize: '0.75rem' }}
                          title={t.general.mastered || 'Dominado'}
                        >
                          ✔
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.15rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.15rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.nemesis.element}</label>
                        <select 
                          value={wState.element || ''}
                          onChange={(e) => handleNemesisUpdate(w.name, w.id, { element: e.target.value })}
                          className="mr-select"
                          style={{ width: '100%', fontSize: '0.78rem', padding: '0.25rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-bright)' }}
                        >
                          <option value="">{t.nemesis.select}</option>
                          <option value="Toxina">{t.nemesis.toxin}</option>
                          <option value="Calor">{t.nemesis.heat}</option>
                          <option value="Frio">{t.nemesis.cold}</option>
                          <option value="Eletricidade">{t.nemesis.electric}</option>
                          <option value="Impacto">{t.nemesis.impact}</option>
                          <option value="Magnético">{t.nemesis.magnetic}</option>
                          <option value="Radiação">{t.nemesis.radiation}</option>
                        </select>
                      </div>
                      <div style={{ width: '75px' }}>
                        <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.15rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.nemesis.bonus}</label>
                        <input 
                          type="number" 
                          min="25" 
                          max="60"
                          value={wState.bonus || 25}
                          onChange={(e) => handleNemesisUpdate(w.name, w.id, { bonus: Number(e.target.value) })}
                          style={{ 
                            width: '100%', 
                            background: 'rgba(0,0,0,0.3)', 
                            border: '1px solid var(--border-color)', 
                            color: 'var(--text-bright)', 
                            padding: '0.25rem',
                            borderRadius: '4px',
                            textAlign: 'center',
                            fontSize: '0.78rem'
                          }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="stat-bar-container" style={{ height: '4px', background: 'rgba(0,0,0,0.5)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div className="stat-bar-fill" style={{ 
                          width: `${((Math.min(60, Math.max(25, wState.bonus || 25)) - 25) / 35) * 100}%`,
                          background: wState.bonus >= 60 ? 'var(--gold)' : factionColor,
                          height: '100%'
                        }}></div>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
                        {wState.bonus >= 60 ? (
                          <span style={{ fontSize: '0.65rem', color: 'var(--gold)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>⭐ {t.nemesis.maxed}</span>
                        ) : (
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                            {t.nemesis.nextFusion}: <strong style={{ color: 'var(--text-bright)' }}>{Math.min(60, (wState.bonus || 25) * 1.1).toFixed(1)}%</strong>
                          </span>
                        )}
                        
                        <a 
                          href={w.wikiaUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-secondary"
                          style={{ padding: '0.15rem 0.35rem', fontSize: '0.65rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                          <ExternalLink size={10} /> Wiki
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: BACKUP & INTEGRATION */}
        {activeTab === 'sync' && (
          <div className="sync-panel glass-panel tab-pane-fade">
            <h2 className="glow-cyan" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              {t.sync.title}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              {t.sync.desc}
            </p>

            <div className="sync-grid">
              
              {/* Export Box */}
              <div className="sync-box">
                <h3>{lang === 'pt' ? 'Exportar Progresso' : lang === 'es' ? 'Exportar Progreso' : lang === 'ja' ? '進行状況のエクスポート' : 'Export Progress'}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {t.sync.exportDesc}
                </p>

                {/* Visual Backup Summary Stats */}
                <div className="backup-stats-container" style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                  marginTop: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{lang === 'pt' ? 'Conta ativa:' : 'Active Account:'}</span>
                    <strong style={{ color: 'var(--text-bright)' }}>{username || 'Tenno'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{lang === 'pt' ? 'Plataforma:' : 'Platform:'}</span>
                    <strong style={{ color: 'var(--cyan)' }}>{platform}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{lang === 'pt' ? 'Itens Arsenal:' : 'Arsenal Items:'}</span>
                    <strong style={{ color: 'var(--text-bright)' }}>{stats.ownedCount} / {stats.totalCount}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{lang === 'pt' ? 'Coleção de Mods:' : 'Mods Collection:'}</span>
                    <strong style={{ color: 'var(--text-bright)' }}>{modStats.obtainedCount} / {modStats.totalCount}</strong>
                  </div>
                </div>

                <button 
                  onClick={handleExportData}
                  className="btn-primary"
                  style={{ marginTop: 'auto', width: '100%' }}
                >
                  <Download size={16} /> {t.sync.exportBtn}
                </button>
              </div>

              {/* Import Box */}
              <div className="sync-box">
                <h3>{lang === 'pt' ? 'Importar Backup ou JSON do AlecaFrame' : lang === 'es' ? 'Importar Copia de Seguridad o JSON de AlecaFrame' : lang === 'ja' ? 'バックアップまたはAlecaFrameのJSONをインポート' : 'Import Backup or AlecaFrame JSON'}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {t.sync.importDesc}
                </p>

                {/* Drag and Drop Zone */}
                <div 
                  className={`import-dropzone ${dragActive ? 'active' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept=".json" 
                    style={{ display: 'none' }} 
                  />
                  <UploadCloud size={32} className="dropzone-icon" />
                  <span className="dropzone-title">{t.sync.dropzoneTitle}</span>
                  <span className="dropzone-desc">{t.sync.dropzoneDesc}</span>
                </div>

                <div className="import-divider">
                  <span>{t.sync.separatorOr}</span>
                </div>
                
                <form onSubmit={handleImportData} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="terminal-header" style={{
                    background: 'rgba(10, 15, 30, 0.85)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    borderBottom: 'none',
                    borderTopLeftRadius: '6px',
                    borderTopRightRadius: '6px',
                    padding: '0.4rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontFamily: 'monospace',
                    fontSize: '0.65rem',
                    color: '#38bdf8',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className="console-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', display: 'inline-block' }} />
                      ORBITER_TERMINAL://IMPORT_JSON
                    </span>
                    <span style={{ opacity: 0.5 }}>SECURE_LINE</span>
                  </div>

                  <textarea
                    placeholder={t.sync.importPlaceholder}
                    value={importJson}
                    onChange={(e) => setImportJson(e.target.value)}
                    className="json-textarea"
                    style={{
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      borderTop: 'none',
                      marginTop: 0,
                      marginBottom: '0.75rem'
                    }}
                    required
                  ></textarea>

                  {syncStatus && (
                    <div className={`alert-message ${syncStatus.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                      {syncStatus.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                      <span>{syncStatus.message}</span>
                    </div>
                  )}

                  <button 
                    type="submit"
                    className="btn-secondary"
                    style={{ width: '100%' }}
                  >
                    <Upload size={16} /> {t.sync.importConfirm}
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* IMPORT PREVIEW MODAL */}
      {importPreview && (
        <div className="modal-overlay" onClick={() => setImportPreview(null)}>
          <div className="modal-content glass-panel" style={{ maxWidth: '460px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 className="glow-cyan" style={{ fontSize: '1.25rem', textTransform: 'uppercase', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={20} style={{ color: 'var(--cyan)' }} /> {lang === 'pt' ? 'Confirmar Importação' : 'Confirm Import'}
              </h3>
              <button 
                onClick={() => setImportPreview(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', outline: 'none' }}
              >
                <X size={20} />
              </button>
            </div>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.4' }}>
              {lang === 'pt' 
                ? 'Lemos os dados do JSON com sucesso! Revise o resumo das informações que serão gravadas:' 
                : 'JSON data read successfully! Review the summary of the information to be written:'}
            </p>

            <div className="backup-stats-container" style={{
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '1rem',
              fontSize: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>{lang === 'pt' ? 'Usuário:' : 'Username:'}</span>
                <strong style={{ color: 'var(--text-bright)' }}>{importPreview.username || 'Tenno'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>{lang === 'pt' ? 'Plataforma:' : 'Platform:'}</span>
                <strong style={{ color: 'var(--cyan)' }}>{importPreview.platform || 'PC'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>{lang === 'pt' ? 'Rank de Maestria:' : 'Mastery Rank:'}</span>
                <strong style={{ color: 'var(--text-bright)' }}>MR {importPreview.masteryRank}</strong>
              </div>
              
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', margin: '0.25rem 0', paddingTop: '0.5rem' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>{lang === 'pt' ? 'Itens de Arsenal Detectados:' : 'Arsenal Items Detected:'}</span>
                <strong style={{ color: 'var(--color-owned)' }}>+{importPreview.weaponsCount}</strong>
              </div>
              
              {importPreview.modsCount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{lang === 'pt' ? 'Mods Detectados:' : 'Mods Detected:'}</span>
                  <strong style={{ color: 'var(--purple)' }}>+{importPreview.modsCount}</strong>
                </div>
              )}
              {importPreview.syndicatesCount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{lang === 'pt' ? 'Sindicatos Detectados:' : 'Syndicates Detected:'}</span>
                  <strong style={{ color: '#f59e0b' }}>+{importPreview.syndicatesCount}</strong>
                </div>
              )}
              {importPreview.arcanesCount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{lang === 'pt' ? 'Arcanos Detectados:' : 'Arcanes Detected:'}</span>
                  <strong style={{ color: 'var(--gold)' }}>+{importPreview.arcanesCount}</strong>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                className="btn-secondary" 
                style={{ flex: 1, padding: '0.65rem' }}
                onClick={() => setImportPreview(null)}
              >
                {lang === 'pt' ? 'Cancelar' : 'Cancel'}
              </button>
              <button 
                className="btn-primary" 
                style={{ flex: 1, padding: '0.65rem', background: 'linear-gradient(135deg, var(--cyan) 0%, #0284c7 100%)' }}
                onClick={() => {
                  const data = importPreview.rawData;
                  if (data.inventory) setInventory(data.inventory);
                  if (data.username) setUsername(data.username);
                  if (data.platform) setPlatform(data.platform);
                  if (data.masteryRank) setMasteryRank(Number(data.masteryRank) || 1);
                  if (data.syndicates) setSyndicates(data.syndicates);
                  if (data.modInventory) setModInventory(data.modInventory);
                  if (data.starChartNormal) setStarChartNormal(data.starChartNormal);
                  if (data.starChartSteelPath) setStarChartSteelPath(data.starChartSteelPath);
                  if (data.starChartJunctions) setStarChartJunctions(data.starChartJunctions);
                  if (data.railjackCompletion) setRailjackCompletion(data.railjackCompletion);
                  if (data.arcanes) setArcaneInventory(data.arcanes);
                  else if (data.arcaneInventory) setArcaneInventory(data.arcaneInventory);
                  if (data.warframeShards) setWarframeShards(data.warframeShards);
                  
                  const countLabel = importPreview.type === 'smart' 
                    ? (lang === 'pt' ? `Importação inteligente concluída! Identificados ${importPreview.weaponsCount} itens.` : `Smart import completed! Identified ${importPreview.weaponsCount} items.`)
                    : (lang === 'pt' ? 'Backup completo restaurado com sucesso!' : 'Complete backup restored successfully!');

                  setSyncStatus({ 
                    type: 'success', 
                    message: countLabel
                  });
                  setImportJson('');
                  setImportPreview(null);
                }}
              >
                {lang === 'pt' ? 'Confirmar' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WEAPON DETAIL MODAL */}
      {selectedWeapon && (
        <div className="modal-overlay" onClick={() => { setSelectedWeapon(null); setActiveShardEditor(null); }}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => { setSelectedWeapon(null); setActiveShardEditor(null); }}>
              <X size={24} />
            </button>

            <div className="modal-body-grid">
              
              {/* LEFT COLUMN: Visuals, Wiki, Description, Combat Stats */}
              <div className="modal-left-column">
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div className="modal-weapon-img-container">
                    <img 
                      src={getWeaponImage(selectedWeapon)} 
                      alt={selectedWeapon.name} 
                      className="modal-weapon-img"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h2 className="modal-title glow-cyan" style={{ fontSize: '1.8rem', margin: 0 }}>{selectedWeapon.name}</h2>
                    <span className="modal-type">{selectedWeapon.type}</span>
                    <div>
                      <a 
                        href={getWikiLink(selectedWeapon)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        style={{ 
                          display: 'inline-flex', 
                          padding: '0.5rem 1rem', 
                          fontSize: '0.85rem', 
                          gap: '0.5rem', 
                          marginTop: '0.5rem', 
                          textDecoration: 'none' 
                        }}
                      >
                        <ExternalLink size={14} /> {t.modal.wiki}
                      </a>
                    </div>
                  </div>
                </div>

                <p style={{ color: 'var(--text-main)', fontStyle: 'italic', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                  "{renderFormattedDescription(selectedWeapon.description)}"
                </p>

                {selectedWeapon.type === 'Warframe' ? (
                  <>
                    {/* WARFRAME STATS SECTION */}
                    <h4 className="modal-section-title">{t.modal.warframeStats}</h4>
                    <div className="combat-stats-panel">
                      {/* Health */}
                      <div className="stat-row">
                        <div className="stat-row-header">
                          <span className="stat-row-label">{t.modal.health}</span>
                          <span className="stat-row-value">{selectedWeapon.health}</span>
                        </div>
                        <div className="stat-bar-container">
                          <div className="stat-bar-fill health-fill" style={{ width: `${Math.min(100, (selectedWeapon.health / 500) * 100)}%` }}></div>
                        </div>
                      </div>

                      {/* Shield */}
                      <div className="stat-row">
                        <div className="stat-row-header">
                          <span className="stat-row-label">{t.modal.shield}</span>
                          <span className="stat-row-value">{selectedWeapon.shield}</span>
                        </div>
                        <div className="stat-bar-container">
                          <div className="stat-bar-fill shield-fill" style={{ width: `${Math.min(100, (selectedWeapon.shield / 500) * 100)}%` }}></div>
                        </div>
                      </div>

                      {/* Armor */}
                      <div className="stat-row">
                        <div className="stat-row-header">
                          <span className="stat-row-label">{t.modal.armor}</span>
                          <span className="stat-row-value">{selectedWeapon.armor}</span>
                        </div>
                        <div className="stat-bar-container">
                          <div className="stat-bar-fill armor-fill" style={{ width: `${Math.min(100, (selectedWeapon.armor / 600) * 100)}%` }}></div>
                        </div>
                      </div>

                      {/* Energy */}
                      <div className="stat-row">
                        <div className="stat-row-header">
                          <span className="stat-row-label">{t.modal.energy}</span>
                          <span className="stat-row-value">{selectedWeapon.power}</span>
                        </div>
                        <div className="stat-bar-container">
                          <div className="stat-bar-fill energy-fill" style={{ width: `${Math.min(100, (selectedWeapon.power / 300) * 100)}%` }}></div>
                        </div>
                      </div>
                    </div>

                    {/* ARCHON SHARD SOCKETS SECTION */}
                    <h4 className="modal-section-title" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>🎴 {lang === 'pt' ? 'Fragmentos de Arconte' : 'Archon Shards'}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>
                        {lang === 'pt' ? 'Clique em um slot para equipar' : 'Click a slot to socket'}
                      </span>
                    </h4>

                    <div className="archon-shards-row" style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '1rem',
                      margin: '1rem 0 1.5rem 0',
                      padding: '0.75rem',
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      {[0, 1, 2, 3, 4].map(slotIndex => {
                        const wfKey = selectedWeapon.id || selectedWeapon.name;
                        const currentShardsList = warframeShards[wfKey] || [null, null, null, null, null];
                        const shard = currentShardsList[slotIndex];
                        let shardColor = 'rgba(255,255,255,0.05)';
                        let shadowGlow = 'none';
                        let borderGlow = 'rgba(255,255,255,0.1)';
                        if (shard && shard.type) {
                          if (shard.type === 'Crimson') { shardColor = '#ef4444'; shadowGlow = '0 0 12px #ef4444'; borderGlow = '#fca5a5'; }
                          else if (shard.type === 'Amber') { shardColor = '#f59e0b'; shadowGlow = '0 0 12px #f59e0b'; borderGlow = '#fde047'; }
                          else if (shard.type === 'Azure') { shardColor = '#3b82f6'; shadowGlow = '0 0 12px #3b82f6'; borderGlow = '#93c5fd'; }
                          else if (shard.type === 'Violet') { shardColor = '#8b5cf6'; shadowGlow = '0 0 12px #8b5cf6'; borderGlow = '#c084fc'; }
                          else if (shard.type === 'Topaz') { shardColor = '#ea580c'; shadowGlow = '0 0 12px #ea580c'; borderGlow = '#ff9d5c'; }
                          else if (shard.type === 'Emerald') { shardColor = '#10b981'; shadowGlow = '0 0 12px #10b981'; borderGlow = '#6ee7b7'; }
                        }

                        const isTauforged = shard && shard.tauforged;
                        const animationClass = isTauforged ? 'tauforged-pulse' : '';

                        return (
                          <div 
                            key={slotIndex}
                            className={`archon-shard-slot ${animationClass}`}
                            onClick={() => setActiveShardEditor({ slotIndex })}
                            style={{
                              width: '45px',
                              height: '45px',
                              background: shard ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.02)',
                              border: shard ? `2px solid ${borderGlow}` : `1px dashed rgba(255,255,255,0.15)`,
                              borderRadius: '50%',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative',
                              boxShadow: shadowGlow,
                              transition: 'all 0.3s ease'
                            }}
                            title={shard ? `${isTauforged ? 'Tauforged ' : ''}${shard.type} Shard` : `Empty Slot ${slotIndex + 1}`}
                          >
                            {shard && shard.type ? (
                              <div style={{
                                width: '18px',
                                height: '18px',
                                background: shardColor,
                                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                boxShadow: isTauforged ? `0 0 8px ${shardColor}` : 'none'
                              }} />
                            ) : (
                              <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.15)' }}>+</span>
                            )}
                            
                            {isTauforged && (
                              <span style={{
                                position: 'absolute',
                                top: '-3px',
                                right: '-3px',
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: 'var(--gold)',
                                boxShadow: '0 0 6px var(--gold)'
                              }} title="Tauforged" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {activeShardEditor !== null && (() => {
                      const slotIndex = activeShardEditor.slotIndex;
                      const wfKey = selectedWeapon.id || selectedWeapon.name;
                      const currentShardsList = warframeShards[wfKey] || [null, null, null, null, null];
                      const shard = currentShardsList[slotIndex];
                      const updateShard = (type, tauforged) => {
                        const newList = [...currentShardsList];
                        newList[slotIndex] = type === null ? null : { type, tauforged };
                        setWarframeShards(prev => ({ ...prev, [wfKey]: newList }));
                      };
                      return (
                        <div className="shard-editor-panel glass-panel" style={{
                          padding: '1rem',
                          margin: '0.5rem 0 1rem 0',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '8px',
                          animation: 'tabFadeIn 0.25s ease-out'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-bright)' }}>
                              {lang === 'pt' ? `Editar Slot ${slotIndex + 1}` : `Edit Slot ${slotIndex + 1}`}
                            </span>
                            <button 
                              onClick={() => setActiveShardEditor(null)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                              }}
                            >
                              ✕
                            </button>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                {lang === 'pt' ? 'Tipo de Fragmento' : 'Shard Type'}
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                {[
                                  { type: null, label: lang === 'pt' ? 'Nenhum' : 'None', color: 'rgba(255,255,255,0.05)' },
                                  { type: 'Crimson', label: 'Crimson', color: '#ef4444' },
                                  { type: 'Amber', label: 'Amber', color: '#f59e0b' },
                                  { type: 'Azure', label: 'Azure', color: '#3b82f6' },
                                  { type: 'Violet', label: 'Violet', color: '#8b5cf6' },
                                  { type: 'Topaz', label: 'Topaz', color: '#ea580c' },
                                  { type: 'Emerald', label: 'Emerald', color: '#10b981' }
                                ].map(opt => {
                                  const isSelected = (!shard && opt.type === null) || (shard && shard.type === opt.type);
                                  return (
                                    <button
                                      key={opt.type || 'none'}
                                      onClick={() => updateShard(opt.type, shard ? shard.tauforged : false)}
                                      style={{
                                        padding: '0.25rem 0.6rem',
                                        fontSize: '0.7rem',
                                        borderRadius: '4px',
                                        border: isSelected ? `1px solid ${opt.color}` : '1px solid transparent',
                                        background: isSelected ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.01)',
                                        color: isSelected ? 'var(--text-bright)' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.3rem',
                                        transition: 'all 0.2s'
                                      }}
                                    >
                                      {opt.type !== null && (
                                        <span style={{ 
                                          width: '8px', 
                                          height: '8px', 
                                          borderRadius: '50%', 
                                          background: opt.color 
                                        }} />
                                      )}
                                      {opt.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {shard && shard.type && (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-bright)' }}>
                                  ⭐ {lang === 'pt' ? 'Fragmento Forjado em Tau (Tauforged)' : 'Tauforged Shard'}
                                </span>
                                <input 
                                  type="checkbox" 
                                  checked={shard.tauforged || false}
                                  onChange={(e) => updateShard(shard.type, e.target.checked)}
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    cursor: 'pointer',
                                    accentColor: 'var(--gold)'
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    {/* ABILITIES SECTION */}
                    {selectedWeapon.abilities && selectedWeapon.abilities.length > 0 && (
                      <>
                        <h4 className="modal-section-title">{t.modal.abilities}</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '0.25rem', marginBottom: '1rem' }}>
                          {selectedWeapon.abilities.map((ability, index) => (
                            <div key={index} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.6rem 0.8rem' }}>
                              <strong style={{ color: 'var(--cyan)', fontSize: '0.85rem', display: 'block', marginBottom: '0.15rem' }}>{ability.name}</strong>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', margin: 0 }}>
                                {ability.description ? renderFormattedDescription(ability.description) : t.modal.noAbilityDesc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* COMBAT STATS SECTION */}
                    <h4 className="modal-section-title">{t.modal.combatStats}</h4>
                    <div className="combat-stats-panel">
                      {/* Crit Chance */}
                      <div className="stat-row">
                        <div className="stat-row-header">
                          <span className="stat-row-label">{t.modal.critChance}</span>
                          <span className="stat-row-value">
                            {selectedWeapon.critChance !== undefined ? `${(selectedWeapon.critChance * 100).toFixed(1)}%` : 'N/A'}
                          </span>
                        </div>
                        <div className="stat-bar-container">
                          <div className="stat-bar-fill crit-fill" style={{ width: `${Math.min(100, (selectedWeapon.critChance || 0) * 100)}%` }}></div>
                        </div>
                      </div>

                      {/* Crit Multiplier */}
                      <div className="stat-row">
                        <div className="stat-row-header">
                          <span className="stat-row-label">{t.modal.critMult}</span>
                          <span className="stat-row-value">
                            {selectedWeapon.critMultiplier !== undefined ? `${Number(selectedWeapon.critMultiplier).toFixed(1)}x` : 'N/A'}
                          </span>
                        </div>
                        <div className="stat-bar-container">
                          <div className="stat-bar-fill crit-mult-fill" style={{ width: `${Math.min(100, ((selectedWeapon.critMultiplier || 0) / 5) * 100)}%` }}></div>
                        </div>
                      </div>

                      {/* Status Chance */}
                      <div className="stat-row">
                        <div className="stat-row-header">
                          <span className="stat-row-label">{t.modal.statusChance}</span>
                          <span className="stat-row-value">
                            {selectedWeapon.statusChance !== undefined ? `${(selectedWeapon.statusChance * 100).toFixed(1)}%` : 'N/A'}
                          </span>
                        </div>
                        <div className="stat-bar-container">
                          <div className="stat-bar-fill status-fill" style={{ width: `${Math.min(100, (selectedWeapon.statusChance || 0) * 100)}%` }}></div>
                        </div>
                      </div>

                      {/* Fire Rate */}
                      <div className="stat-row">
                        <div className="stat-row-header">
                          <span className="stat-row-label">{selectedWeapon.type === 'Melee' ? t.modal.fireRate : t.modal.fireRate}</span>
                          <span className="stat-row-value">
                            {selectedWeapon.fireRate !== undefined ? `${Number(selectedWeapon.fireRate).toFixed(2)}/s` : 'N/A'}
                          </span>
                        </div>
                        <div className="stat-bar-container">
                          <div className="stat-bar-fill speed-fill" style={{ width: `${Math.min(100, ((selectedWeapon.fireRate || 0) / (selectedWeapon.type === 'Melee' ? 2 : 20)) * 100)}%` }}></div>
                        </div>
                      </div>

                      {/* Riven Disposition */}
                      <div className="stat-row" style={{ marginBottom: '0.5rem' }}>
                        <div className="stat-row-header" style={{ marginBottom: '0.2rem' }}>
                          <span className="stat-row-label">{t.modal.rivenDisp}</span>
                          <span className="stat-row-value">
                            <span className="riven-dots">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span 
                                  key={i} 
                                  style={{ 
                                    color: i < (selectedWeapon.disposition || 3) ? 'var(--purple)' : 'var(--text-muted)',
                                    marginRight: '3px',
                                    fontSize: '1.1rem'
                                  }}
                                >
                                  ●
                                </span>
                              ))}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                              ({selectedWeapon.disposition || 3}/5)
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Damage Distribution */}
                      {selectedWeapon.damage && selectedWeapon.damage.total > 0 && (
                        <div className="damage-dist-section" style={{ marginTop: '0.5rem' }}>
                          <span className="stat-row-label" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem' }}>{t.modal.damageDist}: <strong>{selectedWeapon.damage.total} {t.modal.total}</strong></span>
                          <div className="damage-types-flex" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {Object.entries(selectedWeapon.damage)
                              .filter(([key, val]) => key !== 'total' && val > 0)
                              .map(([type, val]) => {
                                const damageNames = {
                                  pt: {
                                    impact: 'Impacto', puncture: 'Perfuração', slash: 'Cortante',
                                    heat: 'Calor', cold: 'Frio', electricity: 'Elétrico', toxin: 'Toxina',
                                    blast: 'Explosivo', radiation: 'Radiação', gas: 'Gás', magnetic: 'Magnético',
                                    viral: 'Viral', corrosive: 'Corrosivo', void: 'Void', true: 'Verdadeiro'
                                  },
                                  en: {
                                    impact: 'Impact', puncture: 'Puncture', slash: 'Slash',
                                    heat: 'Heat', cold: 'Cold', electricity: 'Electricity', toxin: 'Toxin',
                                    blast: 'Blast', radiation: 'Radiation', gas: 'Gas', magnetic: 'Magnetic',
                                    viral: 'Viral', corrosive: 'Corrosive', void: 'Void', true: 'True'
                                  },
                                  es: {
                                    impact: 'Impacto', puncture: 'Perforación', slash: 'Cortante',
                                    heat: 'Calor', cold: 'Frío', electricity: 'Electricidad', toxin: 'Toxina',
                                    blast: 'Explosivo', radiation: 'Radiación', gas: 'Gas', magnetic: 'Magnético',
                                    viral: 'Viral', corrosive: 'Corrosivo', void: 'Vacío', true: 'Verdadero'
                                  },
                                  ja: {
                                    impact: '衝撃', puncture: '貫通', slash: '切断',
                                    heat: '火炎', cold: '冷気', electricity: '電気', toxin: '毒',
                                    blast: '爆発', radiation: '放射線', gas: 'ガス', magnetic: '磁気',
                                    viral: '感染', corrosive: '腐食', void: 'Void', true: '真のダメージ'
                                  }
                                };
                                const activeDmgNames = damageNames[lang] || damageNames['pt'];
                                const name = activeDmgNames[type] || type.charAt(0).toUpperCase() + type.slice(1);
                                const pct = ((val / selectedWeapon.damage.total) * 100).toFixed(0);
                                return (
                                  <span key={type} className={`damage-badge dmg-${type}`} style={{
                                    fontSize: '0.75rem',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '4px',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-main)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem'
                                  }}>
                                    <span>{name}</span>
                                    <strong style={{ color: 'var(--cyan)' }}>{val}</strong>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>({pct}%)</span>
                                  </span>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* RIGHT COLUMN: Acquisition, Crafting, Drop Details, Action Buttons */}
              <div className="modal-right-column" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="modal-grid-info" style={{ marginBottom: '1.25rem' }}>
                  <div className="info-item">
                    <div className="info-label">{t.modal.mr}</div>
                    <div className="info-value" style={{ color: selectedWeapon.masteryReq > masteryRank ? 'var(--color-vaulted)' : 'var(--cyan)', fontSize: '0.95rem' }}>
                      MR {selectedWeapon.masteryReq}
                      {selectedWeapon.masteryReq > masteryRank && (
                        lang === 'pt' ? " (Bloqueado)" :
                        lang === 'es' ? " (Bloqueado)" :
                        lang === 'ja' ? " (ロック中)" :
                        " (Locked)"
                      )}
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">{t.modal.vaultStatus}</div>
                    <div className="info-value" style={{ color: selectedWeapon.vaulted ? 'var(--color-vaulted)' : 'var(--color-owned)', fontSize: '0.95rem' }}>
                      {selectedWeapon.vaulted ? t.modal.vaultVaulted : t.modal.vaultObtainable}
                    </div>
                  </div>
                </div>

                {/* Components / Crafting Reqs */}
                <h4 className="modal-section-title">{t.modal.crafting}</h4>
                <div className="modal-crafting-scrollable" style={{ flex: 1, maxHeight: '280px', overflowY: 'auto', marginBottom: '1.25rem', paddingRight: '0.25rem' }}>
                  {selectedWeapon.components && selectedWeapon.components.length > 0 ? (
                    <ul className="modal-materials-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {selectedWeapon.components.map((comp, index) => {
                        const lowerName = comp.name.toLowerCase();
                        let farmTip = "";
                        
                        const activeResourceLocations = resourceLocations[lang] || resourceLocations['pt'];
                        if (activeResourceLocations[lowerName]) {
                          farmTip = activeResourceLocations[lowerName];
                        } else {
                          const matchedWeapon = weapons.find(w => w.name.toLowerCase() === lowerName);
                          if (matchedWeapon) {
                            farmTip = lang === 'pt' 
                              ? `Arma Necessária (Como obter: ${getLocalizedSource(matchedWeapon.source, lang)})` 
                              : lang === 'es'
                              ? `Arma Requerida (Cómo obtener: ${getLocalizedSource(matchedWeapon.source, lang)})`
                              : lang === 'ja'
                              ? `必要な武器 (入手方法: ${getLocalizedSource(matchedWeapon.source, lang)})`
                              : `Weapon Required (How to get: ${getLocalizedSource(matchedWeapon.source, lang)})`;
                          }
                        }

                        const hasComponentDrops = comp.drops && comp.drops.length > 0;

                        return (
                          <li key={index} className="material-card-detailed">
                            <div className="material-card-header">
                              <span className="material-name">{comp.name}</span>
                              <span className="material-count">
                                Qtd: {comp.itemCount.toLocaleString()}
                              </span>
                            </div>

                            {farmTip && (
                              <div className="farm-tip-badge">
                                <span>➔</span>
                                <span>{farmTip}</span>
                              </div>
                            )}

                            {hasComponentDrops && (
                              <div className="relic-drops-container">
                                <div className="relic-drops-title">{t.modal.whereToGet}:</div>
                                <div className="relic-chips-list">
                                  {comp.drops.slice(0, 6).map((drop, dIdx) => {
                                    const relicFarm = getRelicFarmLocation(drop.location);
                                    const relicClass = getRelicTierClass(drop.location);
                                    return (
                                      <div key={dIdx} className="relic-chip-row">
                                        <span className={`relic-chip ${relicClass}`}>{drop.location}</span>
                                        {drop.rarity && <span className="relic-rarity">({drop.rarity})</span>}
                                        {relicFarm && (
                                          <span className="relic-farm-tag">
                                            {lang === 'pt' ? 'Farm' : lang === 'es' ? 'Cultivar' : lang === 'ja' ? 'ファーム' : 'Farm'}: {relicFarm}
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                  {comp.drops.length > 6 && (
                                    <div className="relic-more-text">
                                      {lang === 'pt' ? `...e mais ${comp.drops.length - 6} relíquias (veja na Wiki).` :
                                       lang === 'es' ? `...y ${comp.drops.length - 6} reliquias más (ver Wiki).` :
                                       lang === 'ja' ? `...他 ${comp.drops.length - 6} 個のレリック（Wikiを参照）。` :
                                       `...and ${comp.drops.length - 6} more relics (see Wiki).`}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                      {lang === 'pt' ? "Nenhum componente específico de fabricação listado ou comprado no Mercado." :
                       lang === 'es' ? "No se enumeran componentes de fabricación específicos o se compran en el Mercado." :
                       lang === 'ja' ? "特定の製作コンポーネントがリストされていないか、マーケットで購入されました。" :
                       "No specific crafting components listed or bought in the Market."}
                    </p>
                  )}
                </div>

                {/* Drop Details */}
                <h4 className="modal-section-title">{t.modal.whereToGet}</h4>
                <div className="drop-locations">
                  {selectedWeapon.drops && selectedWeapon.drops.length > 0 ? (
                    selectedWeapon.drops.map((drop, index) => {
                      const relicFarm = getRelicFarmLocation(drop);
                      const relicClass = getRelicTierClass(drop);
                      const isRelic = relicClass !== 'relic-default';
                      
                      return (
                        <div key={index} className="drop-location-item">
                          {isRelic ? (
                            <div className="relic-chip-row" style={{ width: '100%' }}>
                              <span className={`relic-chip ${relicClass}`}>{getLocalizedDropText(drop, lang, selectedWeapon.name)}</span>
                              {relicFarm && (
                                <span className="relic-farm-tag">
                                  {lang === 'pt' ? 'Farm' : lang === 'es' ? 'Cultivar' : lang === 'ja' ? 'ファーム' : 'Farm'}: {relicFarm}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span style={{ color: 'var(--cyan)' }}>•</span>
                                <span>{getLocalizedDropText(drop, lang, selectedWeapon.name)}</span>
                              </div>
                              {relicFarm && (
                                <span className="relic-farm-tag" style={{ alignSelf: 'flex-start', marginTop: '0.25rem', marginLeft: '1rem' }}>
                                  {lang === 'pt' ? 'Sugestão de Farm' : lang === 'es' ? 'Sugerencia de Cultivo' : lang === 'ja' ? '推奨ファーム' : 'Recommended Farm'}: {relicFarm}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                      {lang === 'pt' ? 'Consulte o Codex do jogo ou a wiki oficial para detalhes de drop adicionais.' : lang === 'es' ? 'Consulte el Códice del juego o la wiki oficial para obtener detalles adicionales de obtención.' : lang === 'ja' ? 'ドロップの詳細については、ゲーム内のコーデックスまたは公式Wikiを参照してください。' : 'Consult the in-game Codex or the official wiki for additional drop details.'}
                    </p>
                  )}
                </div>

                {/* Quick status inside modal */}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                  <button 
                    className={`btn-secondary ${(inventory[selectedWeapon.id] || inventory[selectedWeapon.name])?.owned ? 'owned-active' : ''}`}
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', borderColor: (inventory[selectedWeapon.id] || inventory[selectedWeapon.name])?.owned ? 'var(--color-owned)' : '' }}
                    onClick={() => handleToggleOwned(selectedWeapon.name, selectedWeapon.id)}
                  >
                    {(inventory[selectedWeapon.id] || inventory[selectedWeapon.name])?.owned ? `📦 ${t.modal.markOwned}` : t.modal.markOwned}
                  </button>
                  <button 
                    className="btn-primary"
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', background: (inventory[selectedWeapon.id] || inventory[selectedWeapon.name])?.mastered ? 'rgba(168, 85, 247, 0.2)' : '' }}
                    onClick={() => handleToggleMastered(selectedWeapon.name, selectedWeapon.id)}
                  >
                    {(inventory[selectedWeapon.id] || inventory[selectedWeapon.name])?.mastered ? `✔ ${t.modal.markMastered}` : t.modal.markMastered}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="app-footer">
        <p>
          {t.general.footerCreated} <a href="https://warframestat.us/" target="_blank" rel="noopener noreferrer">WarframeStat.us</a>.
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>
          {t.general.footerNotAffiliated}
        </p>
      </footer>

      {/* MOD DETAILS MODAL */}
      {selectedMod && (() => {
        const rarity = (selectedMod.rarity || 'common').toLowerCase();
        const rarityColors = {
          common: '#cd7f32',
          uncommon: '#4a90e2',
          rare: '#d4af37',
          legendary: '#ebebeb',
          riven: '#a259ff'
        };
        const glowColor = rarityColors[rarity] || '#cd7f32';
        
        return (
          <div 
            className="modal-overlay" 
            onClick={() => setSelectedMod(null)}
            style={{ '--mod-rarity-color': glowColor, '--mod-rarity-color-rgba': `${glowColor}15` }}
          >
            <div className="modal-container glass-panel mod-details-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setSelectedMod(null)}>
                <X size={22} />
              </button>

              <div className="mod-modal-content-layout">
                {/* Left Column: Visual Card Preview */}
                <div className="mod-modal-left-column">
                  {selectedMod.wikiaThumbnail && !imgErrors[selectedMod.uniqueName || selectedMod.name] ? (
                    <img 
                      src={selectedMod.wikiaThumbnail} 
                      alt={selectedMod.name} 
                      className={`mod-modal-actual-card rarity-${rarity}`}
                      onError={(e) => {
                        const key = selectedMod.uniqueName || selectedMod.name;
                        if (e.target.src.endsWith('Mod.png')) {
                          e.target.src = e.target.src.replace('Mod.png', '.png');
                        } else if (selectedMod.imageName && !e.target.src.includes('cdn.warframestat.us')) {
                          e.target.src = `https://cdn.warframestat.us/img/${selectedMod.imageName}`;
                        } else {
                          setImgErrors(prev => ({ ...prev, [key]: true }));
                        }
                      }}
                    />
                  ) : selectedMod.imageName && !imgErrors[selectedMod.uniqueName || selectedMod.name] ? (
                    <img 
                      src={`https://cdn.warframestat.us/img/${selectedMod.imageName}`} 
                      alt={selectedMod.name} 
                      className={`mod-modal-actual-card rarity-${rarity}`}
                      onError={(e) => {
                        const key = selectedMod.uniqueName || selectedMod.name;
                        setImgErrors(prev => ({ ...prev, [key]: true }));
                      }}
                    />
                  ) : (
                    <div className={`mod-modal-preview-card rarity-${rarity}`}>
                      <div className="mod-modal-preview-top">
                        <span className="mod-drain-badge">⬡ {selectedMod.baseDrain}</span>
                        <span className="mod-polarity-icon">
                          {renderPolarityIcon(selectedMod.polarity, 16, '#ffffff')}
                        </span>
                      </div>
                      
                      <div className="mod-modal-preview-placeholder">
                        <span className="mod-placeholder-question-mark">?</span>
                      </div>

                      <div className="mod-modal-preview-name">{selectedMod.name}</div>
                      <div className="mod-modal-preview-desc">
                        {renderFormattedDescription(selectedMod.description)}
                      </div>
                      
                      <div className="mod-modal-preview-bottom">
                        {renderFusionStars(selectedMod.fusionLimit)}
                        <div className="mod-modal-preview-type">{selectedMod.type}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Detailed Info & Stats */}
                <div className="mod-modal-right-column">
                  <span className={`mod-rarity-tag rarity-${rarity}`}>
                    {selectedMod.rarity} {lang === 'pt' ? 'Mod' : 'Mod'}
                  </span>
                  <h2 className="mod-modal-title glow-rarity">{selectedMod.name}</h2>
                  


                  <div className="mod-modal-scrollable-body">
                    <div className="mod-details-grid">
                      <div className="mod-details-badge">
                        <span className="badge-label">{lang === 'pt' ? 'Polaridade' : 'Polarity'}</span>
                        <span className="badge-value">
                          {selectedMod.polarity ? (
                            <>
                              {renderPolarityIcon(selectedMod.polarity, 14, 'var(--cyan)')}
                              <span style={{ marginLeft: '4px' }}>{getPolarityName(selectedMod.polarity, lang)}</span>
                            </>
                          ) : 'None'}
                        </span>
                      </div>
                      <div className="mod-details-badge">
                        <span className="badge-label">{lang === 'pt' ? 'Dreno Base' : 'Base Drain'}</span>
                        <span className="badge-value">⬡ {selectedMod.baseDrain}</span>
                      </div>
                      <div className="mod-details-badge">
                        <span className="badge-label">{lang === 'pt' ? 'Rank Máximo' : 'Max Rank'}</span>
                        <span className="badge-value">★ {selectedMod.fusionLimit}</span>
                      </div>
                      <div className="mod-details-badge">
                        <span className="badge-label">{lang === 'pt' ? 'Tipo' : 'Type'}</span>
                        <span className="badge-value" style={{ textTransform: 'capitalize', fontSize: '0.78rem' }}>{selectedMod.type}</span>
                      </div>
                    </div>

                    {/* Acquisition Method */}
                    <div className="mod-section-panel acquisition-panel">
                      <h4 className="panel-title">
                        {lang === 'pt' ? 'Método Principal de Obtenção' : 
                         lang === 'es' ? 'Método principal de obtención' :
                         lang === 'ja' ? '主な入手方法' : 'Primary Acquisition Method'}
                      </h4>
                      <p className="panel-content">
                        {getModSourceText(selectedMod, lang)}
                      </p>
                    </div>

                    {/* Stats per Rank */}
                    {selectedMod.levelStats && selectedMod.levelStats.length > 0 && (
                      <div className="mod-section-panel">
                        <h4 className="panel-title text-gold">
                          {lang === 'pt' ? 'Atributos por Nível' : 'Stats per Rank'}
                        </h4>
                        <table className="mod-modal-stat-table">
                          <thead>
                            <tr>
                              <th style={{ width: '80px' }}>Rank</th>
                              <th>{lang === 'pt' ? 'Efeito' : 'Effect'}</th>
                              <th style={{ width: '80px', textAlign: 'right' }}>{lang === 'pt' ? 'Dreno' : 'Drain'}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedMod.levelStats.map((lvl, index) => {
                              const rank = index;
                              const drain = selectedMod.baseDrain + rank;
                              return (
                                <tr key={index}>
                                  <td style={{ fontWeight: 'bold', color: 'var(--cyan)' }}>Rank {rank}</td>
                                  <td>{renderFormattedDescription(lvl.stats.join(', ')) || 'N/A'}</td>
                                  <td style={{ textAlign: 'right', fontWeight: '600' }}>{drain}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Detailed Drops Table */}
                    {selectedMod.drops && selectedMod.drops.length > 0 && (
                      <div className="mod-section-panel">
                        <h4 className="panel-title text-gold">
                          {lang === 'pt' ? 'Tabela de Drops Detalhada' : 
                           lang === 'es' ? 'Tabla de Drops Detallada' : 
                           lang === 'ja' ? '詳細なドロップテーブル' : 'Detailed Drops Table'}
                        </h4>
                        <table className="mod-modal-stat-table">
                          <thead>
                            <tr>
                              <th>{lang === 'pt' ? 'Local de Drop' : 'Drop Location'}</th>
                              <th style={{ width: '100px', textAlign: 'right' }}>Chance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedMod.drops.slice(0, 15).map((drop, idx) => (
                              <tr key={idx}>
                                <td>{translateDropLocation(drop.location, lang)}</td>
                                <td style={{ textAlign: 'right', fontWeight: '600', color: 'var(--cyan)' }}>
                                  {(drop.chance * 100).toFixed(2)}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer toggler */}
              <div className="mod-modal-footer" style={{ gap: '1rem' }}>
                <button 
                  className={`btn-obtained-toggle ${modInventory[selectedMod.uniqueName || selectedMod.name]?.obtained ? 'is-obtained' : ''}`}
                  onClick={() => handleToggleModObtained(selectedMod.name, selectedMod.uniqueName)}
                  style={{ flex: 1 }}
                >
                  {modInventory[selectedMod.uniqueName || selectedMod.name]?.obtained 
                    ? `✔ ${lang === 'pt' ? 'Mod Obtido' : 'Mod Obtained'}` 
                    : `📦 ${lang === 'pt' ? 'Marcar como Obtido' : 'Mark as Obtained'}`}
                </button>
                {selectedMod.wikiaUrl && (
                  <a 
                    href={selectedMod.wikiaUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-wiki-large"
                    style={{ flex: 1 }}
                  >
                    <ExternalLink size={14} /> {lang === 'pt' ? 'Wiki Oficial' : 'Official Wiki'}
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODULE 4: DOJO TRACKER — rendered inline when activeTab === 'sync' */}
      {activeTab === 'sync' && (
        <div style={{ marginTop: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <div className="module-section-header">
              <span style={{ fontSize: '1.2rem' }}>🏗️</span>
              <span className="module-section-title">{t.dojo?.title || 'Dojo Research Tracker'}</span>
              <div className="module-section-divider" />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              {t.dojo?.desc || 'Mark researched labs to filter Arsenal.'}
            </p>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input
                type="checkbox"
                checked={hideUnresearched}
                onChange={() => setHideUnresearched(h => !h)}
                style={{ accentColor: 'var(--cyan)', width: '16px', height: '16px' }}
              />
              <span>{t.dojo?.filterLabel || 'Hide unresearched Dojo weapons in Arsenal'}</span>
            </label>
            <div className="dojo-labs-grid">
              {[
                { key: 'tenno', icon: '🔬', label: t.dojo?.tennoLab || 'Tenno Lab' },
                { key: 'chem', icon: '🧪', label: t.dojo?.chemLab || 'Chemical Lab' },
                { key: 'bio', icon: '🦠', label: t.dojo?.bioLab || 'Biology Lab' },
                { key: 'energy', icon: '⚡', label: t.dojo?.energyLab || 'Energy Lab' },
                { key: 'bash', icon: '🛹', label: t.dojo?.bashLab || 'Bash Lab' },
                { key: 'dagath', icon: '💀', label: t.dojo?.dagathHollow || "Dagath's Hollow" }
              ].map(lab => {
                const labWeapons = weapons.filter(w => getDojoLabKey(w.source) === lab.key);
                return (
                  <div key={lab.key} className="dojo-lab-card glass-panel">
                    <div className="dojo-lab-header">
                      <span className="dojo-lab-name">
                        <span className="dojo-lab-icon">{lab.icon}</span>
                        {lab.label}
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>({labWeapons.length})</span>
                      </span>
                      <button
                        className={`dojo-research-toggle ${dojoResearch[lab.key] ? 'on' : 'off'}`}
                        onClick={() => setDojoResearch(prev => ({ ...prev, [lab.key]: !prev[lab.key] }))}
                        title={dojoResearch[lab.key] ? (t.dojo?.researched || 'Researched') : (t.dojo?.notResearched || 'Not Researched')}
                      />
                    </div>
                    <div className="dojo-weapon-list">
                      {labWeapons.slice(0, 8).map(w => {
                        const state = inventory[w.id] || inventory[w.name] || {};
                        return (
                          <div key={w.id} className={`dojo-weapon-item ${state.mastered ? 'researched-item' : ''}`}>
                            <span style={{ color: state.mastered ? 'var(--color-mastered)' : 'var(--text-main)' }}>{w.name}</span>
                            <span style={{ fontSize: '0.65rem', color: state.mastered ? 'var(--color-owned)' : 'var(--text-muted)' }}>
                              {state.mastered ? '✔' : '○'}
                            </span>
                          </div>
                        );
                      })}
                      {labWeapons.length > 8 && (
                        <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', paddingTop: '0.25rem' }}>
                          +{labWeapons.length - 8} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MODULE 5: PRIME PROFIT ANALYZER in Sync tab */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div className="module-section-header">
              <Star size={18} style={{ color: 'var(--gold)' }} />
              <span className="module-section-title">{t.prime?.title || 'Prime Profit Analyzer'}</span>
              <div className="module-section-divider" />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              {t.prime?.desc || 'Find complete Prime sets in your inventory.'}
            </p>
            {primeSetsAnalysis.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⭐</div>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{t.prime?.noSets || 'No complete sets found.'}</p>
                <p style={{ fontSize: '0.8rem' }}>{t.prime?.noSetsSub || 'Mark Prime items as Owned in Arsenal.'}</p>
              </div>
            ) : (
              <div className="prime-sets-grid">
                {primeSetsAnalysis.map(setData => (
                  <div key={setData.setName} className="prime-set-card glass-panel complete">
                    <div className="prime-set-header">
                      <span className="prime-set-name">⭐ {setData.setName}</span>
                      <span className="prime-set-badge complete">{t.prime?.completeSet || 'Complete'}</span>
                    </div>
                    <div style={{ marginBottom: '0.75rem', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {formatPrimeSetParts(setData.type, lang)}
                    </div>
                    <a
                      href={setData.marketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="prime-market-btn"
                    >
                      <ExternalLink size={12} /> {t.prime?.viewMarket || 'View on Market'}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODULE 6: SHARE CARD MODAL */}
      {showShareCard && (
        <div className="share-card-modal" onClick={(e) => { if (e.target === e.currentTarget) setShowShareCard(false); }}>
          <div className="share-card-container">
            {/* The Visual Card */}
            <div className="gamer-card">
              <div className="gamer-card-header">
                <div>
                  <div className="gamer-card-name">{username}</div>
                  <div className="gamer-card-mr">Mastery Rank — {getRankName(masteryRank)}</div>
                </div>
                <div className="gamer-card-rank-badge">
                  <span className="gamer-card-rank-number">{masteryRank}</span>
                  <div className="gamer-card-rank-label">MR</div>
                </div>
              </div>

              <div className="gamer-card-stats">
                <div className="gamer-stat-item">
                  <div className="gamer-stat-value">{stats.masteredCount}</div>
                  <div className="gamer-stat-label">{t.shareCard?.masteredItems || 'Mastered'}</div>
                </div>
                <div className="gamer-stat-item">
                  <div className="gamer-stat-value">{stats.totalCount}</div>
                  <div className="gamer-stat-label">{t.shareCard?.totalItems || 'Total'}</div>
                </div>
                <div className="gamer-stat-item">
                  <div className="gamer-stat-value">{stats.ownedCount}</div>
                  <div className="gamer-stat-label">{lang === 'pt' ? 'Obtidos' : 'Owned'}</div>
                </div>
                <div className="gamer-stat-item">
                  <div className="gamer-stat-value">{((stats.masteredCount / stats.totalCount) * 100 || 0).toFixed(1)}%</div>
                  <div className="gamer-stat-label">{t.shareCard?.completion || 'Completion'}</div>
                </div>
              </div>

              <div className="gamer-card-bars">
                {[
                  { label: lang === 'pt' ? 'Primárias' : 'Primary', val: stats.primaryMastered, total: stats.primaryCount },
                  { label: lang === 'pt' ? 'Secundárias' : 'Secondary', val: stats.secondaryMastered, total: stats.secondaryCount },
                  { label: lang === 'pt' ? 'C. a C.' : 'Melee', val: stats.meleeMastered, total: stats.meleeCount },
                  { label: 'Warframes', val: stats.warframeMastered, total: stats.warframeCount },
                  { label: lang === 'pt' ? 'Companheiros' : 'Companions', val: stats.companionMastered, total: stats.companionCount },
                  { label: lang === 'pt' ? 'Nêmesis' : 'Nemesis', val: stats.nemesisMastered, total: stats.nemesisCount }
                ].map(bar => {
                  const pct = Math.min(100, (bar.val / bar.total) * 100 || 0);
                  return (
                    <div key={bar.label} className="gamer-bar-row">
                      <span className="gamer-bar-label">{bar.label}</span>
                      <div className="gamer-bar-track">
                        <div className="gamer-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="gamer-bar-pct">{pct.toFixed(0)}%</span>
                    </div>
                  );
                })}
              </div>

              <div className="gamer-card-footer">
                <span>warframe-tracker.app</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                className="btn-primary"
                style={{ flex: 1 }}
                onClick={() => {
                  navigator.clipboard.writeText(generateShareMarkdown());
                  setShareCardCopied(true);
                  setTimeout(() => setShareCardCopied(false), 2500);
                }}
              >
                <Copy size={14} style={{ marginRight: '0.4rem' }} />
                {shareCardCopied ? (t.shareCard?.copied || 'Copied!') : (t.shareCard?.copyMarkdown || 'Copy Markdown (Discord)')}
              </button>
              <button className="btn-secondary" onClick={() => setShowShareCard(false)}>
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC GLYPH AVATAR SELECTION MODAL */}
      {showAvatarModal && (
        <div className="share-card-modal" onClick={(e) => { if (e.target === e.currentTarget) setShowAvatarModal(false); }}>
          <div className="share-card-container" style={{ maxWidth: '420px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 className="glow-purple" style={{ fontSize: '1.2rem', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
                {t.general?.avatarModalTitle || 'Escolha seu Glyph'}
              </h3>
              <button 
                onClick={() => setShowAvatarModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', outline: 'none' }}
              >
                <X size={16} />
              </button>
            </div>
            
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {lang === 'pt' ? 'Personalize o ícone de exibição do seu Perfil Tenno.' : 'Personalize your Tenno Profile display badge.'}
            </p>

            <div className="glyph-modal-grid">
              {Object.entries(GLYPHS).map(([key, data]) => {
                const isActive = userAvatar === key;
                return (
                  <div 
                    key={key} 
                    className={`glyph-select-card ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setUserAvatar(key);
                    }}
                  >
                    <div className="glyph-select-card-svg" style={{ color: data.color }}>
                      {data.svg}
                    </div>
                    <span className="glyph-select-card-name">{data.name}</span>
                  </div>
                );
              })}
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', display: 'block', padding: '0.6rem' }}
              onClick={() => setShowAvatarModal(false)}
            >
              {t.general?.avatarBtnClose || 'Salvar'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
