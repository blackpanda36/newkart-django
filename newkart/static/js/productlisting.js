// Product Listing Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Price range functionality
    const priceRange = document.getElementById('priceRange');
    const priceDisplay = document.getElementById('priceDisplay');
    
    if (priceRange && priceDisplay) {
        priceRange.addEventListener('input', function() {
            const minPrice = 0;
            const maxPrice = parseInt(this.value);
            const formattedMaxPrice = maxPrice.toLocaleString('en-IN');
            priceDisplay.textContent = `₹${minPrice.toLocaleString('en-IN')} - ₹${formattedMaxPrice}`;
        });
    }
    
    // Color selection functionality
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(color => {
        color.addEventListener('click', function() {
            // Toggle active state
            colorOptions.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            const selectedColor = this.getAttribute('data-color');
            console.log(`Color filter: ${selectedColor}`);
            
            // Show toast notification
            showToast(`Filtering by color: ${selectedColor}`);
            
            // In a real app, you would filter products here
            // filterProductsByColor(selectedColor);
        });
    });
    
    // Grid/List view toggle
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');
    const productGrid = document.getElementById('productGrid');
    
    if (gridViewBtn && listViewBtn && productGrid) {
        gridViewBtn.addEventListener('click', function() {
            this.classList.add('active');
            listViewBtn.classList.remove('active');
            productGrid.classList.remove('list-view');
            productGrid.classList.add('row');
            
            // Update product cards to grid view
            const productCards = document.querySelectorAll('.product-card-wrapper');
            productCards.forEach(card => {
                card.className = 'col-xl-3 col-lg-4 col-md-6 mb-4 product-card-wrapper';
            });
            
            showToast('Switched to grid view');
        });
        
        listViewBtn.addEventListener('click', function() {
            this.classList.add('active');
            gridViewBtn.classList.remove('active');
            productGrid.classList.add('list-view');
            productGrid.classList.remove('row');
            
            // Update product cards to list view
            const productCards = document.querySelectorAll('.product-card-wrapper');
            productCards.forEach(card => {
                card.className = 'mb-4 product-card-wrapper';
            });
            
            showToast('Switched to list view');
        });
    }
    
    // Sort by functionality
    const sortBySelect = document.getElementById('sortBy');
    if (sortBySelect) {
        sortBySelect.addEventListener('change', function() {
            const sortValue = this.value;
            console.log(`Sorting by: ${sortValue}`);
            
            // Show loading state
            const originalValue = this.value;
            this.disabled = true;
            
            // Simulate sorting delay
            setTimeout(() => {
                showToast(`Products sorted by ${this.options[this.selectedIndex].text}`);
                this.disabled = false;
                
                // In a real app, you would sort products here
                // sortProducts(sortValue);
            }, 500);
        });
    }
    
    // Filter checkbox functionality
    const filterCheckboxes = document.querySelectorAll('.form-check-input');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const filterName = this.closest('.form-check').querySelector('label').textContent.trim();
            const isChecked = this.checked;
            
            console.log(`Filter ${filterName}: ${isChecked ? 'enabled' : 'disabled'}`);
            
            // Show toast for discount filter
            if (this.id === 'discountCheck') {
                showToast(isChecked ? 'Showing only products with 40%+ discount' : 'Showing all products');
            }
            
            // In a real app, you would update filters here
            // updateFilters();
        });
    });
    
    // Filter accordion - save state
    const filterAccordion = document.getElementById('filterAccordion');
    if (filterAccordion) {
        const accordionButtons = filterAccordion.querySelectorAll('.accordion-button');
        
        // Load saved accordion state
        accordionButtons.forEach(button => {
            const target = button.getAttribute('data-bs-target');
            const isExpanded = localStorage.getItem(target) === 'true';
            
            if (isExpanded) {
                const collapse = new bootstrap.Collapse(document.querySelector(target));
                collapse.show();
            }
        });
        
        // Save accordion state when toggled
        accordionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const target = this.getAttribute('data-bs-target');
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                localStorage.setItem(target, isExpanded);
            });
        });
    }
    
    // Pagination functionality
    const paginationItems = document.querySelectorAll('.pagination .page-item');
    paginationItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.classList.contains('disabled')) {
                e.preventDefault();
                return;
            }
            
            const link = this.querySelector('.page-link');
            if (!link || link.getAttribute('href') === '#') {
                e.preventDefault();
                
                // Remove active class from all items
                paginationItems.forEach(i => i.classList.remove('active'));
                
                // Add active class to clicked item (if it's a page number)
                if (!this.classList.contains('disabled') && !link.textContent.includes('Previous') && !link.textContent.includes('Next')) {
                    this.classList.add('active');
                    showToast(`Loading page ${link.textContent}`);
                    
                    // In a real app, you would load the page here
                    // loadPage(parseInt(link.textContent));
                } else if (link.textContent.includes('Next')) {
                    showToast('Loading next page...');
                } else if (link.textContent.includes('Previous')) {
                    showToast('Loading previous page...');
                }
            }
        });
    });
    
    // Filter reset functionality (not in design but useful)
    const resetFilters = document.createElement('button');
    resetFilters.className = 'btn btn-outline-secondary btn-sm mt-3';
    resetFilters.innerHTML = '<i class="fas fa-redo me-1"></i> Reset Filters';
    resetFilters.style.width = '100%';
    
    const filterCard = document.querySelector('.card .card-body');
    if (filterCard) {
        filterCard.appendChild(resetFilters);
        
        resetFilters.addEventListener('click', function() {
            // Reset all checkboxes except "Min 40% Off"
            filterCheckboxes.forEach(checkbox => {
                if (checkbox.id !== 'discountCheck') {
                    checkbox.checked = false;
                }
            });
            
            // Reset price range
            if (priceRange) {
                priceRange.value = priceRange.max;
                const maxPrice = parseInt(priceRange.max);
                priceDisplay.textContent = `₹0 - ₹${maxPrice.toLocaleString('en-IN')}`;
            }
            
            // Reset color selection
            colorOptions.forEach(color => color.classList.remove('active'));
            
            // Reset sort dropdown
            if (sortBySelect) {
                sortBySelect.value = 'Relevance';
            }
            
            // Show success message
            showToast('All filters have been reset', 'success');
            
            console.log('Filters reset');
            
            // In a real app, you would reset all products here
            // resetAllFilters();
        });
    }
    
    // Quick view functionality (bonus feature)
    const quickViewButtons = document.createElement('button');
    quickViewButtons.className = 'btn btn-outline-primary btn-sm quick-view-btn position-absolute bottom-0 start-50 translate-middle-x mb-2';
    quickViewButtons.innerHTML = '<i class="fas fa-eye me-1"></i> Quick View';
    quickViewButtons.style.display = 'none';
    
    // Add quick view buttons to product cards on hover
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const quickViewBtn = quickViewButtons.cloneNode(true);
        const cardBody = card.querySelector('.card-body');
        
        // Position the button correctly
        quickViewBtn.style.position = 'absolute';
        quickViewBtn.style.bottom = '10px';
        quickViewBtn.style.left = '50%';
        quickViewBtn.style.transform = 'translateX(-50%)';
        quickViewBtn.style.zIndex = '10';
        
        card.addEventListener('mouseenter', function() {
            if (!this.querySelector('.quick-view-btn')) {
                const newQuickViewBtn = quickViewBtn.cloneNode(true);
                this.querySelector('.position-relative').appendChild(newQuickViewBtn);
                
                // Add click handler for the new button
                newQuickViewBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const productTitle = card.querySelector('.card-title').textContent;
                    showToast(`Quick view for: ${productTitle}`, 'info');
                    
                    // In a real app, you would show a modal with product details
                    // showQuickViewModal(productId);
                });
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const existingBtn = this.querySelector('.quick-view-btn');
            if (existingBtn) {
                existingBtn.remove();
            }
        });
    });
    
    // Toast notification function (for this file)
    function showToast(message, type = 'info') {
        // Check if toast function exists from main script
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
            return;
        }
        
        // Fallback toast implementation
        const toast = document.createElement('div');
        toast.className = `position-fixed bottom-0 end-0 p-3`;
        toast.style.zIndex = '9999';
        
        const toastEl = document.createElement('div');
        toastEl.className = `toast show`;
        toastEl.setAttribute('role', 'alert');
        
        const toastClass = type === 'error' ? 'danger' : 
                          type === 'success' ? 'success' : 
                          type === 'warning' ? 'warning' : 'info';
        
        toastEl.innerHTML = `
            <div class="toast-header bg-${toastClass} text-white">
                <strong class="me-auto">GreatKart</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;
        
        toast.appendChild(toastEl);
        document.body.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
        
        // Add close functionality
        toastEl.querySelector('.btn-close').addEventListener('click', () => {
            toast.remove();
        });
    }
    
    // Product comparison (bonus feature)
    const compareButtons = document.createElement('button');
    compareButtons.className = 'btn btn-outline-secondary btn-sm compare-btn';
    compareButtons.innerHTML = '<i class="fas fa-balance-scale me-1"></i> Compare';
    
    // Add compare button to each product card
    productCards.forEach(card => {
        const compareBtn = compareButtons.cloneNode(true);
        const cardFooter = document.createElement('div');
        cardFooter.className = 'card-footer bg-transparent border-top-0 pt-0';
        cardFooter.appendChild(compareBtn);
        
        const cardBody = card.querySelector('.card-body');
        if (cardBody && !card.querySelector('.compare-btn')) {
            card.appendChild(cardFooter);
            
            compareBtn.addEventListener('click', function() {
                const productTitle = card.querySelector('.card-title').textContent;
                this.classList.toggle('active');
                
                if (this.classList.contains('active')) {
                    this.innerHTML = '<i class="fas fa-check me-1"></i> Added to Compare';
                    this.classList.add('btn-primary');
                    this.classList.remove('btn-outline-secondary');
                    showToast(`${productTitle} added to comparison`, 'success');
                } else {
                    this.innerHTML = '<i class="fas fa-balance-scale me-1"></i> Compare';
                    this.classList.remove('btn-primary', 'active');
                    this.classList.add('btn-outline-secondary');
                    showToast(`${productTitle} removed from comparison`, 'info');
                }
            });
        }
    });
    
    // Share product functionality (bonus)
    const productTitles = document.querySelectorAll('.card-title');
    productTitles.forEach(title => {
        title.style.cursor = 'pointer';
        title.addEventListener('click', function() {
            const fullTitle = this.textContent;
            const productCard = this.closest('.product-card');
            const productImage = productCard.querySelector('.card-img-top').src;
            
            // In a real app, you would navigate to product detail page
            showToast(`Opening product details for: ${fullTitle}`, 'info');
            console.log(`Product details for: ${fullTitle}`);
            console.log(`Image URL: ${productImage}`);
            
            // Example: window.location.href = `/product/${productId}/`;
        });
    });
    
    // Price alert (bonus feature)
    const priceElements = document.querySelectorAll('.h4.text-primary');
    priceElements.forEach(priceEl => {
        priceEl.style.cursor = 'pointer';
        priceEl.title = 'Click to set price alert';
        
        priceEl.addEventListener('click', function() {
            const price = this.textContent;
            const productName = this.closest('.card-body').querySelector('.card-title').textContent;
            
            // Prompt for email (in a real app, this would be a modal)
            const email = prompt(`Set price alert for ${productName} (${price}). Enter your email:`);
            
            if (email && validateEmail(email)) {
                showToast(`Price alert set for ${productName}! We'll notify you at ${email}`, 'success');
            } else if (email) {
                showToast('Please enter a valid email address', 'error');
            }
        });
    });
    
    // Email validation helper
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Initialize tooltips for color options
    const colorTooltips = document.querySelectorAll('.color-option');
    colorTooltips.forEach(color => {
        color.setAttribute('data-bs-toggle', 'tooltip');
        color.setAttribute('data-bs-placement', 'top');
    });
    
    // Reinitialize Bootstrap tooltips (including new ones)
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});