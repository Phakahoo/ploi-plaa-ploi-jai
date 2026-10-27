'use strict';
/* ========== DATA ========== */
const IMG = 'assets/images/';
const src = f => IMG + encodeURIComponent(f);
const CATS = ['study', 'health', 'success', 'finance', 'love'];
const CAT_NAME = {
  study: ['การเรียนและการงาน', 'Studies & Career'],
  health: ['สุขภาพร่างกาย', 'Health & Wellbeing'],
  success: ['ความสำเร็จและการขจัดอุปสรรค', 'Success & Overcoming Obstacles'],
  finance: ['การเงินและความมั่งคั่ง', 'Finance & Abundance'],
  love: ['ความรักและความสุข', 'Love & Happiness']
};
// Tie-break rule: when scores are equal, the fish listed first here wins.
const FISH = [
  { id: 'eel', f: 'ปลาไหล.png', n: ['ปลาไหล', 'Eel'], cat: 'study', s: ['ความยืดหยุ่น ความก้าวหน้า และการหาทางไปต่อ', 'adaptability, progress and finding a way forward'] },
  { id: 'perch', f: 'ปลาหมอ.png', n: ['ปลาหมอไทย', 'Climbing Perch'], cat: 'health', s: ['ความอึดทน การฟื้นฟู และการดูแลตัวเอง', 'resilience, restoration and caring for yourself'] },
  { id: 'snakehead', f: 'ปลาช่อน.png', n: ['ปลาช่อน', 'Snakehead'], cat: 'success', s: ['ความมุ่งมั่น ความกล้า และความไม่ยอมแพ้', 'determination, courage and persistence'] },
  { id: 'carp', f: 'ปลาตะเพียน.png', n: ['ปลาตะเพียน', 'Silver Barb'], cat: 'finance', s: ['ความอุดมสมบูรณ์ ความมั่นคง และความเจริญ', 'abundance, stability and prosperity'] },
  { id: 'tilapia', f: 'ปลานิล.png', n: ['ปลานิล', 'Tilapia'], cat: 'love', s: ['ความอบอุ่น ความผูกพัน และความกลมกลืน', 'warmth, connection and harmony'] }
];
// Each option: [Thai, English, [fish ids that gain +1]]
const QUIZ = [
  { q: ['ช่วงนี้คุณอยากให้เรื่องไหนในชีวิตเป็นไปได้ด้วยดีมากที่สุด?', 'What would you most like to go well in your life right now?'], o: [
    ['การเรียน', 'Studies', ['eel']], ['การงาน', 'Work', ['eel']], ['การเงิน', 'Money', ['carp']], ['ความรัก', 'Love', ['tilapia']], ['สุขภาพและความสุขของตัวเอง', 'My health and happiness', ['perch']]] },
  { q: ['ถ้าขอพรได้หนึ่งข้อในตอนนี้ คุณอยากขออะไร?', 'If you could make one wish right now, what would it be?'], o: [
    ['ขอให้โชคดี', 'May I be lucky', ['carp']], ['ขอให้สมหวัง', 'May my wishes come true', ['tilapia']], ['ขอให้มีเงินและความมั่นคง', 'May I have money and security', ['carp']], ['ขอให้มีความสุข', 'May I be happy', ['tilapia']], ['ขอให้ผ่านอุปสรรคไปได้', 'May I overcome obstacles', ['snakehead']]] },
  { q: ['ช่วงนี้มีอะไรที่คุณอยากปล่อยผ่านไปบ้างไหม?', 'Is there anything you would like to let go of?'], o: [
    ['เรื่องที่ทำให้คิดมาก', 'Things that make me overthink', ['perch']], ['เรื่องที่ผิดหวัง', 'Things that disappointed me', ['tilapia']], ['เรื่องที่ควบคุมไม่ได้', 'Things I cannot control', ['snakehead']], ['ความเหนื่อยล้าที่สะสม', 'Accumulated exhaustion', ['perch']], ['ไม่มีอะไร แค่อยากเริ่มต้นใหม่', 'Nothing, I just want a fresh start', ['eel']]] },
  { q: ['สำหรับคุณ การปล่อยปลาในครั้งนี้มีความหมายว่าอะไร?', 'What does releasing a fish mean to you in this experience?'], o: [
    ['การปล่อยวางเรื่องร้าย ๆ', 'Letting go of bad things', ['snakehead']], ['การขอพรให้สิ่งดี ๆ เกิดขึ้น', 'Wishing for good things', ['carp']], ['การเริ่มต้นใหม่', 'A new beginning', ['eel']], ['การให้เวลากับตัวเอง', 'Giving time to myself', ['perch']], ['การส่งต่อความปรารถนาดี', 'Passing on goodwill', ['tilapia']]] },
  { q: ['ถ้าปลาหนึ่งตัวสามารถรับความรู้สึกของคุณไว้ได้ คุณอยากฝากอะไรไว้กับมัน?', 'If a fish could carry one of your feelings, what would you leave with it?'], o: [
    ['ความทุกข์ที่ไม่อยากแบกอีกแล้ว', 'Sorrow I no longer want to carry', ['perch']], ['ความหวังที่ยังไม่เป็นจริง', 'A hope not yet come true', ['eel']], ['ความกลัวที่อยากก้าวข้าม', 'A fear I want to move past', ['snakehead']], ['ความฝันที่อยากทำให้สำเร็จ', 'A dream I want to achieve', ['carp']], ['คำขอบคุณสำหรับสิ่งที่ผ่านมา', 'Thanks for all that has passed', ['tilapia']]] }
];
// Accessories: default position (x,y = centre, w = width) as fractions of the fish stage; b = wish-power bonus per category.
const ACC = [
  { id: 'sash', f: 'สายสะพาย.png', n: ['สายสะพาย', 'Sash'], x: .5, y: .55, w: .46, b: { success: 8, study: 6 } },
  { id: 'floral', f: 'เสื้อลายดอก.png', n: ['เสื้อลายดอก', 'Floral Shirt'], x: .5, y: .56, w: .3, b: { love: 8 } },
  { id: 'tank', f: 'เสื้อสายเดี่ยว.png', n: ['เสื้อสายเดี่ยว', 'Camisole'], x: .52, y: .56, w: .28, b: { love: 8 } },
  { id: 'police', f: 'หมวกตำรวจ.png', n: ['หมวกตำรวจ', 'Police Cap'], x: .27, y: .3, w: .2, b: { success: 8 } },
  { id: 'pork', f: 'หมูปิ้ง.png', n: ['หมูปิ้ง', 'Grilled Pork Skewer'], x: .1, y: .62, w: .2, b: { love: 8 } },
  { id: 'gold', f: 'สร้อยทอง.png', n: ['สร้อยทอง', 'Gold Necklace'], x: .37, y: .55, w: .2, b: { finance: 10 } },
  { id: 'pearl', f: 'สร้อยไข่มุข.png', n: ['สร้อยไข่มุข', 'Pearl Necklace'], x: .37, y: .62, w: .2, b: { love: 6, health: 6 } },
  { id: 'glasses', f: 'แว่นตา.png', n: ['แว่นตา', 'Glasses'], x: .24, y: .44, w: .16, b: { study: 8 } },
  { id: 'vest', f: 'เสื้อวิน.png', n: ['เสื้อวิน', 'Motorbike-Taxi Vest'], x: .55, y: .56, w: .3, b: { study: 6, success: 6 } },
  { id: 'sparkle', f: 'ผงฟรุ้งฟริ้ง.png', n: ['ผงฟรุ้งฟริ้ง', 'Sparkle Dust'], x: .5, y: .5, w: .7, b: { study: 3, health: 3, success: 3, finance: 3, love: 3 } },
  { id: 'flower', f: 'ดอกไม้.png', n: ['ดอกไม้', 'Flower'], x: .34, y: .3, w: .12, b: { love: 6, health: 6 } }
];
const MAX_COPIES = 3;

