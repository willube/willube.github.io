document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  // Simulate form submission
  document.getElementById('formMessage').textContent = `Thank you, ${name}! Your message has been sent.`;
  document.getElementById('contactForm').reset();
});
