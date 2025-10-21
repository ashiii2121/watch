// Load config and update images/videos
async function loadConfig() {
  const res = await fetch('/api/config');
  const config = await res.json();

  // Hero videos (index only)
  if (document.querySelector('.hero-carousel')) {
    const heroVideos = document.querySelectorAll('.hero .slide video');
    heroVideos.forEach((video, i) => {
      if (config.hero[i]) {
        const source = video.querySelector('source');
        if (source) {
          source.src = config.hero[i];
          video.load();
        }
      }
    });
  }

  // Featured images (index only)
  if (document.querySelector('.featured-carousel')) {
    const featuredImgs = document.querySelectorAll('.featured .product-card img');
    featuredImgs[0].src = config.featured.richard || 'img/richard.jpg';
    featuredImgs[1].src = config.featured.patek || 'img/pat.jpg';
    featuredImgs[2].src = config.featured.rolex || 'img/rolex.jpg';

    // Add error handling for featured images
    featuredImgs.forEach(img => {
      img.onerror = function () {
        this.onerror = null;
        this.src = 'https://placehold.co/600x400/1a1a1a/ffffff?text=Watch+Image';
      };
    });
  }

  // Categories images (index only, repeated)
  // Only update images in the static categories section, not in the dynamic products section
  if (document.querySelector('#categories .category-grid')) {
    const categorySection = document.querySelector('#categories .category-grid');
    const categoryImgs = categorySection.querySelectorAll('.category-item img');
    categoryImgs.forEach((img, i) => {
      if (i % 3 === 0) img.src = config.featured.richard || 'img/richard.jpg';
      else if (i % 3 === 1) img.src = config.featured.patek || 'img/pat.jpg';
      else img.src = config.featured.rolex || 'img/rolex.jpg';

      // Add error handling for category images
      img.onerror = function () {
        this.onerror = null;
        this.src = 'https://placehold.co/300x200/1a1a1a/ffffff?text=Category+Image';
      };
    });
  }

  // Subpage products (brand pages)
  if (document.querySelector('.product-grid')) {
    const brand = window.location.pathname.split('.')[0].split('/').pop(); // e.g., 'patek'
    const productImgs = document.querySelectorAll('.product-item img');
    productImgs.forEach((img, i) => {
      if (config.subpages[brand] && config.subpages[brand][i]) {
        img.src = config.subpages[brand][i];
      }

      // Add error handling for product images
      img.onerror = function () {
        this.onerror = null;
        this.src = 'https://placehold.co/300x200/1a1a1a/ffffff?text=Product+Image';
      };
    });
  }
}

loadConfig();

// Load products for category pages
async function loadCategoryProducts() {
  // Check if we're on a category page (has product-grid)
  const productGrid = document.querySelector('.product-grid');
  if (!productGrid) {
    return;
  }

  try {
    // Extract category from the page URL
    const pagePath = window.location.pathname;
    const pageName = pagePath.split('/').pop().replace('.html', '');

    // Map page names to category names
    const categoryMap = {
      'rolex': 'rolex',
      'patek-philippe': 'patek-philippe',
      'richard-mille': 'richard-mille'
    };

    const category = categoryMap[pageName];
    if (!category) {
      console.log('No category mapping found for page:', pageName);
      return;
    }

    // Fetch all products
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const allProducts = await response.json();

    // Filter products by category
    const categoryProducts = allProducts.filter(product => product.category === category);

    // Clear existing products
    productGrid.innerHTML = '';

    // Display category products
    if (categoryProducts.length === 0) {
      productGrid.innerHTML = '<p class="no-products">No products available in this category yet.</p>';
      return;
    }

    categoryProducts.forEach(product => {
      const productElement = createProductItemElement(product);
      productGrid.appendChild(productElement);
    });

    console.log(`Loaded ${categoryProducts.length} products for category: ${category}`);
  } catch (error) {
    console.error('Error loading category products:', error);
    if (productGrid) {
      productGrid.innerHTML = '<p class="error">Error loading products. Please try again later.</p>';
    }
  }
}

