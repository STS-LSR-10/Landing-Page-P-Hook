/**
 * P'Hook (พี่ฮูก) LINE Bot Landing Page Script
 * Interactivity: LINE Chat Simulator (#tell), LIFF Web App Showcase,
 * Persona Switcher, Commands Explorer, Pricing Toggle, FAQ Accordion, QR Modal.
 */

/* ตั้งค่า LINE Support (ไลน์ทีมงาน): ใส่ ID ตรงนี้ที่เดียว เช่น '@phook-support'
   ถ้าเว้นว่างไว้ ปุ่ม/ลิงก์จะแสดงเป็น "เร็ว ๆ นี้" และกดไม่ได้ */
const SUPPORT_LINE_ID = '';

function initSupportLine() {
  const links = document.querySelectorAll('[data-support-line]');
  const bar = document.getElementById('supportBar');
  links.forEach((a) => {
    if (SUPPORT_LINE_ID) {
      a.href = 'https://line.me/R/ti/p/' + encodeURIComponent(SUPPORT_LINE_ID).replace('%40', '@');
      if (!a.classList.contains('btn')) a.textContent = SUPPORT_LINE_ID;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    } else {
      a.removeAttribute('href');
      a.setAttribute('aria-disabled', 'true');
      a.classList.add('is-soon');
      a.textContent = a.classList.contains('btn') ? 'LINE Support เร็ว ๆ นี้' : 'เร็ว ๆ นี้';
    }
  });
  if (bar && !SUPPORT_LINE_ID) bar.classList.add('is-soon');
}

document.addEventListener('DOMContentLoaded', () => {
  initSupportLine();
  initSimulator();
  initWebAppTabs();
  initPersonas();
  initCommandsExplorer();
  initPricingToggle();
  initFaqAccordion();
  initModals();
  initMobileNav();
});

/* ==========================================================================
   2. LIFF Mobile Web App Showcase
   ========================================================================== */
