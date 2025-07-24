// DOM Elements
const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const socialLinks = document.querySelectorAll('.social-link');
const skillTags = document.querySelectorAll('.skill-tag');
const profileImg = document.querySelector('.profile-img');
const loading = document.querySelector('.loading');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    createParticles();
    addEventListeners();
    hideLoading();
    animateElements();
    addTypingEffect();
    createFloatingEmojis();
});

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
    
    // Add theme transition effect
    body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        body.style.transition = '';
    }, 300);
}

// Particle System
function createParticles() {
    const particlesContainer = document.querySelector('.bg-particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random positioning
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation delay and duration
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Event Listeners
function addEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Social link interactions
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', handleLinkHover);
        link.addEventListener('mouseleave', handleLinkLeave);
        link.addEventListener('click', handleLinkClick);
    });
    
    // Skill tag interactions
    skillTags.forEach(tag => {
        tag.addEventListener('click', handleSkillClick);
    });
    
    // Profile image interaction
    profileImg.addEventListener('click', handleProfileClick);
    
    // Scroll animations
    window.addEventListener('scroll', handleScroll);
    
    // Konami code easter egg
    document.addEventListener('keydown', handleKonamiCode);
    
    // Mouse tracking for parallax effect
    document.addEventListener('mousemove', handleMouseMove);
}

// Social Link Interactions
function handleLinkHover(e) {
    const link = e.currentTarget;
    const emoji = link.querySelector('.emoji');
    
    // Add vibration effect (if supported)
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    // Random emoji rotation
    emoji.style.transform = `scale(1.2) rotate(${Math.random() * 20 - 10}deg)`;
}

function handleLinkLeave(e) {
    const emoji = e.currentTarget.querySelector('.emoji');
    emoji.style.transform = '';
}

function handleLinkClick(e) {
    const link = e.currentTarget;
    const href = link.getAttribute('href');
    
    // Add click animation
    link.style.transform = 'scale(0.95)';
    setTimeout(() => {
        link.style.transform = '';
    }, 150);
    
    // Analytics tracking (placeholder)
    trackClick('social_link', href);
}

// Skill Tag Interactions
function handleSkillClick(e) {
    const tag = e.currentTarget;
    const text = tag.textContent;
    
    // Create floating message
    createFloatingMessage(text, e.clientX, e.clientY);
    
    // Add pulse animation
    tag.style.animation = 'none';
    setTimeout(() => {
        tag.style.animation = '';
    }, 10);
    
    // Track skill interest
    trackClick('skill_click', text);
}

// Profile Image Interaction
function handleProfileClick() {
    profileImg.style.transform = 'scale(1.2) rotate(360deg)';
    setTimeout(() => {
        profileImg.style.transform = '';
    }, 600);
    
    // Create confetti effect
    createConfetti();
}

// Loading Screen
function hideLoading() {
    setTimeout(() => {
        loading.classList.add('hidden');
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
    }, 1000);
}

// Scroll Animations
function handleScroll() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.bg-particles');
    const speed = scrolled * 0.5;
    
    parallax.style.transform = `translateY(${speed}px)`;
}

// Typing Effect for Description
function addTypingEffect() {
    const description = document.querySelector('.description');
    const text = description.innerHTML;
    description.innerHTML = '';
    
    let i = 0;
    const typeSpeed = 50;
    
    function typeWriter() {
        if (i < text.length) {
            description.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, typeSpeed);
        }
    }
    
    // Start typing after page load
    setTimeout(typeWriter, 1500);
}

// Floating Emojis
function createFloatingEmojis() {
    const emojis = ['✨', '🚀', '💻', '🎨', '⚡', '🎯', '💡', '🔥'];
    
    setInterval(() => {
        const emoji = document.createElement('div');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}vw;
            top: 100vh;
            font-size: 2em;
            pointer-events: none;
            z-index: 1000;
            animation: floatUp 4s ease-out forwards;
        `;
        
        document.body.appendChild(emoji);
        
        setTimeout(() => {
            emoji.remove();
        }, 4000);
    }, 3000);
}

// Floating Message
function createFloatingMessage(text, x, y) {
    const message = document.createElement('div');
    message.textContent = `Interested in ${text}!`;
    message.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        background: rgba(102, 126, 234, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        font-size: 0.8em;
        pointer-events: none;
        z-index: 1000;
        animation: floatMessage 2s ease-out forwards;
        transform: translate(-50%, -50%);
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 2000);
}

// Confetti Effect
function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            pointer-events: none;
            z-index: 1000;
            animation: confettiFall 3s ease-out forwards;
            transform: translate(-50%, -50%);
        `;
        
        // Random direction and rotation
        const angle = Math.random() * 360;
        const velocity = Math.random() * 15 + 5;
        confetti.style.setProperty('--angle', angle + 'deg');
        confetti.style.setProperty('--velocity', velocity + 'px');
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

// Mouse Parallax Effect
function handleMouseMove(e) {
    const cards = document.querySelectorAll('.bio-card, .links-section, .skills');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    cards.forEach((card, index) => {
        const intensity = (index + 1) * 2;
        const xOffset = (x - 0.5) * intensity;
        const yOffset = (y - 0.5) * intensity;
        
        card.style.transform = `translate(${xOffset}px, ${yOffset}px) perspective(1000px) rotateX(${yOffset * 0.5}deg) rotateY(${xOffset * 0.5}deg)`;
    });
}

// Konami Code Easter Egg
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

function handleKonamiCode(e) {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        activateEasterEgg();
        konamiCode = [];
    }
}

function activateEasterEgg() {
    document.body.style.animation = 'rainbow 2s ease-in-out infinite';
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 10000);
    
    alert('🎉 Konami Code activated! You found the easter egg!');
}

// Smooth Animations
function animateElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    document.querySelectorAll('.bio-card, .links-section, .skills').forEach(el => {
        observer.observe(el);
    });
}

// Analytics (placeholder function)
function trackClick(category, label) {
    console.log(`Analytics: ${category} - ${label}`);
    // Here you would integrate with Google Analytics, Mixpanel, etc.
}

// Performance Monitoring
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        });
    }
}

// Social Share Function
function shareProfile() {
    if (navigator.share) {
        navigator.share({
            title: 'willube - Digital Creator',
            text: 'Check out my bio page!',
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        createFloatingMessage('Link copied to clipboard!', window.innerWidth / 2, window.innerHeight / 2);
    }
}

// Add dynamic CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-100vh); opacity: 0; }
    }
    
    @keyframes floatMessage {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        20% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(-50%, -150%) scale(1); opacity: 0; }
    }
    
    @keyframes confettiFall {
        0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; }
        100% { 
            transform: translate(
                calc(-50% + var(--velocity) * cos(var(--angle))), 
                calc(-50% + var(--velocity) * sin(var(--angle)))
            ) rotate(720deg); 
            opacity: 0; 
        }
    }
    
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Initialize performance monitoring
monitorPerformance();