const T = {
  th: {
    title: 'ปล่อยปลาปล่อยใจ', begin: 'เริ่มปล่อยใจ',
    welcomePoem: 'บางสิ่งเราอาจแบกรับไว้นานเกินไป\nลองฝากความรู้สึกเหล่านั้นไว้กับสายน้ำ\nแล้วให้ตัวเองได้เริ่มต้นใหม่อีกครั้ง',
    welcomeNote: 'นี่คือประสบการณ์ดิจิทัล ไม่ได้เป็นการปล่อยสัตว์จริง',
    prev: 'ย้อนกลับ', next: 'ต่อไป', finishQ: 'ดูปลาของฉัน', qOf: (a, b) => `คำถาม ${a} จาก ${b}`,
    yourFish: 'ปลาของคุณคือ', disclaimer: 'ความหมายของปลาเป็นการตีความเชิงสร้างสรรค์ของโครงการนี้ ไม่ใช่คำทำนายหรือคำรับรองโชคลาภ',
    toDeco: 'ไปแต่งตัวให้ปลา', meaningLbl: 'ความหมาย: ', symLbl: 'สัญลักษณ์: ',
    revMsg: (a1, a5, s) => `คุณอยากให้ "${a1}" ค่อย ๆ ดีขึ้น และอยากฝาก "${a5}" ไว้กับสายน้ำ ขอให้${s}เป็นเพื่อนร่วมทางของคุณ`,
    decoTitle: 'แต่งตัวให้ปลาของคุณ', decoHint: 'แตะเพื่อวางของตกแต่ง หรือลากจากคลังไปวางบนตัวปลา ลากเพื่อย้าย กดลูกศรบนคีย์บอร์ดเพื่อขยับ กด Delete เพื่อลบ',
    removeSel: 'ลบชิ้นที่เลือก', resetDeco: 'รีเซ็ตการตกแต่ง', library: 'คลังของตกแต่ง', removeOne: 'ลบ',
    powerTitle: 'พลังความปรารถนา', powerNote: 'ค่านี้เป็นเพียงกติกาสร้างสรรค์ของประสบการณ์นี้ ไม่ใช่ความน่าจะเป็นจริงของความสำเร็จ เงิน สุขภาพ หรือความรัก',
    m_study: 'พลังการเรียนและการงานของคุณเพิ่มขึ้นอีกนิด ✨', m_health: 'พลังแห่งการดูแลตัวเองเพิ่มขึ้นอีกนิด ✨',
    m_success: 'ความกล้าที่จะก้าวข้ามอุปสรรคเพิ่มขึ้นอีกนิด ✨', m_finance: 'ความมั่งคั่งที่คุณปรารถนากำลังได้รับการเติมเต็มอีกนิด ✨',
    m_love: 'ความอบอุ่นและความสุขเพิ่มขึ้นอีกนิด ✨', m_all: 'ประกายเล็ก ๆ ช่วยเติมพลังให้ทุกด้าน ✨',
    reflectTitle: 'มีอะไรที่คุณอยากปล่อยไปกับสายน้ำไหม?',
    reflectSub: 'บางเรื่องไม่จำเป็นต้องหาคำตอบในวันนี้\nลองเขียนสิ่งที่อยู่ในใจ แล้วปล่อยให้มันค่อย ๆ ไหลไป',
    reflectPh: 'เขียนสิ่งที่อยู่ในใจตรงนี้…', skip: 'ข้ามขั้นตอนนี้',
    privacy: 'ข้อความนี้อยู่ในหน้าเว็บนี้เท่านั้น ไม่ถูกส่งไปที่ใด ไม่แสดงบนจอสาธารณะ และจะถูกล้างเมื่อจบหรือเริ่มใหม่',
    releaseTitle: 'ถึงเวลาปล่อยปลา', dropHere: 'ปล่อยลงที่นี่', dragHint: 'ลากปลาไปที่สายน้ำ หรือกดปุ่มด้านล่าง',
    releaseBtn: 'ปล่อยปลาปล่อยใจ',
    relMsg: 'ขอให้สิ่งที่หนักใจ ค่อย ๆ เบาลง\nขอให้ความหวังที่ฝากไว้ ได้เติบโตในแบบของมัน\nและขอให้คุณใจดีกับตัวเองมากขึ้นในทุกวัน',
    closing: 'วันนี้คุณได้ปล่อยบางอย่างลงแล้ว\nขอให้สายน้ำพาคุณไปพบกับวันที่เบาสบายกว่าเดิม',
    restart: 'เริ่มการเดินทางใหม่', noAcc: 'ไม่มีของตกแต่ง', sum: (f, a) => `ปลาของคุณ: ${f} · ของตกแต่ง: ${a}`, none: 'ยังไม่ได้เลือก'
  },
  en: {
    title: 'ปล่อยปลาปล่อยใจ', begin: 'Begin Your Journey',
    welcomePoem: 'Some feelings have stayed with us for too long.\nLeave a little of that weight with the river,\nand give yourself permission to begin again.',
    welcomeNote: 'This is a digital experience. No real animal is being released.',
    prev: 'Previous', next: 'Next', finishQ: 'Meet my fish', qOf: (a, b) => `Question ${a} of ${b}`,
    yourFish: 'Your fish is', disclaimer: 'Fish symbolism is this project’s creative interpretation, not a prediction or a promise of fortune.',
    toDeco: 'Decorate your fish', meaningLbl: 'Meaning: ', symLbl: 'Symbolism: ',
    revMsg: (a1, a5, s) => `You hope “${a1}” goes gently well, and you’d leave “${a5}” with the river. May ${s} keep you company.`,
    decoTitle: 'Decorate Your Fish', decoHint: 'Tap an accessory to place it, or drag it from the library onto the fish. Drag to move; use arrow keys to nudge and Delete to remove.',
    removeSel: 'Remove selected', resetDeco: 'Reset decoration', library: 'Accessory library', removeOne: 'Remove',
    powerTitle: 'Wish Power', powerNote: 'These values are a creative rule of this experience, not real probabilities of success, wealth, health or love.',
    m_study: 'Your studies & career wish grows a little stronger ✨', m_health: 'Your wellbeing wish grows a little stronger ✨',
    m_success: 'Your courage to overcome obstacles grows a little ✨', m_finance: 'The abundance you wish for is being filled a little more ✨',
    m_love: 'Warmth and happiness grow a little ✨', m_all: 'A little sparkle lifts every wish ✨',
    reflectTitle: 'Is there anything you would like to release into the river?',
    reflectSub: 'Not everything needs an answer today.\nWrite down what is on your heart,\nand let the river carry it gently away.',
    reflectPh: 'Write what is on your heart here…', skip: 'Skip this step',
    privacy: 'This message stays on this page only. It is not sent anywhere or shown on any public display, and it is cleared when you finish or restart.',
    releaseTitle: 'Time to release your fish', dropHere: 'Release here', dragHint: 'Drag the fish into the river, or press the button below.',
    releaseBtn: 'Release into the River',
    relMsg: 'May what feels heavy become a little lighter.\nMay your hopes grow in their own time.\nAnd may you be kinder to yourself, one day at a time.',
    closing: 'Today, you let something go.\nMay the river carry you toward a gentler tomorrow.',
    restart: 'Begin a new journey', noAcc: 'no accessories', sum: (f, a) => `Your fish: ${f} · Accessories: ${a}`, none: 'not chosen'
  }
};

