
// Animate entrance for fade-in and fade-in-up elements
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.fade-in, .fade-in-up').forEach((el, i) => {
    el.style.animationDelay = `${0.2 + i * 0.15}s`;
  });
});

document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  // Simulate form submission
  document.getElementById('formMessage').textContent = `Thank you, ${name}! Your message has been sent.`;
  document.getElementById('contactForm').reset();
});
