const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

// Mausposition
const mouse = {
    x: undefined,
    y: undefined,
    radius: 150  // Vergrößerter Einflussbereich
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
                
                // Partikel werden zur Maus hingezogen
                this.speedX += Math.cos(angle) * force * 0.5;
                this.speedY += Math.sin(angle) * force * 0.5;
                
                // Geschwindigkeit begrenzen
                const maxSpeed = 4;
                const currentSpeed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
                if (currentSpeed > maxSpeed) {
                    this.speedX = (this.speedX / currentSpeed) * maxSpeed;
                    this.speedY = (this.speedY / currentSpeed) * maxSpeed;
                }
            }
        }

        // Bildschirmgrenzen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 0, 255, ${this.alpha})`;
        ctx.fill();
    }
}

// Mehr Partikel erstellen
const particles = Array.from({ length: 200 }, () => new Particle());

// Animation
function animate() {
    // Hintergrund komplett löschen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Einmalig den Hintergrund setzen
    ctx.fillStyle = 'rgb(26, 1, 39)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Partikel zeichnen
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animate);
}

// Event Listeners
window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
});

window.addEventListener('mouseleave', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

// Initialisierung
resizeCanvas();
animate();