function initWebAppTabs() {
  const tabs = document.querySelectorAll('.webapp-tab');
  const screenImg = document.getElementById('webappScreenImg');
  const title = document.getElementById('webappTitle');
  const desc = document.getElementById('webappDesc');
  const pointsContainer = document.getElementById('webappPoints');

  const screenData = {
    'summary': {
      img: 'app/summary-overview.png',
      title: 'หน้าสรุปภาพรวม (Summary Overview)',
      desc: 'ดูยอดรายรับ-รายจ่ายสุทธิประจำเดือน พร้อมกราฟแท่งเปรียบเทียบ รายการล่าสุด และสถานะงบประมาณรวม ให้คุณรู้สถานการณ์เงินในพริบตา',
      points: [
        'แสดงยอดคงเหลือสุทธิและอัตราการใช้เงินเทียบกับเดือนก่อน',
        'แตะเพื่อกรองดูเฉพาะรายรับหรือรายจ่ายได้ทันที',
        'ส่งออกข้อมูลเป็น CSV / Excel ได้ในคลิกเดียว'
      ]
    },
    'analytics': {
      img: 'app/analytics-charts.png',
      title: 'หน้าวิเคราะห์กราฟ (Analytics & Charts)',
      desc: 'ดูกราฟเส้นแนวโน้มการใช้จ่าย รายวัน รายสัปดาห์ และสัดส่วนหมวดหมู่ด้วยแผนภูมิวงกลมและแท่งแบบละเอียดยิบ',
      points: [
        'ดูกราฟเปรียบเทียบแนวโน้มรายจ่ายแต่ละสัปดาห์',
        'วิเคราะห์สัดส่วนรายจ่ายตามหลัก 50-30-20 เพื่อสุขภาพการเงินที่ดี',
        'ชี้ชัดหมวดหมู่ที่ใช้เงินเกินเกณฑ์เพื่อช่วยเตือนสติ'
      ]
    },
    'budgets': {
      img: 'app/budgets-categories.png',
      title: 'หมวดหมู่และงบประมาณ (Budgets & Categories)',
      desc: 'ตั้งงบประมาณรวมประจำเดือน งบประมาณรายหมวดหมู่ และงบรายวัน เพื่อควบคุมวินัยทางการเงินอย่างมีประสิทธิภาพ',
      points: [
        'ตั้งงบรวมรอบเดือน/สัปดาห์ พร้อมแถบความคืบหน้าแจ้งเตือนสีส้ม-แดง',
        'ระบบแจ้งเตือนผ่านแชทอัตโนมัติเมื่อใช้เงินแตะ 80% ของงบ',
        'สร้างหมวดหมู่ของฉัน กำหนดอีโมจิและคำค้นเพื่อจัดหมวดเองได้ (Pro)'
      ]
    },
    'transactions': {
      img: 'app/transactions-groups.png',
      title: 'หน้ารายการ & ประวัติ (Transactions & Search)',
      desc: 'ตรวจสอบประวัติการใช้จ่ายทั้งหมด ค้นหาตามคำสำคัญ กรองตามแท็ก # และช่วงวันที่ต้องการได้อย่างรวดเร็ว',
      points: [
        'ค้นหารายการด้วยคีย์เวิร์ด หรือแท็ก #ปาร์ตี้ #ช้อปปิ้ง #เที่ยว',
        'กรองตามช่วงวันที่ต้องการดู พร้อมสรุปยอดรวมเฉพาะช่วงนั้น',
        'แก้ไขหรือลบหลายรายการพร้อมกันได้อย่างสะดวกสบาย'
      ]
    },
    'reminders': {
      img: 'app/reminders-list.png',
      title: 'หน้าจัดการเตือน (Reminders & Calendar)',
      desc: 'ดูรายการแจ้งเตือนทั้งหมดในรูปแบบลิสต์หรือมุมมองปฏิทิน ไม่พลาดทุกเรื่องสำคัญในชีวิตทั้งเรื่องเงินและเรื่องส่วนตัว',
      points: [
        'จัดการเตือนกินยา จ่ายบิล นัดหมายสำคัญ หรือส่งงาน',
        'ติ๊กเครื่องหมายถูกเพื่อเคลียร์ภารกิจที่ทำเสร็จแล้ว',
        'ซิงก์เชื่อมโยงกับ Google Calendar แบบเรียลไทม์'
      ]
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const screenKey = tab.getAttribute('data-screen');
      const data = screenData[screenKey];
      if (!data) return;

      screenImg.style.opacity = '0';
      setTimeout(() => {
        screenImg.src = data.img;
        const sc = document.getElementById('appScroll');
        if (sc) sc.scrollTop = 0;
        title.textContent = data.title;
        desc.textContent = data.desc;
        pointsContainer.innerHTML = data.points.map(p => `
          <div class="webapp-point">
            <span class="point-bullet">✓</span>
            <span>${escapeHtml(p)}</span>
          </div>
        `).join('');
        screenImg.style.opacity = '1';
      }, 150);
    });
  });
}

/* ==========================================================================
   3. 5 Bot Personas
   ========================================================================== */
