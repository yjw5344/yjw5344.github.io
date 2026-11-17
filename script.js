/**
 * Nature Green Wedding Invitation
 * Korean Mobile 청첩장 - Script
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     Utility Helpers
     ═══════════════════════════════════════════ */

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function formatDate(dateStr, timeStr) {
    const d = new Date(`${dateStr}T${timeStr}:00`);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const day = days[d.getDay()];
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const period = hours < 12 ? '오전' : hours === 12 ? '낮' : '오후'; // 12시대는 '낮 12시'로 표기
    const h12 = hours % 12 || 12;
    const minuteStr = minutes > 0 ? ` ${minutes}분` : '';
    return `${year}년 ${month}월 ${date}일 ${day}요일 ${period} ${h12}시${minuteStr}`;
  }

  function getWeddingDateTime() {
    return new Date(`${CONFIG.wedding.date}T${CONFIG.wedding.time}:00`);
  }

  /* ═══════════════════════════════════════════
     Image Auto-Detection
     ═══════════════════════════════════════════ */

  function loadImagesFromFolder(folder, maxAttempts = 50) {
    return new Promise(resolve => {
        const images = [];
        let current = 1;
        let consecutiveFails = 0;

        function tryNext() {
            if (current > maxAttempts || consecutiveFails >= 3) {
                resolve(images);
                return;
            }
            const img = new Image();
            const path = `images/${folder}/${current}.jpg`;
            img.onload = function() {
                images.push(path);
                consecutiveFails = 0;
                current++;
                tryNext();
            };
            img.onerror = function() {
                consecutiveFails++;
                current++;
                tryNext();
            };
            img.src = path;
        }

        tryNext();
    });
  }

  /* ═══════════════════════════════════════════
     Toast
     ═══════════════════════════════════════════ */

  let toastTimer = null;
  function showToast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2500);
  }

  /* ═══════════════════════════════════════════
     Clipboard
     ═══════════════════════════════════════════ */

  async function copyToClipboard(text, successMsg) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0;left:-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      showToast(successMsg || '복사되었습니다');
    } catch {
      showToast('복사에 실패했습니다');
    }
  }

  /* ═══════════════════════════════════════════
     OG Meta Tags
     ═══════════════════════════════════════════ */

  function setMetaTags() {
    const m = CONFIG.meta;
    document.title = m.title;
    const setMeta = (attr, val, content) => {
      const el = document.querySelector(`meta[${attr}="${val}"]`);
      if (el) el.setAttribute('content', content);
    };
    setMeta('property', 'og:title', m.title);
    setMeta('property', 'og:description', m.description);
    setMeta('property', 'og:image', 'images/og/1.jpg');
    setMeta('name', 'description', m.description);
  }

  /* ═══════════════════════════════════════════
     Curtain
     ═══════════════════════════════════════════ */

  function initCurtain() {
    const curtain = $('#curtain');
    const btn = $('#curtainBtn');
    const namesEl = $('#curtainNames');

    // If useCurtain is false, skip the curtain entirely
    if (CONFIG.useCurtain === false) {
      curtain.style.display = 'none';
      initFallingLeaves();
      return;
    }

    namesEl.textContent = `${CONFIG.groom.name}  &  ${CONFIG.bride.name}`;

    btn.addEventListener('click', () => {
      curtain.classList.add('is-open');
      document.body.classList.remove('no-scroll');
      setTimeout(() => {
        curtain.classList.add('is-hidden');
        initFallingLeaves();
      }, 1400);
    });

    document.body.classList.add('no-scroll');
  }

  /* ═══════════════════════════════════════════
     Falling Leaves Animation
     ═══════════════════════════════════════════ */

  function initFallingLeaves() {
    const canvas = $('#leafCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    const leaves = [];
    const LEAF_COUNT = 20;

    // Leaf color palette: green and golden tones
    const leafColors = [
      { fill: 'rgba(139, 158, 126, 0.6)', stroke: 'rgba(74, 94, 59, 0.3)' },   // sage green
      { fill: 'rgba(74, 94, 59, 0.5)', stroke: 'rgba(58, 75, 46, 0.3)' },       // forest green
      { fill: 'rgba(168, 184, 158, 0.5)', stroke: 'rgba(139, 158, 126, 0.3)' },  // light sage
      { fill: 'rgba(180, 165, 120, 0.5)', stroke: 'rgba(139, 115, 85, 0.3)' },   // golden
      { fill: 'rgba(160, 175, 130, 0.5)', stroke: 'rgba(100, 120, 70, 0.3)' },   // yellow-green
    ];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Leaf {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height * -1 : -30;
        this.size = 10 + Math.random() * 14;
        this.speedY = 0.4 + Math.random() * 0.8;
        this.speedX = -0.2 + Math.random() * 0.4;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.025;
        this.oscillateAmp = 25 + Math.random() * 35;
        this.oscillateSpeed = 0.008 + Math.random() * 0.015;
        this.oscillateOffset = Math.random() * Math.PI * 2;
        this.opacity = 0.15 + Math.random() * 0.35;
        this.t = 0;
        this.colorSet = leafColors[Math.floor(Math.random() * leafColors.length)];
        this.leafType = Math.floor(Math.random() * 3); // 3 leaf shape variants
      }

      update() {
        this.t++;
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.t * this.oscillateSpeed + this.oscillateOffset) * 0.4;
        this.rotation += this.rotSpeed;
        if (this.y > height + 30) this.reset();
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        const s = this.size;

        if (this.leafType === 0) {
          // Oval leaf
          ctx.beginPath();
          ctx.moveTo(0, -s * 0.5);
          ctx.bezierCurveTo(s * 0.5, -s * 0.4, s * 0.5, s * 0.4, 0, s * 0.5);
          ctx.bezierCurveTo(-s * 0.5, s * 0.4, -s * 0.5, -s * 0.4, 0, -s * 0.5);
          ctx.fillStyle = this.colorSet.fill;
          ctx.fill();
          // Vein
          ctx.beginPath();
          ctx.moveTo(0, -s * 0.45);
          ctx.lineTo(0, s * 0.45);
          ctx.strokeStyle = this.colorSet.stroke;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        } else if (this.leafType === 1) {
          // Pointed leaf
          ctx.beginPath();
          ctx.moveTo(0, -s * 0.6);
          ctx.bezierCurveTo(s * 0.4, -s * 0.2, s * 0.35, s * 0.3, 0, s * 0.6);
          ctx.bezierCurveTo(-s * 0.35, s * 0.3, -s * 0.4, -s * 0.2, 0, -s * 0.6);
          ctx.fillStyle = this.colorSet.fill;
          ctx.fill();
          // Vein
          ctx.beginPath();
          ctx.moveTo(0, -s * 0.5);
          ctx.lineTo(0, s * 0.5);
          ctx.strokeStyle = this.colorSet.stroke;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        } else {
          // Round leaf
          ctx.beginPath();
          ctx.ellipse(0, 0, s * 0.35, s * 0.45, 0, 0, Math.PI * 2);
          ctx.fillStyle = this.colorSet.fill;
          ctx.fill();
          // Vein
          ctx.beginPath();
          ctx.moveTo(0, -s * 0.4);
          ctx.lineTo(0, s * 0.4);
          ctx.moveTo(0, -s * 0.1);
          ctx.lineTo(s * 0.2, -s * 0.25);
          ctx.moveTo(0, 0.1);
          ctx.lineTo(-s * 0.2, -s * 0.05);
          ctx.strokeStyle = this.colorSet.stroke;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    for (let i = 0; i < LEAF_COUNT; i++) {
      leaves.push(new Leaf());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      leaves.forEach(l => {
        l.update();
        l.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ═══════════════════════════════════════════
     Hero Section
     ═══════════════════════════════════════════ */

  function initHero() {
    $('#heroPhoto').src = 'images/hero/1.jpg';
    $('#heroNames').textContent = `${CONFIG.groom.name}  ·  ${CONFIG.bride.name}`;
    $('#heroTopDate').textContent = CONFIG.wedding.date.replace(/-/g, '.');
  }

  /* ═══════════════════════════════════════════
     Countdown
     ═══════════════════════════════════════════ */

  function initCountdown() {
    const target = getWeddingDateTime();

    function update() {
      const now = new Date();
      const diff = target - now;

      const labelEl = $('#countdownLabel');

      if (diff <= 0) {
        $('#countDays').textContent = '0';
        $('#countHours').textContent = '0';
        $('#countMinutes').textContent = '0';
        $('#countSeconds').textContent = '0';
        labelEl.textContent = '결혼식이 시작되었습니다';
        return;
      }

      const totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
      labelEl.textContent = `결혼식까지 D-${totalDays}`;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      $('#countDays').textContent = days;
      $('#countHours').textContent = String(hours).padStart(2, '0');
      $('#countMinutes').textContent = String(minutes).padStart(2, '0');
      $('#countSeconds').textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  /* ═══════════════════════════════════════════
     Greeting Section
     ═══════════════════════════════════════════ */

  function initGreeting() {
    $('#greetingTitle').textContent = CONFIG.greeting.title;
    $('#greetingContent').textContent = CONFIG.greeting.content;

    const g = CONFIG.groom;
    const b = CONFIG.bride;

    function parentLine(father, mother, fatherDeceased, motherDeceased) {
      const fd = fatherDeceased ? ' deceased' : '';
      const md = motherDeceased ? ' deceased' : '';
      return `<span class="${fd}">${father}</span> · <span class="${md}">${mother}</span>`;
    }

    const parentsHTML = `
      <div class="parent-row">
        ${parentLine(g.father, g.mother, g.fatherDeceased, g.motherDeceased)}
        <span class="parent-dot">●</span>
        의 아들 <span class="child-name">${g.name}</span>
      </div>
      <div class="parent-row">
        ${parentLine(b.father, b.mother, b.fatherDeceased, b.motherDeceased)}
        <span class="parent-dot">●</span>
        의 딸 <span class="child-name">${b.name}</span>
      </div>
    `;

    $('#greetingParents').innerHTML = parentsHTML;
  }

  /* ═══════════════════════════════════════════
     Calendar Section
     ═══════════════════════════════════════════ */

  function initCalendar() {
    $('#scheduleDate').textContent = formatDate(CONFIG.wedding.date, CONFIG.wedding.time);

    const dt = getWeddingDateTime();
    const year = dt.getFullYear();
    const month = dt.getMonth();
    const weddingDay = dt.getDate();

    const grid = $('#calendarGrid');

    // Header
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    grid.innerHTML = `<div class="calendar__header">${monthNames[month]} ${year}</div>`;

    // Weekdays
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const wdRow = document.createElement('div');
    wdRow.className = 'calendar__weekdays';
    weekdays.forEach(wd => {
      const el = document.createElement('span');
      el.className = 'calendar__weekday';
      el.textContent = wd;
      wdRow.appendChild(el);
    });
    grid.appendChild(wdRow);

    // Days
    const daysContainer = document.createElement('div');
    daysContainer.className = 'calendar__days';

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('span');
      empty.className = 'calendar__day is-empty';
      daysContainer.appendChild(empty);
    }

    for (let d = 1; d <= lastDate; d++) {
      const dayEl = document.createElement('span');
      dayEl.className = 'calendar__day';
      if (d === weddingDay) dayEl.classList.add('is-today');
      dayEl.textContent = d;
      daysContainer.appendChild(dayEl);
    }

    grid.appendChild(daysContainer);
  }

  /* ═══════════════════════════════════════════
     Gallery Section
     ═══════════════════════════════════════════ */

  function initGallery(galleryImages) {
    const grid = $('#galleryGrid');
    const placeholder = grid.querySelector('.loading-placeholder');
    if (placeholder) placeholder.remove();

    if (galleryImages.length === 0) {
      const gallerySection = $('#gallery');
      if (gallerySection) gallerySection.style.display = 'none';
      return;
    }

    galleryImages.forEach((src, i) => {
      const div = document.createElement('div');
      div.className = 'gallery__item animate-item';
      div.setAttribute('data-animate', 'scale-in');
      div.innerHTML = `<img src="${src}" alt="갤러리 사진 ${i + 1}" loading="lazy">`;
      div.addEventListener('click', () => openPhotoModal(galleryImages, i));
      grid.appendChild(div);
    });
  }

  /* ═══════════════════════════════════════════
     Photo Modal (with swipe)
     ═══════════════════════════════════════════ */

  let modalImages = [];
  let modalIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;

  function openPhotoModal(images, index) {
    modalImages = images;
    modalIndex = index;
    showModalImage();
    $('#photoModal').classList.add('is-open');
    document.body.classList.add('no-scroll');
  }

  function closePhotoModal() {
    $('#photoModal').classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  function showModalImage() {
    const img = $('#modalImg');
    img.src = modalImages[modalIndex];
    $('#modalCounter').textContent = `${modalIndex + 1} / ${modalImages.length}`;

    $('#modalPrev').style.display = modalIndex > 0 ? '' : 'none';
    $('#modalNext').style.display = modalIndex < modalImages.length - 1 ? '' : 'none';
  }

  function modalNavigate(dir) {
    const newIndex = modalIndex + dir;
    if (newIndex >= 0 && newIndex < modalImages.length) {
      modalIndex = newIndex;
      showModalImage();
    }
  }

  function initPhotoModal() {
    $('#modalClose').addEventListener('click', closePhotoModal);
    $('#modalPrev').addEventListener('click', () => modalNavigate(-1));
    $('#modalNext').addEventListener('click', () => modalNavigate(1));

    const modal = $('#photoModal');
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.id === 'modalContainer') {
        closePhotoModal();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') closePhotoModal();
      if (e.key === 'ArrowLeft') modalNavigate(-1);
      if (e.key === 'ArrowRight') modalNavigate(1);
    });

    // Swipe support
    const container = $('#modalContainer');

    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    const minSwipe = 50;

    if (Math.abs(diffX) < minSwipe || Math.abs(diffX) < Math.abs(diffY)) return;

    if (diffX > 0) {
      modalNavigate(1);  // swipe left -> next
    } else {
      modalNavigate(-1); // swipe right -> prev
    }
  }

  /* ═══════════════════════════════════════════
     Location Section
     ═══════════════════════════════════════════ */

  function initLocation() {
    const w = CONFIG.wedding;
    $('#locationVenue').textContent = w.venue;
    $('#locationHall').textContent = w.hall;
    $('#locationAddress').textContent = w.address;
    $('#locationTel').textContent = w.tel ? `Tel. ${w.tel}` : '';
    $('#locationMapImg').src = 'images/location/1.jpg';
    $('#kakaoMapBtn').href = w.mapLinks.kakao || '#';
    $('#naverMapBtn').href = w.mapLinks.naver || '#';

    $('#copyAddressBtn').addEventListener('click', () => {
      copyToClipboard(w.address, '주소가 복사되었습니다');
    });
  }

  /* ═══════════════════════════════════════════
     Account Section (축의금)
     ═══════════════════════════════════════════ */

  function renderAccounts(accounts, containerId) {
    const container = $(`#${containerId}`);
    accounts.forEach((acc) => {
      const item = document.createElement('div');
      item.className = 'account-item';
      item.innerHTML = `
        <div class="account-item__info">
          <div class="account-item__role">${acc.role}</div>
          <div class="account-item__detail">
            <span class="account-item__name">${acc.name || ''}</span>
            ${acc.bank} ${acc.number}
          </div>
        </div>
        <button class="account-item__copy" data-account="${acc.bank} ${acc.number} ${acc.name || ''}">
          복사
        </button>
      `;
      container.appendChild(item);
    });
  }

  function initAccordion(triggerId, panelId) {
    const trigger = $(`#${triggerId}`);
    const panel = $(`#${panelId}`);

    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', !expanded);

      if (!expanded) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      } else {
        panel.style.maxHeight = '0';
      }
    });
  }

  function initAccounts() {
    renderAccounts(CONFIG.accounts.groom, 'groomAccountList');
    renderAccounts(CONFIG.accounts.bride, 'brideAccountList');

    initAccordion('groomAccordion', 'groomAccordionPanel');
    initAccordion('brideAccordion', 'brideAccordionPanel');

    // Copy account delegates
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.account-item__copy');
      if (!btn) return;
      const text = btn.dataset.account;
      copyToClipboard(text, '계좌번호가 복사되었습니다');
    });
  }

  /* ═══════════════════════════════════════════
     Footer
     ═══════════════════════════════════════════ */

  function initFooter() {
    const dt = getWeddingDateTime();
    const year = dt.getFullYear();
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    $('#footerText').textContent = `${CONFIG.groom.name} ♥ ${CONFIG.bride.name} — ${year}.${month}.${day}`;
  }

  /* ═══════════════════════════════════════════
     Loading Placeholders
     ═══════════════════════════════════════════ */

  function showLoadingPlaceholders() {
    const galleryGrid = $('#galleryGrid');

    const placeholderHTML = '<div class="loading-placeholder"><span class="loading-dot"></span><span class="loading-dot"></span><span class="loading-dot"></span></div>';

    if (galleryGrid) galleryGrid.innerHTML = placeholderHTML;
  }

  /* ═══════════════════════════════════════════
     Scroll Animations (IntersectionObserver)
     ═══════════════════════════════════════════ */

  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    // Observe initial static items
    $$('.animate-item').forEach((el) => observer.observe(el));

    // Re-observe after dynamic content is added (MutationObserver)
    const mutObs = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if (node.classList && node.classList.contains('animate-item')) {
            observer.observe(node);
          }
          if (node.querySelectorAll) {
            node.querySelectorAll('.animate-item').forEach((el) => observer.observe(el));
          }
        });
      });
    });

    mutObs.observe(document.body, { childList: true, subtree: true });
  }

  /* ═══════════════════════════════════════════
     Bottom Sheets (Upload)
     ═══════════════════════════════════════════ */

  let sheetScrollY = 0;
  let openSheetEl = null;
  const sheetCloseGuards = new Map(); // sheet → () => boolean (false면 닫기 막음)

  function lockScroll() {
    sheetScrollY = window.scrollY;
    document.body.style.top = `-${sheetScrollY}px`;
    document.body.classList.add('no-scroll');
  }

  function unlockScroll() {
    document.body.classList.remove('no-scroll');
    document.body.style.top = '';
    window.scrollTo(0, sheetScrollY);
  }

  function openSheet(sheet) {
    if (openSheetEl) return;
    openSheetEl = sheet;
    sheet.hidden = false;
    void sheet.offsetHeight; // 트랜지션 시작점 확정
    sheet.classList.add('is-open');
    lockScroll();
    const closeBtn = $('.sheet__close', sheet);
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  }

  function closeSheet(sheet) {
    if (!sheet || sheet !== openSheetEl) return;
    const guard = sheetCloseGuards.get(sheet);
    if (guard && guard() === false) return;
    sheet.classList.remove('is-open');
    openSheetEl = null;
    unlockScroll();
    setTimeout(() => {
      if (!sheet.classList.contains('is-open')) sheet.hidden = true;
    }, 350);
  }

  function initSheets() {
    $$('.sheet').forEach((sheet) => {
      $$('[data-sheet-close]', sheet).forEach((el) => {
        el.addEventListener('click', () => closeSheet(sheet));
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && openSheetEl) closeSheet(openSheetEl);
    });
  }

  /* ═══════════════════════════════════════════
     Backend (Google Apps Script)
     ═══════════════════════════════════════════ */

  const BACKEND_ERRORS = {
    rate_limited: '요청이 많아요. 잠시 후 다시 시도해 주세요.',
    upload_closed: '지금은 사진을 받을 수 있는 기간이 아니에요.',
    invalid_type: '사진 또는 영상 파일만 올릴 수 있어요.',
    invalid_size: '파일을 읽을 수 없어요.',
    too_large: '파일 크기가 너무 커요.',
    origin_not_allowed: '허용되지 않은 주소에서 접속했어요.',
    drive_error: '저장 공간에 연결하지 못했어요.',
    server_error: '일시적인 오류가 발생했어요.'
  };

  function backendUrl() {
    return (CONFIG.interact && CONFIG.interact.endpoint || '').trim();
  }

  function todayStr() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }

  async function postToBackend(action, data) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 30000);
    let res;
    try {
      // text/plain → CORS 사전요청 없이 전송되고, 응답 JSON도 읽을 수 있음
      res = await fetch(backendUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action, ...data }),
        signal: ctrl.signal
      });
    } finally {
      clearTimeout(timer);
    }
    let json;
    try {
      json = await res.json();
    } catch {
      throw new Error('server_error');
    }
    if (!json || !json.ok) throw new Error((json && json.error) || 'server_error');
    return json;
  }

  function errorMessage(err, fallback) {
    return BACKEND_ERRORS[err && err.message] || fallback;
  }

  /* ═══════════════════════════════════════════
     Guest Photo / Video Upload
     (원본 그대로 Google Drive 이어올리기 업로드)
     ═══════════════════════════════════════════ */

  const CHUNK_SIZE = 8 * 1024 * 1024;  // 256KB의 배수여야 함
  const MAX_RETRIES = 3;
  const EXT_MIME = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp',
    heic: 'image/heic', heif: 'image/heif', dng: 'image/x-adobe-dng',
    mp4: 'video/mp4', m4v: 'video/x-m4v', mov: 'video/quicktime', '3gp': 'video/3gpp',
    webm: 'video/webm', mkv: 'video/x-matroska', avi: 'video/x-msvideo'
  };

  function mediaMime(file) {
    if (/^(image|video)\//.test(file.type)) return file.type;
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    return EXT_MIME[ext] || '';
  }

  function formatBytes(n) {
    if (n >= 1024 ** 3) return `${(n / 1024 ** 3).toFixed(1)}GB`;
    if (n >= 1024 ** 2) return `${(n / 1024 ** 2).toFixed(1)}MB`;
    return `${Math.max(1, Math.round(n / 1024))}KB`;
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /** "bytes=0-1234" → 1235 (다음에 보낼 위치). 헤더를 못 읽으면 null */
  function parseRangeEnd(range) {
    const m = /bytes=\d+-(\d+)/.exec(range || '');
    return m ? Number(m[1]) + 1 : null;
  }

  function sendRange(url, body, contentRange, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Range', contentRange);
      if (onProgress) xhr.upload.onprogress = (e) => onProgress(e.loaded);
      xhr.onload = () => {
        let range = null;
        try { range = xhr.getResponseHeader('Range'); } catch { /* 노출되지 않은 헤더 */ }
        resolve({ status: xhr.status, range });
      };
      xhr.onerror = () => reject(new Error('network'));
      xhr.ontimeout = () => reject(new Error('network'));
      xhr.send(body);
    });
  }

  async function uploadToDrive(url, file, onProgress) {
    const size = file.size;
    let offset = 0;
    let retries = 0;

    while (offset < size) {
      const end = Math.min(offset + CHUNK_SIZE, size);
      try {
        const r = await sendRange(
          url,
          file.slice(offset, end),
          `bytes ${offset}-${end - 1}/${size}`,
          (loaded) => onProgress(offset + loaded)
        );
        if (r.status === 200 || r.status === 201) return;
        if (r.status === 308) {
          offset = parseRangeEnd(r.range) ?? end;
          retries = 0;
          onProgress(offset);
          continue;
        }
        if (r.status >= 400 && r.status < 500) {
          throw Object.assign(new Error('drive_error'), { fatal: true });
        }
        throw new Error('network'); // 5xx → 재시도
      } catch (err) {
        if (err.fatal || ++retries > MAX_RETRIES) throw err;
        await sleep(1000 * 2 ** retries);
        // 서버가 실제로 어디까지 받았는지 확인 후 이어서 전송
        try {
          const s = await sendRange(url, null, `bytes */${size}`);
          if (s.status === 200 || s.status === 201) return;
          if (s.status === 308) {
            const got = parseRangeEnd(s.range);
            if (got !== null) offset = got;
          }
        } catch { /* 다음 루프에서 같은 조각 재전송 */ }
      }
    }
  }

  function initUpload() {
    const cfg = CONFIG.interact && CONFIG.interact.upload;
    const btn = $('#openUploadBtn');
    if (!cfg || !cfg.enabled) {
      btn.hidden = true;
      return false;
    }

    const sheet = $('#uploadSheet');
    const input = $('#uploadInput');
    const pickBtn = $('#uploadPickBtn');
    const status = $('#uploadStatus');
    const list = $('#uploadList');
    const summaryText = $('#uploadSummaryText');
    const summaryPct = $('#uploadSummaryPct');
    const barFill = $('#uploadBarFill');
    const notice = $('#uploadNotice');
    const retryBtn = $('#uploadRetryBtn');
    const maxBytes = (cfg.maxFileMB || 2048) * 1024 * 1024;

    let uploading = false;
    let failed = [];

    const notOpenYet = cfg.openFrom && todayStr() < cfg.openFrom;
    if (notOpenYet) btn.classList.add('is-disabled');

    btn.addEventListener('click', () => {
      if (!backendUrl()) return showToast('사진 올리기는 준비 중입니다.');
      if (notOpenYet) {
        const [, m, d] = cfg.openFrom.split('-').map(Number);
        return showToast(`${m}월 ${d}일부터 사진을 올리실 수 있어요.`);
      }
      openSheet(sheet);
    });

    pickBtn.addEventListener('click', () => {
      if (!uploading) input.click();
    });

    retryBtn.addEventListener('click', () => {
      if (!uploading && failed.length) run(failed.map((it) => it.file));
    });

    sheetCloseGuards.set(sheet, () => {
      if (uploading) {
        showToast('업로드가 끝날 때까지 기다려 주세요.');
        return false;
      }
      return true;
    });

    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    input.addEventListener('change', () => {
      const files = Array.from(input.files || []);
      input.value = '';
      if (files.length) run(files);
    });

    async function run(files) {
      const items = [];
      list.innerHTML = '';

      files.forEach((file) => {
        const li = document.createElement('li');
        li.className = 'upload__item';
        const name = document.createElement('span');
        name.className = 'upload__name';
        name.textContent = file.name;
        const state = document.createElement('span');
        state.className = 'upload__state';
        li.append(name, state);
        list.appendChild(li);

        const item = { file, mime: mediaMime(file), li, state, loaded: 0, error: null };
        if (!item.mime) item.error = '지원하지 않는 형식';
        else if (file.size === 0) item.error = '빈 파일';
        else if (file.size > maxBytes) item.error = `${formatBytes(maxBytes)} 초과`;
        state.textContent = item.error || `대기 · ${formatBytes(file.size)}`;
        if (item.error) li.classList.add('is-error');
        items.push(item);
      });

      const valid = items.filter((it) => !it.error);
      const totalBytes = valid.reduce((s, it) => s + it.file.size, 0) || 1;
      const render = () => {
        const loaded = valid.reduce((s, it) => s + it.loaded, 0);
        const pct = Math.min(100, Math.floor((loaded / totalBytes) * 100));
        barFill.style.width = `${pct}%`;
        summaryPct.textContent = `${pct}%`;
      };

      status.hidden = false;
      retryBtn.hidden = true;
      notice.textContent = '업로드가 끝날 때까지 이 화면을 닫지 말아 주세요.';
      uploading = true;
      pickBtn.disabled = true;
      pickBtn.textContent = '올리는 중...';
      window.addEventListener('beforeunload', onBeforeUnload);
      render();

      const uploader = $('#uploaderName').value.trim();
      let doneCount = 0;

      for (let i = 0; i < valid.length; i++) {
        const it = valid[i];
        summaryText.textContent = `${i + 1} / ${valid.length}개 올리는 중`;
        it.state.textContent = '준비 중';
        try {
          const { uploadUrl } = await postToBackend('upload_init', {
            name: it.file.name,
            mimeType: it.mime,
            size: it.file.size,
            uploader,
            origin: location.origin
          });
          await uploadToDrive(uploadUrl, it.file, (bytes) => {
            it.loaded = Math.min(bytes, it.file.size);
            it.state.textContent = `${Math.floor((it.loaded / it.file.size) * 100)}%`;
            render();
          });
          it.loaded = it.file.size;
          it.state.textContent = '완료';
          it.li.classList.add('is-done');
          doneCount++;
        } catch (err) {
          console.error('Upload error:', it.file.name, err);
          it.loaded = 0;
          it.error = errorMessage(err, '실패');
          it.state.textContent = it.error;
          it.li.classList.add('is-error');
        }
        render();
      }

      uploading = false;
      pickBtn.disabled = false;
      pickBtn.textContent = '사진·영상 더 선택하기';
      window.removeEventListener('beforeunload', onBeforeUnload);

      failed = items.filter((it) => it.error && it.mime && it.file.size > 0 && it.file.size <= maxBytes);
      const failCount = items.length - doneCount;
      summaryText.textContent = failCount
        ? `${doneCount}개 완료 · ${failCount}개 실패`
        : `${doneCount}개 모두 전달 완료`;
      notice.textContent = doneCount
        ? '소중한 사진과 영상 감사합니다 💚'
        : '전달하지 못했어요. 네트워크를 확인한 뒤 다시 시도해 주세요.';
      retryBtn.hidden = failed.length === 0;
      if (doneCount) showToast(`${doneCount}개의 사진·영상이 전달되었습니다. 감사합니다!`);
    }

    return true;
  }

  function initActionBar() {
    initSheets();
    initUpload(); // 업로드가 꺼져 있으면 업로드 버튼만 숨김
    initSectionNav();
    $('#actionBar').hidden = false;
    document.body.classList.add('has-action-bar');
  }

  /** 하단 바의 섹션 이동 버튼 + 현재 보고 있는 섹션 표시 */
  const NAV_SCROLL_GAP = 24; // 이동 후 화면 맨 위와 내용 사이 여백(px)

  function initSectionNav() {
    const tabs = [...document.querySelectorAll('.action-bar__tab[data-target]')];
    const byId = new Map();

    tabs.forEach((tab) => {
      const section = document.getElementById(tab.dataset.target);
      if (!section) { tab.hidden = true; return; }
      byId.set(section.id, tab);
      tab.addEventListener('click', () => {
        // 섹션 위쪽 여백(padding)을 건너뛰고 내용 시작점이 화면 위에 오도록 이동
        const anchor = section.querySelector('.section__inner') || section;
        const top = anchor.getBoundingClientRect().top + window.scrollY - NAV_SCROLL_GAP;
        window.scrollTo({ top: Math.max(0, top) }); // html의 scroll-behavior: smooth 적용
      });
    });

    if (!('IntersectionObserver' in window)) return;
    const setActive = (id) => tabs.forEach((t) => {
      const on = t.dataset.target === id;
      t.classList.toggle('is-active', on);
      if (on) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
    });
    // 화면 가운데 줄에 걸친 섹션을 '현재 섹션'으로 봄
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(byId.has(e.target.id) ? e.target.id : null);
      });
    }, { rootMargin: '-50% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach((sec) => io.observe(sec));
  }

  /* ═══════════════════════════════════════════
     Init
     ═══════════════════════════════════════════ */

  async function init() {
    setMetaTags();
    initCurtain();
    initHero();
    initCountdown();
    initGreeting();
    initCalendar();

    // Show loading placeholders while detecting images
    showLoadingPlaceholders();

    // Init sections that don't depend on image detection
    initPhotoModal();
    initLocation();
    initAccounts();
    initFooter();
    initActionBar();
    initScrollAnimations();

    // Auto-detect gallery images
    const galleryImages = await loadImagesFromFolder('gallery');
    initGallery(galleryImages);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
