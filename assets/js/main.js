/**
 * OpravaBytov.sk - High-End Interaktívny Engine (2026 Edition)
 * Integrácia: Lenis Smooth Scroll, GSAP 3 + ScrollTrigger, Aceternity UI Spotlight & 3D Tilt
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializácia plynulého scrollovania (Lenis)
  const lenis = initLenisSmoothScroll();

  // 2. Inicializácia GSAP ScrollTrigger animácií a odometrov
  initGsapAnimations(lenis);

  // 3. Aceternity UI Spotlight a 3D Tilt efekt
  initSpotlightAndTilt();

  // 4. Cenová kalkulačka a plávajúca lišta
  initCalculator();

  // 5. Porovnávač Pred & Po
  initComparisonSlider();

  // 6. FAQ akordeón a modály
  initFaqAccordion();
  initModals();
});

// ==========================================================================
// 1. Lenis Smooth Scroll (Kinetické luxusné posúvanie)
// ==========================================================================
function initLenisSmoothScroll() {
  if (typeof Lenis === 'undefined') {
    initNativeSmoothScroll();
    return null;
  }

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.8
  });

  // Prepojenie Lenis s GSAP Tickerom
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Plynulý posun na kotvy cez Lenis
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        lenis.scrollTo(targetEl, { offset: -80, duration: 1.2 });
      }
    });
  });

  return lenis;
}

function initNativeSmoothScroll() {
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

// ==========================================================================
// 2. GSAP ScrollTrigger Animácie & Dynamické Počítadlá (Odometre)
// ==========================================================================
function initGsapAnimations(lenis) {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // A. Hero sekcia reveal sekvencia
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl
    .from('.hero-badge', { y: -20, opacity: 0, duration: 0.8, delay: 0.1 })
    .from('.hero h1', { y: 35, opacity: 0, duration: 0.9 }, '-=0.5')
    .from('.hero-lead', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
    .from('.hero .btn', { scale: 0.92, opacity: 0, stagger: 0.15, duration: 0.6 }, '-=0.5')
    .from('.hero-stats .stat-box', { 
      y: 30, 
      opacity: 0, 
      stagger: 0.12, 
      duration: 0.8,
      onComplete: () => {
        triggerCounters();
      }
    }, '-=0.4')
    .from('.trust-badges-wrap .trust-badge-item', { 
      y: 15, 
      opacity: 0, 
      stagger: 0.1, 
      duration: 0.6 
    }, '-=0.4');

  // Funkcia pre odometrové počítadlá v Hero sekcii
  let countersAnimated = false;
  function triggerCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    // 1. Priemerná cena: 0 -> 580 €
    const priceStatEl = document.querySelector('[data-counter="580"]');
    if (priceStatEl) {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: 580,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => {
          priceStatEl.textContent = `${Math.round(obj.val)} €`;
        }
      });
    }

    // 2. Úspora: 0 -> 15 – 25 %
    const saveStatEl = document.querySelector('[data-counter-range="15|25"]');
    if (saveStatEl) {
      const obj = { min: 0, max: 0 };
      gsap.to(obj, {
        min: 15,
        max: 25,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => {
          saveStatEl.textContent = `${Math.round(obj.min)} – ${Math.round(obj.max)} %`;
        }
      });
    }
  }

  // B. Fázované ScrollTrigger animácie sekcií
  if (typeof ScrollTrigger !== 'undefined') {
    // Nadpisy sekcií
    document.querySelectorAll('.section-header').forEach(header => {
      gsap.from(header.children, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%'
        },
        y: 25,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power2.out'
      });
    });

    // Kalkulačka
    const calcCard = document.querySelector('.calc-card');
    if (calcCard) {
      gsap.from(calcCard, {
        scrollTrigger: {
          trigger: calcCard,
          start: 'top 85%'
        },
        y: 35,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out'
      });
    }

    // Karty miest (Cenový radar) - fázovaný nástup
    const cityCards = document.querySelectorAll('.cities-grid .city-card');
    if (cityCards.length > 0) {
      gsap.from(cityCards, {
        scrollTrigger: {
          trigger: '.cities-grid',
          start: 'top 80%'
        },
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power2.out'
      });
    }

    // Kroky v sprievodcovi prácami
    const stepCards = document.querySelectorAll('.timeline-grid .step-card');
    if (stepCards.length > 0) {
      gsap.from(stepCards, {
        scrollTrigger: {
          trigger: '.timeline-grid',
          start: 'top 82%'
        },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power2.out'
      });
    }

    // Porovnávač Pred & Po
    const compareCard = document.querySelector('.compare-card');
    if (compareCard) {
      gsap.from(compareCard, {
        scrollTrigger: {
          trigger: compareCard,
          start: 'top 82%'
        },
        scale: 0.97,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out'
      });
    }
  }
}

// ==========================================================================
// 3. Aceternity UI: Spotlight a 3D Tilt Efekt
// ==========================================================================
function initSpotlightAndTilt() {
  const cards = document.querySelectorAll('.spotlight-card, .city-card, .step-card, .stat-box, .calc-card');

  cards.forEach(card => {
    // Spotlight: Sledovanie polohy kurzora
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Jemný 3D Tilt len pre menšie karty (stat-box a city-card) na desktope
      if (window.innerWidth > 768 && (card.classList.contains('city-card') || card.classList.contains('stat-box'))) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      if (card.classList.contains('city-card') || card.classList.contains('stat-box')) {
        card.style.transform = '';
      }
    });
  });
}

// ==========================================================================
// 4. Cenová Kalkulačka & Plávajúci Sklenený Status Bar
// ==========================================================================
function initCalculator() {
  const areaSlider = document.getElementById('areaSlider');
  const areaDisplay = document.getElementById('areaDisplay');
  const roomButtons = document.querySelectorAll('.room-btn');
  const standardCards = document.querySelectorAll('.standard-card');
  const taskCheckboxes = document.querySelectorAll('.task-checkbox');

  // Výstupné prvky na karte
  const priceMinEl = document.getElementById('priceMin');
  const priceMaxEl = document.getElementById('priceMax');
  const laborCostEl = document.getElementById('laborCost');
  const materialCostEl = document.getElementById('materialCost');
  const durationEl = document.getElementById('projectDuration');
  const printBtn = document.getElementById('printCalcBtn');

  // Prvky plávajúcej lišty (Sticky Bar)
  const stickyBar = document.getElementById('calcStickyBar');
  const stickyPriceMin = document.getElementById('stickyPriceMin');
  const stickyPriceMax = document.getElementById('stickyPriceMax');
  const stickySpec = document.getElementById('stickySpec');

  if (!areaSlider || !priceMinEl) return;

  // Predvolený stav kalkulátora
  let state = {
    rooms: 3,
    area: 72,
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
    const baseRates = {
      usporny: { min: 290, max: 390 },
      standard: { min: 460, max: 620 },
      premium: { min: 720, max: 1050 }
    };

    let rate = baseRates[state.standard];
    let baseMin = state.area * rate.min;
    let baseMax = state.area * rate.max;

    let addonMin = 0;
    let addonMax = 0;

    // Kúpeľňa a murované jadro
    if (state.tasks.bathroom) {
      if (state.standard === 'usporny') { addonMin += 2800; addonMax += 4200; }
      else if (state.standard === 'standard') { addonMin += 4500; addonMax += 6800; }
      else { addonMin += 7500; addonMax += 12000; }
    }

    // Elektroinštalácia
    if (state.tasks.electro) {
      const elRate = state.standard === 'premium' ? 55 : (state.standard === 'standard' ? 38 : 28);
      addonMin += state.area * elRate * 0.9;
      addonMax += state.area * elRate * 1.25;
    }

    // Vodoinštalácia
    if (state.tasks.plumbing) {
      const plRate = state.standard === 'premium' ? 35 : (state.standard === 'standard' ? 24 : 18);
      addonMin += state.area * plRate * 0.9;
      addonMax += state.area * plRate * 1.2;
    }

    // Stierky a maľovanie
    if (state.tasks.walls) {
      const wallRate = state.standard === 'premium' ? 42 : (state.standard === 'standard' ? 28 : 20);
      addonMin += state.area * wallRate * 0.9;
      addonMax += state.area * wallRate * 1.2;
    }

    // Podlahy
    if (state.tasks.floors) {
      const flRate = state.standard === 'premium' ? 60 : (state.standard === 'standard' ? 35 : 22);
      addonMin += state.area * flRate * 0.9;
      addonMax += state.area * flRate * 1.25;
    }

    // Sadrokartón
    if (state.tasks.ceilings) {
      const ceilRate = state.standard === 'premium' ? 48 : 32;
      addonMin += state.area * ceilRate * 0.8;
      addonMax += state.area * ceilRate * 1.2;
    }

    // Dvere
    if (state.tasks.doors) {
      const doorCount = Math.max(3, state.rooms + 2);
      const doorUnit = state.standard === 'premium' ? 480 : (state.standard === 'standard' ? 320 : 190);
      addonMin += doorCount * doorUnit * 0.9;
      addonMax += doorCount * doorUnit * 1.2;
    }

    // Kuchyňa
    if (state.tasks.kitchen) {
      if (state.standard === 'usporny') { addonMin += 1400; addonMax += 2200; }
      else if (state.standard === 'standard') { addonMin += 2600; addonMax += 4400; }
      else { addonMin += 4800; addonMax += 8500; }
    }

    const totalMin = Math.round((baseMin * 0.5 + addonMin) / 100) * 100;
    const totalMax = Math.round((baseMax * 0.5 + addonMax) / 100) * 100;

    const laborShare = 0.54;
    const materialShare = 0.46;
    const avgTotal = (totalMin + totalMax) / 2;
    const laborCost = Math.round((avgTotal * laborShare) / 100) * 100;
    const materialCost = Math.round((avgTotal * materialShare) / 100) * 100;

    let weeksMin = 3;
    let weeksMax = 5;
    if (state.area > 50) { weeksMin = 4; weeksMax = 7; }
    if (state.area > 80) { weeksMin = 6; weeksMax = 10; }
    if (state.standard === 'premium') { weeksMin += 2; weeksMax += 3; }

    // Aktualizácia DOM s plynulou animáciou čísel
    animateNumber(priceMinEl, totalMin);
    animateNumber(priceMaxEl, totalMax);
    animateNumber(laborCostEl, laborCost);
    animateNumber(materialCostEl, materialCost);
    durationEl.textContent = `${weeksMin} – ${weeksMax} týždňov`;

    // Synchronizácia s plávajúcou lištou (Sticky Bar)
    if (stickyPriceMin && stickyPriceMax && stickySpec) {
      animateNumber(stickyPriceMin, totalMin);
      animateNumber(stickyPriceMax, totalMax);
      const standardLabels = { usporny: 'Úsporný', standard: 'Štandard', premium: 'Prémiový' };
      stickySpec.textContent = `${state.rooms}-izbový • ${state.area} m² • ${standardLabels[state.standard]}`;
    }
  }

  // Logika zobrazenia plávajúcej lišty pri scrollovaní
  if (stickyBar) {
    const calcSection = document.getElementById('kalkulacka');
    const footerSection = document.querySelector('.site-footer');

    window.addEventListener('scroll', () => {
      if (!calcSection) return;
      const calcRect = calcSection.getBoundingClientRect();
      const footerRect = footerSection ? footerSection.getBoundingClientRect() : null;

      const passedCalc = calcRect.bottom < 100;
      const nearFooter = footerRect && footerRect.top < window.innerHeight;

      if (passedCalc && !nearFooter) {
        stickyBar.classList.add('visible');
      } else {
        stickyBar.classList.remove('visible');
      }
    }, { passive: true });
  }

  // Tlač / PDF Export rozpočtu
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  calculatePrice();
}

// Plynulá animácia čísel (requestAnimationFrame)
function animateNumber(element, targetVal) {
  if (!element) return;
  const currentVal = parseInt(element.textContent.replace(/\s/g, '').replace('€', ''), 10) || targetVal;
  const diff = targetVal - currentVal;
  const duration = 280;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(currentVal + diff * easeOut);
    element.textContent = `${value.toLocaleString('sk-SK')} €`;
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

// ==========================================================================
// 5. Interaktívny Porovnávač Pred & Po (Before/After Slider)
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

  container.addEventListener('touchstart', () => isDragging = true, { passive: true });
  window.addEventListener('touchend', () => isDragging = false);
  container.addEventListener('touchmove', handleMove, { passive: true });
}

// ==========================================================================
// 6. FAQ Akordeón & Modálne Dialógy
// ==========================================================================
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!question || !answer) return;

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

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
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