/* ========== STATE ========== */
const fresh = () => ({ stage: 0, q: 0, answers: [null, null, null, null, null], fish: null, items: [], sel: null, uid: 0, released: false, notice: null });
let S = Object.assign(fresh(), { lang: 'th' });
let reflectText = ''; // private; memory only, never transmitted
const $ = id => document.getElementById(id);
const L = () => (S.lang === 'th' ? 0 : 1);
const t = k => T[S.lang][k];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const accById = id => ACC.find(a => a.id === id);

/* ========== NAVIGATION ========== */
function go(n) {
  S.stage = n;
  document.querySelectorAll('.stage').forEach((s, i) => (s.hidden = i !== n));
  if (n === 1) renderQuiz();
  if (n === 2) renderReveal();
  if (n === 3) { renderStage(); renderLib(); renderPower($('powerMini')); }
  if (n === 4) renderPower($('powerFull'));
  if (n === 5) updateCount();
  if (n === 6) renderRelease();
  if (n === 7) renderClosing();
  window.scrollTo(0, 0);
  const h = document.querySelector('#s' + n + ' h1, #s' + n + ' h2[tabindex]');
  if (h) h.focus({ preventScroll: true });
}

/* ========== i18n ========== */
function applyLang() {
  document.documentElement.lang = S.lang;
  document.querySelectorAll('[data-i18n]').forEach(e => (e.textContent = t(e.dataset.i18n)));
  document.querySelectorAll('[data-i18n-ph]').forEach(e => (e.placeholder = t(e.dataset.i18nPh)));
  document.querySelectorAll('[data-i18n-aria]').forEach(e => e.setAttribute('aria-label', t(e.dataset.i18nAria)));
  document.querySelectorAll('[data-act=lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === S.lang)));
  document.title = t('title') + ' · Let the Fish Go, Let Your Heart Flow';
  if (S.stage === 1) renderQuiz();
  if (S.stage === 2) renderReveal();
  if (S.stage === 3) { renderLib(); renderPower($('powerMini')); $('notice').textContent = S.notice ? t(S.notice) : ''; }
  if (S.stage === 4) renderPower($('powerFull'));
  if (S.stage === 5) updateCount();
  if (S.stage === 6) renderRelease(true);
  if (S.stage === 7) renderClosing();
}

/* ========== QUIZ ========== */
function renderQuiz() {
  const q = QUIZ[S.q], i = L();
  $('qCount').textContent = t('qOf')(S.q + 1, QUIZ.length);
  $('qBar').style.width = ((S.q + 1) / QUIZ.length * 100) + '%';
  $('qText').textContent = q.q[i];
  $('qOpts').innerHTML = q.o.map((o, k) =>
    `<button class="opt" role="radio" aria-checked="${S.answers[S.q] === k}" data-act="ans" data-k="${k}">${o[i]}</button>`).join('');
  $('qNext').textContent = S.q === QUIZ.length - 1 ? t('finishQ') : t('next');
  $('qNext').disabled = S.answers[S.q] === null;
}
function scoreFish() {
  const sc = {};
  FISH.forEach(f => (sc[f.id] = 0));
  S.answers.forEach((a, qi) => { if (a !== null) QUIZ[qi].o[a][2].forEach(id => sc[id]++); });
  let best = FISH[0];
  FISH.forEach(f => { if (sc[f.id] > sc[best.id]) best = f; }); // strict ">" keeps list order as tie-break
  return best;
}

/* ========== FISH REVEAL ========== */
function fishHTML(live) {
  const accs = S.items.map(it => {
    const a = accById(it.id);
    return `<div class="acc${a.id === 'sparkle' ? ' spark' : ''}" data-uid="${it.uid}" style="left:${it.x * 100}%;top:${it.y * 100}%;width:${a.w * 100}%"${live ? ' tabindex="0" role="button"' : ''} aria-label="${a.n[L()]}"><img src="${src(a.f)}" alt="${a.n[L()]}" draggable="false">${live ? `<button class="rm" data-act="rmOne" aria-label="${t('removeOne')} ${a.n[L()]}">×</button>` : ''}</div>`;
  }).join('');
  return `<img class="fish" src="${src(S.fish.f)}" alt="${S.fish.n[L()]}" draggable="false">${accs}`;
}
function renderReveal() {
  const f = S.fish, i = L();
  $('revFish').innerHTML = `<div class="fishbox static"><img class="fish" src="${src(f.f)}" alt="${f.n[i]}"></div>`;
  $('h2').textContent = `${f.n[0]} · ${f.n[1]}`;
  $('revMeaning').textContent = t('meaningLbl') + CAT_NAME[f.cat][i];
  $('revSym').textContent = t('symLbl') + f.s[i];
  const a1 = QUIZ[0].o[S.answers[0]][i], a5 = QUIZ[4].o[S.answers[4]][i];
  $('revMsg').textContent = t('revMsg')(a1, a5, f.s[i].split(S.lang === 'th' ? ' ' : ',')[0]);
}

/* ========== DECORATE ========== */
const stageEl = () => $('decoStage');
function renderStage() {
  stageEl().innerHTML = fishHTML(true);
  updateSel();
}
function renderLib() {
  $('lib').innerHTML = ACC.map(a => `<button class="libbtn" data-id="${a.id}" aria-label="${a.n[L()]}"><img src="${src(a.f)}" alt="${a.n[L()]}" draggable="false"><span>${a.n[L()]}</span></button>`).join('');
}
function updateSel() {
  stageEl().querySelectorAll('.acc').forEach(e => e.classList.toggle('sel', Number(e.dataset.uid) === S.sel));
}
function addItem(id, pos) {
  if (S.items.filter(i => i.id === id).length >= MAX_COPIES) return null;
  const a = accById(id), isNew = !S.items.some(i => i.id === id);
  const it = { uid: ++S.uid, id, x: pos ? clamp(pos.x, 0, 1) : a.x, y: pos ? clamp(pos.y, 0, 1) : a.y };
  S.items.push(it); S.sel = it.uid;
  if (isNew) { const cats = Object.keys(a.b); S.notice = cats.length > 4 ? 'm_all' : 'm_' + cats[0]; $('notice').textContent = t(S.notice); }
  renderStage(); renderPower($('powerMini'));
  return it;
}
function removeItem(uid) {
  S.items = S.items.filter(i => i.uid !== uid);
  if (S.sel === uid) S.sel = null;
  renderStage(); renderPower($('powerMini'));
}
function toNorm(e) {
  const r = stageEl().getBoundingClientRect();
  return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height, inside: e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom };
}
let drag = null, lp = null, relDrag = null;
function setPos(it, x, y) {
  it.x = clamp(x, 0, 1); it.y = clamp(y, 0, 1);
  const el = stageEl().querySelector(`[data-uid="${it.uid}"]`);
  if (el) { el.style.left = it.x * 100 + '%'; el.style.top = it.y * 100 + '%'; }
}
function initDecorate() {
  $('lib').addEventListener('pointerdown', e => {
    const b = e.target.closest('.libbtn'); if (!b) return;
    lp = { id: b.dataset.id, x: e.clientX, y: e.clientY, made: null };
  });
  $('lib').addEventListener('click', e => { // keyboard activation (Enter/Space)
    const b = e.target.closest('.libbtn'); if (b && e.detail === 0) addItem(b.dataset.id);
  });
  stageEl().addEventListener('pointerdown', e => {
    const el = e.target.closest('.acc'); if (!el || e.target.closest('.rm')) return;
    const it = S.items.find(i => i.uid === Number(el.dataset.uid)); if (!it) return;
    S.sel = it.uid; updateSel();
    const n = toNorm(e); drag = { it, dx: n.x - it.x, dy: n.y - it.y };
    e.preventDefault();
  });
  stageEl().addEventListener('focusin', e => { const el = e.target.closest('.acc'); if (el) { S.sel = Number(el.dataset.uid); updateSel(); } });
  stageEl().addEventListener('keydown', e => {
    const it = S.items.find(i => i.uid === S.sel); if (!it) return;
    const d = e.shiftKey ? .04 : .01;
    const m = { ArrowLeft: [-d, 0], ArrowRight: [d, 0], ArrowUp: [0, -d], ArrowDown: [0, d] }[e.key];
    if (m) { e.preventDefault(); setPos(it, it.x + m[0], it.y + m[1]); }
    else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); removeItem(it.uid); stageEl().focus(); }
  });
}

