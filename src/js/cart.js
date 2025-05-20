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
        this.updateDisplay();
    },

    setupEventListeners() {
        // Open cart
        this.cartIcon?.addEventListener('click', (e) => {
            e.preventDefault();
            this.cartSidebar?.classList.add('active');
        });

        // Close cart
        this.closeCart?.addEventListener('click', () => {
            this.cartSidebar?.classList.remove('active');
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.cartSidebar?.classList.contains('active') && 
                !this.cartSidebar.contains(e.target) && 
                !this.cartIcon.contains(e.target)) {
                this.cartSidebar.classList.remove('active');
            }
        });
    },

    addItem(product) {
        const existingItem = this.items.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.updateDisplay();
    },

    updateDisplay() {
        if (this.cartCount) {
            this.cartCount.textContent = this.items.reduce((sum, item) => sum + item.quantity, 0);
        }
        
        if (this.cartItems) {
            this.cartItems.innerHTML = this.items.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">€${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button onclick="cart.updateQuantity('${item.name}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="cart.updateQuantity('${item.name}', 1)">+</button>
                    </div>
                </div>
            `).join('');
        }
        
        if (this.totalAmount) {
            const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            this.totalAmount.textContent = `€${total.toFixed(2)}`;
        }
    },

    updateQuantity(name, change) {
        const item = this.items.find(item => item.name === name);
        if (item) {
            item.quantity += change;
            if (item.quantity < 1) {
                this.items = this.items.filter(i => i.name !== name);
            }
            this.updateDisplay();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => cart.init());