const cart = {
    items: [],
    
    init() {
        // DOM Elements
        this.cartIcon = document.querySelector('.cart-icon');
        this.cartSidebar = document.querySelector('.cart-sidebar');
        this.closeCart = document.querySelector('.close-cart');
        this.cartCount = document.querySelector('.cart-count');
        this.cartItems = document.querySelector('.cart-items');
        this.totalAmount = document.querySelector('.total-amount');
        this.checkoutBtn = document.querySelector('.checkout-btn');
        this.checkoutModal = document.getElementById('checkout-modal');
        this.closeModal = document.querySelector('.close-modal');
        this.checkoutForm = document.getElementById('checkout-form');
        
        this.setupEventListeners();
        this.updateDisplay();
    },

    setupEventListeners() {
        // Cart toggle
        this.cartIcon?.addEventListener('click', () => {
            this.cartSidebar?.classList.add('active');
        });

        this.closeCart?.addEventListener('click', () => {
            this.cartSidebar?.classList.remove('active');
        });

        // Add to cart buttons
        document.querySelectorAll('.btn-add-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.product-card');
                const product = {
                    id: Date.now(),
                    name: card.querySelector('h3').textContent,
                    price: parseFloat(card.querySelector('.price').textContent.replace('€', '')),
                    quantity: 1
                };
                this.addItem(product);
                this.cartSidebar?.classList.add('active');
            });
        });

        // Checkout
        this.checkoutBtn?.addEventListener('click', () => {
            this.showCheckoutModal();
        });

        this.closeModal?.addEventListener('click', () => {
            this.checkoutModal?.classList.remove('active');
        });

        // Handle checkout form
        this.checkoutForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processCheckout();
        });
    },

    addItem(product) {
        const existingItem = this.items.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push(product);
        }
        this.updateDisplay();
    },

    updateDisplay() {
        // Update cart count
        if (this.cartCount) {
            this.cartCount.textContent = this.items.reduce((sum, item) => sum + item.quantity, 0);
        }
        
        // Update cart items
        if (this.cartItems) {
            this.cartItems.innerHTML = this.items.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">€${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button onclick="cart.updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="cart.updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            `).join('');
        }
        
        // Update all total amounts
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.querySelectorAll('.total-amount, .checkout-amount').forEach(el => {
            el.textContent = `€${total.toFixed(2)}`;
        });
    },

    updateQuantity(id, change) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity < 1) {
                this.items = this.items.filter(i => i.id !== id);
            }
            this.updateDisplay();
        }
    },

    showCheckoutModal() {
        if (this.checkoutModal && this.items.length > 0) {
            // Update checkout items
            const checkoutItems = this.checkoutModal.querySelector('.checkout-items');
            if (checkoutItems) {
                checkoutItems.innerHTML = this.items.map(item => `
                    <div class="checkout-item">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>€${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('');
            }
            this.checkoutModal.classList.add('active');
            this.cartSidebar?.classList.remove('active');
        }
    },

    processCheckout() {
        // Here we would normally integrate with a payment processor
        // For now, we'll just show a success message
        const formData = new FormData(this.checkoutForm);
        const orderData = {
            items: this.items,
            total: this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            customer: {
                name: formData.get('name'),
                email: formData.get('email'),
                address: formData.get('address')
            }
        };

        // Redirect to PayPal
        const paypalBusinessEmail = 'YOUR_PAYPAL_EMAIL'; // Replace with your PayPal email
        const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(paypalBusinessEmail)}&item_name=${encodeURIComponent('Order from aury')}&amount=${orderData.total}&currency_code=EUR`;
        
        window.location.href = paypalUrl;
    }
};

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => cart.init());