/* ========== WISH POWER ========== */
function computePower() {
  const p = {};
  CATS.forEach(c => (p[c] = c === S.fish.cat ? 60 : 20));
  new Set(S.items.map(i => i.id)).forEach(id => { // unique accessories only: copies never add more
    const b = accById(id).b;
    for (const c in b) p[c] = Math.min(100, p[c] + b[c]);
  });
  return p;
}
function renderPower(el) {
  const p = computePower();
  if (!el.firstChild) el.innerHTML = CATS.map(c => `<div class="prow" data-c="${c}"><span class="lbl"></span><b class="num">0%</b><div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"><i></i></div></div>`).join('');
  CATS.forEach(c => {
    const row = el.querySelector(`[data-c="${c}"]`), main = c === S.fish.cat, from = Number(row.dataset.v || 0);
    row.classList.toggle('main', main);
    row.querySelector('.lbl').textContent = CAT_NAME[c][L()] + (main ? ' ★' : '');
    row.querySelector('i').style.width = p[c] + '%';
    const bar = row.querySelector('.bar');
    bar.setAttribute('aria-valuenow', p[c]); bar.setAttribute('aria-label', `${CAT_NAME[c][L()]} ${p[c]}%`);
    countUp(row.querySelector('.num'), from, p[c]);
    row.dataset.v = p[c];
  });
}
function countUp(el, from, to) {
  if (from === to || reduced()) { el.textContent = to + '%'; return; }
  const t0 = performance.now();
  (function step(now) {
    const k = clamp((now - t0) / 700, 0, 1);
    el.textContent = Math.round(from + (to - from) * k) + '%';
    if (k < 1) requestAnimationFrame(step);
  })(t0);
}

