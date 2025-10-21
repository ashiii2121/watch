// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Check if admin is logged in
    if (!localStorage.getItem('adminLoggedIn')) {
        window.location.href = 'admin-login.html';
        return;
    }

    // Initialize the dashboard
    initializeDashboard();

    // Set up event listeners
    setupEventListeners();

    // Load initial data
    loadDashboardStats();
    loadProducts();
    loadHeroSlides();
});

function initializeDashboard() {
    // Set active section based on URL hash
    const hash = window.location.hash;
    if (hash) {
        showSection(hash.substring(1));
    } else {
        showSection('dashboard');
    }
}

function setupEventListeners() {
    // Navigation links
    document.getElementById('dashboard-link').addEventListener('click', function (e) {
        e.preventDefault();
        showSection('dashboard');
    });

    document.getElementById('products-link').addEventListener('click', function (e) {
        e.preventDefault();
        showSection('products');
    });

    document.getElementById('hero-link').addEventListener('click', function (e) {
        e.preventDefault();
        showSection('hero');
    });

    document.getElementById('logout-link').addEventListener('click', function (e) {
        e.preventDefault();
        logout();
    });

    // Action buttons
    document.getElementById('add-product-btn').addEventListener('click', function () {
        openProductModal();
    });

    document.getElementById('add-new-product-btn').addEventListener('click', function () {
        openProductModal();
    });

    document.getElementById('add-hero-slide-btn').addEventListener('click', function () {
        openHeroModal();
    });

    document.getElementById('add-new-hero-btn').addEventListener('click', function () {
        openHeroModal();
    });

    // Modal close buttons
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            closeModal();
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function (event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                closeModal();
            }
        });
    });

    // Form submissions
    document.getElementById('product-form').addEventListener('submit', function (e) {
        e.preventDefault();
        saveProduct();
    });

    document.getElementById('hero-form').addEventListener('submit', function (e) {
        e.preventDefault();
        saveHeroSlide();
    });
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show the selected section
    document.getElementById(sectionId + '-section').classList.add('active');

    // Update active nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });

    const activeLink = document.getElementById(sectionId + '-link');
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Update URL hash
    window.location.hash = sectionId;
}

function logout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'admin-login.html';
}

// Dashboard functions
async function loadDashboardStats() {
    try {
        // Load products count
        const productsResponse = await fetch('/api/products');
        const products = await productsResponse.json();
        document.getElementById('total-products').textContent = products.length;

        // Load hero slides count
        const heroResponse = await fetch('/api/hero');
        const heroSlides = await heroResponse.json();
        document.getElementById('total-hero-slides').textContent = heroSlides.length;
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Product management functions
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();

        const productsList = document.getElementById('products-list');

        if (products.length === 0) {
            productsList.innerHTML = '<p class="no-products">No products found.</p>';
            return;
        }

        productsList.innerHTML = '';

        products.forEach(product => {
            const productCard = createProductCard(product);
            productsList.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('products-list').innerHTML = '<p class="error">Error loading products.</p>';
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card admin-card';
    card.innerHTML = `
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <p class="product-price">Price: $${parseFloat(product.price).toFixed(2)}</p>
        <p class="product-category">Category: ${product.category}</p>
        <div class="card-actions">
            <button class="btn edit-btn" data-id="${product.id}">Edit</button>
            <button class="btn delete-btn" data-id="${product.id}">Delete</button>
        </div>
    `;

    // Add event listeners for edit and delete buttons
    card.querySelector('.edit-btn').addEventListener('click', function () {
        editProduct(product);
    });

    card.querySelector('.delete-btn').addEventListener('click', function () {
        deleteProduct(product.id);
    });

    return card;
}

function openProductModal(product = null) {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('product-modal-title');
    const form = document.getElementById('product-form');

    // Reset form
    form.reset();

    if (product) {
        // Edit existing product
        title.textContent = 'Edit Product';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-image-url').value = product.image;

        // Clear file input
        document.getElementById('product-image').value = '';
    } else {
        // Add new product
        title.textContent = 'Add New Product';
        document.getElementById('product-id').value = '';

        // Clear file input
        document.getElementById('product-image').value = '';
        document.getElementById('product-image-url').value = '';
    }

    modal.style.display = 'block';
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

async function saveProduct() {
    try {
        const id = document.getElementById('product-id').value;
        const formData = new FormData();

        // Add text fields to form data
        formData.append('name', document.getElementById('product-name').value);
        formData.append('description', document.getElementById('product-description').value);
        formData.append('price', document.getElementById('product-price').value);
        formData.append('category', document.getElementById('product-category').value);

        // Check if an image file is selected
        const imageFile = document.getElementById('product-image').files[0];
        const imageUrl = document.getElementById('product-image-url').value;

        // If an image file is selected, use it; otherwise, use the URL
        if (imageFile) {
            formData.append('productImage', imageFile);
        } else if (imageUrl) {
            formData.append('image', imageUrl);
        } else {
            // If no image is provided, use a placeholder
            formData.append('image', 'https://placehold.co/300x200/1a1a1a/ffffff?text=Product+Image');
        }

        let response;
        if (id) {
            // Update existing product
            response = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer admin123'
                },
                body: formData
            });
        } else {
            // Add new product
            response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer admin123'
                },
                body: formData
            });
        }

        if (response.ok) {
            closeModal();
            loadProducts();
            loadDashboardStats();
        } else {
            const errorData = await response.json();
            alert('Error saving product: ' + (errorData.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Error saving product: ' + error.message);
    }
}

function editProduct(product) {
    openProductModal(product);
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadProducts();
            loadDashboardStats();
        } else {
            alert('Error deleting product');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
    }
}

