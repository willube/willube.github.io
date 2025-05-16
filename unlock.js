document.addEventListener('DOMContentLoaded', () => {
    const unlockScreen = document.getElementById('unlock-screen');
    const unlockBtn = document.getElementById('unlock-btn');
    const mainContent = document.getElementById('main-content');

    // Initial state
    mainContent.classList.remove('visible');
    unlockScreen.classList.remove('hidden');

    unlockBtn.addEventListener('click', () => {
        unlockScreen.classList.add('hidden');
        mainContent.classList.add('visible');
    });
});