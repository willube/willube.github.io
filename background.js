const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

// Mausposition
const mouse = {
    x: undefined,
    y: undefined,
    radius: 100  // Einflussbereich der Maus
};

// Canvas-Größe anpassen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Partikel-Klasse
class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.baseSpeedX = Math.random() * 2 - 1;
        this.baseSpeedY = Math.random() * 2 - 1;
        this.speedX = this.baseSpeedX;
        this.speedY = this.baseSpeedY;
        this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
        // Basis-Bewegung
        this.x += this.speedX;
        this.y += this.speedY;

        // Mausinteraktion
        if (mouse.x !== undefined && mouse.y !== undefined) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                
                // Partikel werden von der Maus weggedrückt
                this.speedX = this.baseSpeedX - Math.cos(angle) * force * 2;
                this.speedY = this.baseSpeedY - Math.sin(angle) * force * 2;
            } else {
                // Zurück zur normalen Geschwindigkeit
                this.speedX = this.baseSpeedX;
                this.speedY = this.baseSpeedY;
            }
        }

        // Zurücksetzen wenn außerhalb des Bildschirms
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 0, 255, ${this.alpha})`;
        ctx.fill();
    }
}

// Partikel erstellen
const particles = Array.from({ length: 100 }, () => new Particle());

// Animation
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animate);
}

// Event Listeners
window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', () => {
    resizeCanvas();
    animate();
});

// Maus-Event-Listener hinzufügen
canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

canvas.addEventListener('mouseleave', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});