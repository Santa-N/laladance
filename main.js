// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
const spans     = hamburger.querySelectorAll('span');

function openMenu() {
  navMenu.classList.add('open');
  spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
  spans[1].style.opacity   = '0';
  spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  navMenu.classList.remove('open');
  spans[0].style.transform = '';
  spans[1].style.opacity   = '';
  spans[2].style.transform = '';
  document.body.style.overflow = '';
}
hamburger.addEventListener('click', () => {
  navMenu.classList.contains('open') ? closeMenu() : openMenu();
});
navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 10;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`.nav-menu a[href="#${e.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => activeObserver.observe(s));

// ===== STATS COUNTER =====
function animateCount(el, target, dur = 1400) {
  let start;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}
const countEls = document.querySelectorAll('.count');
const countObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target, +e.target.dataset.target);
      countObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
countEls.forEach(el => countObs.observe(el));

// ===== REVEAL ANIMATION =====
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.ccard, .pcard, .news-card, .about-grid, .contact-grid, .highlight-item, .stat, .ai-box'
).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  revealObs.observe(el);
});

// ===== CLASS FILTER TABS =====
const tabs  = document.querySelectorAll('.ctab');
const cards = document.querySelectorAll('.ccard');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    cards.forEach(card => {
      const cats = card.dataset.cat || '';
      if (filter === 'all' || cats.includes(filter)) {
        card.style.display = '';
        card.style.opacity = '1';
        card.style.transform = '';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          if (!cats.includes(tab.dataset.filter) && tab.dataset.filter !== 'all') {
            card.style.display = 'none';
          }
        }, 280);
      }
    });
  });
});

// ===== SUBTLE CARD TILT =====
document.querySelectorAll('.ccard, .pcard').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const rx = -((e.clientY - r.top  - r.height / 2) / r.height) * 4;
    const ry =  ((e.clientX - r.left - r.width  / 2) / r.width ) * 4;
    card.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});
