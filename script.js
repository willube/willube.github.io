// Global variables
let mouseX = 0, mouseY = 0;
let particles = [];
let audioContext;
let analyzer;
let dataArray;
let matrixCanvas, matrixCtx;
let matrixChars = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let matrixDrops = [];

// DOM Elements
const body = document.body;
const loading = document.querySelector('.loading');
const themeToggle = document.querySelector('.theme-toggle');
const profileImg = document.querySelector('.profile-img');
const cursorTrail = document.querySelector('.cursor-trail');
const musicPlayer = document.querySelector('.music-player');
const bgMusic = document.getElementById('bgMusic');
const playBtn = document.getElementById('playBtn');
const muteBtn = document.getElementById('muteBtn');
const progressBar = document.querySelector('.progress-bar');

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeMatrix();
    initializeMusicPlayer();
    initializeParticles();
    initializeCursor();
    initializeAnimations();
    initializeCounters();
    addEventListeners();
    hideLoading();
    
    // Start background effects
    setTimeout(() => {
        startMatrixEffect();
        createFloatingElements();
    }, 2000);
});

// Loading Screen
function hideLoading() {
    setTimeout(() => {
        loading.classList.add('hidden');
        setTimeout(() => {
            loading.style.display = 'none';
        }, 800);
    }, 1500);
}

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }
}

function toggleTheme() {
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Theme transition effect
    body.style.transition = 'all 0.5s ease';
    setTimeout(() => {
        body.style.transition = '';
    }, 500);
}

// Matrix Background Effect
function initializeMatrix() {
    matrixCanvas = document.getElementById('matrix-bg');
    matrixCtx = matrixCanvas.getContext('2d');
    
    function resizeMatrix() {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
        
        const columns = matrixCanvas.width / 20;
        matrixDrops.length = 0;
        for (let i = 0; i < columns; i++) {
            matrixDrops[i] = 1;
        }
    }
    
    resizeMatrix();
    window.addEventListener('resize', resizeMatrix);
}

function startMatrixEffect() {
    function drawMatrix() {
        matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        
        matrixCtx.fillStyle = '#0F3460';
        matrixCtx.font = '15px monospace';
        
        for (let i = 0; i < matrixDrops.length; i++) {
            const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            matrixCtx.fillText(text, i * 20, matrixDrops[i] * 20);
            
            if (matrixDrops[i] * 20 > matrixCanvas.height && Math.random() > 0.975) {
                matrixDrops[i] = 0;
            }
            matrixDrops[i]++;
        }
    }
    
    setInterval(drawMatrix, 35);
}

// Music Player
function initializeMusicPlayer() {
    // Since we can't load external audio easily, we'll simulate the music player
    let isPlaying = false;
    let isMuted = false;
    let progress = 0;
    
    playBtn.addEventListener('click', function() {
        isPlaying = !isPlaying;
        playBtn.textContent = isPlaying ? '⏸️' : '▶️';
        
        if (isPlaying) {
            startProgressAnimation();
            createMusicVisualizer();
        }
    });
    
    muteBtn.addEventListener('click', function() {
        isMuted = !isMuted;
        muteBtn.textContent = isMuted ? '🔇' : '🔊';
    });
    
    function startProgressAnimation() {
        if (!isPlaying) return;
        
        progress += 0.5;
        if (progress > 100) progress = 0;
        
        progressBar.style.width = progress + '%';
        
        if (isPlaying) {
            setTimeout(startProgressAnimation, 200);
        }
    }
}

function createMusicVisualizer() {
    const musicInfo = document.querySelector('.music-info');
    
    // Create audio visualization particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 3px;
            height: ${Math.random() * 30 + 10}px;
            background: linear-gradient(45deg, #667eea, #f093fb);
            left: ${Math.random() * 100}%;
            bottom: 0;
            animation: musicBounce ${Math.random() * 1 + 0.5}s ease-in-out infinite;
            border-radius: 2px;
        `;
        musicInfo.appendChild(particle);
        
        setTimeout(() => particle.remove(), 5000);
    }
}

// Particle System
function initializeParticles() {
    const particlesContainer = document.querySelector('.bg-particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Custom Cursor
function initializeCursor() {
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorTrail.style.left = mouseX - 10 + 'px';
        cursorTrail.style.top = mouseY - 10 + 'px';
        
        // Create cursor particles
        if (Math.random() < 0.1) {
            createCursorParticle(mouseX, mouseY);
        }
    });
}

function createCursorParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, #667eea, transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: cursorParticleFade 1s ease-out forwards;
    `;
    
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 1000);
}

// Profile Image Interactions
function initializeProfileInteractions() {
    profileImg.addEventListener('click', function() {
        // Explosion effect
        createExplosion(profileImg);
        
        // Rotate and scale animation
        profileImg.style.transform = 'scale(1.3) rotate(720deg)';
        setTimeout(() => {
            profileImg.style.transform = '';
        }, 1000);
        
        // Create floating letters
        const letters = ['C', 'E', 'R'];
        letters.forEach((letter, index) => {
            setTimeout(() => {
                createFloatingLetter(letter);
            }, index * 200);
        });
    });
}

