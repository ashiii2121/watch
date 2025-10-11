// Load config and update images/videos
async function loadConfig() {
  const res = await fetch('/api/config');
  const config = await res.json();

  // Hero videos (index only)
  if (document.querySelector('.hero-carousel')) {
    const heroVideos = document.querySelectorAll('.hero .slide video source');
    heroVideos.forEach((source, i) => {
      if (config.hero[i]) {
        source.src = config.hero[i];
        source.parentElement.load();
      }
    });
  }

  // Featured images (index only)
  if (document.querySelector('.featured-carousel')) {
    const featuredImgs = document.querySelectorAll('.featured .product-card img');
    featuredImgs[0].src = config.featured.richard || 'img/richard.jpg';
    featuredImgs[1].src = config.featured.patek || 'img/pat.jpg';
    featuredImgs[2].src = config.featured.rolex || 'img/rolex.jpg';
  }

  // Categories images (index only, repeated)
  if (document.querySelector('.category-grid')) {
    const categoryImgs = document.querySelectorAll('.category-item img');
    categoryImgs.forEach((img, i) => {
      if (i % 3 === 0) img.src = config.featured.richard || 'img/richard.jpg';
      else if (i % 3 === 1) img.src = config.featured.patek || 'img/pat.jpg';
      else img.src = config.featured.rolex || 'img/rolex.jpg';
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
    });
  }
}
loadConfig();

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
  document.querySelector('.nav-links').classList.toggle('active');
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