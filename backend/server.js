const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Serve static files FIRST, before any middleware
// Updated to serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '..', 'frontend')));
// Serve img directory
app.use('/img', express.static(path.join(__dirname, '..', 'img')));
// Serve uploads directory for videos
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Simple authentication middleware
const authenticateAdmin = (req, res, next) => {
  // In a real application, you would check a session or JWT token
  // For this demo, we'll use a simple check
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader === 'Bearer admin123') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

const configPath = path.join(__dirname, 'config.json');
if (!fs.existsSync(configPath)) {
  fs.writeJsonSync(configPath, { /* your initial config here */ });
}

// Product data path
const productsPath = path.join(__dirname, 'products.json');
if (!fs.existsSync(productsPath)) {
  fs.writeJsonSync(productsPath, []);
}

// Configure multer for different file types
// For Vercel deployment, we'll store files in memory instead of disk
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // For hero section uploads, we check the referer or accept both types
    // since we can't reliably access req.body.section in the fileFilter
    const referer = req.get('Referer') || '';
    const isHeroUpload = referer.includes('/admin') || req.path === '/api/upload';

    // Accept videos for hero section and images for other sections
    // We'll do more specific validation after the upload completes
    if (file.mimetype.startsWith('video/')) {
      cb(null, true); // Accept all videos
    } else if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Accept all images
    } else {
      cb(new Error('Only video and image files are accepted'), false);
    }
  }
});

// API routes
app.get('/api/config', (req, res) => {
  const config = fs.readJsonSync(configPath);
  res.json(config);
});

// Updated upload endpoint to handle different sections
// For Vercel deployment, we'll return a data URL instead of file path
app.post('/api/upload', authenticateAdmin, upload.single('file'), (req, res) => {
  const { section, subpage, index } = req.body;
  const config = fs.readJsonSync(configPath);

  // Validate file type based on section
  if (section === 'hero' && !req.file.mimetype.startsWith('video/')) {
    return res.status(400).json({ success: false, message: 'Hero section only accepts video files' });
  } else if (section !== 'hero' && !req.file.mimetype.startsWith('image/')) {
    return res.status(400).json({ success: false, message: 'Non-hero sections only accept image files' });
  }

  // Convert file to base64 data URL for client-side storage
  const fileData = req.file.buffer.toString('base64');
  const dataUrl = `data:${req.file.mimetype};base64,${fileData}`;

  if (section === 'hero') {
    // For hero section, we store the video data URL
    if (!config.hero) {
      config.hero = [];
    }
    config.hero[parseInt(index)] = dataUrl;
  } else if (section === 'featured') {
    if (!config.featured) {
      config.featured = {};
    }
    config.featured[subpage] = dataUrl;
  } else if (section === 'subpages') {
    if (!config.subpages) {
      config.subpages = {};
    }
    if (!config.subpages[subpage]) {
      config.subpages[subpage] = [];
    }
    config.subpages[subpage][parseInt(index)] = dataUrl;
  }

  fs.writeJsonSync(configPath, config);
  res.json({ success: true, message: 'File uploaded!', path: dataUrl });
});

// Product API endpoints
app.get('/api/products', (req, res) => {
  try {
    const products = fs.readJsonSync(productsPath);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

app.post('/api/products', authenticateAdmin, upload.single('productImage'), (req, res) => {
  try {
    const products = fs.readJsonSync(productsPath);

    // Determine image path - either uploaded file or provided URL
    let imagePath = req.body.image;
    if (req.file) {
      // Convert file to base64 data URL for client-side storage
      const fileData = req.file.buffer.toString('base64');
      imagePath = `data:${req.file.mimetype};base64,${fileData}`;
    }

    const newProduct = {
      id: Date.now().toString(),
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      image: imagePath,
      dateAdded: new Date().toISOString()
    };

    products.push(newProduct);
    fs.writeJsonSync(productsPath, products);
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.put('/api/products/:id', authenticateAdmin, upload.single('productImage'), (req, res) => {
  try {
    const products = fs.readJsonSync(productsPath);
    const productIndex = products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Determine image path - either uploaded file or provided URL
    let imagePath = req.body.image;
    if (req.file) {
      // Convert file to base64 data URL for client-side storage
      const fileData = req.file.buffer.toString('base64');
      imagePath = `data:${req.file.mimetype};base64,${fileData}`;
    }

    products[productIndex] = {
      ...products[productIndex],
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      image: imagePath
    };

    fs.writeJsonSync(productsPath, products);
    res.json(products[productIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', authenticateAdmin, (req, res) => {
  try {
    const products = fs.readJsonSync(productsPath);
    const filteredProducts = products.filter(p => p.id !== req.params.id);
    fs.writeJsonSync(productsPath, filteredProducts);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Hero section management endpoints
app.get('/api/hero', (req, res) => {
  try {
    const config = fs.readJsonSync(configPath);
    res.json(config.hero || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve hero data' });
  }
});

// Fixed the multer configuration for hero section
app.post('/api/hero', authenticateAdmin, upload.single('heroVideo'), (req, res) => {
  try {
    const config = fs.readJsonSync(configPath);

    // Create hero array if it doesn't exist
    if (!config.hero) {
      config.hero = [];
    }

    let videoUrl = '';
    // Handle file upload if present
    if (req.file) {
      // Convert file to base64 data URL for client-side storage
      const fileData = req.file.buffer.toString('base64');
      videoUrl = `data:${req.file.mimetype};base64,${fileData}`;
    }

    // Add new hero slide data
    const newSlide = {
      video: videoUrl || 'uploads/hero1.mp4', // Default video if none provided
      title: req.body.heroTitle || 'Default Title',
      text: req.body.heroText || 'Default Description',
      buttonText: req.body.heroButtonText || 'Shop Now'
    };

    config.hero.push(newSlide);
    fs.writeJsonSync(configPath, config);

    res.json({ success: true, message: 'Hero slide added successfully', slide: newSlide });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add hero slide' });
  }
});

app.put('/api/hero/:index', authenticateAdmin, (req, res) => {
  try {
    const config = fs.readJsonSync(configPath);
    const index = parseInt(req.params.index);

    if (!config.hero || index >= config.hero.length) {
      return res.status(404).json({ error: 'Hero slide not found' });
    }

    // Update hero slide data
    config.hero[index] = {
      ...config.hero[index],
      ...req.body
    };

    fs.writeJsonSync(configPath, config);
    res.json({ success: true, message: 'Hero slide updated successfully', slide: config.hero[index] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update hero slide' });
  }
});

app.delete('/api/hero/:index', authenticateAdmin, (req, res) => {
  try {
    const config = fs.readJsonSync(configPath);
    const index = parseInt(req.params.index);

    if (!config.hero || index >= config.hero.length) {
      return res.status(404).json({ error: 'Hero slide not found' });
    }

    // Remove hero slide
    config.hero.splice(index, 1);
    fs.writeJsonSync(configPath, config);

    res.json({ success: true, message: 'Hero slide deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete hero slide' });
  }
});

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  // Simple authentication (in a real app, this would check against a database)
  if (username === 'admin' && password === 'admin123') {
    res.json({
      success: true,
      token: 'admin123',
      message: 'Login successful'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Main page route
// Updated to serve index.html from the frontend directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Admin dashboard route
// Updated to serve admin.html from the frontend directory
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'admin.html'));
});

// Admin login page route
// Updated to serve admin-login.html from the frontend directory
app.get('/admin-login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'admin-login.html'));
});

// Updated login page route - now redirects to admin login
app.get('/login', (req, res) => {
  res.redirect('/admin-login');
});

app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});