/* ========== REFLECTION (private, memory only) ========== */
function updateCount() { $('reflectCount').textContent = `${$('reflect').value.length} / 500`; }

/* ========== RELEASE ========== */
function renderRelease(keepPos) {
  $('relFish').innerHTML = `<div class="fishbox static">${fishHTML(false)}</div>`;
  $('relMsg').textContent = t('relMsg');
  if (!keepPos) { $('relWrap').classList.remove('swim'); $('relFish').style.transform = ''; }
}
function initRelease() {
  const rf = $('relFish');
  rf.addEventListener('pointerdown', e => {
    if (S.released) return;
    relDrag = { x: e.clientX, y: e.clientY }; rf.classList.add('dragging'); rf.setPointerCapture(e.pointerId); e.preventDefault();
  });
  rf.addEventListener('pointermove', e => {
    if (!relDrag) return;
    rf.style.transform = `translate(${e.clientX - relDrag.x}px,${e.clientY - relDrag.y}px)`;
    $('riverTarget').classList.toggle('near', overTarget(e));
  });
  const end = e => {
    if (!relDrag) return;
    const hit = overTarget(e); relDrag = null; rf.classList.remove('dragging'); $('riverTarget').classList.remove('near');
    if (hit) { rf.style.transform = ''; releaseFish(); } else rf.style.transform = '';
  };
  rf.addEventListener('pointerup', end);
  rf.addEventListener('pointercancel', end);
}
function overTarget(e) {
  const r = $('riverTarget').getBoundingClientRect();
  return e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom;
}
function releaseFish() {
  if (S.released) return; // guard: one release per journey
  S.released = true;
  $('relBtn').disabled = true;
  $('relWrap').classList.add('swim');
  sendEvent(buildEvent());
  setTimeout(() => go(7), reduced() ? 1100 : 3000);
}

