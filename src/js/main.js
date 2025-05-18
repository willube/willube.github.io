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
const submitButton = form.querySelector('button[type="submit"]');
const originalButtonText = submitButton.innerHTML;

async function handleSubmit(event) {
    event.preventDefault();
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Show success message
            showNotification('Message sent successfully! ✨', 'success');
            form.reset();
        } else {
            // Show error message
            showNotification('Oops! There was a problem.', 'error');
        }
    } catch (error) {
        showNotification('Oops! There was a problem.', 'error');
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

form.addEventListener('submit', handleSubmit);