// Frontend JavaScript for displaying products

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing product loading...');
    loadProducts();

    // Initialize hero carousel
    initHeroCarousel();

    // Initialize featured watches
    initFeaturedWatches();
});

// Initialize hero carousel functionality
function initHeroCarousel() {
    console.log('Initializing hero carousel...');
    const slides = document.querySelectorAll('.hero .slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }

    // Auto-advance slides every 5 seconds
    setInterval(nextSlide, 5000);

    // Event listeners for buttons
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    console.log('Hero carousel initialized');
}

async function loadProducts() {
    try {
        console.log('Loading products...');
        const response = await fetch('/api/products');
        console.log('Products API response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const products = await response.json();
        console.log('Products loaded:', products);

        const productsContainer = document.getElementById('products-container');
        console.log('Products container:', productsContainer);

        if (!productsContainer) {
            console.error('Products container not found');
            return;
        }

        if (products.length === 0) {
            productsContainer.innerHTML = '<p class="no-products">No products available at the moment.</p>';
            return;
        }

        // Clear the loading message
        productsContainer.innerHTML = '';

        // Display products (limit to 6 for the homepage)
        const displayedProducts = products.slice(0, 6);
        console.log('Displaying products:', displayedProducts);

        let productCount = 0;
        displayedProducts.forEach(product => {
            // Validate product data
            if (!product.name || !product.description || product.price === undefined) {
                console.warn('Invalid product data:', product);
                return;
            }

            const productElement = createProductElement(product);
            productsContainer.appendChild(productElement);
            productCount++;
        });

        console.log(`Successfully added ${productCount} products to the page`);
    } catch (error) {
        console.error('Error loading products:', error);
        const productsContainer = document.getElementById('products-container');
        if (productsContainer) {
            productsContainer.innerHTML = '<p class="no-products">Error loading products.</p>';
        }
    }
}

function createProductElement(product) {
    console.log('Creating product element:', product);
    const productDiv = document.createElement('div');
    productDiv.className = 'category-item';

    // Add premium class for certain categories
    if (['richard-mille', 'patek-philippe', 'audemars-piguet'].includes(product.category)) {
        productDiv.classList.add('premium');
    }

    // Ensure price is a valid number
    const price = parseFloat(product.price);
    if (isNaN(price)) {
        console.warn('Invalid price for product:', product);
        product.price = 0;
    }

    // Create WhatsApp message with product details
    const productName = encodeURIComponent(product.name);
    const productPrice = encodeURIComponent(`$${parseFloat(product.price).toFixed(2)}`);
    const productDescription = encodeURIComponent(product.description);
    const productImage = encodeURIComponent(product.image);

    // WhatsApp message template with image URL
    const whatsappMessage = encodeURIComponent(`Hi, I'm interested in this watch:\n\nProduct: ${product.name}\nPrice: $${parseFloat(product.price).toFixed(2)}\nDescription: ${product.description}\n\nImage: ${product.image}\n\nCould you please provide more details?`);

    // WhatsApp link (replace with your actual WhatsApp number)
    const whatsappLink = `https://wa.me/9061649654?text=${whatsappMessage}`;

    productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}" onerror="console.error('Image failed to load:', '${product.image}'); this.onerror=null;this.src='https://placehold.co/300x200/1a1a1a/ffffff?text=${encodeURIComponent(product.name)}';">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="product-price">Price: $${parseFloat(product.price).toFixed(2)}</p>
        <a href="${whatsappLink}" class="btn" target="_blank">Enquire Now</a>
    `;

    return productDiv;
}

function initFeaturedWatches() {
    const watchCards = document.querySelectorAll('.watch-card');

    watchCards.forEach(card => {
        const zoomBtn = card.querySelector('.zoom-btn');
        const rotateBtn = card.querySelector('.rotate-btn');
        const watchVisual = card.querySelector('.watch-visual');
        const watchFace = card.querySelector('.watch-face');

        if (zoomBtn) {
            zoomBtn.addEventListener('click', function () {
                watchVisual.classList.toggle('rotating');
                setTimeout(() => {
                    watchVisual.classList.remove('rotating');
                }, 2000);
            });
        }

        if (rotateBtn) {
            rotateBtn.addEventListener('click', function () {
                watchVisual.classList.add('rotating');
                setTimeout(() => {
                    watchVisual.classList.remove('rotating');
                }, 2000);
            });
        }

        // Add hover effect for zoom indicator
        card.addEventListener('mouseenter', function () {
            this.querySelector('.zoom-indicator').style.opacity = '1';
        });

        card.addEventListener('mouseleave', function () {
            this.querySelector('.zoom-indicator').style.opacity = '0';
        });
    });
}

// Wishlist functionality
document.addEventListener('DOMContentLoaded', function () {
    // Initialize wishlist
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // Update wishlist count display
    function updateWishlistCount() {
        const countElement = document.querySelector('.wishlist-count');
        if (countElement) {
            countElement.textContent = wishlist.length;
        }
    }

    // Add item to wishlist
    function addToWishlist(product) {
        // Check if product is already in wishlist
        const exists = wishlist.some(item => item.id === product.id);
        if (!exists) {
            wishlist.push(product);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            updateWishlistCount();

            // Visual feedback
            const wishlistIcon = document.querySelector('.wishlist-icon');
            if (wishlistIcon) {
                wishlistIcon.classList.add('added');
                setTimeout(() => {
                    wishlistIcon.classList.remove('added');
                }, 1000);
            }
        }
    }

    // Remove item from wishlist
    function removeFromWishlist(productId) {
        wishlist = wishlist.filter(item => item.id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
    }

    // Initialize wishlist count
    updateWishlistCount();

    // Add event listeners for wishlist toggle
    const wishlistToggle = document.getElementById('wishlist-toggle');
    if (wishlistToggle) {
        wishlistToggle.addEventListener('click', function (e) {
            e.preventDefault();
            // Here you would typically open a wishlist modal or page
            alert(`You have ${wishlist.length} items in your wishlist`);
        });
    }

    // Add event listeners to product "Add to Wishlist" buttons
    // This would be implemented on product pages
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        button.addEventListener('click', function () {
            const product = {
                id: this.dataset.productId,
                name: this.dataset.productName,
                price: this.dataset.productPrice,
                image: this.dataset.productImage
            };
            addToWishlist(product);
        });
    });
});

// Enhanced navbar scroll effect
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});