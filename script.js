// ========== GLOBAL VARIABLES ==========
let isLoading = true;
let currentSection = 'profile';
let musicPlayer = null;
let isPlaying = false;
let isDarkTheme = true;

// ========== DOM ELEMENTS ==========
const elements = {
    loading: null,
    bioCard: null,
    navbar: null,
    navLinks: null,
    themeToggle: null,
    playBtn: null,
    playToggle: null,
    ytPlayer: null,
    cursor: null,
    cursorDot: null,
    cursorRing: null,
    typewriterElements: null,
    statNumbers: null,
    progressFill: null,
    currentTime: null,
    totalTime: null,
    visualizerBars: null,
    socialCards: null
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    initializeLoading();
    initializeCursor();
    initializeNavigation();
    initializeMusic();
    initializeAnimations();
    initializeIntersectionObserver();
    initializeParticles();
    initializeMatrix();
    
    console.log('🚀 cer.exe initialized successfully');
});

// ========== ELEMENT INITIALIZATION ==========
function initializeElements() {
    elements.loading = document.getElementById('loading');
    elements.bioCard = document.getElementById('bioCard');
    elements.navbar = document.querySelector('.navbar');
    elements.navLinks = document.querySelectorAll('.nav-link');
    elements.themeToggle = document.querySelector('.theme-toggle');
    elements.playBtn = document.getElementById('playBtn');
    elements.playToggle = document.getElementById('playToggle');
    elements.ytPlayer = document.getElementById('ytplayer');
    elements.cursor = document.querySelector('.cursor');
    elements.cursorDot = document.querySelector('.cursor-dot');
    elements.cursorRing = document.querySelector('.cursor-ring');
    elements.typewriterElements = document.querySelectorAll('.typewriter');
    elements.statNumbers = document.querySelectorAll('.stat-number');
    elements.progressFill = document.querySelector('.progress-fill');
    elements.currentTime = document.getElementById('currentTime');
    elements.totalTime = document.getElementById('totalTime');
    elements.visualizerBars = document.querySelectorAll('.bar');
    elements.socialCards = document.querySelectorAll('.social-card');
}

// ========== LOADING ANIMATION ==========
function initializeLoading() {
    const loadingScreen = document.querySelector('.loading');
    const progressFill = document.querySelector('.progress-fill');
    const logoLetters = document.querySelectorAll('.logo-letter');
    
    // Animate letters one by one
    logoLetters.forEach((letter, index) => {
        setTimeout(() => {
            letter.style.animationDelay = `${index * 0.1}s`;
            letter.classList.add('animate');
        }, index * 100);
    });
    
    // Progress bar animation
    setTimeout(() => {
        if (progressFill) {
            progressFill.style.width = '100%';
        }
    }, 500);
    
    // Enhanced ending animation sequence
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        isLoading = false;
        
        // After the spectacular ending animation completes
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            // Start entrance animations
            setTimeout(() => {
                startTypewriterEffect();
                animateStatNumbers();
            }, 200);
        }, 2500); // Match the screenWipeOut animation duration
    }, 3000);
}

// ========== CURSOR EFFECTS ==========
function initializeCursor() {
    if (window.innerWidth <= 768) return; // Disable on mobile
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function updateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        if (elements.cursor) {
            elements.cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        }
        
        requestAnimationFrame(updateCursor);
    }
    
    updateCursor();
    
    // Add hover effects
    const hoverElements = document.querySelectorAll('a, button, .social-card, .nav-link, .stat-item');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (elements.cursorRing) {
                elements.cursorRing.style.transform = 'translate(-50%, -50%) scale(1.5)';
                elements.cursorRing.style.borderColor = '#667eea';
            }
        });
        
        el.addEventListener('mouseleave', () => {
            if (elements.cursorRing) {
                elements.cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
                elements.cursorRing.style.borderColor = '#667eea';
            }
        });
    });
}

// ========== NAVIGATION ==========
function initializeNavigation() {
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href').substring(1);
            navigateToSection(target);
        });
    });
    
    // Theme toggle
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Smooth scroll behavior
    document.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > 50) {
            e.preventDefault();
            const sections = ['profile', 'music', 'contact'];
            const currentIndex = sections.indexOf(currentSection);
            
            if (e.deltaY > 0 && currentIndex < sections.length - 1) {
                navigateToSection(sections[currentIndex + 1]);
            } else if (e.deltaY < 0 && currentIndex > 0) {
                navigateToSection(sections[currentIndex - 1]);
            }
        }
    }, { passive: false });
}