// Hero section management functions
async function loadHeroSlides() {
    try {
        const response = await fetch('/api/hero');
        const heroSlides = await response.json();

        const heroSlidesList = document.getElementById('hero-slides-list');

        if (heroSlides.length === 0) {
            heroSlidesList.innerHTML = '<p class="no-products">No hero slides found.</p>';
            return;
        }

        heroSlidesList.innerHTML = '';

        heroSlides.forEach((slide, index) => {
            const slideCard = createHeroSlideCard(slide, index);
            heroSlidesList.appendChild(slideCard);
        });
    } catch (error) {
        console.error('Error loading hero slides:', error);
        document.getElementById('hero-slides-list').innerHTML = '<p class="error">Error loading hero slides.</p>';
    }
}

function createHeroSlideCard(slide, index) {
    const card = document.createElement('div');
    card.className = 'hero-slide-card admin-card';
    card.innerHTML = `
        <h3>Slide ${index + 1}</h3>
        <p class="slide-title"><strong>Title:</strong> ${slide.title || 'N/A'}</p>
        <p class="slide-text"><strong>Description:</strong> ${slide.text || 'N/A'}</p>
        <p class="slide-button"><strong>Button Text:</strong> ${slide.buttonText || 'N/A'}</p>
        <div class="card-actions">
            <button class="btn edit-btn" data-index="${index}">Edit</button>
            <button class="btn delete-btn" data-index="${index}">Delete</button>
        </div>
    `;

    // Add event listeners for edit and delete buttons
    card.querySelector('.edit-btn').addEventListener('click', function () {
        editHeroSlide(slide, index);
    });

    card.querySelector('.delete-btn').addEventListener('click', function () {
        deleteHeroSlide(index);
    });

    return card;
}

function openHeroModal(slide = null, index = null) {
    const modal = document.getElementById('hero-modal');
    const title = document.getElementById('hero-modal-title');
    const form = document.getElementById('hero-form');

    if (slide) {
        // Edit existing slide
        title.textContent = 'Edit Hero Slide';
        document.getElementById('hero-index').value = index;
        document.getElementById('hero-title').value = slide.title || '';
        document.getElementById('hero-text').value = slide.text || '';
        document.getElementById('hero-button-text').value = slide.buttonText || '';
    } else {
        // Add new slide
        title.textContent = 'Add New Hero Slide';
        form.reset();
        document.getElementById('hero-index').value = '';
    }

    modal.style.display = 'block';
}

async function saveHeroSlide() {
    try {
        const index = document.getElementById('hero-index').value;
        const heroData = {
            title: document.getElementById('hero-title').value,
            text: document.getElementById('hero-text').value,
            buttonText: document.getElementById('hero-button-text').value
        };

        // Check if a video file is selected
        const videoFile = document.getElementById('hero-video').files[0];

        if (videoFile) {
            // Handle file upload
            const formData = new FormData();
            formData.append('file', videoFile);
            formData.append('section', 'hero');
            formData.append('heroTitle', heroData.title);
            formData.append('heroText', heroData.text);
            formData.append('heroButtonText', heroData.buttonText);

            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer admin123'
                },
                body: formData
            });

            if (response.ok) {
                closeModal();
                loadHeroSlides();
                loadDashboardStats();
            } else {
                alert('Error uploading video');
            }
        } else if (index !== '') {
            // Update existing slide without changing video
            const response = await fetch(`/api/hero/${index}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(heroData)
            });

            if (response.ok) {
                closeModal();
                loadHeroSlides();
                loadDashboardStats();
            } else {
                alert('Error saving hero slide');
            }
        } else {
            alert('Please select a video file for new hero slides');
        }
    } catch (error) {
        console.error('Error saving hero slide:', error);
        alert('Error saving hero slide');
    }
}

function editHeroSlide(slide, index) {
    openHeroModal(slide, index);
}

async function deleteHeroSlide(index) {
    if (!confirm('Are you sure you want to delete this hero slide?')) {
        return;
    }

    try {
        const response = await fetch(`/api/hero/${index}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadHeroSlides();
            loadDashboardStats();
        } else {
            alert('Error deleting hero slide');
        }
    } catch (error) {
        console.error('Error deleting hero slide:', error);
        alert('Error deleting hero slide');
    }
}