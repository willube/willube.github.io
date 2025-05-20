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
    // Cart state
    let cart = {
        items: [],
        total: 0
    };

    // DOM Elements
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.querySelector('.cart-items');
    const totalAmount = document.querySelector('.total-amount');
    const checkoutBtn = document.querySelector('.checkout-btn');

    // Debug check
    console.log('Cart Elements:', {
        cartIcon,
        cartSidebar,
        closeCart,
        cartCount,
        cartItems,
        totalAmount,
        checkoutBtn
    });

    // Open cart
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        cartSidebar.classList.add('active');
        console.log('Cart opened');
    });

    // Close cart
    closeCart.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        console.log('Cart closed');
    });

    // Click outside to close
    document.addEventListener('click', function(e) {
        if (!cartSidebar.contains(e.target) && 
            !cartIcon.contains(e.target) && 
            cartSidebar.classList.contains('active')) {
            cartSidebar.classList.remove('active');
        }
    });

    // Add to cart
    document.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const product = {
                id: Date.now(),
                name: card.querySelector('h3').textContent,
                price: parseFloat(card.querySelector('.price').textContent.replace('€', '')),
                quantity: 1
            };
            
            addToCart(product);
            cartSidebar.classList.add('active');
        });
    });

    function addToCart(product) {
        const existingItem = cart.items.find(item => item.name === product.name);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.items.push(product);
        }
        
        updateCartDisplay();
    }

    function updateCartDisplay() {
        // Update cart count
        cartCount.textContent = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        
        // Update cart items
        cartItems.innerHTML = cart.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">€${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        `).join('');
        
        // Update total
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalAmount.textContent = `€${cart.total.toFixed(2)}`;
    }

    // Make updateQuantity available globally
    window.updateQuantity = function(id, change) {
        const item = cart.items.find(item => item.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity < 1) {
                cart.items = cart.items.filter(i => i.id !== id);
            }
            updateCartDisplay();
        }
    };
});
