// ============================================
// NAV TOGGLE (mobile menu)
// ============================================
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.navlinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
}

// mark current page as active in nav
document.querySelectorAll('.navlinks a').forEach(link => {
  const linkPage = link.getAttribute('href');
  if (linkPage === window.location.pathname.split('/').pop() ||
      (linkPage === 'index.html' && window.location.pathname.endsWith('/'))) {
    link.classList.add('active');
  }
});

// ============================================
// BOOT SEQUENCE TYPEWRITER (device LCD screen)
// ============================================
function typewriter(el, lines, opts = {}) {
  if (!el) return;
  const speed = opts.speed || 32;
  const lineDelay = opts.lineDelay || 350;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    el.textContent = lines.join('\n');
    return;
  }

  el.textContent = '';
  let lineIndex = 0;
  let charIndex = 0;

  function typeChar() {
    if (lineIndex >= lines.length) return;
    const currentLine = lines[lineIndex];

    if (charIndex < currentLine.length) {
      el.textContent += currentLine[charIndex];
      charIndex++;
      setTimeout(typeChar, speed);
    } else {
      el.textContent += '\n';
      lineIndex++;
      charIndex = 0;
      setTimeout(typeChar, lineDelay);
    }
  }
  typeChar();
}

const bootEl = document.querySelector('[data-boot-text]');
if (bootEl) {
  const lines = JSON.parse(bootEl.getAttribute('data-boot-text'));
  typewriter(bootEl, lines);
}

// ============================================
// PROJECT CARTRIDGE MODAL
// ============================================
const overlay = document.querySelector('.overlay');
const cartridge = overlay ? overlay.querySelector('.cartridge') : null;
const appTiles = document.querySelectorAll('.app-tile');
const closeBtn = overlay ? overlay.querySelector('.cartridge-close') : null;
let lastFocused = null;

const projectData = {
  1: {
    title: 'mobLedger',
    desc: 'World of Warcraft addon meant to collect data from mob drops, uploads them to a private SQL server then redistributes the data amongst users using the client',
    tags: ['LUA', 'C++'],
    link: '#'
  }
};

function openCartridge(id) {
  const data = projectData[id];
  if (!data || !overlay) return;

  cartridge.querySelector('.cartridge-title').textContent = data.title;
  cartridge.querySelector('.cartridge-desc').textContent = data.desc;
  cartridge.querySelector('.cartridge-link').href = data.link;

  const tagRow = cartridge.querySelector('.tag-row');
  tagRow.innerHTML = '';
  data.tags.forEach(tag => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = tag;
    tagRow.appendChild(span);
  });

  lastFocused = document.activeElement;
  overlay.classList.add('open');
  closeBtn.focus();
  document.addEventListener('keydown', handleEscape);
}

function closeCartridge() {
  if (!overlay) return;
  overlay.classList.remove('open');
  document.removeEventListener('keydown', handleEscape);
  if (lastFocused) lastFocused.focus();
}

function handleEscape(e) {
  if (e.key === 'Escape') closeCartridge();
}

appTiles.forEach(tile => {
  tile.addEventListener('click', () => {
    const id = tile.getAttribute('data-project');
    openCartridge(id);
  });
});

if (closeBtn) closeBtn.addEventListener('click', closeCartridge);
if (overlay) {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeCartridge();
  });
}

// ============================================
// CONTACT FORM (front-end only demo handling)
// ============================================
const contactForm = document.querySelector('.terminal-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = contactForm.querySelector('.form-status');
    const name = contactForm.querySelector('#name').value.trim();
    const email = contactForm.querySelector('#email').value.trim();
    const message = contactForm.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      status.textContent = 'ERROR: all fields required.';
      status.style.color = '#E8A33D';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      status.textContent = 'ERROR: enter a valid email address.';
      status.style.color = '#E8A33D';
      return;
    }

    status.textContent = 'MESSAGE SENT. Thanks, ' + name + ' — I\'ll reply soon.';
    status.style.color = '#9BCE0F';
    contactForm.reset();
  });
}