function initPersonas() {
  const tabs = document.querySelectorAll('.persona-tab');
  const owlImg = document.getElementById('personaOwlImg');
  const emojiBadge = document.getElementById('personaEmojiBadge');
  const nameLabel = document.getElementById('personaNameLabel');
  const quote = document.getElementById('personaQuote');
  const desc = document.getElementById('personaDesc');
  const currentSimPersona = document.getElementById('currentSimPersona');

  const personaData = {
    'warm': {
      emoji: '🌸',
      name: 'ฮูกน้อยอบอุ่น (โหมดเริ่มต้น)',
      sample: 'รับทราบครับคุณ santisook ไม่ต้องห่วงนะ พรุ่งนี้สู้ใหม่ พี่ฮูกคอยซัพพอร์ตเสมอครับ ✨',
      desc: 'พูดจาน่ารัก สุภาพ ให้กำลังใจ ใส่ใจทุกเรื่องของคุณ ช่วยให้การจดเงินไม่เครียดและมีแรงบันดาลใจออมเงินในทุกๆ วัน',
      simText: '🌸 โหมดฮูกน้อยอบอุ่น'
    },
    'bestie': {
      emoji: '🤝',
      name: 'ฮูกเพื่อนซี้',
      sample: 'เออ จัดไปเพื่อน! จดไว้ให้ละ เผื่อรอบนี้สมองเออเร่อลืมอีก 555 กินดีอยู่ดีนะมึงงง',
      desc: 'ฟีลเพื่อนสนิท คุยชิลๆ แซะพอกรุบกริบ เป็นกันเองขั้นสุด แต่พึ่งพาได้เสมอเวลาต้องการเช็กยอดเงิน',
      simText: '🤝 โหมดฮูกเพื่อนซี้'
    },
    'spicy': {
      emoji: '🌶️',
      name: 'ฮูกปากแจ๋ว',
      sample: 'พรุ่งนี้อีกละนะแก! พูดงี้มาสามวันติดละ 555 เดี๋ยวพี่ฮูกบินไปจิกถึงเตียงเลยคอยดู กินหรูอยู่แพงอีกแล้วนะ!',
      desc: 'กวนประสาทขั้นสุด ปั่นเก่ง ขยันเบรก ยิงมุกไม่พัก เหมาะมากสำหรับคนที่ต้องการคนด่าเตือนสติก่อนกระเป๋าฉีก',
      simText: '🌶️ โหมดฮูกปากแจ๋ว'
    },
    'tea': {
      emoji: '🫖',
      name: 'นกฮูกจิบชา',
      sample: 'ได้ครับ นึกว่าจะผลัดเป็นเดือนหน้าซะแล้วนะเนี่ย... บันทึกเรียบร้อยครับ หวังว่างวดหน้าจะไม่เกินงบอีกนะครับ',
      desc: 'ท่าทีสุขุม ผู้ดีทุกกระเบียดนิ้ว แต่คำพูดแอบเหน็บเบาๆ ให้สะดุ้ง ตอกย้ำวินัยการเงินแบบมีชั้นเชิง',
      simText: '🫖 โหมดนกฮูกจิบชา'
    },
    'night': {
      emoji: '🦉',
      name: 'ฮูกนอนดึก (พิเศษ!)',
      sample: 'ดึกป่านนี้ยังไม่นอนอีกนะ! ตีสองยังสั่งเดลิเวอรี่ ตาจะค้างแข่งกับพี่ฮูกเหรอ รีบกดจ่ายแล้วนอนได้แล้ว!',
      desc: 'ขยันเตือนคนนอนดึกและชอบช้อปปิ้งยามวิกาล จ้องจับผิดรายจ่ายเก่ง ตาวาวทุกการเคลื่อนไหวของกระเป๋าตังค์',
      simText: '🦉 โหมดฮูกนอนดึก'
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const key = tab.getAttribute('data-persona');
      const data = personaData[key];
      if (!data) return;

      emojiBadge.textContent = data.emoji;
      nameLabel.textContent = data.name;
      quote.textContent = `“${data.sample}”`;
      desc.textContent = data.desc;

      if (currentSimPersona) {
        currentSimPersona.textContent = data.simText;
      }
      window.phookPersona = key;
      window.dispatchEvent(new Event('phook-persona'));
    });
  });
}

/* ==========================================================================
   4. Commands Explorer (Cheatsheet)
   ========================================================================== */
