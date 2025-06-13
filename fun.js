document.getElementById('fun-btn').addEventListener('click', function() {
  const desc = document.getElementById('bio-desc');
  desc.textContent = '👋 Hallo! Schön, dass du da bist.';
  setTimeout(() => {
    desc.textContent = 'Kreativität trifft Struktur.\nMinimalismus, Code, Design.';
  }, 2000);
});