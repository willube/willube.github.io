const cart = {
    items: [],
    supabaseUrl: 'YOUR_SUPABASE_URL',
    supabaseKey: 'YOUR_SUPABASE_ANON_KEY',
    
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
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: this.getTotal().toFixed(2)
                        }
                    }]
                });
            },
            onApprove: async (data, actions) => {
                try {
                    const order = await actions.order.capture();
                    await this.saveOrderToDatabase(order);
                    this.showSuccess('Payment successful!');
                    this.clearCart();
                } catch (error) {
                    this.showError('Payment failed. Please try again.');
                    console.error(error);
                }
            }
        }).render('#paypal-button-container');
    },

    async saveOrderToDatabase(order) {
        const response = await fetch(`${this.supabaseUrl}/rest/v1/orders`, {
            method: 'POST',
            headers: {
                'apikey': this.supabaseKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                paypal_order_id: order.id,
                customer_email: order.payer.email_address,
                items: this.items,
                total: this.getTotal()
            })
        });

        if (!response.ok) throw new Error('Failed to save order');
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

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
        if (this.totalAmount) {
            this.totalAmount.textContent = `€${this.getTotal().toFixed(2)}`;
        }
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
        this.cartSidebar?.classList.remove('active');
    },

    showSuccess(message) {
        this.showMessage(message, 'success');
    },

    showError(message) {
        this.showMessage(message, 'error');
    },

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `cart-message cart-${type}`;
        messageDiv.textContent = message;
        this.cartItems.prepend(messageDiv);
        setTimeout(() => messageDiv.remove(), 5000);
    }
};

// Initialize cart
document.addEventListener('DOMContentLoaded', () => cart.init());