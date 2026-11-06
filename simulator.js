/**
 * P'Hook LINE chat simulator — a small working "bot".
 * Parses what the visitor types (Thai), keeps an in-memory ledger for the
 * session, and renders LINE-style Flex cards as real HTML (not static images).
 */

/* ---------- helpers ---------- */
const TH_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const pad2 = (n) => String(n).padStart(2, '0');
const fmtMoney = (n) => '฿' + (Math.round(n * 100) / 100).toLocaleString('en-US', { maximumFractionDigits: 2 });
const fmtDate = (d) => `${d.getDate()} ${TH_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;
const fmtDateTime = (d) => `${fmtDate(d)} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const sameMonth = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ---------- categories ---------- */
const EXPENSE_CATS = [
  { name: 'บิล', emoji: '🧾', kw: ['ค่าไฟ', 'ค่าน้ำ', 'ค่าเน็ต', 'อินเทอร์เน็ต', 'ค่าโทร', 'เติมเงิน', 'ค่าบริการ', 'บิล', 'ประกัน', 'ภาษี', 'ค่าแก๊ส'] },
  { name: 'ที่พัก', emoji: '🏠', kw: ['ค่าเช่า', 'ค่าห้อง', 'หอพัก', 'คอนโด', 'ส่วนกลาง', 'ผ่อนบ้าน', 'ซ่อมบ้าน'] },
  { name: 'เดินทาง', emoji: '🚌', kw: ['bts', 'mrt', 'รถไฟฟ้า', 'แท็กซี่', 'taxi', 'grab', 'bolt', 'วิน', 'มอไซค์', 'มอเตอร์ไซค์', 'รถเมล์', 'น้ำมัน', 'ทางด่วน', 'ค่าจอด', 'จอดรถ', 'ตั๋ว', 'เครื่องบิน', 'รถทัวร์', 'เดินทาง', 'ค่ารถ', 'ค่าโดยสาร', 'ปั๊ม', 'ล้างรถ', 'รถไฟ'] },
  { name: 'สัตว์เลี้ยง', emoji: '🐾', kw: ['แมว', 'หมา', 'สุนัข', 'สัตว์เลี้ยง', 'ทรายแมว'] },
  { name: 'สุขภาพ', emoji: '💊', kw: ['ยา', 'หมอ', 'โรงพยาบาล', 'คลินิก', 'ฟิตเนส', 'ยิม', 'วิตามิน', 'ทำฟัน', 'ตรวจสุขภาพ', 'ร้านขายยา'] },
  { name: 'การศึกษา', emoji: '📚', kw: ['คอร์ส', 'เรียน', 'หนังสือ', 'ค่าเทอม', 'อบรม', 'สอนพิเศษ'] },
  { name: 'บันเทิง', emoji: '🎬', kw: ['หนัง', 'netflix', 'เน็ตฟลิกซ์', 'spotify', 'youtube', 'เกม', 'คอนเสิร์ต', 'ปาร์ตี้', 'คาราโอเกะ', 'เที่ยว', 'โรงแรม', 'ท่องเที่ยว', 'สมัครสมาชิก', 'disney'] },
  { name: 'ช้อปปิ้ง', emoji: '🛍️', kw: ['เสื้อ', 'กางเกง', 'รองเท้า', 'กระเป๋า', 'shopee', 'lazada', 'ช้อป', 'เครื่องสำอาง', 'ครีม', 'น้ำหอม', 'ของขวัญ', 'นาฬิกา', 'แว่น', 'ซื้อของ', 'ลิปสติก'] },
  { name: 'ของใช้', emoji: '🧴', kw: ['ผงซักฟอก', 'สบู่', 'แชมพู', 'ทิชชู่', 'ของใช้', '7-11', 'เซเว่น', 'แมคโคร', 'โลตัส', 'บิ๊กซี', 'ซุปเปอร์', 'ยาสีฟัน', 'น้ำยา'] },
  { name: 'อาหาร', emoji: '🍜', kw: ['ข้าว', 'ก๋วยเตี๋ยว', 'เส้น', 'หมู', 'ไก่', 'เนื้อ', 'ปลา', 'กุ้ง', 'ส้มตำ', 'ชาบู', 'สุกี้', 'บุฟเฟ', 'ซูชิ', 'ราเมน', 'พิซซ่า', 'เบอร์เกอร์', 'ขนม', 'ผลไม้', 'มื้อ', 'อาหาร', 'ตามสั่ง', 'กะเพรา', 'ผัด', 'ต้ม', 'แกง', 'ยำ', 'ตลาด', 'ของกิน', 'ไอติม', 'ไอศกรีม', 'เค้ก', 'ปิ้งย่าง', 'เดลิเวอรี่', 'โจ๊ก', 'ขนมปัง', 'แซนวิช', 'ไข่', 'เกาเหลา', 'ข้าวมันไก่', 'หมูกระทะ', 'ติ่มซำ', 'มาม่า', 'สเต็ก'] },
  { name: 'เครื่องดื่ม', emoji: '🥤', kw: ['กาแฟ', 'ชา', 'น้ำ', 'โค้ก', 'นม', 'เบียร์', 'เหล้า', 'ไวน์', 'สมูทตี้', 'โกโก้', 'คาเฟ่', 'ลาเต้', 'อเมริกาโน่', 'โซดา', 'เป๊ปซี่', 'ชานม', 'ชาไข่มุก', 'เครื่องดื่ม', 'starbucks', 'อเมซอน', 'coffee', 'เอสเพรสโซ่', 'มัทฉะ', 'ชาเขียว', 'น้ำผลไม้'] }
];
const INCOME_CATS = [
  { name: 'เงินเดือน', emoji: '💼', kw: ['เงินเดือน'] },
  { name: 'โบนัส', emoji: '🎁', kw: ['โบนัส'] },
  { name: 'ขายของ', emoji: '🏪', kw: ['ขาย'] },
  { name: 'รายได้เสริม', emoji: '💡', kw: ['ฟรีแลนซ์', 'ค่าจ้าง', 'งานเสริม', 'ค่าคอม', 'ดอกเบี้ย', 'ปันผล', 'ทิป', 'ค่าตอบแทน'] }
];
const INCOME_WORDS = ['เงินเดือน', 'โบนัส', 'ขาย', 'รายได้', 'ได้รับ', 'ค่าจ้าง', 'เงินเข้า', 'ดอกเบี้ย', 'ปันผล', 'ฟรีแลนซ์', 'รับเงิน', 'คืนเงิน', 'ได้เงิน', 'ค่าคอม', 'ทิป', 'ค่าตอบแทน', 'ถูกหวย', 'ถูกรางวัล'];
const FX = { JPY: 0.25, USD: 35, EUR: 38, GBP: 44, KRW: 0.026, CNY: 4.9, SGD: 26 };
const FX_ALIAS = { 'เยน': 'JPY', 'ดอลลาร์': 'USD', 'ยูโร': 'EUR', 'วอน': 'KRW', 'หยวน': 'CNY' };

function categorize(name, type) {
  const n = name.toLowerCase();
  const list = type === 'income' ? INCOME_CATS : EXPENSE_CATS;
  for (const c of list) {
    if (c.kw.some((k) => n.includes(k))) return { cat: c.name, emoji: c.emoji };
  }
  return type === 'income' ? { cat: 'ไม่ระบุหมวด', emoji: '💰' } : { cat: 'อื่นๆ', emoji: '📦' };
}

/* ---------- parsing ---------- */
function toArabicDigits(s) {
  return s.replace(/[๐-๙]/g, (d) => '๐๑๒๓๔๕๖๗๘๙'.indexOf(d));
}