function initCommandsExplorer() {
  const searchInput = document.getElementById('cmdSearchInput');
  const catPills = document.querySelectorAll('.cat-pill');
  const grid = document.getElementById('commandsGrid');

  // 60 Raw Commands embedded from commands.json
  const rawCommands = [
    { group: 'จดรายการ', type: 'กาแฟ 30', does: 'จดรายจ่าย', plan: 'Free' },
    { group: 'จดรายการ', type: 'เงินเดือน 25000', does: 'จดรายรับ', plan: 'Free' },
    { group: 'จดรายการ', type: '+500 ขายของ', does: 'จดรายรับด้วยเครื่องหมาย + (ใช้ − สำหรับรายจ่าย)', plan: 'Free' },
    { group: 'จดรายการ', type: 'เมื่อวาน กาแฟ 45', does: 'จดย้อนหลัง', plan: 'Pro' },
    { group: 'จดรายการ', type: 'ข้าว 50, กาแฟ 45', does: 'หลายรายการในครั้งเดียว', plan: 'Pro' },
    { group: 'จดรายการ', type: 'หมูกระทะ 500 #ปาร์ตี้', does: 'ติดแท็ก', plan: 'Pro' },
    { group: 'จดรายการ', type: 'กาแฟ 45 @KTC', does: 'จดลงกระเป๋าที่เลือก', plan: 'Free' },
    { group: 'จดรายการ', type: 'ราเมน 1500 JPY', does: 'สกุลเงินต่างประเทศ', plan: 'Elite' },
    { group: 'จดรายการ', type: 'ลบล่าสุด', does: 'ลบรายการล่าสุด', plan: 'Free' },
    { group: 'จดรายการ', type: 'แก้ล่าสุด 45', does: 'แก้ยอดรายการล่าสุด', plan: 'Free' },
    { group: 'สรุปและค้นหา', type: 'สรุป', does: 'สรุปยอดวันนี้และเดือนนี้', plan: 'Free' },
    { group: 'สรุปและค้นหา', type: 'สรุปวันนี้', does: 'สรุปยอดเฉพาะวันนี้', plan: 'Free' },
    { group: 'สรุปและค้นหา', type: 'สรุปเดือนนี้', does: 'สรุปยอดเดือนปัจจุบัน', plan: 'Free' },
    { group: 'สรุปและค้นหา', type: 'สรุปหมวด', does: 'ยอดใช้จ่ายแยกตามหมวดหมู่', plan: 'Free' },
    { group: 'สรุปและค้นหา', type: 'ล่าสุด', does: 'ดูรายการ 5 รายการล่าสุด', plan: 'Free' },
    { group: 'สรุปและค้นหา', type: 'สรุปปี', does: 'ภาพรวมรายรับ-รายจ่ายทั้งปี', plan: 'Pro' },
    { group: 'สรุปและค้นหา', type: 'เทียบเดือน', does: 'เทียบรายหมวดกับเดือนก่อนหน้า', plan: 'Pro' },
    { group: 'สรุปและค้นหา', type: 'สรุป 01/10-15/10', does: 'สรุปยอดช่วงวันที่เลือก', plan: 'Pro' },
    { group: 'สรุปและค้นหา', type: 'ค้นหา กาแฟ', does: 'หารายการพร้อมผลรวมเงิน', plan: 'Pro' },
    { group: 'สรุปและค้นหา', type: 'พยากรณ์', does: 'คาดการณ์เงินคงเหลือปลายเดือน', plan: 'Elite' },
    { group: 'สรุปและค้นหา', type: 'วิเคราะห์', does: 'AI วิเคราะห์พฤติกรรมการใช้จ่าย', plan: 'Elite' },
    { group: 'กระเป๋าและบัตร', type: 'กระเป๋า', does: 'ดูยอดเงินทุกกระเป๋า', plan: 'Free' },
    { group: 'กระเป๋าและบัตร', type: 'กระเป๋า ใหม่ เงินสด', does: 'สร้างกระเป๋าใหม่', plan: 'Pro' },
    { group: 'กระเป๋าและบัตร', type: 'โอน 500 เงินสด>KTC', does: 'โอนเงินระหว่างกระเป๋า', plan: 'Pro' },
    { group: 'กระเป๋าและบัตร', type: 'บัตร', does: 'ดูวงเงิน วันตัดรอบ ยอดบัตรเครดิต', plan: 'Pro' },
    { group: 'กระเป๋าและบัตร', type: 'เชิญ กองกลาง', does: 'สร้างกระเป๋าร่วมชวนแฟน/ครอบครัว', plan: 'Pro' },
    { group: 'งบและเป้าหมาย', type: 'งบ', does: 'ดูสถานะงบประมาณปัจจุบัน', plan: 'Pro' },
    { group: 'งบและเป้าหมาย', type: 'งบ 15000', does: 'ตั้งงบประมาณรวมประจำเดือน', plan: 'Pro' },
    { group: 'งบและเป้าหมาย', type: 'งบวัน 500', does: 'ตั้งงบรายวัน เตือนเมื่อเกิน', plan: 'Pro' },
    { group: 'งบและเป้าหมาย', type: 'เป้าหมาย ใหม่ เที่ยวญี่ปุ่น 30000', does: 'สร้างกระปุกเป้าหมายออมเงิน', plan: 'Pro' },
    { group: 'งบและเป้าหมาย', type: 'ออม เที่ยวญี่ปุ่น 2000', does: 'หยอดเงินใส่กระปุกเป้าหมาย', plan: 'Pro' },
    { group: 'งบและเป้าหมาย', type: 'ประจำ ใหม่ เน็ตฟลิกซ์ 419 ทุกวันที่ 1', does: 'ตั้งรายการจ่ายประจำอัตโนมัติ', plan: 'Pro' },
    { group: 'หนี้และบิล', type: 'ให้ยืม สมชาย 500', does: 'บันทึกคนยืมเงิน', plan: 'Elite' },
    { group: 'หนี้และบิล', type: 'สมชายคืน 500', does: 'บันทึกยอดชำระคืน', plan: 'Elite' },
    { group: 'หนี้และบิล', type: 'หนี้', does: 'ดูยอดหนี้สินและลูกหนี้ทั้งหมด', plan: 'Elite' },
    { group: 'หนี้และบิล', type: 'บิล ใหม่ ค่าไฟ 1250 ทุกวันที่ 15', does: 'เตือนชำระบิลรายเดือน', plan: 'Elite' },
    { group: 'เตือน โน้ต ไฟล์', type: 'เตือน พรุ่งนี้ 9 โมง จ่ายค่าไฟ', does: 'ตั้งเตือนความจำ', plan: 'Free' },
    { group: 'เตือน โน้ต ไฟล์', type: 'เตือน ทุกวัน 8 โมง กินยา', does: 'ตั้งเตือนซ้ำรายวัน/สัปดาห์', plan: 'Free' },
    { group: 'เตือน โน้ต ไฟล์', type: 'รายการเตือน', does: 'ดูสิ่งที่ต้องทำทั้งหมด', plan: 'Free' },
    { group: 'เตือน โน้ต ไฟล์', type: 'โน้ต รหัสไวไฟ 1234', does: 'บันทึกโน้ตสำคัญ', plan: 'Free' },
    { group: 'เตือน โน้ต ไฟล์', type: 'ค้นหาโน้ต ไวไฟ', does: 'ค้นหาโน้ตที่เคยบันทึก', plan: 'Free' },
    { group: 'เตือน โน้ต ไฟล์', type: 'เก็บไว้ให้หน่อย', does: 'ส่งรูปหรือไฟล์เพื่อฝากเก็บเข้าคลัง', plan: 'Free' },
    { group: 'เตือน โน้ต ไฟล์', type: 'หาไฟล์ สัญญา', does: 'ค้นหาไฟล์ในคลัง', plan: 'Free' },
    { group: 'สมุดกลุ่ม (ใช้ในกลุ่ม LINE)', type: 'เปิดสมุดกลุ่ม', does: 'เริ่มใช้สมุดบัญชีกองกลางในกลุ่ม LINE', plan: 'Elite' },
    { group: 'สมุดกลุ่ม (ใช้ในกลุ่ม LINE)', type: 'จด ข้าวเที่ยง 350', does: 'จดรายจ่ายในกลุ่ม', plan: 'Free' },
    { group: 'สมุดกลุ่ม (ใช้ในกลุ่ม LINE)', type: 'หารบิล หมูกระทะ 1200', does: 'หารบิล พร้อมสร้าง QR รายคน', plan: 'Elite' },
    { group: 'สมุดกลุ่ม (ใช้ในกลุ่ม LINE)', type: 'ตามเงิน', does: 'ส่งการ์ดทวงเงินคนที่ยังค้างจ่าย', plan: 'Elite' },
    { group: 'สมุดกลุ่ม (ใช้ในกลุ่ม LINE)', type: 'เริ่มทริป เชียงใหม่', does: 'เปิดกองกลางสำหรับทริปเที่ยว', plan: 'Elite' },
    { group: 'สมุดกลุ่ม (ใช้ในกลุ่ม LINE)', type: 'สรุปทริป', does: 'คำนวณเงิน ใครโอนคืนใคร', plan: 'Elite' },
    { group: 'ถามพี่ฮูก', type: 'ถามพี่ฮูก', does: 'เข้าสู่โหมดคุยปรึกษาการเงินต่อเนื่อง', plan: 'Free' },
    { group: 'ถามพี่ฮูก', type: 'ฮูก เดือนนี้ใช้ไปเท่าไร', does: 'ถามคำถามด่วนรอบเดียว', plan: 'Free' },
    { group: 'ถามพี่ฮูก', type: 'ฮูก พอจะมีเงินไปเที่ยวไหม', does: 'ปรึกษาการวางแผนการเงินกับ AI', plan: 'Free' }
  ];

  let currentCategory = 'all';
  let searchQuery = '';

  function renderCommands() {
    grid.innerHTML = '';
    const filtered = rawCommands.filter(c => {
      const matchCat = currentCategory === 'all' || c.group === currentCategory;
      const matchSearch = !searchQuery || 
        c.type.toLowerCase().includes(searchQuery) || 
        c.does.toLowerCase().includes(searchQuery) ||
        c.group.toLowerCase().includes(searchQuery);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #94A3B8; padding: 2rem;">ไม่พบคำสั่งที่ตรงกับคำค้นหา</div>';
      return;
    }

    filtered.forEach(cmd => {
      const planClass = cmd.plan === 'Free' ? 'plan-free' : (cmd.plan === 'Pro' ? 'plan-pro' : 'plan-elite');
      const card = document.createElement('div');
      card.className = 'cmd-card';
      card.innerHTML = `
        <div class="cmd-header">
          <code class="cmd-code">${escapeHtml(cmd.type)}</code>
          <span class="cmd-plan-tag ${planClass}">${cmd.plan}</span>
        </div>
        <div class="cmd-does">${escapeHtml(cmd.does)}</div>
        <button class="cmd-copy-btn" data-text="${escapeHtml(cmd.type)}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          คัดลอกคำสั่ง
        </button>
      `;
      grid.appendChild(card);
    });

    // Add copy listener
    grid.querySelectorAll('.cmd-copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-text');
        navigator.clipboard.writeText(text).then(() => {
          btn.innerHTML = '✓ คัดลอกแล้ว!';
          setTimeout(() => {
            btn.innerHTML = `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              คัดลอกคำสั่ง
            `;
          }, 1500);
        });
      });
    });
  }

  // Filter clicks
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-cat');
      renderCommands();
    });
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderCommands();
    });
  }

  renderCommands();
}

