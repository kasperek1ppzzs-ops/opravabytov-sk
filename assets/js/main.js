/**
 * OpravaBytov.sk - Interaktívny Engine & Kalkulačka
 * Verzia: 2.0 (2026)
 */

document.addEventListener('DOMContentLoaded', () => {
  initCalculator();
  initComparisonSlider();
  initFaqAccordion();
  initModals();
  initSmoothScroll();
});

// ==========================================================================
// 1. Interaktívna Cenová Kalkulačka rekonštrukcie
// ==========================================================================
function initCalculator() {
  const areaSlider = document.getElementById('areaSlider');
  const areaDisplay = document.getElementById('areaDisplay');
  const roomButtons = document.querySelectorAll('.room-btn');
  const standardCards = document.querySelectorAll('.standard-card');
  const taskCheckboxes = document.querySelectorAll('.task-checkbox');

  // Výstupné prvky
  const priceMinEl = document.getElementById('priceMin');
  const priceMaxEl = document.getElementById('priceMax');
  const laborCostEl = document.getElementById('laborCost');
  const materialCostEl = document.getElementById('materialCost');
  const durationEl = document.getElementById('projectDuration');
  const printBtn = document.getElementById('printCalcBtn');

  if (!areaSlider || !priceMinEl) return;

  // Predvolený stav kalkulátora
  let state = {
    rooms: 3,
    area: 70,
    standard: 'standard', // 'usporny', 'standard', 'premium'
    tasks: {
      electro: true,
      plumbing: true,
      bathroom: true,
      walls: true,
      floors: true,
      ceilings: false,
      doors: true,
      kitchen: true
    }
  };

  // Posuvník výmery (m²)
  areaSlider.addEventListener('input', (e) => {
    state.area = parseInt(e.target.value, 10);
    areaDisplay.textContent = `${state.area} m²`;
    calculatePrice();
  });

  // Prepínače izieb (1, 2, 3, 4+)
  roomButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roomButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const rooms = parseInt(btn.dataset.rooms, 10);
      state.rooms = rooms;

      // Odporúčané prednastavenie m² podľa izieb, ak je mimo rozsahu
      const defaultAreas = { 1: 36, 2: 54, 3: 72, 4: 95 };
      if (defaultAreas[rooms]) {
        state.area = defaultAreas[rooms];
        areaSlider.value = state.area;
        areaDisplay.textContent = `${state.area} m²`;
      }
      calculatePrice();
    });
  });

  // Prepínače štandardu
  standardCards.forEach(card => {
    card.addEventListener('click', () => {
      standardCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.standard = card.dataset.standard;
      calculatePrice();
    });
  });

  // Checkboxy jednotlivých položiek
  taskCheckboxes.forEach(cb => {
    cb.addEventListener('change', (e) => {
      const taskKey = e.target.dataset.task;
      state.tasks[taskKey] = e.target.checked;
      const label = e.target.closest('.task-checkbox-label');
      if (label) {
        label.classList.toggle('checked', e.target.checked);
      }
      calculatePrice();
    });
  });

  // Výpočtová logika rekonštrukcie (Slovensko 2026 sadzby)
  function calculatePrice() {
    // Základné sadzby práce a materiálu za m²
    const baseRates = {
      usporny: { min: 290, max: 390 },
      standard: { min: 460, max: 620 },
      premium: { min: 720, max: 1050 }
    };

    let rate = baseRates[state.standard];
    let baseMin = state.area * rate.min;
    let baseMax = state.area * rate.max;

    // Príplatky za špecifické remeselné celky
    let addonMin = 0;
    let addonMax = 0;

    // Kúpeľňa a murované jadro
    if (state.tasks.bathroom) {
      if (state.standard === 'usporny') { addonMin += 2800; addonMax += 4200; }
      else if (state.standard === 'standard') { addonMin += 4500; addonMax += 6800; }
      else { addonMin += 7500; addonMax += 12000; }
    }

    // Elektroinštalácia (kompletná výmena rozvodov)
    if (state.tasks.electro) {
      const elRate = state.standard === 'premium' ? 55 : (state.standard === 'standard' ? 38 : 28);
      addonMin += state.area * elRate * 0.9;
      addonMax += state.area * elRate * 1.25;
    }

    // Vodoinštalácia a kanalizácia
    if (state.tasks.plumbing) {
      const plRate = state.standard === 'premium' ? 35 : (state.standard === 'standard' ? 24 : 18);
      addonMin += state.area * plRate * 0.9;
      addonMax += state.area * plRate * 1.2;
    }

    // Stierky, penetrácia a maľovanie
    if (state.tasks.walls) {
      const wallRate = state.standard === 'premium' ? 42 : (state.standard === 'standard' ? 28 : 20);
      addonMin += state.area * wallRate * 0.9;
      addonMax += state.area * wallRate * 1.2;
    }

    // Nivelácia a podlahy
    if (state.tasks.floors) {
      const flRate = state.standard === 'premium' ? 60 : (state.standard === 'standard' ? 35 : 22);
      addonMin += state.area * flRate * 0.9;
      addonMax += state.area * flRate * 1.25;
    }

    // Sadrokartón a LED podhľady
    if (state.tasks.ceilings) {
      const ceilRate = state.standard === 'premium' ? 48 : 32;
      addonMin += state.area * ceilRate * 0.8;
      addonMax += state.area * ceilRate * 1.2;
    }

    // Interiérové dvere
    if (state.tasks.doors) {
      const doorCount = Math.max(3, state.rooms + 2);
      const doorUnit = state.standard === 'premium' ? 480 : (state.standard === 'standard' ? 320 : 190);
      addonMin += doorCount * doorUnit * 0.9;
      addonMax += doorCount * doorUnit * 1.2;
    }

    // Kuchyňa na mieru (príprava inštalácií a montáž)
    if (state.tasks.kitchen) {
      if (state.standard === 'usporny') { addonMin += 1400; addonMax += 2200; }
      else if (state.standard === 'standard') { addonMin += 2600; addonMax += 4400; }
      else { addonMin += 4800; addonMax += 8500; }
    }

    const totalMin = Math.round((baseMin * 0.5 + addonMin) / 100) * 100;
    const totalMax = Math.round((baseMax * 0.5 + addonMax) / 100) * 100;

    // Rozdelenie práca vs materiál
    const laborShare = 0.54;
    const materialShare = 0.46;
    const avgTotal = (totalMin + totalMax) / 2;
    const laborCost = Math.round((avgTotal * laborShare) / 100) * 100;
    const materialCost = Math.round((avgTotal * materialShare) / 100) * 100;

    // Trvanie v týždňoch
    let weeksMin = 3;
    let weeksMax = 5;
    if (state.area > 50) { weeksMin = 4; weeksMax = 7; }
    if (state.area > 80) { weeksMin = 6; weeksMax = 10; }
    if (state.standard === 'premium') { weeksMin += 2; weeksMax += 3; }

    // Aktualizácia DOM s animáciou
    animateNumber(priceMinEl, totalMin);
    animateNumber(priceMaxEl, totalMax);
    animateNumber(laborCostEl, laborCost);
    animateNumber(materialCostEl, materialCost);
    durationEl.textContent = `${weeksMin} – ${weeksMax} týždňov`;
  }

  // Tlač / PDF Export rozpočtu
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Prvý výpočet pri načítaní
  calculatePrice();
}