/* ========== CLOSING / RESTART ========== */
function renderClosing() {
  const names = [...new Set(S.items.map(i => accById(i.id).n[L()]))];
  $('summary').textContent = S.fish ? t('sum')(S.fish.n[L()], names.length ? names.join(', ') : t('noAcc')) : '';
}
function restart() {
  const lang = S.lang;
  S = Object.assign(fresh(), { lang });
  reflectText = ''; $('reflect').value = ''; $('notice').textContent = '';
  ['powerMini', 'powerFull'].forEach(id => ($(id).innerHTML = ''));
  $('relBtn').disabled = false; $('relWrap').classList.remove('swim'); $('relFish').style.transform = '';
  go(0);
}

/* ========== TOUCHDESIGNER ADAPTER (optional, off the network by default) ========== */
const TD_CONFIG = {
  enabled: true,
  // To connect TouchDesigner later, replace `mockTransport` with a function that opens a WebSocket
  // (e.g. new WebSocket('ws://<td-host>:<port>')) and calls ws.send(JSON.stringify(payload)).
  // Nothing is transmitted until you do this. The private reflection text is never part of the payload.
  transport: payload => console.info('[DEV ONLY – mock transport, nothing was sent]', payload)
};
function buildEvent() {
  const p = computePower();
  return {
    event: 'fish_release', fish_id: S.fish.id, fish_type: S.fish.n[0], language: S.lang,
    accessories: [...new Set(S.items.map(i => accById(i.id).f))],
    wish_power: { studies_career: p.study, health_wellbeing: p.health, success_obstacles: p.success, finance_abundance: p.finance, love_happiness: p.love },
    timestamp: new Date().toISOString()
  };
}
function sendEvent(payload) {
  if (!TD_CONFIG.enabled) return;
  try { TD_CONFIG.transport(payload); } catch (err) { console.warn('Transport failed; experience unaffected.', err); }
}