/* ==========================================================================
   5. Pricing & Plans Toggle (from plans.json)
   ========================================================================== */
function initPricingToggle() {
  const switchBtn = document.getElementById('billingSwitch');
  const labelMonthly = document.getElementById('labelMonthly');
  const labelYearly = document.getElementById('labelYearly');

  const proPrice = document.getElementById('proPrice');
  const proPeriod = document.getElementById('proPeriod');
  const proOriginalPrice = document.getElementById('proOriginalPrice');

  const elitePrice = document.getElementById('elitePrice');
  const elitePeriod = document.getElementById('elitePeriod');
  const eliteOriginalPrice = document.getElementById('eliteOriginalPrice');

  let isYearly = true; // Default Yearly

  function updatePrices() {
    if (isYearly) {
      switchBtn.setAttribute('aria-checked', 'true');
      labelYearly.classList.add('active');
      labelMonthly.classList.remove('active');

      if (proPrice) proPrice.textContent = '299';
      if (proPeriod) proPeriod.textContent = '/ ปี (เหลือ ฿25/ด)';
      if (proOriginalPrice) proOriginalPrice.innerHTML = 'ราคาปกติ <del>฿339/ปี</del> • โปรเปิดตัวถึง 31 ธ.ค. 2569';

      if (elitePrice) elitePrice.textContent = '699';
      if (elitePeriod) elitePeriod.textContent = '/ ปี (เหลือ ฿58/ด)';
      if (eliteOriginalPrice) eliteOriginalPrice.innerHTML = 'ราคาปกติ <del>฿799/ปี</del> • โปรเปิดตัวถึง 31 ธ.ค. 2569';
    } else {
      switchBtn.setAttribute('aria-checked', 'false');
      labelMonthly.classList.add('active');
      labelYearly.classList.remove('active');

      if (proPrice) proPrice.textContent = '39';
      if (proPeriod) proPeriod.textContent = '/ เดือน';
      if (proOriginalPrice) proOriginalPrice.innerHTML = 'ราคาปกติ <del>฿59/เดือน</del> • โปรเปิดตัวถึง 31 ธ.ค. 2569';

      if (elitePrice) elitePrice.textContent = '119';
      if (elitePeriod) elitePeriod.textContent = '/ เดือน';
      if (eliteOriginalPrice) eliteOriginalPrice.innerHTML = 'ราคาปกติ <del>฿139/เดือน</del> • โปรเปิดตัวถึง 31 ธ.ค. 2569';
    }
  }

  if (switchBtn) {
    switchBtn.addEventListener('click', () => {
      isYearly = !isYearly;
      updatePrices();
    });
  }

  if (labelMonthly) {
    labelMonthly.addEventListener('click', () => {
      isYearly = false;
      updatePrices();
    });
  }

  if (labelYearly) {
    labelYearly.addEventListener('click', () => {
      isYearly = true;
      updatePrices();
    });
  }
}

/* ==========================================================================
   6. FAQ Accordion (from faq.md)
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      // Close other items
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. QR Modal & Copy LINE ID
   ========================================================================== */
function initModals() {
  const qrModal = document.getElementById('qrModal');
  const openBtns = document.querySelectorAll('.open-qr-btn');
  const closeBtn = document.getElementById('modalCloseBtn');
  const copyBtn = document.getElementById('copyIdBtn');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (qrModal) qrModal.classList.add('open');
    });
  });

  if (closeBtn && qrModal) {
    closeBtn.addEventListener('click', () => {
      qrModal.classList.remove('open');
    });
  }

  if (qrModal) {
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) {
        qrModal.classList.remove('open');
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('@p-hook').then(() => {
        copyBtn.textContent = '✓ คัดลอกแล้ว!';
        setTimeout(() => {
          copyBtn.textContent = 'คัดลอก ID';
        }, 1500);
      });
    });
  }
}

/* ==========================================================================
   8. Mobile Navigation Toggle
   ========================================================================== */
function initMobileNav() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    navLinks.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }
}

/* Helper function to escape HTML */
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
