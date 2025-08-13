
// Scroll reveal using IntersectionObserver
const reveals = () => {
  const els = document.querySelectorAll('.reveal');
  if (!window.IntersectionObserver) {
    els.forEach(e => e.classList.add('visible')); return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -40px' });
  els.forEach(el => io.observe(el));
};
// Theme & motion toggles
const initPrefs = () => {
  const themeBtn = document.getElementById('themeToggle');
  const motionBtn = document.getElementById('motionToggle');
  const storedTheme = localStorage.getItem('pref-theme');
  const storedMotion = localStorage.getItem('pref-motion');
  if (storedTheme === 'light') document.body.setAttribute('data-theme', 'light');
  if (storedMotion === 'off') document.body.classList.add('motion-off');
  themeBtn?.addEventListener('click', () => {
    const isLight = document.body.getAttribute('data-theme') === 'light';
    if (isLight) { document.body.removeAttribute('data-theme'); localStorage.setItem('pref-theme','dark'); }
    else { document.body.setAttribute('data-theme','light'); localStorage.setItem('pref-theme','light'); }
  });
  motionBtn?.addEventListener('click', () => {
    const off = document.body.classList.toggle('motion-off');
    localStorage.setItem('pref-motion', off ? 'off' : 'on');
  });
};

// Active nav highlighting
const navActive = () => {
  const sections = [...document.querySelectorAll('main section[id]')];
  const links = [...document.querySelectorAll('.nav-list a[href^="#"]')];
  if (!sections.length || !links.length) return;
  const setActive = (id) => {
    links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === `#${id}`));
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { threshold: 0.5 });
  sections.forEach(sec => io.observe(sec));
};

// Smooth scroll (native fallback)
const smoothNav = () => {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', `#${id}`);
      target.focus({ preventScroll: true });
    });
  });
};

// Focus management for hash loads
const hashFocus = () => {
  if (location.hash) {
    const el = document.getElementById(location.hash.slice(1));
    if (el) setTimeout(() => el.focus({ preventScroll:true }), 150);
  }
};

// Subtle parallax for decorative orbs
const parallax = () => {
  const orbs = document.querySelectorAll('.orb');
  window.addEventListener('pointermove', (e) => {
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 12;
      orb.style.transform = `translate3d(${x * depth}px, ${y * depth}px,0)`;
    });
  });
};

// Lightweight tilt effect for button
const tilt = () => {
  document.querySelectorAll('[data-tilt]').forEach(el => {
    const strength = 12;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -strength;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * strength;
      el.style.transform = `translateY(-4px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
};

// Form handler
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    if (!name || !email || !message) { e.preventDefault(); return; }

    // If local file preview, show inline success and skip network
    if (location.protocol === 'file:') {
      e.preventDefault();
      const msg = document.getElementById('formMessage');
      msg.textContent = `Thanks ${name}, I'll be in touch soon.`;
      form.reset();
      return;
    }

    // Use fetch POST to ensure the request is sent as POST and handle redirect
    e.preventDefault();
    try {
      const formData = new FormData(form);
      const res = await fetch(form.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        window.location.href = 'thanks.html';
      } else {
        // fallback to native submit if something odd happened
        form.submit();
      }
    } catch (err) {
      form.submit();
    }
  });
}

// Init
// Ensure we start at the top on fresh load (ignore if navigating back with hash)
const resetScrollIfNeeded = () => {
  if (!location.hash) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
};

// Stagger hero entrance
const heroEnter = () => {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  hero.classList.add('visible');
};

window.addEventListener('DOMContentLoaded', () => {
  resetScrollIfNeeded();
  reveals();
  parallax();
  tilt();
  initPrefs();
  navActive();
  smoothNav();
  hashFocus();
  heroEnter();
  typeWriter();
});

// Simple typewriter that cycles through phrases
function typeWriter() {
  const target = document.getElementById('typed');
  if (!target) return;
  let phrases = [];
  try {
    const raw = target.getAttribute('data-phrases') || '[]';
    phrases = JSON.parse(raw);
  } catch (_) { phrases = []; }
  if (!Array.isArray(phrases) || phrases.length === 0) return;

  const speed = { type: 70, erase: 40, pause: 1200 };
  let pi = 0, ci = 0, typing = true, timeoutId = null;

  const loop = () => {
    if (document.body.classList.contains('motion-off')) return; // paused
    const phrase = String(phrases[pi % phrases.length]);
    if (typing) {
      ci++;
      target.textContent = phrase.slice(0, ci);
      if (ci >= phrase.length) { typing = false; timeoutId = setTimeout(loop, speed.pause); return; }
      timeoutId = setTimeout(loop, speed.type);
    } else {
      ci--;
      target.textContent = phrase.slice(0, ci);
      if (ci <= 0) { typing = true; ci = 0; pi++; timeoutId = setTimeout(loop, 250); return; }
      timeoutId = setTimeout(loop, speed.erase);
    }
  };

  // Start
  clearTimeout(timeoutId);
  timeoutId = setTimeout(loop, 250);

  // React to motion toggle changes
  const observer = new MutationObserver(() => {
    const off = document.body.classList.contains('motion-off');
    if (off) {
      clearTimeout(timeoutId);
      target.textContent = String(phrases[0] || '');
    } else {
      // restart typing from current phrase
      clearTimeout(timeoutId);
      timeoutId = setTimeout(loop, 300);
    }
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
}