function navigateToSection(sectionId) {
    currentSection = sectionId;
    
    // Update active nav link
    elements.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
    
    // Scroll to section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    console.log(`📍 Navigated to section: ${sectionId}`);
}

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('light-theme', !isDarkTheme);
    
    const icon = elements.themeToggle.querySelector('.toggle-icon');
    if (icon) {
        icon.textContent = isDarkTheme ? '🌙' : '☀️';
    }
    
    console.log(`🎨 Theme switched to: ${isDarkTheme ? 'dark' : 'light'}`);
}

// ========== MUSIC PLAYER ==========
function initializeMusic() {
    // YouTube API setup
    window.onYouTubeIframeAPIReady = () => {
        musicPlayer = new YT.Player('ytplayer', {
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    };
    
    // Load YouTube API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    // Play button events
    if (elements.playBtn) {
        elements.playBtn.addEventListener('click', toggleMusic);
    }
    
    if (elements.playToggle) {
        elements.playToggle.addEventListener('click', toggleMusic);
    }
    
    // Control buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const volumeBtn = document.getElementById('volumeBtn');
    
    if (prevBtn) prevBtn.addEventListener('click', () => seekMusic(-10));
    if (nextBtn) nextBtn.addEventListener('click', () => seekMusic(10));
    if (volumeBtn) volumeBtn.addEventListener('click', toggleMute);
    
    // Start visualizer animation
    startMusicVisualizer();
}

function onPlayerReady(event) {
    console.log('🎵 Music player ready');
    updateMusicProgress();
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        updatePlayButtons('⏸️');
        animateVisualizer();
    } else if (event.data === YT.PlayerState.PAUSED) {
        isPlaying = false;
        updatePlayButtons('▶️');
        pauseVisualizer();
    }
}

function toggleMusic() {
    if (!musicPlayer) return;
    
    try {
        if (isPlaying) {
            musicPlayer.pauseVideo();
        } else {
            musicPlayer.playVideo();
        }
    } catch (error) {
        console.log('🎵 Music control error:', error);
        // Fallback: open YouTube link
        window.open('https://youtu.be/k6xFjFXji7A', '_blank');
    }
}

function seekMusic(seconds) {
    if (!musicPlayer) return;
    
    try {
        const currentTime = musicPlayer.getCurrentTime();
        const newTime = Math.max(0, currentTime + seconds);
        musicPlayer.seekTo(newTime);
    } catch (error) {
        console.log('🎵 Seek error:', error);
    }
}

function toggleMute() {
    if (!musicPlayer) return;
    
    try {
        if (musicPlayer.isMuted()) {
            musicPlayer.unMute();
            document.getElementById('volumeBtn').textContent = '🔊';
        } else {
            musicPlayer.mute();
            document.getElementById('volumeBtn').textContent = '🔇';
        }
    } catch (error) {
        console.log('🎵 Mute error:', error);
    }
}

function updatePlayButtons(icon) {
    if (elements.playBtn) {
        const playIcon = elements.playBtn.querySelector('.play-icon');
        if (playIcon) playIcon.textContent = icon;
    }
    
    if (elements.playToggle) {
        elements.playToggle.textContent = icon;
    }
}

function updateMusicProgress() {
    if (!musicPlayer || !isPlaying) {
        setTimeout(updateMusicProgress, 1000);
        return;
    }
    
    try {
        const currentTime = musicPlayer.getCurrentTime();
        const duration = musicPlayer.getDuration();
        
        if (duration > 0) {
            const progressPercent = (currentTime / duration) * 100;
            
            if (elements.progressFill) {
                elements.progressFill.style.width = `${progressPercent}%`;
            }
            
            if (elements.currentTime) {
                elements.currentTime.textContent = formatTime(currentTime);
            }
            
            if (elements.totalTime) {
                elements.totalTime.textContent = formatTime(duration);
            }
        }
    } catch (error) {
        console.log('🎵 Progress update error:', error);
    }
    
    setTimeout(updateMusicProgress, 1000);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ========== MUSIC VISUALIZER ==========
function startMusicVisualizer() {
    if (!elements.visualizerBars) return;
    
    elements.visualizerBars.forEach((bar, index) => {
        const delay = index * 0.1;
        bar.style.animationDelay = `${delay}s`;
    });
}

function animateVisualizer() {
    if (!elements.visualizerBars) return;
    
    elements.visualizerBars.forEach(bar => {
        bar.style.animationPlayState = 'running';
    });
}

function pauseVisualizer() {
    if (!elements.visualizerBars) return;
    
    elements.visualizerBars.forEach(bar => {
        bar.style.animationPlayState = 'paused';
    });
}

// ========== TYPEWRITER EFFECT ==========
function startTypewriterEffect() {
    elements.typewriterElements.forEach((element, index) => {
        const text = element.getAttribute('data-text');
        const delay = index * 1000;
        
        setTimeout(() => {
            typeText(element, text);
        }, delay);
    });
}

function typeText(element, text) {
    element.textContent = '';
    let i = 0;
    
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
        }
    }, 50);
}