function createExplosion(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        const angle = (i / 30) * Math.PI * 2;
        const velocity = Math.random() * 100 + 50;
        
        particle.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            width: 6px;
            height: 6px;
            background: linear-gradient(45deg, #667eea, #f093fb);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: explodeParticle 1.5s ease-out forwards;
        `;
        
        particle.style.setProperty('--angle', angle + 'rad');
        particle.style.setProperty('--velocity', velocity + 'px');
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1500);
    }
}

// Social Link Interactions
function initializeSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }
            
            // Create hover particles
            createHoverParticles(this);
        });
        
        link.addEventListener('click', function(e) {
            if (this.classList.contains('share')) {
                e.preventDefault();
                shareProfile();
                return;
            }
            
            // Click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Track click
            trackInteraction('social_click', this.querySelector('.link-title').textContent);
        });
    });
}

function createHoverParticles(element) {
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
            width: 3px;
            height: 3px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: hoverParticle 1s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}

// Skill Tag Interactions
function initializeSkillTags() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const skillName = this.textContent;
            const level = this.getAttribute('data-level');
            
            // Create skill popup
            createSkillPopup(skillName, level, this);
            
            // Animate the tag
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = '';
            }, 10);
            
            trackInteraction('skill_click', skillName);
        });
    });
}

function createSkillPopup(skill, level, element) {
    const popup = document.createElement('div');
    const rect = element.getBoundingClientRect();
    
    popup.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 5px;">${skill}</div>
        <div style="font-size: 0.8em; opacity: 0.8;">Level: ${level}</div>
    `;
    
    popup.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top - 60}px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 10px 15px;
        border-radius: 10px;
        font-size: 0.9em;
        pointer-events: none;
        z-index: 1000;
        transform: translate(-50%, 0) scale(0);
        animation: popupAppear 0.3s ease-out forwards;
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2000);
}

// Floating Elements
function createFloatingElements() {
    const elements = ['✨', '🎵', '💫', '🚀', '💎', '⚡'];
    
    setInterval(() => {
        const element = document.createElement('div');
        element.textContent = elements[Math.floor(Math.random() * elements.length)];
        element.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}vw;
            top: 100vh;
            font-size: ${Math.random() * 20 + 20}px;
            pointer-events: none;
            z-index: 1000;
            animation: floatUpSlow 8s ease-out forwards;
            opacity: 0.7;
        `;
        
        document.body.appendChild(element);
        setTimeout(() => element.remove(), 8000);
    }, 2000);
}

// Counter Animation
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = element.getAttribute('data-target');
    const isInfinity = target === '∞';
    const finalValue = isInfinity ? 999 : parseInt(target);
    let current = 0;
    const increment = finalValue / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= finalValue) {
            current = finalValue;
            clearInterval(timer);
            element.textContent = isInfinity ? '∞' : finalValue;
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

// Scroll Animations
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.links-section, .skills, .footer').forEach(el => {
        observer.observe(el);
    });
}

// Share Profile Function
function shareProfile() {
    if (navigator.share) {
        navigator.share({
            title: 'cer - Digital Creator',
            text: 'Check out my bio page! 🚀',
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href);
        createNotification('Link copied to clipboard! 📋');
    }
}

function createNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-size: 1em;
        z-index: 10000;
        animation: notificationSlide 3s ease-out forwards;
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Event Listeners
function addEventListeners() {
    themeToggle.addEventListener('click', toggleTheme);
    initializeProfileInteractions();
    initializeSocialLinks();
    initializeSkillTags();
    initializeScrollAnimations();
    
    // Konami Code
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.code);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join('') === konamiSequence.join('')) {
            activateKonamiCode();
            konamiCode = [];
        }
    });
    
    // Window resize
    window.addEventListener('resize', function() {
        // Recalculate positions for responsive design
    });
}

function activateKonamiCode() {
    // Rainbow mode
    body.style.animation = 'rainbow 3s ease-in-out infinite';
    
    // Create massive particle explosion
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            createCursorParticle(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
        }, i * 50);
    }
    
    // Reset after 10 seconds
    setTimeout(() => {
        body.style.animation = '';
    }, 10000);
    
    createNotification('🎉 Konami Code Activated! Welcome to the matrix! 🕶️');
}

function trackInteraction(event, label) {
    console.log(`Event: ${event}, Label: ${label}`);
    // Here you would integrate with analytics
}

// Initialize everything
function initializeAnimations() {
    // Add entrance animations
    document.querySelectorAll('.social-link').forEach((link, index) => {
        link.style.animationDelay = `${0.8 + index * 0.1}s`;
    });
    
    document.querySelectorAll('.skill-tag').forEach((tag, index) => {
        tag.style.animationDelay = `${1.2 + index * 0.05}s`;
    });
}

// Add CSS animations dynamically
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes musicBounce {
        0%, 100% { transform: scaleY(1); }
        50% { transform: scaleY(2); }
    }
    
    @keyframes cursorParticleFade {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0) translateY(-50px); }
    }
    
    @keyframes explodeParticle {
        0% { opacity: 1; transform: scale(1); }
        100% { 
            opacity: 0; 
            transform: scale(0) translate(
                calc(cos(var(--angle)) * var(--velocity)),
                calc(sin(var(--angle)) * var(--velocity))
            );
        }
    }
    
    @keyframes hoverParticle {
        0% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-30px); }
    }
    
    @keyframes floatUpSlow {
        0% { transform: translateY(0); opacity: 0.7; }
        50% { opacity: 1; }
        100% { transform: translateY(-100vh); opacity: 0; }
    }
    
    @keyframes popupAppear {
        0% { transform: translate(-50%, 0) scale(0); opacity: 0; }
        100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
    }
    
    @keyframes notificationSlide {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        10% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        90% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
    }
    
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg) saturate(1.5); }
        100% { filter: hue-rotate(360deg) saturate(1.5); }
    }
`;

document.head.appendChild(additionalStyles);
