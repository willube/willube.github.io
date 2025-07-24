// Advanced Bio Page JavaScript - Inspired by fakecrime.bio
class WillubeApp {
    constructor() {
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.createCustomCursor();
        this.createBackgroundEffects();
        this.initializeLoadingScreen();
        this.initializeMusicPlayer();
        this.setupThemeToggle();
        this.createParticleSystem();
        this.setupScrollEffects();
        this.animateOnScroll();
        this.createMatrixBackground();
        this.setupProfileEffects();
        this.initializeStats();
        this.setupTypewriter();
        this.initializeSkillBars();
        this.createFloatingElements();
    }

    setupEventListeners() {
        window.addEventListener('load', () => this.hideLoadingScreen());
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('mousemove', (e) => this.updateCursor(e));
        window.addEventListener('resize', () => this.handleResize());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                e.preventDefault();
                this.toggleMusic();
            }
            if (e.key === 't' || e.key === 'T') {
                this.toggleTheme();
            }
        });
    }

    // Custom Cursor System
    createCustomCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'cursor';
        
        const dot = document.createElement('div');
        dot.className = 'cursor-dot';
        
        const ring = document.createElement('div');
        ring.className = 'cursor-ring';
        
        cursor.appendChild(dot);
        cursor.appendChild(ring);
        document.body.appendChild(cursor);
        
        this.cursor = { dot, ring };
        
        // Hide default cursor on hover
        document.querySelectorAll('a, button, [role="button"]').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.ring.style.transform = 'translate(-50%, -50%) scale(1.5)';
                this.cursor.ring.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
            });
            
            el.addEventListener('mouseleave', () => {
                this.cursor.ring.style.transform = 'translate(-50%, -50%) scale(1)';
                this.cursor.ring.style.backgroundColor = 'transparent';
            });
        });
    }

    updateCursor(e) {
        if (this.cursor) {
            const { clientX: x, clientY: y } = e;
            
            this.cursor.dot.style.left = x + 'px';
            this.cursor.dot.style.top = y + 'px';
            
            setTimeout(() => {
                this.cursor.ring.style.left = x + 'px';
                this.cursor.ring.style.top = y + 'px';
            }, 100);
        }
    }

    // Background Effects System
    createBackgroundEffects() {
        this.createMovingGradient();
        this.createGridPattern();
        this.createNoiseTexture();
    }

    createMovingGradient() {
        const bgContainer = document.createElement('div');
        bgContainer.className = 'bg-container';
        
        const gradient = document.createElement('div');
        gradient.className = 'bg-gradient';
        
        const particles = document.createElement('div');
        particles.className = 'bg-particles';
        
        const grid = document.createElement('div');
        grid.className = 'bg-grid';
        
        const noise = document.createElement('div');
        noise.className = 'bg-noise';
        
        bgContainer.appendChild(gradient);
        bgContainer.appendChild(particles);
        bgContainer.appendChild(grid);
        bgContainer.appendChild(noise);
        
        document.body.appendChild(bgContainer);
    }

    createGridPattern() {
        // Grid pattern is handled by CSS
    }

    createNoiseTexture() {
        // Noise texture is handled by CSS
    }

    // Loading Screen System
    initializeLoadingScreen() {
        const loading = document.querySelector('.loading');
        if (!loading) return;

        const progressFill = loading.querySelector('.progress-fill');
        const lines = loading.querySelectorAll('.loading-line');
        
        // Animate progress bar
        setTimeout(() => {
            if (progressFill) {
                progressFill.style.width = '100%';
            }
        }, 500);
        
        // Animate loading text
        lines.forEach((line, index) => {
            setTimeout(() => {
                line.style.opacity = '1';
            }, 500 + (index * 500));
        });
    }

    hideLoadingScreen() {
        const loading = document.querySelector('.loading');
        if (loading) {
            setTimeout(() => {
                loading.classList.add('hidden');
                setTimeout(() => loading.remove(), 1000);
            }, 3000);
        }
    }

    // Music Player System
    initializeMusicPlayer() {
        this.musicState = {
            isPlaying: false,
            currentTime: 0,
            duration: 240, // 4 minutes
            volume: 0.7
        };
        
        this.setupMusicControls();
        this.animateMusicVisualizer();
        this.updateMusicProgress();
    }

    setupMusicControls() {
        const playBtn = document.querySelector('.play-btn');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const volumeBtn = document.querySelector('.volume-btn');
        
        if (playBtn) {
            playBtn.addEventListener('click', () => this.toggleMusic());
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousTrack());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextTrack());
        }
        
        if (volumeBtn) {
            volumeBtn.addEventListener('click', () => this.toggleVolume());
        }
    }

    toggleMusic() {
        this.musicState.isPlaying = !this.musicState.isPlaying;
        const playBtn = document.querySelector('.play-btn');
        
        if (playBtn) {
            playBtn.innerHTML = this.musicState.isPlaying ? '⏸️' : '▶️';
        }
        
        if (this.musicState.isPlaying) {
            this.startMusicAnimation();
        } else {
            this.stopMusicAnimation();
        }
    }

    animateMusicVisualizer() {
        const bars = document.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            const height = Math.random() * 25 + 5;
            bar.style.height = height + 'px';
            bar.style.animationDelay = (index * 0.1) + 's';
        });
        
        if (this.musicState.isPlaying) {
            setTimeout(() => this.animateMusicVisualizer(), 200);
        }
    }

    updateMusicProgress() {
        const progressBar = document.querySelector('.progress-bar::before');
        const currentTimeEl = document.querySelector('.current-time');
        const durationEl = document.querySelector('.duration-time');
        
        if (currentTimeEl) {
            currentTimeEl.textContent = this.formatTime(this.musicState.currentTime);
        }
        
        if (durationEl) {
            durationEl.textContent = this.formatTime(this.musicState.duration);
        }
        
        if (this.musicState.isPlaying) {
            this.musicState.currentTime += 0.1;
            if (this.musicState.currentTime >= this.musicState.duration) {
                this.musicState.currentTime = 0;
            }
            setTimeout(() => this.updateMusicProgress(), 100);
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    startMusicAnimation() {
        this.animateMusicVisualizer();
        this.updateMusicProgress();
    }

    stopMusicAnimation() {
        // Animation stops naturally when isPlaying is false
    }

    previousTrack() {
        this.musicState.currentTime = 0;
        // Add track switching logic here
    }

    nextTrack() {
        this.musicState.currentTime = 0;
        // Add track switching logic here
    }

    toggleVolume() {
        this.musicState.volume = this.musicState.volume > 0 ? 0 : 0.7;
        const volumeBtn = document.querySelector('.volume-btn');
        if (volumeBtn) {
            volumeBtn.innerHTML = this.musicState.volume > 0 ? '🔊' : '🔇';
        }
    }

    // Theme System
    setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const toggleIcon = document.querySelector('.toggle-icon');
        
        if (toggleIcon) {
            const isDark = document.body.classList.contains('dark-theme');
            toggleIcon.textContent = isDark ? '☀️' : '🌙';
        }
    }

    // Particle System
    createParticleSystem() {
        const particlesContainer = document.querySelector('.bg-particles');
        if (!particlesContainer) return;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Matrix Background Effect
    createMatrixBackground() {
        const canvas = document.querySelector('.matrix-background');
        if (!canvas) {
            const matrixCanvas = document.createElement('canvas');
            matrixCanvas.className = 'matrix-background';
            document.querySelector('.bg-container').appendChild(matrixCanvas);
            this.initMatrix(matrixCanvas);
        }
    }

    initMatrix(canvas) {
        const ctx = canvas.getContext('2d');
        
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resize();
        window.addEventListener('resize', resize);
        
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        const charArray = chars.split('');
        
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        
        const drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }
        
        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = 'rgba(102, 126, 234, 0.1)';
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        
        setInterval(draw, 35);
    }

    // Scroll Effects
    setupScrollEffects() {
        this.lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const navbar = document.querySelector('.navbar');
            
            if (navbar) {
                if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }
            
            this.lastScrollY = currentScrollY;
        });
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-bg');
        
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
        
        // Update progress indicators
        const winHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const scrollPercent = scrolled / (docHeight - winHeight);
        
        // You can use scrollPercent to update any progress indicators
    }

    // Animation on Scroll
    animateOnScroll() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Animate skill bars when skills section is visible
                    if (entry.target.classList.contains('skills-section')) {
                        this.animateSkillBars();
                    }
                    
                    // Start counter animation for stats
                    if (entry.target.classList.contains('hero-stats')) {
                        this.animateCounters();
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const elementsToObserve = document.querySelectorAll(
            '.social-card, .skill-category, .stat-card, .hero-stats, .skills-section'
        );
        
        elementsToObserve.forEach(el => observer.observe(el));
    }

    // Profile Effects
    setupProfileEffects() {
        const profileImg = document.querySelector('.profile-img');
        if (!profileImg) return;
        
        profileImg.addEventListener('click', () => {
            profileImg.style.transform = 'scale(1.2) rotate(360deg)';
            setTimeout(() => {
                profileImg.style.transform = 'scale(1) rotate(0deg)';
            }, 1000);
        });
        
        // Add floating animation to orbit dots
        this.animateOrbitDots();
    }

    animateOrbitDots() {
        const dots = document.querySelectorAll('.orbit-dot');
        dots.forEach((dot, index) => {
            const angle = (index * 120) * (Math.PI / 180);
            const radius = 100 + (index * 20);
            
            let rotation = 0;
            const animate = () => {
                rotation += 0.5;
                const x = Math.cos(angle + rotation * Math.PI / 180) * radius;
                const y = Math.sin(angle + rotation * Math.PI / 180) * radius;
                
                dot.style.transform = `translate(${x}px, ${y}px)`;
                requestAnimationFrame(animate);
            };
            
            animate();
        });
    }

    // Statistics Animation
    initializeStats() {
        this.stats = {
            projects: { current: 0, target: 27, element: null },
            experience: { current: 0, target: 5, element: null },
            clients: { current: 0, target: 100, element: null }
        };
        
        // Get stat elements
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length >= 3) {
            this.stats.projects.element = statNumbers[0];
            this.stats.experience.element = statNumbers[1];
            this.stats.clients.element = statNumbers[2];
        }
    }

    animateCounters() {
        Object.keys(this.stats).forEach(key => {
            const stat = this.stats[key];
            if (!stat.element) return;
            
            const increment = stat.target / 60; // 60 frames for 1 second at 60fps
            const timer = setInterval(() => {
                stat.current += increment;
                if (stat.current >= stat.target) {
                    stat.current = stat.target;
                    clearInterval(timer);
                }
                
                const displayValue = key === 'experience' 
                    ? `${Math.floor(stat.current)}+`
                    : `${Math.floor(stat.current)}${key === 'clients' ? '+' : ''}`;
                    
                stat.element.textContent = displayValue;
            }, 16); // ~60fps
        });
    }

    // Typewriter Effect
    setupTypewriter() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.width = '0';
            
            let i = 0;
            const timer = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(timer);
                    element.style.borderRight = 'none';
                }
            }, 100);
        });
    }

    // Skill Bars Animation
    initializeSkillBars() {
        this.skillLevels = {
            'JavaScript': 95,
            'Python': 88,
            'React': 90,
            'Node.js': 85,
            'CSS/SCSS': 92,
            'Git': 87,
            'Docker': 75,
            'AWS': 70
        };
    }

    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach(bar => {
            const skillName = bar.closest('.skill-item').querySelector('.skill-name').textContent;
            const targetWidth = this.skillLevels[skillName] || 0;
            
            setTimeout(() => {
                bar.style.width = targetWidth + '%';
            }, Math.random() * 500);
        });
    }

    // Floating Elements
    createFloatingElements() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        for (let i = 0; i < 5; i++) {
            const float = document.createElement('div');
            float.className = 'floating-element';
            float.style.cssText = `
                position: absolute;
                width: ${20 + Math.random() * 40}px;
                height: ${20 + Math.random() * 40}px;
                background: linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(240, 147, 251, 0.1));
                border-radius: 50%;
                pointer-events: none;
                animation: float${i + 1} ${8 + Math.random() * 4}s ease-in-out infinite;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
            `;
            
            hero.appendChild(float);
        }
        
        // Add keyframes for floating animation
        this.addFloatingKeyframes();
    }

    addFloatingKeyframes() {
        if (document.querySelector('#floating-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'floating-styles';
        style.textContent = `
            @keyframes float1 {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(180deg); }
            }
            @keyframes float2 {
                0%, 100% { transform: translateX(0px) rotate(0deg); }
                50% { transform: translateX(20px) rotate(-180deg); }
            }
            @keyframes float3 {
                0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
                50% { transform: translate(15px, -15px) rotate(90deg); }
            }
            @keyframes float4 {
                0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
                50% { transform: translate(-15px, 15px) rotate(-90deg); }
            }
            @keyframes float5 {
                0%, 100% { transform: translateY(0px) scale(1); }
                50% { transform: translateY(-25px) scale(1.1); }
            }
        `;
        
        document.head.appendChild(style);
    }

    // Resize Handler
    handleResize() {
        // Recalculate any size-dependent elements
        const canvas = document.querySelector('.matrix-background');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }

    // Status Updates
    updateStatus() {
        const stats = document.querySelectorAll('.stat-value');
        if (stats.length >= 3) {
            // Update stats with real-time data if available
            const visitors = 1337 + Math.floor(Math.random() * 100);
            const uptime = '99.9%';
            const ping = Math.floor(Math.random() * 50) + 10;
            
            if (stats[0]) stats[0].textContent = visitors;
            if (stats[1]) stats[1].textContent = uptime;
            if (stats[2]) stats[2].textContent = ping + 'ms';
        }
    }

    // Smooth Scrolling for Navigation
    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Easter Eggs
    setupEasterEggs() {
        let konamiCode = [];
        const konamiSequence = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        
        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.code);
            if (konamiCode.length > konamiSequence.length) {
                konamiCode.shift();
            }
            
            if (konamiCode.join(',') === konamiSequence.join(',')) {
                this.activateEasterEgg();
                konamiCode = [];
            }
        });
    }

    activateEasterEgg() {
        // Fun easter egg - rainbow mode!
        document.body.style.animation = 'rainbow 2s linear infinite';
        
        const rainbowStyle = document.createElement('style');
        rainbowStyle.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(rainbowStyle);
        
        setTimeout(() => {
            document.body.style.animation = '';
            rainbowStyle.remove();
        }, 10000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.willubeApp = new WillubeApp();
});

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`🚀 WillUBE Bio loaded in ${Math.round(loadTime)}ms`);
    
    // Update status periodically
    setInterval(() => {
        if (window.willubeApp) {
            window.willubeApp.updateStatus();
        }
    }, 30000); // Update every 30 seconds
});

// Service Worker Registration (for PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
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
