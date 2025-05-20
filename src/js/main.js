// Navigation highlight
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.parentElement.classList.remove('active');
                if (link.getAttribute('href').slice(1) === section.getAttribute('id')) {
                    link.parentElement.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// Contact form
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    const mailtoLink = `mailto:auripulina@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}%0A%0AFrom: ${encodeURIComponent(email)}`;
    
    window.location.href = mailtoLink;
});

let cart = [];

// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Cart Elements
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.querySelector('.cart-items');
    const totalAmount = document.querySelector('.total-amount');
    
    // Cart Toggle
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        cartSidebar.classList.add('active');
        console.log('Cart opened'); // Debug line
    });

    closeCart.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        console.log('Cart closed'); // Debug line
    });

    // Add to cart buttons
    document.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const product = {
                name: card.querySelector('h3').textContent,
                price: parseFloat(card.querySelector('.price').textContent.replace('€', '')),
                quantity: 1
            };
            
            addToCart(product);
            cartSidebar.classList.add('active');
        });
    });

    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        if (!cartSidebar.contains(e.target) && 
            !cartIcon.contains(e.target) && 
            cartSidebar.classList.contains('active')) {
            cartSidebar.classList.remove('active');
        }
    });

    // Update cart functions
    function addToCart(product) {
        const existingItem = cart.find(item => item.name === product.name);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push(product);
        }
        
        updateCartDisplay();
    }

    function updateCartDisplay() {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">€${item.price}</p>
                </div>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalAmount.textContent = `€${total.toFixed(2)}`;
    }
});

// Global function for quantity updates
function updateQuantity(productName, change) {
    const item = cart.find(item => item.name === productName);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) {
            cart = cart.filter(i => i.name !== productName);
        }
        document.querySelector('.cart-count').textContent = 
            cart.reduce((sum, item) => sum + item.quantity, 0);
        updateCartDisplay();
    }
}

// Checkout
document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (cart.length > 0) {
        openCheckoutModal();
    }
});

function openCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    const checkoutItems = modal.querySelector('.checkout-items');
    const checkoutAmounts = modal.querySelectorAll('.checkout-amount');
    
    // Display cart items in checkout
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <span>${item.name} x${item.quantity}</span>
            <span>€${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    // Update total amount
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    checkoutAmounts.forEach(el => el.textContent = `€${total.toFixed(2)}`);
    
    modal.classList.add('active');
}

// Close modal when clicking close button or outside
document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('checkout-modal').classList.remove('active');
});

document.getElementById('checkout-modal').addEventListener('click', (e) => {
    if (e.target.id === 'checkout-modal') {
        e.target.classList.remove('active');
    }
});

// Handle checkout form submission
document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simple form validation
    const cardNumber = document.getElementById('card').value.replace(/\s/g, '');
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;
    
    if (!/^\d{16}$/.test(cardNumber)) {
        alert('Please enter a valid card number');
        return;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        alert('Please enter a valid expiry date (MM/YY)');
        return;
    }
    
    if (!/^\d{3}$/.test(cvv)) {
        alert('Please enter a valid CVV');
        return;
    }
    
    // Simulate payment processing
    const btn = e.target.querySelector('.btn-pay');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Processing...';
    btn.disabled = true;
    
    setTimeout(() => {
        alert('Payment successful! Thank you for your purchase.');
        cart = [];
        updateCart();
        document.getElementById('checkout-modal').classList.remove('active');
        document.querySelector('.cart-sidebar').classList.remove('active');
        btn.innerHTML = originalText;
        btn.disabled = false;
        e.target.reset();
    }, 1500);
});

// Format card number input
document.getElementById('card').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(.{4})/g, '$1 ').trim();
    e.target.value = value.substring(0, 19);
});

// Format expiry date input
document.getElementById('expiry').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
});

// Limit CVV to 3 digits
document.getElementById('cvv').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
});
