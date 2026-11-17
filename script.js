const header = document.getElementById('header');
const nav = document.getElementById('nav');
const toggle = document.getElementById('menuToggle');

// Mobile menu
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
});

// Header shadow on scroll
window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 10), { passive: true });

// Count-up stats when visible
const counter = new IntersectionObserver((entries, obs) => entries.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.count, start = performance.now();
  const step = t => {
    const p = Math.min((t - start) / 1500, 1);
    el.textContent = Math.floor(end * p).toLocaleString();
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
  obs.unobserve(el);
}));
document.querySelectorAll('[data-count]').forEach(el => counter.observe(el));

// Scroll reveal, staggered within each group
const revealer = new IntersectionObserver((entries, obs) => entries.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target;
  el.classList.add('in');
  obs.unobserve(el);
  // drop reveal styles after it plays so hover transforms/timing work normally
  setTimeout(() => { el.classList.remove('reveal', 'in'); el.style.transitionDelay = ''; }, 1400);
}), { threshold: 0.15 });
document.querySelectorAll('.section-head, .about > *, .card, .dcard, .schedule tbody tr, .facility, .feature, .contact > *, .appt, .cta-box, .mvv-card, .stat-grid > *, .tl-item, .testi, .tcard, .step, .faq-wrap > *, .fac-intro > *, .ftile, .equip > div, .amen-grid > div')
  .forEach(el => {
    el.classList.add('reveal');
    el.style.transitionDelay = [...el.parentNode.children].indexOf(el) % 4 * 0.12 + 's';
    revealer.observe(el);
  });

// Appointment form (only on appointment.html)
const form = document.getElementById('apptForm');
if (form) {
  const status = document.getElementById('formStatus');
  // Hospital WhatsApp number: country code + number, no spaces or +
  const WHATSAPP = '917947433442';
  const now = new Date();
  form.date.min = new Date(now - now.getTimezoneOffset() * 60000).toISOString().split('T')[0]; // no past dates (local time)

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach(f => {
      const bad = !f.checkValidity();
      f.classList.toggle('invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) {
      status.className = 'form-status full err';
      status.textContent = 'Please fill all required fields correctly.';
      return;
    }
    // Send the booking as a pre-filled WhatsApp message to the hospital
    const msg = [
      'New Appointment Request – S.P.Eye Hospital',
      `Name: ${form.name.value.trim()}`,
      `Phone: ${form.phone.value.trim()}`,
      `Treatment: ${form.dept.value}`,
      `Preferred Date: ${form.date.value.split('-').reverse().join('-')}`,
      form.msg.value.trim() && `Message: ${form.msg.value.trim()}`,
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    status.className = 'form-status full ok';
    status.textContent = `Thank you, ${form.name.value.trim()}! WhatsApp has opened – please press Send to confirm your appointment request.`;
    form.reset();
  });
}

document.getElementById('year').textContent = new Date().getFullYear();
