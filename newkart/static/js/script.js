// GreatKart E-commerce Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count
    let cartCount = 3;
    let favoriteProducts = new Set();
    const cartBadge = document.querySelector('.badge');
    
    // Initialize from localStorage if available
    if (localStorage.getItem('cartCount')) {
        cartCount = parseInt(localStorage.getItem('cartCount'));
        if (cartBadge) cartBadge.textContent = cartCount;
    }
    
    if (localStorage.getItem('favorites')) {
        favoriteProducts = new Set(JSON.parse(localStorage.getItem('favorites')));
        updateFavoriteButtons();
    }
    
    // Favorite button functionality
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product');
            const icon = this.querySelector('i');
            
            if (favoriteProducts.has(productId)) {
                // Remove from favorites
                favoriteProducts.delete(productId);
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.classList.remove('active');
                showToast('Product removed from favorites!');
            } else {
                // Add to favorites
                favoriteProducts.add(productId);
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.classList.add('active');
                showToast('Product added to favorites!');
            }
            
            // Save to localStorage
            localStorage.setItem('favorites', JSON.stringify([...favoriteProducts]));
        });
    });
    
    function updateFavoriteButtons() {
        favoriteButtons.forEach(button => {
            const productId = button.getAttribute('data-product');
            const icon = button.querySelector('i');
            
            if (favoriteProducts.has(productId)) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                button.classList.add('active');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                button.classList.remove('active');
            }
        });
    }
    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product');
            const productName = this.closest('.card-body').querySelector('.card-title').textContent;
            const productPrice = this.closest('.card-body').querySelector('.h4').textContent;
            
            // Update cart count
            cartCount++;
            if (cartBadge) cartBadge.textContent = cartCount;
            
            // Save to localStorage
            localStorage.setItem('cartCount', cartCount);
            
            // Change button state
            const originalText = this.innerHTML;
            const originalClass = this.className;
            this.innerHTML = '<i class="fas fa-check me-1"></i> Added!';
            this.className = 'btn btn-success add-to-cart';
            this.disabled = true;
            
            // Show success message
            showToast(`${productName} added to cart!`);
            
            // Revert button after 2 seconds
            setTimeout(() => {
                this.innerHTML = originalText;
                this.className = originalClass;
                this.disabled = false;
            }, 2000);
            
            // Here you would typically send an AJAX request to your Django backend
            console.log(`Added product ${productId} to cart`);
            
            // Update cart in localStorage
            let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
            cartItems.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1,
                timestamp: new Date().getTime()
            });
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        });
    });
    
    // Search form functionality
    const searchForm = document.querySelector('form.d-flex');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input[type="search"]');
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                // Add loading state to search button
                const searchBtn = this.querySelector('button');
                const originalContent = searchBtn.innerHTML;
                searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                searchBtn.disabled = true;
                
                console.log(`Searching for: ${searchTerm}`);
                // Here you would typically submit the form or make an AJAX request
                
                setTimeout(() => {
                    searchBtn.innerHTML = originalContent;
                    searchBtn.disabled = false;
                    showToast(`Search results for "${searchTerm}" would appear here.`);
                }, 1000);
            } else {
                showToast('Please enter a search term', 'error');
                searchInput.focus();
            }
        });
    }
    
    // Newsletter subscription
    const newsletterBtn = document.querySelector('footer .btn-primary');
    
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', function() {
            const emailInput = this.closest('.input-group').querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                // Add loading state
                const originalText = this.textContent;
                this.textContent = 'Subscribing...';
                this.disabled = true;
                
                setTimeout(() => {
                    showToast('Thank you for subscribing to our newsletter!');
                    emailInput.value = '';
                    this.textContent = originalText;
                    this.disabled = false;
                }, 1000);
            } else {
                showToast('Please enter a valid email address!', 'error');
                emailInput.focus();
            }
        });
    }
    
    // Category card click functionality
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const categoryName = this.querySelector('h5').textContent;
            showToast(`Navigating to ${categoryName} category`);
            
            // Add visual feedback
            this.style.transform = 'translateY(-3px) scale(1.02)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
            
            // In a real app, you would navigate to the category page
            // window.location.href = `/category/${categoryName.toLowerCase()}/`;
        });
    });
    
    // Currency dropdown functionality
    const currencyDropdownItems = document.querySelectorAll('#currencyDropdown .dropdown-item');
    
    currencyDropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const currencyText = this.textContent.trim();
            const currencyIcon = this.querySelector('i').className;
            const currencyButton = document.querySelector('#currencyDropdown');
            
            // Update currency button
            currencyButton.innerHTML = `<i class="${currencyIcon}"></i> ${currencyText.split(' ')[1]}`;
            
            // Save to localStorage
            localStorage.setItem('currency', currencyText.split(' ')[1]);
            
            // Update all prices
            updatePrices(currencyText.split(' ')[1]);
        });
    });
    
    // Load saved currency on page load
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency) {
        const currencySymbols = {
            'USD': 'fa-dollar-sign',
            'EUR': 'fa-euro-sign',
            'GBP': 'fa-pound-sign',
            'JPY': 'fa-yen-sign'
        };
        
        const currencyButton = document.querySelector('#currencyDropdown');
        if (currencyButton && currencySymbols[savedCurrency]) {
            currencyButton.innerHTML = `<i class="fas ${currencySymbols[savedCurrency]}"></i> ${savedCurrency}`;
            updatePrices(savedCurrency);
        }
    }
    
    // Toast notification function
    function showToast(message, type = 'success') {
        // Remove existing toast if any
        const existingToast = document.querySelector('.custom-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `custom-toast alert alert-${type === 'error' ? 'danger' : 'success'} shadow`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                    <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} me-2"></i>
                    <span>${message}</span>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(toast);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideIn 0.3s ease-out reverse';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 300);
            }
        }, 4000);
        
        // Add close functionality
        toast.querySelector('.btn-close').addEventListener('click', () => {
            toast.remove();
        });
    }
    
    // Email validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Price update simulation (for currency change)
    function updatePrices(currency) {
        const prices = document.querySelectorAll('.h4.text-primary');
        const conversionRates = {
            'USD': 1,
            'EUR': 0.92,
            'GBP': 0.79,
            'JPY': 150
        };
        
        const rate = conversionRates[currency] || 1;
        const symbols = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'JPY': '¥'
        };
        
        prices.forEach(priceElement => {
            const originalPrice = parseFloat(priceElement.textContent.replace(/[^0-9.]/g, ''));
            const convertedPrice = (originalPrice * rate).toFixed(2);
            priceElement.textContent = `${symbols[currency] || '$'}${convertedPrice}`;
        });
        
        showToast(`Currency changed to ${currency}`);
    }
    
    // Navbar mobile menu close on click
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Add to cart animation for navbar cart icon
    const cartIcon = document.querySelector('.fa-shopping-cart').closest('a');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            showToast(`You have ${cartCount} items in your cart`);
        });
    }
    
    // Heart icon in navbar
    const heartIcon = document.querySelector('.fa-heart').closest('a');
    if (heartIcon) {
        heartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            const favoriteCount = favoriteProducts.size;
            showToast(`You have ${favoriteCount} favorite ${favoriteCount === 1 ? 'product' : 'products'}`);
        });
    }
    
    // User icon in navbar
    const userIcon = document.querySelector('.fa-user').closest('a');
    if (userIcon) {
        userIcon.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('User profile page would open here');
        });
    }
    
    // See All button functionality
    const seeAllBtn = document.querySelector('.btn-outline-primary');
    if (seeAllBtn && seeAllBtn.textContent.includes('See all')) {
        seeAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Loading all popular products...');
            
            // Add loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
                showToast('All products loaded successfully!');
            }, 1500);
        });
    }
    
    // Product image error handling
    const productImages = document.querySelectorAll('.card-img-top');
    productImages.forEach(img => {
        img.addEventListener('error', function() {
            if (!this.src.includes('via.placeholder.com')) {
                this.src = 'https://via.placeholder.com/300x200/eee/ccc?text=Product+Image';
            }
        });
    });
});