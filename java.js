:\Users\Auri\Desktop\willube.github.io\src\js\main.js
const form = document.getElementById('contactForm');

form.addEventListener('submit', function(e) {
    // Show loading state
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Form will be handled by Formspree
    // This is just for visual feedback
    setTimeout(() => {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = 'Message sent successfully! ✨';
        document.body.appendChild(notification);
        
        // Reset button
        button.innerHTML = originalText;
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        // Reset form
        form.reset();
    }, 1000);
});