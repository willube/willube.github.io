function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.parentElement.classList.remove('active');
        if (link.getAttribute('href').slice(1) === currentSection) {
            link.parentElement.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Create mailto link with form data
    const mailtoLink = `mailto:auripulina@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}%0A%0AFrom: ${encodeURIComponent(email)}`;
    
    // Open email client
    window.location.href = mailtoLink;
});

const form = document.getElementById('contactForm');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loading state
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Form handling
    const formData = new FormData(form);
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            showNotification('Message sent successfully! ✨', 'success');
            form.reset();
        } else {
            showNotification('Oops! Something went wrong.', 'error');
        }
        button.innerHTML = originalText;
    }).catch(error => {
        showNotification('Oops! Something went wrong.', 'error');
        button.innerHTML = originalText;
    });
});

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Scroll animations
const observerOptions = {
    threshold: 0.25
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});