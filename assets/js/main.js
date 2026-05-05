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
// Mobile menu section toggle
function toggleMobSection(btn) {
  const sub = btn.nextElementSibling;
  const isOpen = sub.classList.contains('open');
  // Close all open sections first
  document.querySelectorAll('.mob-sub.open').forEach(s => s.classList.remove('open'));
  document.querySelectorAll('.mob-toggle.open').forEach(b => b.classList.remove('open'));
  // Toggle clicked
  if (!isOpen) {
    sub.classList.add('open');
    btn.classList.add('open');
  }
}

// ── AIRTABLE INSCRIPTION INTEGRATION ─────────
async function submitToAirtable(formData) {
  const BASE_ID = 'appx92IiIetb4TSjB';
  const TOKEN = 'REPLACE_WITH_TOKEN';

  const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  };

  try {
    // 1. Create player record
    const playerRes = await fetch(`https://api.airtable.com/v0/${BASE_ID}/tblO49rDoSSn1uvGe`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        fields: {
          'Full Name': formData.enfant_prenom + ' ' + formData.enfant_nom,
          'Programme Enrolled': formData.programme || 'A confirmer',
          'Start Date': new Date().toISOString().split('T')[0]
        }
      })
    });
    const player = await playerRes.json();

    // 2. Create parent record linked to player
    await fetch(`https://api.airtable.com/v0/${BASE_ID}/tblOUpQ6pmswUhUke`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        fields: {
          'Full Name': formData.parent_prenom + ' ' + formData.parent_nom,
          'Phone': formData.telephone,
          'Email': formData.email,
          'Players': [player.id]
        }
      })
    });

    return true;
  } catch (err) {
    console.error('Airtable error:', err);
    return false;
  }
}

// ── INSCRIPTION FORM → AIRTABLE ──────────────
document.addEventListener('DOMContentLoaded', function() {
  const insForm = document.querySelector('form.ins-form');
  if (!insForm) return;

  insForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = insForm.querySelector('button[type="submit"]');
    btn.textContent = 'ENVOI EN COURS...';
    btn.disabled = true;

    const data = {
      parent_prenom: insForm.querySelector('[name="parent_prenom"]')?.value || '',
      parent_nom:    insForm.querySelector('[name="parent_nom"]')?.value || '',
      telephone:     insForm.querySelector('[name="telephone"]')?.value || '',
      email:         insForm.querySelector('[name="email"]')?.value || '',
      enfant_prenom: insForm.querySelector('[name="enfant_prenom"]')?.value || '',
      enfant_nom:    insForm.querySelector('[name="enfant_nom"]')?.value || '',
      programme:     insForm.querySelector('[name="programme"]')?.value || '',
      message:       insForm.querySelector('[name="message"]')?.value || ''
    };

    try {
      // Send to Airtable via Netlify Function
      const airtableRes = await fetch('/.netlify/functions/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const airtableResult = await airtableRes.json();

      // Also send to Formspree for email notification
      const formData = new FormData(insForm);
      await fetch(insForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (airtableResult.success) {
        btn.textContent = 'DEMANDE ENVOYEE !';
        btn.style.background = '#27ae60';
        insForm.reset();
        setTimeout(() => {
          window.location.href = '/merci.html';
        }, 1500);
      } else {
        throw new Error('Airtable error');
      }

    } catch(err) {
      console.error(err);
      btn.textContent = 'ENVOYER MA DEMANDE D\'INSCRIPTION';
      btn.disabled = false;
      alert('Une erreur est survenue. Veuillez reessayer ou nous contacter sur WhatsApp.');
    }
  });
});