function parseEntry(raw, baseDate) {
  let s = toArabicDigits(raw.trim());
  if (!s || s.length > 60) return null;

  let sign = null;
  if (/^[+＋]/.test(s)) sign = '+';
  else if (/^[-−–]/.test(s)) sign = '-';

  const tag = (s.match(/#([^\s#@]+)/) || [])[1] || null;
  s = s.replace(/#[^\s#@]+/g, ' ');
  const walletRaw = (s.match(/@([^\s#@]+)/) || [])[1] || null;
  s = s.replace(/@[^\s#@]+/g, ' ');
  s = s.replace(/(\d),(?=\d{3}(?!\d))/g, '$1');

  let dayOffset = 0;
  const dw = s.match(/(เมื่อวานซืน|เมื่อวาน|วันนี้)/);
  if (dw) {
    dayOffset = dw[1] === 'เมื่อวานซืน' ? 2 : dw[1] === 'เมื่อวาน' ? 1 : 0;
    s = s.replace(dw[1], ' ');
  }

  const re = /(?<![\d\-:/.])(\d+(?:\.\d+)?)\s*(k|K|พัน|หมื่น|แสน)?\s*(JPY|USD|EUR|GBP|KRW|CNY|SGD|jpy|usd|eur|gbp|krw|cny|sgd|เยน|ดอลลาร์|ยูโร|วอน|หยวน)?(?![\d\-:/])/g;
  const all = [...s.matchAll(re)];
  if (!all.length) return null;
  const m = all[all.length - 1];
  let amount = parseFloat(m[1]);
  const mult = { k: 1000, K: 1000, 'พัน': 1000, 'หมื่น': 10000, 'แสน': 100000 }[m[2]] || 1;
  amount *= mult;
  let fxCode = (m[3] || '').toUpperCase();
  if (FX_ALIAS[m[3]]) fxCode = FX_ALIAS[m[3]];
  const original = fxCode && FX[fxCode] ? { code: fxCode, amount } : null;
  if (original) amount = amount * FX[fxCode];
  if (!(amount > 0) || amount > 100000000) return null;

  let name = (s.slice(0, m.index) + ' ' + s.slice(m.index + m[0].length))
    .replace(/บาท|฿|บ\.|baht/gi, ' ')
    .replace(/^[\s+＋\-−–]+/, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (name.length > 32) return null;

  const lower = name.toLowerCase();
  let type = 'expense';
  if (sign === '+') type = 'income';
  else if (sign === '-') type = 'expense';
  else if (INCOME_WORDS.some((w) => lower.includes(w))) type = 'income';
  if (!name) name = type === 'income' ? 'รายรับ' : 'ไม่ระบุ';

  const { cat, emoji } = categorize(name, type);
  const d = new Date(baseDate);
  d.setDate(d.getDate() - dayOffset);
  if (dayOffset > 0) d.setHours(12, 0, 0, 0);

  return { name, amount, type, cat, emoji, wallet: walletLabel(walletRaw), tag, original, ts: d };
}

function walletLabel(w) {
  if (!w) return '💵 เงินสด';
  const k = w.toLowerCase();
  if (['เงินสด', 'cash'].includes(k)) return '💵 เงินสด';
  return '💳 ' + w;
}

function parseMulti(text, baseDate) {
  const parts = text.split(/,(?!\d{3}(?!\d))|[\n;，]+/).map((p) => p.trim()).filter(Boolean);
  if (parts.length > 1) {
    const dw = text.match(/(เมื่อวานซืน|เมื่อวาน|วันนี้)/);
    const list = parts.map((p) => parseEntry(dw && !p.includes(dw[1]) ? `${dw[1]} ${p}` : p, baseDate));
    if (list.every(Boolean)) return list;
  }
  const one = parseEntry(text, baseDate);
  return one ? [one] : null;
}

/* ---------- persona voice ---------- */
const PERSONA_LABEL = {
  warm: '🌸 โหมดฮูกน้อยอบอุ่น', bestie: '🤝 โหมดฮูกเพื่อนซี้', spicy: '🌶️ โหมดฮูกปากแจ๋ว',
  tea: '🫖 โหมดนกฮูกจิบชา', night: '🦉 โหมดฮูกนอนดึก'
};
const PERSONA_KEYS = Object.keys(PERSONA_LABEL);
const VOICE = {
  expense: {
    warm: ['อย่าลืมตรวจสอบรายการที่จดด้วยนะ', 'จดให้แล้วนะครับ ใช้จ่ายอย่างมีสติน้า ✨'],
    bestie: ['จดไว้ละ เดี๋ยวลืมอีก 555', 'เรียบร้อยเพื่อน! จดให้แล้ว'],
    spicy: ['เปย์อีกแล้วนะแก! จดไว้ให้ละ', 'อีกแล้วเหรอ! จดให้ก็ได้ แต่เบรกบ้างนะ'],
    tea: ['บันทึกเรียบร้อยครับ... หวังว่าจะไม่เกินงบนะครับ', 'จดแล้วครับ ขอให้รอบนี้คุ้มค่านะครับ'],
    night: ['ตาวาวทุกรายจ่าย! จดไว้ให้ละ', 'จดแล้ว อย่าลืมพักผ่อนนะ']
  },
  income: {
    warm: ['เย้! มีเงินเข้ากระเป๋าเพิ่มแล้วนะ', 'ยินดีด้วยครับ เงินเข้าแล้ว 🎉'],
    bestie: ['รวยแล้วเพื่อน! เลี้ยงข้าวด้วยนะ', 'เงินเข้า! จดให้ละ'],
    spicy: ['เงินเข้าแล้ว อย่าเพิ่งรีบผลาญล่ะ!', 'ได้เงินแล้วก็อย่าลืมเก็บออมนะแก'],
    tea: ['ยินดีด้วยครับ รายรับเข้ามาแล้ว', 'บันทึกรายรับเรียบร้อยครับ'],
    night: ['เงินเข้าตอนนี้เลย ตาสว่างเลยทีเดียว', 'มีรายรับเข้า จดให้แล้ว!']
  },
  night: 'ดึกป่านนี้ยังไม่นอนอีกนะ! จดไว้ให้ละ รีบพักผ่อนนะ',
  greet: {
    warm: 'สวัสดีครับ! วันนี้มีอะไรให้พี่ฮูกช่วยจดไหมครับ ✨',
    bestie: 'ว่าไงเพื่อน! วันนี้ใช้เงินไปกี่บาทแล้วล่ะ 555',
    spicy: 'มาแล้วเหรอ! วันนี้เปย์อะไรไปบ้างบอกมา!',
    tea: 'สวัสดีครับ เชิญเล่าได้เลยครับว่าวันนี้ใช้จ่ายอะไรไปบ้าง',
    night: 'ว้าย ยังไม่นอนเหรอ! มีรายจ่ายอะไรจะจดบอกมา'
  },
  unknown: {
    warm: 'พี่ฮูกยังไม่แน่ใจว่าหมายถึงอะไรครับ ลองพิมพ์ชื่อรายการตามด้วยยอด เช่น "น้ำ 50" ดูนะครับ 🙏',
    bestie: 'อ่านไม่ออกอ่ะเพื่อน ลองพิมพ์ "ชื่อของ ราคา" เช่น "น้ำ 50" ดิ',
    spicy: 'พิมพ์อะไรเนี่ย พี่ฮูกไม่เข้าใจ! ต้องแบบ "น้ำ 50" ถึงจะจดได้!',
    tea: 'ขออภัยครับ ผมยังไม่เข้าใจข้อความนี้ ลองพิมพ์ในรูปแบบ "น้ำ 50" ดูสิครับ',
    night: 'ง่วงจนอ่านไม่ออกเลย... ลองพิมพ์ "น้ำ 50" ให้ชัดๆ หน่อยนะ'
  }
};
const MONTHLY_BUDGET = 15000;

/* ---------- simulator ---------- */
function initSimulator() {
  const chatArea = document.getElementById('simChatArea');
  const form = document.getElementById('simForm');
  const input = document.getElementById('simInput');
  const chips = document.getElementById('presetChips');
  const slipBtn = document.getElementById('simSlipBtn');
  const micBtn = document.getElementById('simMicBtn');
  const badge = document.getElementById('currentSimPersona');
  const infoTitle = document.getElementById('simInfoTitle');
  const infoDesc = document.getElementById('simInfoDesc');
  const infoList = document.getElementById('simInfoHighlights');
  if (!chatArea || !form) return;

  window.phookPersona = window.phookPersona || 'warm';
  const persona = () => (PERSONA_LABEL[window.phookPersona] ? window.phookPersona : 'warm');

  /* ----- ledger (seeded so summaries look lived-in) ----- */
  const now = () => new Date();
  let nextId = 1;
  const ledger = [];
  (function seed() {
    const t = now();
    const monthStart = new Date(t.getFullYear(), t.getMonth(), 1, 9, 0);
    const at = (off, h, m) => {
      const d = new Date(t.getFullYear(), t.getMonth(), t.getDate() - off, h, m);
      return d < monthStart ? new Date(monthStart.getTime() + h * 60000) : d;
    };
    const rows = [
      ['income', 'เงินเดือน', 25000, at(99, 9, 0)],
      ['expense', 'ค่าเช่าห้อง', 6500, at(99, 10, 0)],
      ['expense', 'ค่าไฟ', 1250, at(4, 18, 20)],
      ['expense', 'Netflix', 419, at(3, 20, 5)],
      ['expense', 'ข้าวมันไก่', 60, at(1, 12, 10)],
      ['expense', 'กาแฟ', 45, at(1, 8, 40)],
      ['expense', 'BTS', 42, at(1, 8, 10)],
      ['expense', 'ข้าวหมูกรอบ', 65, at(0, 12, 30)]
    ];
    rows.forEach(([type, name, amount, ts]) => {
      const { cat, emoji } = categorize(name, type);
      ledger.push({ id: nextId++, type, name, amount, cat, emoji, wallet: '💵 เงินสด', tag: null, original: null, ts });
    });
  })();

  const inMonth = (e) => sameMonth(e.ts, now());
  const sum = (list, type) => list.filter((e) => e.type === type).reduce((a, e) => a + e.amount, 0);
  const monthExpense = () => sum(ledger.filter(inMonth), 'expense');
  const catTotals = (list) => {
    const m = {};
    list.filter((e) => e.type === 'expense').forEach((e) => {
      m[e.cat] = m[e.cat] || { cat: e.cat, emoji: e.emoji, total: 0 };
      m[e.cat].total += e.amount;
    });
    return Object.values(m).sort((a, b) => b.total - a.total);
  };

  /* ----- info box (right-hand explainer) ----- */
  const INFO = {
    expense: ['จดไว ไม่เสียเวลา', 'พิมพ์เพียงชื่อรายการและตัวเลข พี่ฮูกวิเคราะห์แยกหมวดหมู่อัตโนมัติ พร้อมแสดงแถบงบประมาณและปุ่มลบ/แก้ไขได้ทันที', ['แยกหมวดหมู่อัตโนมัติ (อาหาร เครื่องดื่ม เดินทาง บิล)', 'การ์ดจดสำเร็จพร้อมปุ่ม แก้ไข / ลบ ทันที', 'แจ้งเตือนสถานะงบประมาณทุกครั้งที่จด']],
    income: ['บันทึกรายรับ แยกกระเป๋าได้', 'บันทึกเงินเดือน โบนัส หรือรายได้เสริมง่ายๆ บอทอัปเดตยอดเงินคงเหลือของคุณทันที', ['พิมพ์ + นำหน้า หรือพิมพ์คำว่าเงินเดือน/ขาย', 'เลือกกระเป๋าปลายทางได้ เช่น @KTC', 'อัปเดตยอดคงเหลือสุทธิประจำเดือนอัตโนมัติ']],
    multi: ['จดหลายรายการในครั้งเดียว', 'พิมพ์คั่นด้วยคอมมา เช่น "ข้าว 50, กาแฟ 45" พี่ฮูกแยกให้เป็นหลายรายการและจัดหมวดให้แต่ละอัน (Pro)', ['คั่นรายการด้วย , หรือขึ้นบรรทัดใหม่', 'จัดหมวดแยกทีละรายการ', 'ลบ/แก้ไขย้อนหลังได้']],
    summary: ['สรุปครบ จบในแชทเดียว', 'ดูภาพรวมรายรับ รายจ่าย ยอดคงเหลือ และหมวดที่ใช้เงินมากที่สุด คำนวณจากรายการที่คุณจดจริง', ['สรุปวันนี้ / เดือนนี้ / หมวด', 'จัดอันดับหมวดที่ใช้จ่ายสูงสุด', 'ปุ่มลัดเปิดกราฟในแอปเว็บ LIFF']],
    recent: ['ดูรายการล่าสุดได้ทันที', 'พิมพ์ "ล่าสุด" เพื่อดู 5 รายการที่จดไว้ล่าสุด พร้อมคำสั่งลัดสำหรับลบหรือแก้ไข', ['แสดงหมวดและวันเวลา', 'ลบล่าสุด · แก้ล่าสุด 45', 'เปิดดูทั้งหมดในแอป']],
    search: ['ค้นหาแม่นยำ พร้อมยอดรวม', 'อยากรู้ว่าเดือนนี้หมดค่าน้ำไปกี่บาท? พิมพ์ค้นหา บอทรวมยอดและลิสต์ทุกรายการให้', ['ค้นหาตามชื่อสินค้า หมวดหมู่ หรือแท็ก #', 'รวมยอดรายรับ-รายจ่ายของผลลัพธ์', 'แตะเพื่อเปิดดูในแอป']],
    del: ['ลบ/แก้ไขได้ในคำสั่งเดียว', 'จดผิดไม่เป็นไร พิมพ์ "ลบล่าสุด" หรือ "แก้ล่าสุด 45" หรือกดปุ่มบนการ์ดได้เลย', ['ลบล่าสุด', 'แก้ล่าสุด 45 (แก้ยอด)', 'ปุ่มแก้/ลบบนการ์ดทุกใบ']],
    split: ['สมุดกลุ่ม LINE & หารบิล', 'ชวนพี่ฮูกเข้ากลุ่มแก๊งเพื่อน สั่งหารบิลได้ทันที ระบบแบ่งยอดและสร้าง QR พร้อมเพย์รายคน พร้อมปุ่มตามเงิน (Elite)', ['หารเท่ากันตามจำนวนคน เช่น "หารบิล หมูกระทะ 1200 4 คน"', 'สร้าง QR พร้อมเพย์ระบุยอดรายคน', 'ปุ่ม "ตามเงิน" เตือนคนที่ยังไม่โอน']],
    reminder: ['เลขาช่วยเตือน & ปฏิทิน', 'สั่งเตือนกินยา จ่ายบิล นัดประชุม บอทเตือนในแชทเมื่อถึงเวลา และมีปุ่มเพิ่มลง Google Calendar ได้ทันที', ['พิมพ์วันเวลาแบบภาษาพูด เช่น "พรุ่งนี้ 9 โมง"', 'เตือนซ้ำ ทุกวัน/สัปดาห์/เดือน', 'ปุ่มเพิ่มลง Google Calendar ใช้งานได้จริง']],
    ask: ['ถามพี่ฮูก AI อัจฉริยะ', 'ถามเป็นภาษาพูดธรรมชาติ บอทวิเคราะห์จากรายการของคุณจริง ตอบตรงประเด็น ช่วยวางแผนการเงิน', ['วิเคราะห์พฤติกรรมและคาดการณ์ปลายเดือน', 'คำนวณงบที่เหลือ', 'ข้อมูลปลอดภัย ไม่ส่งเลขบัตร/รหัสผ่านให้ AI']],
    slip: ['AI สแกนสลิป & ใบเสร็จ', 'โอนเงินเสร็จแล้วเพียงส่งรูปสลิปเข้ามา พี่ฮูกอ่านยอด วันที่ และผู้รับให้ตรวจสอบก่อนกดยืนยัน', ['อ่านสลิปทุกธนาคารชั้นนำ', 'ป้องกันการจดสลิปซ้ำ', 'Pro อ่านได้ 30 ใบ/เดือน (Elite ไม่อั้น)']],
    voice: ['จดด้วยเสียงพูด (Voice Log)', 'ขับรถ ถือของ หรือไม่สะดวกพิมพ์? กดอัดเสียงสั้นๆ พี่ฮูกฟังแล้วจดให้เสร็จ', ['แปลงเสียงภาษาไทยเป็นรายการ', 'จับชื่อสินค้าและยอดพร้อมกัน', 'Pro 20 ครั้ง/เดือน']],
    trip: ['หารค่าทริปเที่ยว ไม่ปวดหัว', 'ไปเที่ยวกับเพื่อนหลายวัน พี่ฮูกรวมยอดทั้งทริปและคำนวณว่าใครต้องโอนคืนใครเท่าไร (Elite)', ['บันทึกกองกลางตลอดทริป', 'คำนวณยอดสุทธิรายคน', 'ส่งออกสรุปให้เพื่อนในกลุ่ม']],
    wallets: ['หลายกระเป๋า แยกบัญชีชัด', 'ดูยอดทุกกระเป๋าในคำสั่งเดียว พิมพ์ @ชื่อกระเป๋า ท้ายรายการเพื่อจดลงกระเป๋านั้น', ['เงินสด ธนาคาร บัตรเครดิต e-Wallet', 'โอนข้ามกระเป๋าได้ (Pro)', 'กระเป๋าร่วมกับแฟน/ครอบครัว']],
    help: ['พิมพ์อะไรได้บ้าง', 'พี่ฮูกเข้าใจภาษาพูดธรรมชาติ ลองคำสั่งด้านล่างหรือดูคลังคำสั่งเต็มๆ ด้านล่างของหน้านี้', ['จด: น้ำ 50 · เงินเดือน 25000', 'ดู: สรุปวันนี้ · สรุปเดือนนี้ · ล่าสุด', 'จัดการ: ลบล่าสุด · แก้ล่าสุด 45 · ค้นหา กาแฟ']],
    upsell: ['ปลดล็อกด้วยแพ็กเกจ Pro / Elite', 'ฟังก์ชันขั้นสูงอย่างพยากรณ์ หนี้ บิลเตือน เป้าหมายออม อยู่ในแพ็กเกจ Pro/Elite ทดลองฟรี 7 วัน', ['Free: จด สรุป เตือน โน้ต ถาม AI 200 ครั้ง/เดือน', 'Pro: งบ กราฟ กระเป๋าร่วม เสียง สลิป', 'Elite: สมุดกลุ่ม หนี้ พยากรณ์ AI']],
    chat: ['พิมพ์ได้ตามสบาย', 'พี่ฮูกเข้าใจภาษาพูดธรรมชาติ และพร้อมช่วยในทุกเรื่องที่เกี่ยวกับเงินของคุณ', ['พิมพ์ชื่อรายการตามด้วยยอด เช่น "ข้าวเหนียวหมูปิ้ง 35"', 'พิมพ์ "สรุป" เพื่อดูยอด', 'พิมพ์ "เตือน ..." เพื่อตั้งนาฬิกาเตือน']]
  };
  function setInfo(key) {
    const d = INFO[key] || INFO.chat;
    if (infoTitle) infoTitle.textContent = d[0];
    if (infoDesc) infoDesc.textContent = d[1];
    if (infoList) {
      infoList.innerHTML = d[2].map((h) => `<div class="highlight-item"><span class="check-icon">✓</span><span>${escapeHtml(h)}</span></div>`).join('');
    }
  }

  /* ----- DOM append helpers ----- */
  const timeNow = () => `${pad2(now().getHours())}:${pad2(now().getMinutes())}`;
  const scroll = () => { chatArea.scrollTop = chatArea.scrollHeight; };
  function userBubble(html) {
    chatArea.insertAdjacentHTML('beforeend', `<div class="sim-msg-row user-row"><div class="sim-bubble user-bubble-sim">${html}<span class="msg-time">${timeNow()}</span></div></div>`);
    scroll();
  }
  function botRow(inner, cls = '') {
    chatArea.insertAdjacentHTML('beforeend', `<div class="sim-msg-row bot-row"><img src="brand/logo.png?v=2" class="sim-bot-icon" alt="พี่ฮูก"><div class="sim-bot-content ${cls}">${inner}</div></div>`);
    scroll();
  }
  const botText = (t) => botRow(`<div class="sim-bubble bot-bubble">${escapeHtml(t).replace(/\n/g, '<br>')}<span class="msg-time">${timeNow()}</span></div>`);
  const botCard = (html) => botRow(html, 'fx-wrap');
  function botImage(src, alt) {
    botRow(`<div class="card-bubble-container"><img src="${src}" alt="${escapeHtml(alt)}" class="sim-card-img"></div>`);
    const img = chatArea.querySelector('.bot-row:last-child img.sim-card-img');
    if (img) img.addEventListener('load', scroll);
  }
  function showTyping() {
    chatArea.insertAdjacentHTML('beforeend', `<div class="sim-msg-row bot-row" id="simTyping"><img src="brand/logo.png?v=2" class="sim-bot-icon" alt="พี่ฮูก"><div class="typing-indicator"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div></div>`);
    scroll();
  }
  const hideTyping = () => { const t = document.getElementById('simTyping'); if (t) t.remove(); };

  /* ----- flex card renderers ----- */
  const card = ({ title, sub, icon = '', body = '', foot = '' }) => `
    <div class="fx-card">
      <div class="fx-head"><div><div class="fx-title">${title}</div>${sub ? `<div class="fx-sub">${sub}</div>` : ''}</div>${icon ? `<span class="fx-ico">${icon}</span>` : ''}</div>
      <div class="fx-body">${body}</div>${foot}
    </div>`;
  const appFoot = (label = 'ดูทั้งหมดในแอป') => `<button type="button" class="fx-foot" data-act="app">${label}</button>`;
  const bar = (pct, color = '#A78BDF') => `<div class="fx-bar"><i style="width:${Math.max(2, Math.min(100, pct))}%;background:${color}"></i></div>`;

  function subtitleFor(type) {
    const p = persona();
    const h = now().getHours();
    if (type === 'expense' && (h >= 23 || h < 4) && p === 'night') return VOICE.night;
    return pick(VOICE[type][p]);
  }

  function budgetLine() {
    const used = monthExpense();
    const pct = (used / MONTHLY_BUDGET) * 100;
    const color = pct >= 100 ? '#E11D48' : pct >= 80 ? '#F59E0B' : '#0F766E';
    let note = '';
    if (pct >= 100) note = `<div class="fx-warn">🚨 เกินงบเดือนนี้แล้ว ${fmtMoney(used - MONTHLY_BUDGET)}</div>`;
    else if (pct >= 80) note = `<div class="fx-warn">⚠️ ใช้ไปแล้ว ${Math.round(pct)}% ของงบเดือนนี้</div>`;
    return `<div class="fx-sep"></div>
      <div class="fx-row"><span class="fx-muted">งบเดือนนี้ ${fmtMoney(MONTHLY_BUDGET)}</span><span>${Math.round(pct)}%</span></div>
      ${bar(pct, color)}
      <div class="fx-muted">ใช้ไป ${fmtMoney(used)} · เหลือ ${fmtMoney(Math.max(0, MONTHLY_BUDGET - used))}</div>${note}`;
  }

  function recordCard(entries, { title = 'จดสำเร็จ ✅', sub } = {}) {
    if (entries.length === 1) {
      const e = entries[0];
      const isInc = e.type === 'income';
      const monthCat = e.type === 'expense' ? catTotals(ledger.filter(inMonth)).find((c) => c.cat === e.cat) : null;
      const totalExp = monthExpense();
      const fx = e.original ? `<div class="fx-muted">≈ ${e.original.amount.toLocaleString('en-US')} ${e.original.code} (เรต ${FX[e.original.code]})</div>` : '';
      const body = `
        <div class="fx-row"><div class="fx-lead"><span class="fx-pill ${isInc ? 'inc' : 'exp'}">${isInc ? 'รายรับ' : 'รายจ่าย'}</span><b>- ${escapeHtml(e.cat)}</b></div><button type="button" class="fx-share ${isInc ? 'inc' : 'exp'}" data-act="share">แชร์</button></div>
        <div class="fx-muted">${fmtDateTime(e.ts)}</div>
        <div class="fx-row fx-item"><b class="fx-name">${e.emoji} ${escapeHtml(e.name)}</b>
          <span class="fx-right"><b class="fx-amt ${isInc ? 'inc' : 'exp'}">${isInc ? '+' : ''}${fmtMoney(e.amount)}</b>
          <button type="button" class="fx-ibtn" data-act="edit" data-id="${e.id}" aria-label="แก้ไข">✏️</button>
          <button type="button" class="fx-ibtn danger" data-act="del" data-id="${e.id}" aria-label="ลบ">🗑️</button></span></div>
        ${fx}
        <div class="fx-muted">${isInc ? 'รับเข้า' : 'จ่ายด้วย'}</div><div class="fx-chip">✔ ${escapeHtml(e.wallet)}</div>
        ${e.tag ? `<div class="fx-chip tag">#${escapeHtml(e.tag)}</div>` : ''}
        ${monthCat ? `<div class="fx-sep"></div><div class="fx-row"><b>${e.emoji} ${escapeHtml(e.cat)} (เดือนนี้)</b><b class="exp">${fmtMoney(monthCat.total)}</b></div>${bar((monthCat.total / Math.max(totalExp, 1)) * 100)}` : ''}
        ${e.type === 'expense' ? budgetLine() : ''}`;
      return card({ title, sub: sub || subtitleFor(e.type), body });
    }
    const total = entries.reduce((a, e) => a + (e.type === 'income' ? e.amount : -e.amount), 0);
    const rows = entries.map((e) => `
      <div class="fx-row"><div><b>${e.emoji} ${escapeHtml(e.name)}</b><div class="fx-muted">${escapeHtml(e.cat)}</div></div>
      <span class="fx-right"><b class="fx-amt ${e.type === 'income' ? 'inc' : 'exp'}">${e.type === 'income' ? '+' : '-'}${fmtMoney(e.amount)}</b>
      <button type="button" class="fx-ibtn danger" data-act="del" data-id="${e.id}" aria-label="ลบ">🗑️</button></span></div>`).join('');
    return card({
      title: `จดสำเร็จ ${entries.length} รายการ ✅`, sub: sub || subtitleFor('expense'),
      body: `${rows}<div class="fx-sep"></div><div class="fx-row"><b>รวม</b><b class="fx-amt ${total >= 0 ? 'inc' : 'exp'}">${total >= 0 ? '+' : '-'}${fmtMoney(Math.abs(total))}</b></div>${budgetLine()}`
    });
  }

  function summaryCard(scope) {
    const n = now();
    let list, label, range;
    if (scope === 'today') {
      list = ledger.filter((e) => sameDay(e.ts, n)); label = 'สรุปวันนี้'; range = fmtDate(n);
    } else {
      list = ledger.filter(inMonth); label = 'สรุปเดือนนี้';
      range = `1 ${TH_MONTHS[n.getMonth()]} ${n.getFullYear() + 543} – ${fmtDate(n)} (${n.getDate()} วัน)`;
    }
    const inc = sum(list, 'income');
    const exp = sum(list, 'expense');
    const cats = catTotals(list);
    const top = cats[0];
    const net = inc - exp;
    const body = list.length ? `
      <div class="fx-row"><span>💰 รายรับ</span><b class="fx-amt inc">+${fmtMoney(inc)}</b></div>
      <div class="fx-row"><span>🧾 รายจ่าย</span><b class="fx-amt exp">-${fmtMoney(exp)}</b></div>
      <div class="fx-row fx-big"><b>เหลือ</b><b>💵 ${net < 0 ? '-' : ''}${fmtMoney(Math.abs(net))}</b></div>
      ${top ? `<div class="fx-sep"></div><b class="fx-muted2">ใช้จ่ายเยอะสุด</b>
        ${cats.slice(0, 3).map((c) => `<div class="fx-row"><span>${c.emoji} ${escapeHtml(c.cat)}</span><span class="fx-muted">${fmtMoney(c.total)} · ${Math.round((c.total / exp) * 100)}%</span></div>${bar((c.total / exp) * 100)}`).join('')}` : ''}
      <div class="fx-muted">📝 จดไว้ ${list.length} รายการ</div>`
      : `<div class="fx-muted">ยังไม่มีรายการ${scope === 'today' ? 'ของวันนี้' : ''} ลองพิมพ์ "น้ำ 50" ดูสิครับ</div>`;
    return card({ title: label, sub: range, icon: '📅', body, foot: appFoot() });
  }

  function categoryCard() {
    const list = ledger.filter(inMonth);
    const exp = sum(list, 'expense');
    const cats = catTotals(list);
    const body = `${cats.map((c) => `<div class="fx-row"><b>${c.emoji} ${escapeHtml(c.cat)}</b><span class="fx-muted">${fmtMoney(c.total)} · ${Math.round((c.total / exp) * 100)}%</span></div>${bar((c.total / exp) * 100)}`).join('')}
      <div class="fx-sep"></div><div class="fx-row fx-big"><b>รายจ่ายรวม 💰</b><b class="fx-amt exp">${fmtMoney(exp)}</b></div>`;
    return card({ title: 'ใช้จ่ายตามหมวด', sub: 'เดือนนี้', icon: '📊', body, foot: appFoot() });
  }

  function recentCard() {
    const last = [...ledger].sort((a, b) => b.ts - a.ts || b.id - a.id).slice(0, 5);
    const body = last.map((e) => `<div class="fx-row"><div><b>${escapeHtml(e.name)}</b><div class="fx-muted">${escapeHtml(e.cat)} · ${fmtDateTime(e.ts)}</div></div><b class="fx-amt ${e.type === 'income' ? 'inc' : 'exp'}">${e.type === 'income' ? '+' : '-'}${fmtMoney(e.amount)}</b></div>`).join('')
      + '<div class="fx-muted">ลบล่าสุด · แก้ล่าสุด 45</div>';
    return card({ title: 'รายการล่าสุด', sub: `${last.length} รายการล่าสุดที่จดไว้`, body, foot: appFoot() });
  }

  function searchCard(q) {
    const k = q.toLowerCase();
    const hits = ledger.filter((e) => e.name.toLowerCase().includes(k) || e.cat.toLowerCase().includes(k) || (e.tag && e.tag.toLowerCase().includes(k)))
      .sort((a, b) => b.ts - a.ts);
    if (!hits.length) return null;
    const inc = sum(hits, 'income'), exp = sum(hits, 'expense');
    const body = `
      <div class="fx-row"><span class="fx-muted">รายรับ</span><b class="fx-amt inc">+${fmtMoney(inc)}</b></div>
      <div class="fx-row"><span class="fx-muted">รายจ่าย</span><b class="fx-amt exp">-${fmtMoney(exp)}</b></div>
      <div class="fx-row"><span class="fx-muted">สุทธิ</span><b class="fx-amt ${inc - exp >= 0 ? 'inc' : 'exp'}">${inc - exp < 0 ? '-' : ''}${fmtMoney(Math.abs(inc - exp))}</b></div>
      <div class="fx-muted">พบ ${hits.length} รายการ</div><div class="fx-sep"></div><div class="fx-muted">ล่าสุด</div>
      ${hits.slice(0, 3).map((e) => `<div class="fx-row"><span>${e.ts.getDate()} ${TH_MONTHS[e.ts.getMonth()]} ${escapeHtml(e.name)}</span><span class="fx-amt ${e.type === 'income' ? 'inc' : 'exp'}">${e.type === 'income' ? '+' : '-'}${fmtMoney(e.amount)}</span></div>`).join('')}
      ${hits.length > 3 ? `<div class="fx-muted">และอีก ${hits.length - 3} รายการ</div>` : ''}`;
    return card({ title: 'ผลการค้นหา', sub: escapeHtml(q), body, foot: appFoot() });
  }

  function walletsCard() {
    const bal = sum(ledger, 'income') - sum(ledger, 'expense');
    const cash = ledger.filter((e) => e.wallet === '💵 เงินสด');
    const cashBal = sum(cash, 'income') - sum(cash, 'expense');
    const others = {};
    ledger.filter((e) => e.wallet !== '💵 เงินสด').forEach((e) => { others[e.wallet] = (others[e.wallet] || 0) + (e.type === 'income' ? e.amount : -e.amount); });
    const rows = [`<div class="fx-row"><b>💵 เงินสด</b><b>${fmtMoney(cashBal)}</b></div>`]
      .concat(Object.entries(others).map(([w, v]) => `<div class="fx-row"><b>${escapeHtml(w)}</b><b>${fmtMoney(v)}</b></div>`));
    return card({ title: 'กระเป๋าของฉัน', sub: 'ยอดคงเหลือทุกกระเป๋า', icon: '👛', body: `${rows.join('')}<div class="fx-sep"></div><div class="fx-row fx-big"><b>รวม</b><b>${fmtMoney(bal)}</b></div>`, foot: appFoot() });
  }

  function splitCard(name, total, people) {
    const per = Math.ceil((total / people) * 100) / 100;
    const names = ['แอน', 'บ๊อบ', 'ชมพู่', 'เบนซ์', 'ฟ้า', 'ต้น', 'มินต์', 'โอ๊ต', 'ปลา', 'นุ่น'];
    const rows = names.slice(0, people).map((n, i) => `<div class="fx-person"><div><b>${n}</b><div class="fx-muted">${i === 0 ? '✅ จ่ายแล้ว (คนจ่ายบิล)' : '⏳ ยังไม่โอน'}</div></div><b>${fmtMoney(per)}</b></div>`).join('');
    return card({
      title: `🍽️ ${escapeHtml(name)}`, sub: `${fmtMoney(total)} · หาร ${people} คน · คนละ ${fmtMoney(per)}`,
      body: `${rows}<div class="fx-muted">ยอดรวม ${fmtMoney(per * people)}${per * people > total ? ' (ปัดเศษขึ้น)' : ''}</div>
        <button type="button" class="fx-primary" data-act="qr">📲 จ่ายด้วยพร้อมเพย์ (QR รายคน)</button>
        <button type="button" class="fx-ghost" data-act="chase">🔔 ตามเงินคนที่ยังไม่โอน</button>`
    });
  }

  /* ----- reminder parsing ----- */
  function parseReminder(text) {
    let s = toArabicDigits(text.replace(/^เตือน\s*/, '')).trim();
    if (!s) return null;
    const base = now();
    let repeat = null;
    const rep = s.match(/ทุก(วัน|สัปดาห์|อาทิตย์|เดือน|ปี)/);
    if (rep) { repeat = { 'วัน': 'ทุกวัน', 'สัปดาห์': 'ทุกสัปดาห์', 'อาทิตย์': 'ทุกสัปดาห์', 'เดือน': 'ทุกเดือน', 'ปี': 'ทุกปี' }[rep[1]]; s = s.replace(rep[0], ' '); }
    let dayOff = null;
    if (/พรุ่งนี้/.test(s)) { dayOff = 1; s = s.replace('พรุ่งนี้', ' '); }
    else if (/มะรืน/.test(s)) { dayOff = 2; s = s.replace(/มะรืน(นี้)?/, ' '); }
    else if (/วันนี้/.test(s)) { dayOff = 0; s = s.replace('วันนี้', ' '); }
    let h = null, mi = 0, t;
    if ((t = s.match(/(\d{1,2}):(\d{2})/))) { h = +t[1]; mi = +t[2]; s = s.replace(t[0], ' '); }
    else if ((t = s.match(/บ่าย\s*(\d{1})\s*(โมง)?/))) { h = 12 + (+t[1] === 12 ? 0 : +t[1]); s = s.replace(t[0], ' '); }
    else if ((t = s.match(/(\d{1,2})\s*ทุ่ม/))) { h = 18 + +t[1]; s = s.replace(t[0], ' '); }
    else if ((t = s.match(/ตี\s*(\d{1,2})/))) { h = +t[1]; s = s.replace(t[0], ' '); }
    else if ((t = s.match(/(\d{1,2})\s*โมง(เช้า)?/))) { h = +t[1]; if (h < 7 && !t[2]) h += 12; s = s.replace(t[0], ' '); }
    else if (/เที่ยง/.test(s)) { h = 12; s = s.replace('เที่ยง', ' '); }
    const what = s.replace(/\s+/g, ' ').trim();
    if (!what) return null;
    if (h === null) h = 9;
    const when = new Date(base.getFullYear(), base.getMonth(), base.getDate(), h, mi);
    if (dayOff !== null) when.setDate(when.getDate() + dayOff);
    else if (when <= base) when.setDate(when.getDate() + 1);
    return { what, when, repeat };
  }
  function reminderCard(r) {
    const d = r.when;
    const end = new Date(d.getTime() + 30 * 60000);
    const g = (x) => `${x.getFullYear()}${pad2(x.getMonth() + 1)}${pad2(x.getDate())}T${pad2(x.getHours())}${pad2(x.getMinutes())}00`;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(r.what)}&dates=${g(d)}/${g(end)}${r.repeat ? '&recur=' + encodeURIComponent({ 'ทุกวัน': 'RRULE:FREQ=DAILY', 'ทุกสัปดาห์': 'RRULE:FREQ=WEEKLY', 'ทุกเดือน': 'RRULE:FREQ=MONTHLY', 'ทุกปี': 'RRULE:FREQ=YEARLY' }[r.repeat]) : ''}`;
    return card({
      title: 'ตั้งเตือนแล้ว ⏰', sub: 'พี่ฮูกจะทักเตือนในแชทเมื่อถึงเวลา',
      body: `<div class="fx-row fx-item"><b class="fx-name">📌 ${escapeHtml(r.what)}</b></div>
        <div class="fx-muted">🗓️ ${fmtDate(d)} เวลา ${pad2(d.getHours())}:${pad2(d.getMinutes())} น.</div>
        ${r.repeat ? `<div class="fx-chip">🔁 ${r.repeat}</div>` : ''}
        <a class="fx-primary" href="${url}" target="_blank" rel="noopener noreferrer">📆 เพิ่มลง Google Calendar</a>
        <div class="fx-row"><button type="button" class="fx-ghost" data-act="snooze">เลื่อน 10 นาที</button><button type="button" class="fx-ghost" data-act="done">✓ เสร็จแล้ว</button></div>`
    });
  }

  /* ----- AI question ----- */
  function askAnswer(q) {
    const n = now();
    const list = ledger.filter(inMonth);
    const exp = sum(list, 'expense'), inc = sum(list, 'income');
    const cats = catTotals(list);
    const left = Math.max(0, MONTHLY_BUDGET - exp);
    const daysLeft = new Date(n.getFullYear(), n.getMonth() + 1, 0).getDate() - n.getDate() + 1;
    const avg = exp / Math.max(n.getDate(), 1);
    const p = persona();
    const tail = { warm: ' สู้ๆ นะครับ ✨', bestie: ' ไหวป่าวเพื่อน 555', spicy: ' อย่าเปย์เกินนะ!', tea: ' ขอให้บริหารเงินอย่างมีชั้นเชิงครับ', night: ' แล้วรีบนอนด้วยล่ะ!' }[p];
    if (/^(ฮูก|ถามพี่ฮูก)\s*$/.test(q.trim())) return 'ว่าไงครับ ถามเรื่องเงินของคุณได้เลย เช่น "ฮูก เดือนนี้ใช้ไปเท่าไร"' + tail;
    if (/เที่ยว|พอ|ไหว|ซื้อ|ผ่อน/.test(q)) {
      return `ดูจากข้อมูล เดือนนี้ใช้ไป ${fmtMoney(exp)} จากงบ ${fmtMoney(MONTHLY_BUDGET)} เหลือ ${fmtMoney(left)} อีก ${daysLeft} วัน เฉลี่ยวันละ ${fmtMoney(left / daysLeft)} ถ้าจะใช้เพิ่มก้อนใหญ่ ควรเหลือไว้ให้ค่าใช้จ่ายจำเป็นก่อนนะครับ (พี่ฮูกช่วยวางแผนจากตัวเลขของคุณ ไม่แนะนำการลงทุนเฉพาะตัว)${tail}`;
    }
    if (/ออม|เก็บ/.test(q)) {
      return `จากรายรับเดือนนี้ ${fmtMoney(inc)} ลองออม 20% ตามหลัก 50-30-20 = ${fmtMoney(inc * 0.2)} ตอนนี้ใช้จ่ายไปแล้ว ${fmtMoney(exp)} ยังเหลือพอออมได้ถ้ารักษาระดับนี้ครับ${tail}`;
    }
    if (/หมวด|เยอะสุด|มากสุด|ใช้อะไร/.test(q) && cats[0]) {
      return `เดือนนี้หมวดที่ใช้เยอะสุดคือ ${cats[0].emoji} ${cats[0].cat} ${fmtMoney(cats[0].total)} (${Math.round((cats[0].total / exp) * 100)}% ของรายจ่าย)${cats[1] ? ` รองลงมา ${cats[1].emoji} ${cats[1].cat} ${fmtMoney(cats[1].total)}` : ''}${tail}`;
    }
    if (/เหลือ/.test(q)) return `เดือนนี้รายรับ ${fmtMoney(inc)} รายจ่าย ${fmtMoney(exp)} คงเหลือ ${fmtMoney(inc - exp)} และงบที่ตั้งไว้เหลืออีก ${fmtMoney(left)}${tail}`;
    return `เดือนนี้ใช้ไปแล้ว ${fmtMoney(exp)} (เฉลี่ยวันละ ${fmtMoney(avg)}) คิดเป็น ${Math.round((exp / MONTHLY_BUDGET) * 100)}% ของงบ เหลือ ${fmtMoney(left)} เก็บไว้ใช้อีก ${daysLeft} วัน${cats[0] ? ` หมวดที่ใช้เยอะสุดคือ ${cats[0].cat}` : ''}${tail}`;
  }

  /* ----- command engine ----- */
  const GATED = /^(พยากรณ์|วิเคราะห์|สรุปปี|เทียบเดือน|หนี้|ให้ยืม|.+คืน \d|บิล ใหม่|เป้าหมาย|ออม |ประจำ|โอน |บัตร|เชิญ|กระเป๋า ใหม่|งบ\s*\d|งบวัน)/;
  let busy = false;

  function handle(rawText) {
    const text = toArabicDigits(rawText.trim());
    const reply = (fn, info, delay) => runBot(fn, info, delay);

    if (/^(ช่วยเหลือ|help|วิธีใช้|เมนู|ทำอะไรได้บ้าง|พิมพ์อะไรได้บ้าง)$/i.test(text)) {
      return reply(() => botCard(card({ title: 'พี่ฮูกทำอะไรได้บ้าง', sub: 'ลองพิมพ์ตามตัวอย่างได้เลย', icon: '🦉', body: `
        <div><b>✍️ จด</b><div class="fx-muted">น้ำ 50 · เงินเดือน 25000 · +500 ขายของ</div></div>
        <div><b>📊 ดู</b><div class="fx-muted">สรุปวันนี้ · สรุปเดือนนี้ · สรุปหมวด · ล่าสุด</div></div>
        <div><b>🛠️ จัดการ</b><div class="fx-muted">ลบล่าสุด · แก้ล่าสุด 45 · ค้นหา กาแฟ</div></div>
        <div><b>⏰ เตือน</b><div class="fx-muted">เตือน พรุ่งนี้ 9 โมง จ่ายค่าไฟ</div></div>
        <div><b>👥 หารบิล</b><div class="fx-muted">หารบิล หมูกระทะ 1200 4 คน</div></div>
        <div><b>🤖 ถาม AI</b><div class="fx-muted">ฮูก เดือนนี้ใช้ไปเท่าไร</div></div>` })), 'help');
    }
    if (/^(สวัสดี|หวัดดี|ดีครับ|ดีค่ะ|ดีจ้า|hi|hello|hey)/i.test(text)) return reply(() => botText(VOICE.greet[persona()]), 'chat');
    if (/^(ขอบคุณ|ขอบใจ|thx|thanks)/i.test(text)) return reply(() => botText('ยินดีครับ! มีอะไรให้ช่วยจดอีกบอกได้เลยนะ 🦉'), 'chat');

    let m;
    if (/^สรุป(วันนี้)?$/.test(text) && text === 'สรุปวันนี้') return reply(() => botCard(summaryCard('today')), 'summary');
    if (/^สรุป(เดือนนี้)?$/.test(text)) return reply(() => botCard(summaryCard('month')), 'summary');
    if (/^สรุปหมวด/.test(text)) return reply(() => botCard(categoryCard()), 'summary');
    if (/^(ล่าสุด|รายการล่าสุด)$/.test(text)) return reply(() => botCard(recentCard()), 'recent');
    if (/^กระเป๋า$/.test(text)) return reply(() => botCard(walletsCard()), 'wallets');

    if (/^ลบล่าสุด$/.test(text)) {
      return reply(() => {
        const last = [...ledger].sort((a, b) => b.ts - a.ts || b.id - a.id)[0] || null;
        if (!last) return botText('ยังไม่มีรายการให้ลบครับ');
        ledger.splice(ledger.indexOf(last), 1);
        markDeleted(last.id);
        botText(`ลบ "${last.name}" ${fmtMoney(last.amount)} แล้วครับ 🗑️`);
      }, 'del');
    }
    if ((m = text.match(/^แก้ล่าสุด\s*(\d+(?:\.\d+)?)/))) {
      return reply(() => {
        const last = [...ledger].sort((a, b) => b.ts - a.ts || b.id - a.id)[0];
        if (!last) return botText('ยังไม่มีรายการให้แก้ครับ');
        const old = last.amount;
        last.amount = parseFloat(m[1]);
        botCard(recordCard([last], { title: 'แก้ไขแล้ว ✏️', sub: `เปลี่ยนยอดจาก ${fmtMoney(old)} เป็น ${fmtMoney(last.amount)}` }));
      }, 'del');
    }
    if ((m = text.match(/^ค้นหา\s*(.+)$/))) {
      return reply(() => {
        const c = searchCard(m[1].trim());
        if (c) botCard(c); else botText(`ไม่พบรายการที่เกี่ยวกับ "${m[1].trim()}" ครับ ลองจดก่อน เช่น "${m[1].trim()} 50" แล้วค้นหาใหม่ได้เลย`);
      }, 'search');
    }
    if ((m = text.match(/^เตือน(.*)$/))) {
      const r = parseReminder(text);
      return reply(() => r ? botCard(reminderCard(r)) : botText('บอกพี่ฮูกให้ครบหน่อยครับ เช่น "เตือน พรุ่งนี้ 9 โมง จ่ายค่าไฟ"'), 'reminder');
    }
    if ((m = text.match(/^หารบิล\s+(.+?)\s+(\d+(?:\.\d+)?)(?:\s*บาท)?(?:\s+(?:หาร\s*)?(\d{1,2})\s*คน)?\s*$/))) {
      const people = Math.min(10, Math.max(2, parseInt(m[3] || '4', 10)));
      return reply(() => botCard(splitCard(m[1], parseFloat(m[2]), people)), 'split');
    }
    if (/^หารบิล/.test(text)) return reply(() => botText('พิมพ์แบบนี้ครับ: "หารบิล หมูกระทะ 1200 4 คน" (ไม่ใส่จำนวนคนพี่ฮูกหาร 4 คนให้)'), 'split');
    if (/^สรุปทริป/.test(text)) return reply(() => botImage('cards-clean/trip-summary-card-1.png', 'การ์ดสรุปทริป'), 'trip');
    if (/^(ฮูก|ถามพี่ฮูก)(\s|$)/.test(text)) return reply(() => botText(askAnswer(text.replace(/^(ฮูก|ถามพี่ฮูก)\s*/, '') || text)), 'ask', 900);
    if (GATED.test(text)) return reply(() => { botText('ฟังก์ชันนี้อยู่ในแพ็กเกจ Pro / Elite ครับ ทดลองใช้ฟรี 7 วัน 🎁'); botImage('cards-clean/upsell-card-1.png', 'อัปเกรดแพ็กเกจ'); }, 'upsell');

    const entries = parseMulti(text, now());
    if (entries) {
      return reply(() => {
        entries.forEach((e) => { e.id = nextId++; ledger.push(e); });
        botCard(recordCard(entries));
      }, entries.length > 1 ? 'multi' : entries[0].type);
    }
    return reply(() => botText(VOICE.unknown[persona()]), 'chat');
  }

  function markDeleted(id) {
    chatArea.querySelectorAll(`[data-id="${id}"][data-act="del"]`).forEach((b) => {
      const c = b.closest('.fx-card');
      if (c) c.classList.add('fx-deleted');
    });
  }

  function runBot(fn, info, delay) {
    busy = true;
    showTyping();
    setTimeout(() => {
      hideTyping();
      fn();
      if (info) setInfo(info);
      busy = false;
    }, delay || 550 + Math.random() * 300);
  }

  function sendText(text) {
    if (!text) return;
    userBubble(escapeHtml(text));
    handle(text);
  }

  /* ----- slip / voice shortcuts ----- */
  function sendSlip() {
    userBubble('🧾 [ส่งรูปภาพสลิปโอนเงินธนาคาร]');
    runBot(() => botImage('cards-clean/receipt-card-1.png', 'อ่านสลิปสำเร็จ'), 'slip', 900);
  }
  const VOICE_LINES = ['ข้าวมันไก่พิเศษ 60 บาท', 'ชานมไข่มุก 55', 'ค่าแท็กซี่ 120 บาท', 'ซื้อยาแก้ปวด 85', 'กาแฟเย็น 65 บาท'];
  function sendVoice() {
    const said = pick(VOICE_LINES);
    const bars = Array.from({ length: 22 }, () => `<i style="height:${6 + Math.round(Math.random() * 14)}px"></i>`).join('');
    userBubble(`<span class="fx-voice">▶ <span class="fx-wave">${bars}</span> 0:0${3 + Math.floor(Math.random() * 3)}</span>`);
    runBot(() => {
      botText(`🎙️ ได้ยินว่า: "${said}"`);
      const entries = parseMulti(said, now());
      if (entries) {
        entries.forEach((e) => { e.id = nextId++; ledger.push(e); });
        setTimeout(() => botCard(recordCard(entries)), 350);
      }
    }, 'voice', 1100);
  }

  /* ----- events ----- */
  chips.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip || busy) return;
    chips.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    const cmd = chip.getAttribute('data-cmd');
    if (cmd === 'ส่งรูปสลิป') return sendSlip();
    if (cmd === 'ส่งข้อความเสียง') return sendVoice();
    sendText(cmd);
  });
  if (slipBtn) slipBtn.addEventListener('click', () => { if (!busy) sendSlip(); });
  if (micBtn) micBtn.addEventListener('click', () => { if (!busy) sendVoice(); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v || busy) return;
    input.value = '';
    sendText(v);
  });

  chatArea.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const act = b.getAttribute('data-act');
    const id = Number(b.getAttribute('data-id'));
    if (act === 'app') { document.getElementById('webapp').scrollIntoView({ behavior: 'smooth' }); return; }
    if (act === 'del') {
      const i = ledger.findIndex((x) => x.id === id);
      if (i < 0) return;
      const [gone] = ledger.splice(i, 1);
      markDeleted(id);
      runBot(() => botText(`ลบ "${gone.name}" ${fmtMoney(gone.amount)} แล้วครับ 🗑️`), 'del', 350);
    } else if (act === 'edit') {
      const last = [...ledger].sort((a, b2) => b2.ts - a.ts || b2.id - a.id)[0];
      if (last && last.id === id) { input.value = 'แก้ล่าสุด '; input.focus(); }
      else runBot(() => botText('ตอนนี้แก้ได้เฉพาะรายการล่าสุดครับ พิมพ์ "แก้ล่าสุด 45" เพื่อเปลี่ยนยอด'), 'del', 350);
    } else if (act === 'share') {
      runBot(() => botText('ในแชท LINE จริง ปุ่มนี้จะส่งการ์ดให้เพื่อนหรือกลุ่มได้เลยครับ 📤'), null, 350);
    } else if (act === 'qr') {
      runBot(() => botText('ในกลุ่ม LINE จริง พี่ฮูกจะสร้าง QR พร้อมเพย์ระบุยอดให้เพื่อนแต่ละคนสแกนจ่ายได้เลยครับ 📲'), null, 350);
    } else if (act === 'chase') {
      runBot(() => botText('ตามเงินแล้วครับ! พี่ฮูกส่งการ์ดเตือนไปหาคนที่ยังไม่โอนในกลุ่มเรียบร้อย 🔔'), null, 350);
    } else if (act === 'snooze') {
      runBot(() => botText('เลื่อนเตือนไปอีก 10 นาทีแล้วครับ ⏳'), null, 350);
    } else if (act === 'done') {
      b.textContent = '✓ ทำเสร็จแล้ว'; b.disabled = true;
    }
  });

  if (badge) {
    badge.style.cursor = 'pointer';
    badge.title = 'แตะเพื่อสลับนิสัยพี่ฮูก';
    const refresh = () => { badge.textContent = PERSONA_LABEL[persona()]; };
    badge.addEventListener('click', () => {
      const next = PERSONA_KEYS[(PERSONA_KEYS.indexOf(persona()) + 1) % PERSONA_KEYS.length];
      window.phookPersona = next;
      refresh();
    });
    window.addEventListener('phook-persona', refresh);
    refresh();
  }

  if (input) input.setAttribute('placeholder', "พิมพ์ เช่น 'น้ำ 50' 'เงินเดือน 25000' 'สรุปเดือนนี้'...");
}