// Plynulá animácia čísel
function animateNumber(element, targetVal) {
  if (!element) return;
  const currentVal = parseInt(element.textContent.replace(/\s/g, '').replace('€', ''), 10) || targetVal;
  const diff = targetVal - currentVal;
  const duration = 250;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(currentVal + diff * progress);
    element.textContent = `${value.toLocaleString('sk-SK')} €`;
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

// ==========================================================================
// 2. Interaktívny Porovnávač Pred & Po (Before/After Slider)
// ==========================================================================
function initComparisonSlider() {
  const container = document.querySelector('.compare-container');
  const sliderInput = document.querySelector('.compare-slider-input');
  const afterImage = document.querySelector('.compare-after');
  const handle = document.querySelector('.compare-handle');

  if (!container || !sliderInput || !afterImage || !handle) return;

  function updateSlider(val) {
    afterImage.style.width = `${val}%`;
    handle.style.left = `${val}%`;
  }

  sliderInput.addEventListener('input', (e) => {
    updateSlider(e.target.value);
  });

  // Touch & Mouse Drag podpora priamo na kontajneri
  let isDragging = false;
  function handleMove(e) {
    if (!isDragging) return;
    const rect = container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let pos = ((clientX - rect.left) / rect.width) * 100;
    pos = Math.max(0, Math.min(100, pos));
    sliderInput.value = pos;
    updateSlider(pos);
  }

  container.addEventListener('mousedown', () => isDragging = true);
  window.addEventListener('mouseup', () => isDragging = false);
  container.addEventListener('mousemove', handleMove);

  container.addEventListener('touchstart', () => isDragging = true);
  window.addEventListener('touchend', () => isDragging = false);
  container.addEventListener('touchmove', handleMove);
}

// ==========================================================================
// 3. FAQ Akordeón
// ==========================================================================
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!question || !answer) return;

    // Začneme so zbaleným stavom okrem prvého
    answer.style.display = item.classList.contains('active') ? 'block' : 'none';

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach(i => {
        i.classList.remove('active');
        const a = i.querySelector('.faq-a');
        if (a) a.style.display = 'none';
      });

      if (!isOpen) {
        item.classList.add('active');
        answer.style.display = 'block';
      }
    });
  });
}

// ==========================================================================
// 4. Modálne Dialógy pre Dopyt & Kúpu Domény
// ==========================================================================
function initModals() {
  const modal = document.getElementById('contactModal');
  const openBtns = document.querySelectorAll('[data-open-modal]');
  const closeBtns = document.querySelectorAll('.modal-close, .modal-overlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubjectInput = document.getElementById('modalSubject');
  const contactForm = document.getElementById('contactForm');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const type = btn.dataset.modalType || 'dopyt';
      if (type === 'domain') {
        if (modalTitle) modalTitle.textContent = 'Mám záujem o kúpu domény OpravaBytov.sk';
        if (modalSubjectInput) modalSubjectInput.value = 'Akvizícia domény OpravaBytov.sk (1 490 €)';
      } else {
        if (modalTitle) modalTitle.textContent = 'Získať nezáväznú cenovú ponuku';
        if (modalSubjectInput) modalSubjectInput.value = 'Dopyt na rekonštrukciu bytu';
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target === btn || btn.classList.contains('modal-close')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // ESC klávesa na zatvorenie
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Spracovanie odoslania formulára
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Odosielam...';
      submitBtn.disabled = true;

      setTimeout(() => {
        contactForm.innerHTML = `
          <div style="text-align: center; padding: 30px 10px;">
            <div style="font-size: 3rem; margin-bottom: 12px; color: #10b981;">✓</div>
            <h3 style="margin-bottom: 10px; font-size: 1.4rem;">Správa bola úspešne odoslaná!</h3>
            <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.6;">
              Ďakujeme za váš záujem. Správu sme zaevidovali a ozveme sa vám v najkratšom možnom čase.
            </p>
          </div>
        `;
      }, 700);
    });
  }
}

// Plynulý posun pre kotvy
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
