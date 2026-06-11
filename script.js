// ── Mobile nav toggle ──
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');

hamburger.addEventListener('click', () => {
  navMobile.classList.toggle('open');
});

// Close mobile nav when a link is clicked
navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navMobile.classList.remove('open'));
});

// ── Scroll-reveal for objective cards ──
const cards = document.querySelectorAll('.card');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const card = entry.target;
    const delay = parseInt(card.dataset.delay || '0', 10);
    setTimeout(() => card.classList.add('visible'), delay);
    revealObserver.unobserve(card);
  });
}, { threshold: 0.15 });

cards.forEach(card => revealObserver.observe(card));

// ── Active nav link on scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute('id');
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${id}` ? '#FF9900' : '';
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => activeObserver.observe(s));
