// ── Progress bar ──
const progressBar = document.querySelector('.progress-bar');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  if (progressBar) progressBar.style.width = pct + '%';
}, { passive: true });

// ── Navbar: glass blur + mobile toggle ──
const navbar    = document.querySelector('.navbar');
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');

hamburger.addEventListener('click', () => navMobile.classList.toggle('open'));
navMobile.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => navMobile.classList.remove('open'))
);
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Active nav link on scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a, .nav-mobile a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link =>
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)
    );
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => sectionObserver.observe(s));

// ── Architecture: draw SVG connection lines ──
const LINE_COLORS = ['#FF9900', '#4da6ff', '#2ecc71', '#FF9900'];

function drawArchLines() {
  const scene = document.getElementById('arch3dScene');
  const svg   = document.getElementById('arch3dSvg');
  if (!scene || !svg) return;

  const illus = scene.querySelectorAll('.a3node-illus');
  const sr    = scene.getBoundingClientRect();

  svg.innerHTML = '';

  const pts = Array.from(illus).map(d => {
    const r = d.getBoundingClientRect();
    return { x: r.left + r.width / 2 - sr.left, y: r.top + r.height / 2 - sr.top };
  });

  pts.forEach((p, i) => {
    if (i >= pts.length - 1) return;
    const q    = pts[i + 1];
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', p.x);
    line.setAttribute('y1', p.y);
    line.setAttribute('x2', q.x);
    line.setAttribute('y2', q.y);
    line.setAttribute('class', 'arch-conn');
    line.setAttribute('stroke', LINE_COLORS[i] || '#FF9900');
    line.style.animationDelay = `${i * 0.18}s`;
    svg.appendChild(line);
  });
}

window.addEventListener('load', drawArchLines);
let archResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(archResizeTimer);
  archResizeTimer = setTimeout(drawArchLines, 150);
});

// ── Architecture arrows flow animation ──
document.querySelectorAll('.arch-arrow').forEach((arrow, i) => {
  arrow.style.animation = `arrowFlow 1.8s ${i * 0.28}s ease-in-out infinite`;
});

// ── Scroll reveal ──
const revealEls = document.querySelectorAll(
  '.section-label, .section h2, .arch-section h2, .section-desc, .arch-desc, ' +
  '.card, .service-card, .team-card, .arch-node, .stat, .pipeline-step, ' +
  '.outcome-card, .pricing-card, .contact-cta'
);
revealEls.forEach(el => el.classList.add('reveal'));

// Stagger delays within groups
document.querySelectorAll('.card').forEach((el, i)           => { el.dataset.delay = i * 80; });
document.querySelectorAll('.service-card').forEach((el, i)   => { el.dataset.delay = (i % 4) * 80; });
document.querySelectorAll('.team-card').forEach((el, i)      => { el.dataset.delay = i * 100; });
document.querySelectorAll('.stat').forEach((el, i)           => { el.dataset.delay = i * 150; });
document.querySelectorAll('.pipeline-step').forEach((el, i)  => { el.dataset.delay = i * 100; });
document.querySelectorAll('.outcome-card').forEach((el, i)   => { el.dataset.delay = i * 100; });
document.querySelectorAll('.pricing-card').forEach((el, i)   => { el.dataset.delay = i * 120; });
document.querySelectorAll('.contact-cta').forEach((el, i)    => { el.dataset.delay = i * 120; });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = parseInt(entry.target.dataset.delay || '0', 10);
    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

// Redraw arch lines when architecture section scrolls into view
const archSection = document.getElementById('architecture');
if (archSection) {
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) drawArchLines();
  }, { threshold: 0.1 }).observe(archSection);
}

// ── Counter animation ──
function animateCount(el, target, suffix) {
  const duration = 1600;
  let start = null;
  function tick(now) {
    if (!start) start = now;
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const numEl  = entry.target.querySelector('.stat-number');
    const target = parseInt(entry.target.dataset.count, 10);
    const suffix = entry.target.dataset.suffix || '';
    if (numEl && target) animateCount(numEl, target, suffix);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });
document.querySelectorAll('.stat[data-count]').forEach(el => counterObserver.observe(el));

// ── Mobile tooltip modal ──
const tipOverlay = document.getElementById('tipModalOverlay');
const tipTitle   = document.getElementById('tipModalTitle');
const tipIcon    = document.getElementById('tipModalIcon');
const tipText    = document.getElementById('tipModalText');
const tipClose   = document.getElementById('tipModalClose');

function isTouchDevice() {
  return window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches;
}

if (tipOverlay) {
  document.querySelectorAll('.a3node').forEach(node => {
    const illus = node.querySelector('.a3node-illus');
    if (!illus) return;

    illus.addEventListener('click', () => {
      if (!isTouchDevice()) return;
      const label   = node.querySelector('.a3node-label').textContent.trim();
      const tip     = illus.querySelector('.node-tip').textContent.trim();
      const svgEl   = illus.querySelector('.node-svg');

      tipTitle.textContent = label;
      tipText.textContent  = tip;
      tipIcon.innerHTML    = svgEl ? svgEl.outerHTML : '';
      tipOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    tipOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  tipClose.addEventListener('click', closeModal);
  tipOverlay.addEventListener('click', e => { if (e.target === tipOverlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}
