// Frontend JavaScript for displaying products

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing product loading...');
    loadProducts();

    // Initialize hero carousel
    initHeroCarousel();
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

    productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}" onerror="console.error('Image failed to load:', '${product.image}'); this.onerror=null;this.src='https://placehold.co/300x200/1a1a1a/ffffff?text=${encodeURIComponent(product.name)}';">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="product-price">Price: $${parseFloat(product.price).toFixed(2)}</p>
        <a href="#" class="btn">View Details</a>
    `;

    return productDiv;
}