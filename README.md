# Replica Watches - Luxury Watch E-Commerce Platform

![Replica Watches](https://placehold.co/800x200/1a1a1a/ffffff?text=Replica+Watches+Luxury+Collection)

A modern, responsive e-commerce website for luxury replica watches with a comprehensive admin dashboard for content management.

> **Repository**: https://github.com/ashiii2121/watch.git

## 🌟 Features

### Frontend

- **Responsive Design**: Works beautifully on all devices from mobile to desktop
- **Dynamic Product Display**: Products loaded dynamically from the backend
- **Interactive Hero Carousel**: Video-based hero section with auto-play functionality
- **Product Categories**: Organized luxury watch categories (Rolex, Patek Philippe, Richard Mille)
- **Contact Page**: Professional contact form with map integration
- **Modern UI**: Elegant gold-themed design with smooth animations and transitions

### Admin Dashboard

- **Product Management**:
  - Add, edit, and delete products
  - Upload product images or use external URLs
  - Organize by categories (Rolex, Patek Philippe, Richard Mille)
- **Hero Section Management**:
  - Add, edit, and delete hero slides
  - Upload MP4 video files for hero backgrounds
  - Customize slide content (titles, descriptions, buttons)
- **Dashboard Overview**:
  - Statistics for products and hero slides
  - Quick action buttons for content management
- **Secure Authentication**:
  - Admin login system
  - Protected API endpoints

### Technical Features

- **RESTful API**: Clean and organized backend API
- **File Uploads**: Support for both images and videos
- **JSON Data Storage**: Lightweight data persistence
- **Error Handling**: Comprehensive error handling and validation
- **Static File Serving**: Efficient static asset delivery

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd replica-watches
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
node server.js
```

4. Open your browser and navigate to:

```
http://localhost:3000
```

### Admin Access

To access the admin dashboard:

1. Navigate to: `http://localhost:3000/admin-login`
2. Login with credentials:
   - Username: `admin`
   - Password: `admin123`

## 🛠️ Project Structure

```
replica-watches/
├── rw/
│   ├── uploads/              # Uploaded images and videos
│   ├── img/                  # Static images
│   ├── index.html            # Main homepage
│   ├── admin.html            # Admin dashboard
│   ├── admin-login.html      # Admin login page
│   ├── contact.html          # Contact page
│   ├── rolex.html            # Rolex brand page
│   ├── patek-philippe.html   # Patek Philippe brand page
│   ├── richard-mille.html    # Richard Mille brand page
│   ├── server.js             # Backend server
│   ├── admin.js              # Admin dashboard frontend
│   ├── frontend.js           # Homepage frontend
│   ├── script.js             # Shared frontend scripts
│   ├── login.js              # Login page scripts
│   ├── style.css             # Main stylesheet
│   ├── products.json         # Product data
│   ├── config.json           # Site configuration
│   └── package.json          # Project dependencies
```

## 🎯 API Endpoints

### Public Endpoints

- `GET /api/products` - Retrieve all products
- `GET /api/hero` - Retrieve hero section data
- `GET /api/config` - Retrieve site configuration

### Admin Endpoints (Require Authentication)

- `POST /api/products` - Add new product
- `PUT /api/products/:id` - Update existing product
- `DELETE /api/products/:id` - Delete product
- `POST /api/hero` - Add new hero slide
- `PUT /api/hero/:index` - Update existing hero slide
- `DELETE /api/hero/:index` - Delete hero slide
- `POST /api/upload` - Upload files

## 🔐 Authentication

Admin endpoints require authentication using Bearer tokens:

```
Authorization: Bearer admin123
```

## 📁 Data Storage

- **Products**: Stored in `products.json`
- **Configuration**: Stored in `config.json`
- **Uploads**: Stored in `uploads/` directory

## 🎨 Design Elements

- **Color Scheme**: Elegant gold (#d4af37) with dark backgrounds
- **Typography**: Playfair Display for headings, Roboto for body text
- **Icons**: Font Awesome icons
- **Animations**: Smooth hover effects and transitions
- **Responsive Grid**: CSS Grid and Flexbox for layouts

## 📱 Responsive Features

- Mobile-first design approach
- Flexible grid layouts
- Touch-friendly navigation
- Adaptive images and videos
- Cross-device compatibility

## 🛡️ Security

- Protected admin endpoints
- File type validation for uploads
- Input sanitization
- Error handling for API requests

## 📈 Performance

- Static file caching
- Efficient JSON data handling
- Optimized CSS and JavaScript
- Lazy loading for images

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Placeholder images from placehold.co
- Unsplash for stock images

## 📞 Support

For support, email info@replicawatchesdubai.com or open an issue in the repository.

---

<p align="center">
  <strong>Replica Watches - Luxury Master Copies from Dubai</strong>
</p>

<p align="center">
  <a href="http://localhost:3000">🌐 Visit Website</a> •
  <a href="http://localhost:3000/admin-login">🔧 Admin Dashboard</a> •
  <a href="http://localhost:3000/contact.html">📧 Contact Us</a>
</p>