/* ========== GLOBAL EVENTS ========== */
const ACTIONS = {
  lang: b => { S.lang = b.dataset.v; applyLang(); },
  start: () => go(1),
  ans: b => { S.answers[S.q] = Number(b.dataset.k); renderQuiz(); },
  qprev: () => { if (S.q > 0) { S.q--; renderQuiz(); } else go(0); },
  qnext: () => {
    if (S.answers[S.q] === null) return;
    if (S.q < QUIZ.length - 1) { S.q++; renderQuiz(); } else { S.fish = scoreFish(); S.items = []; S.sel = null; S.notice = null; go(2); }
  },
  toDeco: () => go(3),
  rmSel: () => { if (S.sel) removeItem(S.sel); },
  rmOne: b => removeItem(Number(b.closest('.acc').dataset.uid)),
  reset: () => { S.items = []; S.sel = null; S.notice = null; $('notice').textContent = ''; renderStage(); renderPower($('powerMini')); },
  toPower: () => go(4),
  backDeco: () => go(3),
  toReflect: () => go(5),
  toRelease: () => go(6),
  release: releaseFish,
  restart
};
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (b && ACTIONS[b.dataset.act]) ACTIONS[b.dataset.act](b);
});
document.addEventListener('pointermove', e => {
  if (lp && !lp.made && Math.hypot(e.clientX - lp.x, e.clientY - lp.y) > 10) {
    const n = toNorm(e); lp.made = addItem(lp.id, n);
    if (lp.made) drag = { it: lp.made, dx: 0, dy: 0 };
  }
  if (drag) { const n = toNorm(e); setPos(drag.it, n.x - drag.dx, n.y - drag.dy); }
});
function endDrag(e) {
  if (lp) {
    if (!lp.made) addItem(lp.id); // plain tap/click adds at default position
    else if (e.type === 'pointerup' && !toNorm(e).inside) removeItem(lp.made.uid); // dropped outside the fish stage
  }
  lp = null; drag = null;
}
document.addEventListener('pointerup', endDrag);
document.addEventListener('pointercancel', () => { lp = null; drag = null; });
$('reflect').addEventListener('input', e => { reflectText = e.target.value; updateCount(); });

/* Missing-image fallback */
document.addEventListener('error', e => {
  const i = e.target;
  if (!i || i.tagName !== 'IMG' || i.dataset.fb) return;
  i.dataset.fb = 1;
  const s = document.createElement('span'); s.className = 'fallback'; s.textContent = i.alt || '…';
  i.replaceWith(s);
}, true);

/* Petals */
(function petals() {
  const box = $('petals');
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('i');
    p.className = 'petal';
    p.style.left = (i * 7.3 + 3) % 100 + '%';
    p.style.animationDuration = 14 + (i % 5) * 3 + 's';
    p.style.animationDelay = -(i * 1.7) + 's';
    p.style.transform = `scale(${0.7 + (i % 3) * 0.3})`;
    box.appendChild(p);
  }
})();

initDecorate();
initRelease();
applyLang();
go(0);