// ========== STAT COUNTER ANIMATION ==========
function animateStatNumbers() {
    elements.statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const counter = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(counter);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// ========== INTERSECTION OBSERVER ==========
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Update current section
                const sectionId = entry.target.id;
                if (sectionId && sectionId !== currentSection) {
                    currentSection = sectionId;
                    updateActiveNavLink();
                }
            }
        });
    }, observerOptions);
    
    // Observe sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => observer.observe(section));
    
    // Observe cards for stagger animation
    const cards = document.querySelectorAll('.social-card, .stat-item');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
}

function updateActiveNavLink() {
    elements.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ========== PARTICLE SYSTEM ==========
function initializeParticles() {
    const particleContainer = document.querySelector('.bg-particles');
    if (!particleContainer) return;
    
    // Create floating particles
    for (let i = 0; i < 20; i++) {
        createParticle(particleContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, #667eea, transparent);
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        animation: floatParticle ${duration}s ease-in-out infinite;
        opacity: 0.6;
    `;
    
    container.appendChild(particle);
    
    // Remove and recreate particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
            createParticle(container);
        }
    }, duration * 1000);
}

// ========== MATRIX BACKGROUND ==========
function initializeMatrix() {
    const canvas = document.getElementById('matrix-bg');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Matrix characters
    const chars = '01';
    const charArray = chars.split('');
    
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#667eea';
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(drawMatrix, 100);
}

// ========== SOCIAL INTERACTIONS ==========
function shareProfile() {
    if (navigator.share) {
        navigator.share({
            title: 'cer - Digital Creator',
            text: 'Check out my digital portfolio - Music, Code, Innovation',
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Link copied to clipboard!');
        }).catch(() => {
            console.log('Share fallback failed');
        });
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent-primary);
        color: white;
        padding: 1rem 2rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ========== ANIMATIONS ==========
function initializeAnimations() {
    // Add CSS animation keyframes dynamically
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes floatParticle {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-20px) rotate(90deg); }
            50% { transform: translateY(-10px) rotate(180deg); }
            75% { transform: translateY(-15px) rotate(270deg); }
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    document.head.appendChild(styleSheet);
}

// ========== PERFORMANCE OPTIMIZATION ==========
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========== ERROR HANDLING ==========
window.addEventListener('error', (e) => {
    console.error('🚨 Application error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('🚨 Unhandled promise rejection:', e.reason);
});

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        e.preventDefault();
        toggleMusic();
    } else if (e.key === 'Escape') {
        // Reset to profile section
        navigateToSection('profile');
    } else if (e.key >= '1' && e.key <= '3') {
        const sections = ['profile', 'music', 'contact'];
        const index = parseInt(e.key) - 1;
        if (sections[index]) {
            navigateToSection(sections[index]);
        }
    }
});

// ========== EXPORT FUNCTIONS ==========
window.shareProfile = shareProfile;
window.toggleMusic = toggleMusic;
window.navigateToSection = navigateToSection;

console.log('🎯 cer.exe script loaded successfully');
