export interface Chemical {
  id: string;
  name: string;
  formula: string;
  color: string;
  type: 'acid' | 'base' | 'metal' | 'salt' | 'other';
  state: 'liquid' | 'solid' | 'gas';
  pubchemCID: number;
}

export interface ReactionResult {
  equation: string;
  gas: boolean;
  gasFormula: string;
  heat: boolean;
  exothermic: boolean;
  intensity: 'low' | 'medium' | 'high';
  colorChange: string;
  colorFrom: string;
  colorTo: string;
  description: string;
}

export const chemicals: Chemical[] = [
  { id: 'hcl', name: 'حمض الهيدروكلوريك', formula: 'HCl', color: '#c8e6c9', type: 'acid', state: 'liquid', pubchemCID: 313 },
  { id: 'h2so4', name: 'حمض الكبريتيك', formula: 'H₂SO₄', color: '#fff9c4', type: 'acid', state: 'liquid', pubchemCID: 1118 },
  { id: 'hno3', name: 'حمض النيتريك', formula: 'HNO₃', color: '#ffe0b2', type: 'acid', state: 'liquid', pubchemCID: 944 },
  { id: 'ch3cooh', name: 'حمض الأسيتيك', formula: 'CH₃COOH', color: '#e1f5fe', type: 'acid', state: 'liquid', pubchemCID: 176 },
  { id: 'naoh', name: 'هيدروكسيد الصوديوم', formula: 'NaOH', color: '#f3e5f5', type: 'base', state: 'solid', pubchemCID: 14798 },
  { id: 'koh', name: 'هيدروكسيد البوتاسيوم', formula: 'KOH', color: '#fce4ec', type: 'base', state: 'solid', pubchemCID: 14797 },
  { id: 'nh3', name: 'الأمونيا', formula: 'NH₃', color: '#e0f7fa', type: 'base', state: 'gas', pubchemCID: 222 },
  { id: 'zn', name: 'الزنك', formula: 'Zn', color: '#eceff1', type: 'metal', state: 'solid', pubchemCID: 23994 },
  { id: 'mg', name: 'الماغنسيوم', formula: 'Mg', color: '#e8eaf6', type: 'metal', state: 'solid', pubchemCID: 5462224 },
  { id: 'fe', name: 'الحديد', formula: 'Fe', color: '#efebe9', type: 'metal', state: 'solid', pubchemCID: 23925 },
  { id: 'cu', name: 'النحاس', formula: 'Cu', color: '#fff3e0', type: 'metal', state: 'solid', pubchemCID: 23978 },
  { id: 'caco3', name: 'كربونات الكالسيوم', formula: 'CaCO₃', color: '#fafafa', type: 'salt', state: 'solid', pubchemCID: 10112 },
  { id: 'nacl', name: 'كلوريد الصوديوم', formula: 'NaCl', color: '#ffffff', type: 'salt', state: 'solid', pubchemCID: 5234 },
  { id: 'na2co3', name: 'كربونات الصوديوم', formula: 'Na₂CO₃', color: '#f5f5f5', type: 'salt', state: 'solid', pubchemCID: 10340 },
];