// Create product item element for category pages
function createProductItemElement(product) {
  const productDiv = document.createElement('div');
  productDiv.className = 'product-item';

  // Ensure price is a valid number
  const price = parseFloat(product.price);
  if (isNaN(price)) {
    product.price = 0;
  }

  // Create WhatsApp message with product details including image
  const productName = encodeURIComponent(product.name);
  const productPrice = parseFloat(product.price).toFixed(2);
  const productDescription = encodeURIComponent(product.description);
  const productImage = encodeURIComponent(product.image);

  // WhatsApp message template with image URL
  const whatsappMessage = encodeURIComponent(`Hi, I'm interested in this watch:\n\nProduct: ${product.name}\nPrice: $${productPrice}\nDescription: ${product.description}\n\nImage: ${product.image}\n\nCould you please provide more details?`);

  // WhatsApp link (replace with your actual WhatsApp number)
  const whatsappLink = `https://wa.me/9061649654?text=${whatsappMessage}`;

  productDiv.innerHTML = `
    <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='https://placehold.co/300x200/1a1a1a/ffffff?text=${encodeURIComponent(product.name)}';">
    <h3>${product.name}</h3>
    <p class="product-price">Price: $${parseFloat(product.price).toFixed(2)}</p>
    <a href="${whatsappLink}" class="btn" target="_blank">Enquire Now</a>
  `;

  return productDiv;
}

// Initialize category product loading
document.addEventListener('DOMContentLoaded', function () {
  // Load config first
  loadConfig().then(() => {
    // Then load category products
    loadCategoryProducts();
  });
});

// Hero Carousel
const heroSlides = document.querySelectorAll('.slide');
const heroPrev = document.querySelector('.carousel-prev');
const heroNext = document.querySelector('.carousel-next');
const heroDots = document.querySelectorAll('.dot');
let currentHeroSlide = 0;

function showHeroSlide(index) {
  heroSlides.forEach(slide => slide.classList.remove('active'));
  heroDots.forEach(dot => dot.classList.remove('active'));
  heroSlides[index].classList.add('active');
  heroDots[index].classList.add('active');
}

if (heroNext) heroNext.addEventListener('click', () => {
  currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
  showHeroSlide(currentHeroSlide);
});

if (heroPrev) heroPrev.addEventListener('click', () => {
  currentHeroSlide = (currentHeroSlide - 1 + heroSlides.length) % heroSlides.length;
  showHeroSlide(currentHeroSlide);
});

heroDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentHeroSlide = index;
    showHeroSlide(currentHeroSlide);
  });
});

// Auto-play hero
setInterval(() => {
  currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
  showHeroSlide(currentHeroSlide);
}, 5000);

// Featured Carousel
const fSlides = document.querySelectorAll('.carousel-slide');
const fPrev = document.querySelector('.f-carousel-prev');
const fNext = document.querySelector('.f-carousel-next');
let currentFSlide = 0;

function showFSlide(index) {
  fSlides.forEach(slide => slide.style.transform = `translateX(-${index * 100}%)`);
}

if (fNext) fNext.addEventListener('click', () => {
  currentFSlide = (currentFSlide + 1) % fSlides.length;
  showFSlide(currentFSlide);
});

if (fPrev) fPrev.addEventListener('click', () => {
  currentFSlide = (currentFSlide - 1 + fSlides.length) % fSlides.length;
  showFSlide(currentFSlide);
});

// Auto-play featured
setInterval(() => {
  currentFSlide = (currentFSlide + 1) % fSlides.length;
  showFSlide(currentFSlide);
}, 4000);

// Mobile menu
document.querySelector('.hamburger').addEventListener('click', () => {
  document.querySelector('.hamburger').classList.toggle('active');
  document.querySelector('.nav-links').classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.hamburger').classList.remove('active');
    document.querySelector('.nav-links').classList.remove('active');
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (event) => {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelector('.nav-links');
  const hamburger = document.querySelector('.hamburger');

  if (!navbar.contains(event.target) && navLinks.classList.contains('active')) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  }
});

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
});

document.querySelectorAll('.product-card, .category-item, .product-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});