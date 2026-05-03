/* ── NAVBAR SCROLL ───────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 10);
});

/* ── MOBILE MENU ─────────────────────────────── */
const burger      = document.getElementById('burger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

function closeMobile() {
  if (mobileMenu) mobileMenu.classList.remove('open');
  if (burger)     burger.classList.remove('open');
  document.body.style.overflow = '';
}

if (burger) {
  burger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    burger.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
}

if (mobileClose) mobileClose.addEventListener('click', closeMobile);

/* ── HERO SLIDER ─────────────────────────────── */
const slides  = document.querySelectorAll('.slide');
const dots    = document.querySelectorAll('.dot');
let current   = 0;
let autoTimer = null;

function goToSlide(index) {
  if (!slides.length) return;
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (index + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}
function nextSlide() { goToSlide(current + 1); resetTimer(); }
function prevSlide()  { goToSlide(current - 1); resetTimer(); }
function resetTimer() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => goToSlide(current + 1), 5000);
}

if (slides.length) {
  autoTimer = setInterval(() => goToSlide(current + 1), 5000);
  const sliderEl = document.querySelector('.slider');
  if (sliderEl) {
    sliderEl.addEventListener('mouseenter', () => clearInterval(autoTimer));
    sliderEl.addEventListener('mouseleave', resetTimer);
    let touchStartX = 0;
    sliderEl.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; });
    sliderEl.addEventListener('touchend',   e => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) { diff > 0 ? nextSlide() : prevSlide(); }
    });
  }
}

/* ── COMPTEURS ANIMES ────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start    = performance.now();
  const update   = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObs.observe(el));

/* ── SCROLL REVEAL ───────────────────────────── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity   = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.pillar-card, .belief-item, .pathway-step, .partner-logo-item, .pyr-desc, .history-text'
).forEach(el => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  revealObs.observe(el);
});