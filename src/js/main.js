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
let cart = [];

document.addEventListener('DOMContentLoaded', function() {
    // Get all cart elements
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeModal = document.querySelector('.close-modal');
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.querySelector('.cart-items');
    const totalAmount = document.querySelector('.total-amount');
    
    // Debug log to check if elements are found
    console.log('Cart Elements:', {
        cartIcon, cartSidebar, closeCart, checkoutBtn,
        checkoutModal, closeModal, cartCount
    });

    // Cart toggle
    if (cartIcon && cartSidebar) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartSidebar.classList.add('active');
            console.log('Cart opened');
        });
    }

    // Close cart
    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
            console.log('Cart closed');
        });
    }

    // Add to cart functionality
    document.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const product = {
                name: card.querySelector('h3').textContent,
                price: parseFloat(card.querySelector('.price').textContent.replace('€', '')),
                quantity: 1
            };
            
            addToCart(product);
            updateCartDisplay();
            cartSidebar.classList.add('active');
        });
    });

    // Update cart display
    function updateCartDisplay() {
        if (cartCount && cartItems && totalAmount) {
            // Update cart count
            const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = itemCount;

            // Update cart items
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">€${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button onclick="updateQuantity('${item.name}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.name}', 1)">+</button>
                    </div>
                </div>
            `).join('');

            // Update total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            totalAmount.textContent = `€${total.toFixed(2)}`;
        }
    }

    // Helper function to add items to cart
    function addToCart(product) {
        const existingItem = cart.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push(product);
        }
    }

    // Outside click handler
    document.addEventListener('click', function(e) {
        if (cartSidebar && 
            !cartSidebar.contains(e.target) && 
            !cartIcon.contains(e.target) && 
            cartSidebar.classList.contains('active')) {
            cartSidebar.classList.remove('active');
        }
    });

    // Stop propagation on cart sidebar clicks
    if (cartSidebar) {
        cartSidebar.addEventListener('click', function(e) {
            e.stopPropagation();
        });
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
        // Get elements inside the function to ensure they exist
        const cartCount = document.querySelector('.cart-count');
        const cartItems = document.querySelector('.cart-items');
        const totalAmount = document.querySelector('.total-amount');
        
        if (cartCount && cartItems && totalAmount) {
            cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            totalAmount.textContent = `€${total.toFixed(2)}`;
        }
    }
}