export function findReaction(chemAId: string, chemBId: string): ReactionResult | null {
  const key = [chemAId, chemBId].sort().join('_');

  const db: Record<string, ReactionResult> = {
    'hcl_naoh': {
      equation: 'HCl + NaOH → NaCl + H₂O',
      gas: false, gasFormula: '', heat: true, exothermic: true,
      intensity: 'medium',
      colorChange: 'أصفر فاتح → عديم اللون', colorFrom: '#fff9c4', colorTo: '#e8f5e9',
      description: 'تفاعل تعادل حمض-قاعدة ينتج ملح وماء مع انطلاق حرارة',
    },
    'hcl_zn': {
      equation: '2HCl + Zn → ZnCl₂ + H₂↑',
      gas: true, gasFormula: 'H₂', heat: true, exothermic: true,
      intensity: 'high',
      colorChange: 'عديم اللون → رمادي فاتح', colorFrom: '#e8f5e9', colorTo: '#cfd8dc',
      description: 'تفاعل فلز مع حمض ينتج غاز الهيدروجين وكلوريد الزنك',
    },
    'hcl_mg': {
      equation: '2HCl + Mg → MgCl₂ + H₂↑',
      gas: true, gasFormula: 'H₂', heat: true, exothermic: true,
      intensity: 'high',
      colorChange: 'عديم اللون → فقاعات كثيفة', colorFrom: '#e8f5e9', colorTo: '#b3e5fc',
      description: 'تفاعل عنيف ينتج غاز الهيدروجين بسرعة مع حرارة عالية',
    },
    'hcl_fe': {
      equation: '2HCl + Fe → FeCl₂ + H₂↑',
      gas: true, gasFormula: 'H₂', heat: true, exothermic: true,
      intensity: 'medium',
      colorChange: 'عديم اللون → أخضر فاتح', colorFrom: '#e8f5e9', colorTo: '#c8e6c9',
      description: 'الحديد يتفاعل ببطء مع الحمض منتجاً غاز الهيدروجين',
    },
    'hcl_caco3': {
      equation: '2HCl + CaCO₃ → CaCl₂ + H₂O + CO₂↑',
      gas: true, gasFormula: 'CO₂', heat: true, exothermic: true,
      intensity: 'high',
      colorChange: 'عديم اللون → رغوة بيضاء', colorFrom: '#e8f5e9', colorTo: '#fffde7',
      description: 'تفاعل حمض مع كربونات ينتج غاز ثاني أكسيد الكربون ورغوة',
    },
    'hcl_na2co3': {
      equation: '2HCl + Na₂CO₃ → 2NaCl + H₂O + CO₂↑',
      gas: true, gasFormula: 'CO₂', heat: true, exothermic: true,
      intensity: 'medium',
      colorChange: 'عديم اللون → فقاعات', colorFrom: '#e8f5e9', colorTo: '#f5f5f5',
      description: 'تفاعل فوراني ينتج غاز ثاني أكسيد الكربون',
    },
    'h2so4_naoh': {
      equation: 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O',
      gas: false, gasFormula: '', heat: true, exothermic: true,
      intensity: 'high',
      colorChange: 'أصفر → عديم اللون', colorFrom: '#fff9c4', colorTo: '#e8f5e9',
      description: 'تفاعل تعادل قوي مع انطلاق حرارة شديدة',
    },
    'h2so4_zn': {
      equation: 'H₂SO₄ + Zn → ZnSO₄ + H₂↑',
      gas: true, gasFormula: 'H₂', heat: true, exothermic: true,
      intensity: 'high',
      colorChange: 'أصفر فاتح → فقاعات + حرارة', colorFrom: '#fff9c4', colorTo: '#fff3e0',
      description: 'حمض قوي مع فلز نشط ينتج غاز الهيدروجين وحرارة',
    },
    'h2so4_caco3': {
      equation: 'H₂SO₄ + CaCO₃ → CaSO₄ + H₂O + CO₂↑',
      gas: true, gasFormula: 'CO₂', heat: true, exothermic: true,
      intensity: 'medium',
      colorChange: 'أصفر → رغوة بيضاء', colorFrom: '#fff9c4', colorTo: '#fffde7',
      description: 'تكون رغوة كثيفة مع غاز ثاني أكسيد الكربون',
    },
    'hno3_naoh': {
      equation: 'HNO₃ + NaOH → NaNO₃ + H₂O',
      gas: false, gasFormula: '', heat: true, exothermic: true,
      intensity: 'medium',
      colorChange: 'برتقالي فاتح → عديم اللون', colorFrom: '#ffe0b2', colorTo: '#e8f5e9',
      description: 'تفاعل تعادل ينتج نترات الصوديوم',
    },
    'hno3_cu': {
      equation: '4HNO₃ + Cu → Cu(NO₃)₂ + 2NO₂↑ + 2H₂O',
      gas: true, gasFormula: 'NO₂', heat: true, exothermic: true,
      intensity: 'high',
      colorChange: 'أزرق → بني محمر + غاز بني', colorFrom: '#4fc3f7', colorTo: '#8d6e63',
      description: 'تفاعل أكسدة-اختزال عنيف ينتج غاز ثاني أكسيد النيتروجين البني',
    },
    'ch3cooh_naoh': {
      equation: 'CH₃COOH + NaOH → CH₃COONa + H₂O',
      gas: false, gasFormula: '', heat: true, exothermic: true,
      intensity: 'low',
      colorChange: 'شفاف → عديم اللون', colorFrom: '#e1f5fe', colorTo: '#f1f8e9',
      description: 'تفاعل تعادل هادئ ينتج أسيتات الصوديوم',
    },
    'ch3cooh_na2co3': {
      equation: '2CH₃COOH + Na₂CO₃ → 2CH₃COONa + H₂O + CO₂↑',
      gas: true, gasFormula: 'CO₂', heat: false, exothermic: false,
      intensity: 'medium',
      colorChange: 'شفاف → فقاعات', colorFrom: '#e1f5fe', colorTo: '#f1f8e9',
      description: 'تفاعل حمض الخل مع كربونات الصوديوم - تجربة البركان الشهيرة',
    },
    'naoh_nh3': {
      equation: 'NaOH + NH₃ → No Reaction', // Actually NH3 is a base too, but let's keep it simple
      gas: false, gasFormula: '', heat: false, exothermic: false,
      intensity: 'low',
      colorChange: 'لا تغيير', colorFrom: '#f3e5f5', colorTo: '#f3e5f5',
      description: 'لا تفاعل - قاعدتان لا تتفاعلان',
    },
    'hcl_h2so4': {
      equation: 'HCl + H₂SO₄ → No Reaction',
      gas: false, gasFormula: '', heat: false, exothermic: false,
      intensity: 'low',
      colorChange: 'لا تغيير', colorFrom: '#e8f5e9', colorTo: '#e8f5e9',
      description: 'لا تفاعل - حمضان لا يتفاعلان',
    },
  };

  return db[key] || null;
}

export function getCompoundProperty(cid: number): Promise<Record<string, any>> {
  return fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularWeight,MolecularFormula,IUPACName,CanonicalSMILES,XLogP,HBondDonorCount,HBondAcceptorCount,HeavyAtomCount/JSON`)
    .then((r) => r.json())
    .then((d) => d?.PropertyTable?.Properties?.[0] || {})
    .catch(() => ({}));
}
