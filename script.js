
// Scroll reveal using IntersectionObserver
const reveals = () => {
  const els = document.querySelectorAll('.reveal');
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
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    if (!name || !email || !message) return;
    const msg = document.getElementById('formMessage');
    msg.textContent = `Thanks ${name}, I'll be in touch soon.`;
    form.reset();
  });
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  reveals();
  parallax();
  tilt();
});
