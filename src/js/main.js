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

// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    const cart = {
        items: [],
        
        // DOM Elements
        elements: {
            cartIcon: document.querySelector('.cart-icon'),
            cartSidebar: document.querySelector('.cart-sidebar'),
            closeCart: document.querySelector('.close-cart'),
            cartCount: document.querySelector('.cart-count'),
            cartItems: document.querySelector('.cart-items'),
            totalAmount: document.querySelector('.total-amount')
        },
        
        // Initialize cart functionality
        init() {
            if (!this.elements.cartIcon || !this.elements.cartSidebar) {
                console.error('Required cart elements not found');
                return;
            }
            
            // Open cart
            this.elements.cartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.elements.cartSidebar.classList.add('active');
            });
            
            // Close cart
            this.elements.closeCart.addEventListener('click', () => {
                this.elements.cartSidebar.classList.remove('active');
            });
        },
        
        // Update cart display
        updateDisplay() {
            const {cartCount, cartItems, totalAmount} = this.elements;
            
            // Update count
            const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = itemCount;
            
            // Update items
            cartItems.innerHTML = this.items.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>€${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button onclick="cart.updateQuantity('${item.name}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="cart.updateQuantity('${item.name}', 1)">+</button>
                    </div>
                </div>
            `).join('');
            
            // Update total
            const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            totalAmount.textContent = `€${total.toFixed(2)}`;
        }
    };
    
    // Initialize cart
    cart.init();
    
    // Make cart globally available
    window.cart = cart;
});
