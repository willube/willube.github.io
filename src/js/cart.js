const cart = {
    items: [],
    
    init() {
        this.cartIcon = document.querySelector('.cart-icon');
        this.cartSidebar = document.querySelector('.cart-sidebar');
        this.closeCart = document.querySelector('.close-cart');
        this.cartCount = document.querySelector('.cart-count');
        this.cartItems = document.querySelector('.cart-items');
        this.totalAmount = document.querySelector('.total-amount');
        
        this.setupEventListeners();
        this.setupPayPal();
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
    },

    setupPayPal() {
        paypal.Buttons({
            createOrder: (data, actions) => {
                const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: total.toFixed(2)
                        },
                        description: 'Order from aury shop'
                    }]
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then((details) => {
                    alert('Payment completed! Order ID: ' + details.id);
                    this.clearCart();
                    this.cartSidebar?.classList.remove('active');
                });
            },
            onError: (err) => {
                console.error('PayPal error:', err);
                alert('Payment failed. Please try again.');
            }
        }).render('#paypal-button-container');
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
        
        // Update total
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.querySelectorAll('.total-amount').forEach(el => {
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

    clearCart() {
        this.items = [];
        this.updateDisplay();
    }
};

// Initialize cart
document.addEventListener('DOMContentLoaded', () => cart.init());