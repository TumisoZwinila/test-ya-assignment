/* ========================================
   TERRAVAST HOLDINGS - MAIN JAVASCRIPT
   Handles interactivity, search, mobile menu, forms
   ======================================== */

// Wait for the entire page to load before running any code
document.addEventListener('DOMContentLoaded', function() {

    /* ========== 1. MOBILE MENU TOGGLE ========== */
    // Find the mobile menu button and panel
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobilePanel = document.getElementById('mobileNavPanel');
    
    if (menuBtn && mobilePanel) {
        menuBtn.addEventListener('click', function() {
            mobilePanel.classList.toggle('show');
        });
    }

    // Also handle any other mobile menu buttons on different pages
    const anyMenuBtn = document.querySelectorAll('.mobile-menu-btn');
    anyMenuBtn.forEach(btn => {
        btn.addEventListener('click', function() {
            const panel = this.closest('header').nextElementSibling;
            if (panel && panel.classList.contains('mobile-nav-panel')) {
                panel.classList.toggle('show');
            }
        });
    });

    /* ========== 2. PROPERTY LISTINGS DATA ========== */
    // This is the data for all properties - matches the assignment image
    const listingsData = [
        { 
            title: "Residential Plot", 
            location: "Gaborone", 
            price: "P300,000", 
            size: "500m²", 
            type: "Residential", 
            priceNum: 300000 
        },
        { 
            title: "Commercial Farmland", 
            location: "Maun", 
            price: "P850,000", 
            size: "3,500m²", 
            type: "Commercial", 
            priceNum: 850000 
        },
        { 
            title: "Agricultural Land", 
            location: "Mahalapye", 
            price: "P2,700,000", 
            size: "20,000m²", 
            type: "Freehold", 
            priceNum: 2700000 
        },
        { 
            title: "Tribal Residential", 
            location: "Mochudi", 
            price: "P450,000", 
            size: "3,000m²", 
            type: "Residential", 
            priceNum: 450000 
        },
        { 
            title: "Commercial Stand", 
            location: "Francistown", 
            price: "P1,200,000", 
            size: "2,500m²", 
            type: "Commercial", 
            priceNum: 1200000 
        },
        { 
            title: "Luxury Plot", 
            location: "Kasane", 
            price: "P2,100,000", 
            size: "5,000m²", 
            type: "Freehold", 
            priceNum: 2100000 
        },
        { 
            title: "Residential Plot", 
            location: "Lobatse", 
            price: "P350,000", 
            size: "600m²", 
            type: "Residential", 
            priceNum: 350000 
        },
        { 
            title: "Commercial Farm", 
            location: "Ghanzi", 
            price: "P1,800,000", 
            size: "15,000m²", 
            type: "Commercial", 
            priceNum: 1800000 
        }
    ];

    /* ========== 3. FUNCTION TO RENDER LISTINGS ========== */
    // This creates the HTML for each property card
    function renderListings(filteredData, containerId) {
        const grid = document.getElementById(containerId);
        if (!grid) return;
        
        if (filteredData.length === 0) {
            grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No properties found. Try a different search.</p>';
            return;
        }
        
        grid.innerHTML = '';
        
        filteredData.forEach(list => {
            const card = document.createElement('div');
            card.className = 'listing-card';
            card.innerHTML = `
                <div class="listing-img-placeholder">
                    <i class="bi bi-tree-fill"></i>
                    <i class="bi bi-house-fill"></i>
                </div>
                <div class="listing-card-content">
                    <h3>${escapeHtml(list.title)}</h3>
                    <div class="listing-location">
                        <i class="bi bi-geo-alt-fill"></i> ${escapeHtml(list.location)}
                    </div>
                    <div class="listing-price">${escapeHtml(list.price)}</div>
                    <div class="listing-details">
                        <span>📐 ${escapeHtml(list.size)}</span>
                        <span>🏷️ ${escapeHtml(list.type)}</span>
                    </div>
                    <a href="contact.html" class="btn-details">VIEW DETAILS →</a>
                </div>
            `;
            grid.appendChild(card);
        });
    }
    
    // Helper function to prevent HTML injection
    function escapeHtml(str) {
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    /* ========== 4. RENDER FEATURED LISTINGS ON HOMEPAGE ========== */
    // Show first 6 properties on homepage
    const featuredGrid = document.getElementById('featuredListingsGrid');
    if (featuredGrid) {
        renderListings(listingsData.slice(0, 6), 'featuredListingsGrid');
    }
    
    // Show ALL listings on the listings page
    const allListingsGrid = document.getElementById('allListingsGrid');
    if (allListingsGrid) {
        renderListings(listingsData, 'allListingsGrid');
    }

    /* ========== 5. SEARCH/FILTER FUNCTIONALITY ========== */
    const searchForm = document.getElementById('searchForm');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Don't refresh the page
            
            // Get search values
            const locationInput = document.getElementById('searchLocation')?.value.toLowerCase().trim() || '';
            const typeSelect = document.getElementById('searchType')?.value || 'all';
            const priceRange = document.getElementById('searchPrice')?.value || 'any';
            
            // Filter the data
            let filtered = [...listingsData];
            
            // Filter by location
            if (locationInput !== '') {
                filtered = filtered.filter(item => 
                    item.location.toLowerCase().includes(locationInput)
                );
            }
            
            // Filter by property type
            if (typeSelect !== 'all') {
                filtered = filtered.filter(item => item.type === typeSelect);
            }
            
            // Filter by price range
            if (priceRange !== 'any') {
                if (priceRange === '0-300000') {
                    filtered = filtered.filter(item => item.priceNum <= 300000);
                } else if (priceRange === '300001-600000') {
                    filtered = filtered.filter(item => item.priceNum >= 300001 && item.priceNum <= 600000);
                } else if (priceRange === '600001-1000000') {
                    filtered = filtered.filter(item => item.priceNum >= 600001 && item.priceNum <= 1000000);
                } else if (priceRange === '1000001+') {
                    filtered = filtered.filter(item => item.priceNum >= 1000001);
                }
            }
            
            // Update the display with filtered results
            renderListings(filtered, 'featuredListingsGrid');
            
            // Scroll to results
            document.querySelector('.featured-listings')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    /* ========== 6. CONTACT FORM VALIDATION ========== */
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('conName')?.value.trim();
            const email = document.getElementById('conEmail')?.value.trim();
            const type = document.getElementById('conType')?.value;
            const message = document.getElementById('conMsg')?.value.trim();
            
            // Validation
            if (!name) {
                alert('Please enter your full name.');
                return;
            }
            if (!email) {
                alert('Please enter your email address.');
                return;
            }
            if (!email.includes('@') || !email.includes('.')) {
                alert('Please enter a valid email address (e.g., name@example.com).');
                return;
            }
            if (!type) {
                alert('Please select whether you are a buyer or seller.');
                return;
            }
            if (!message) {
                alert('Please enter your message.');
                return;
            }
            
            // Success message
            alert('Thank you! Your inquiry has been sent. A Terravast representative will contact you within 24 hours.');
            contactForm.reset();
        });
    }

    /* ========== 7. FEEDBACK FORM VALIDATION ========== */
    const feedbackForm = document.getElementById('feedbackForm');
    const thankYouMsg = document.getElementById('thankYouMsg');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('fbName')?.value.trim();
            const email = document.getElementById('fbEmail')?.value.trim();
            const message = document.getElementById('fbMsg')?.value.trim();
            
            // Validation
            if (!name) {
                alert('Please enter your name.');
                return;
            }
            if (!email) {
                alert('Please enter your email address.');
                return;
            }
            if (!email.includes('@') || !email.includes('.')) {
                alert('Please enter a valid email address.');
                return;
            }
            if (!message) {
                alert('Please enter your feedback message.');
                return;
            }
            
            // Hide form, show thank you message
            feedbackForm.style.display = 'none';
            if (thankYouMsg) {
                thankYouMsg.style.display = 'block';
            }
        });
    }

}); // End of DOMContentLoaded