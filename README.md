# 🎯 Luxury Replica Watches E-commerce Platform

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</p>

<p align="center">
  <img src="https://placehold.co/800x400/1a1a1a/ffffff?text=Luxury+Watch+Showcase" alt="Luxury Watch E-commerce Platform">
</p>

A sophisticated, full-featured e-commerce platform for luxury replica watches with dynamic product display, video-based hero carousel, and comprehensive admin dashboard. Built with modern web technologies for an exceptional user experience.

## ✨ Key Features

### 🛍️ Customer Experience

- **Dynamic Product Display**: Real-time product loading from backend API
- **Video Hero Carousel**: Auto-playing MP4 videos with smooth transitions
- **Category Pages**: Dedicated collections for Rolex, Patek Philippe, and Richard Mille
- **Responsive Design**: Mobile-first approach with elegant gold-themed UI
- **WhatsApp Integration**: Direct customer communication channel
- **Interactive Gallery**: Hover effects and 360° product views

### 🔧 Admin Dashboard

- **Full CRUD Operations**: Create, read, update, and delete products
- **Hero Section Management**: Upload and manage MP4 video slides
- **Secure Authentication**: Token-based admin access protection
- **File Upload System**: Supports both images and videos
- **Product Categorization**: Organize watches by brand and collection

### 🎨 Design & Performance

- **Luxury Aesthetics**: Gold-themed interface with smooth animations
- **Optimized Loading**: Static asset caching and resource optimization
- **Error Handling**: Comprehensive input validation across all APIs
- **Cross-Browser Compatibility**: Works seamlessly on all modern browsers

## 🚀 Technology Stack

### Frontend

- **HTML5** - Semantic markup and structure
- **CSS3** - Flexbox/Grid layout, animations, and responsive design
- **Vanilla JavaScript** - Dynamic interactions and DOM manipulation
- **Font Awesome** - Iconography
- **Google Fonts** - Playfair Display and Roboto typography

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **JSON Storage** - Lightweight data persistence
- **Multer** - File upload handling
- **Body-parser** - Request body parsing

## 📁 Project Structure

```
luxury-replica-watches/
├── backend/
│   ├── server.js          # Main server application
│   ├── admin.js           # Admin dashboard functionality
│   ├── config.json        # Site configuration
│   └── products.json      # Product data
├── frontend/
│   ├── index.html         # Main landing page
│   ├── style.css          # Styling
│   └── frontend.js        # Frontend JavaScript
├── img/                   # Static images
├── uploads/               # Uploaded files (videos/images)
├── package.json           # Node.js dependencies
└── vercel.json            # Vercel deployment configuration
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/luxury-replica-watches.git
   cd luxury-replica-watches
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   node backend/server.js
   ```

4. **Visit the application**
   Open your browser and navigate to `http://localhost:3000`

## 🔐 Admin Access

- **Login URL**: `/admin-login`
- **Credentials**:
  - Username: `admin`
  - Password: `admin123`

> **Note**: For security in production, change these default credentials.

## ☁️ Deployment

### Vercel Deployment

This application is optimized for deployment on Vercel with special handling for file uploads:

#### File Upload Handling

Vercel's serverless architecture presents challenges for traditional file uploads:

- Filesystems are ephemeral (files don't persist between deployments)
- Serverless functions may run on different instances

To address this, the application uses a hybrid approach:

- **Development/Local**: Files are stored in the `uploads/` directory
- **Vercel Production**: Files are converted to base64 data URLs and stored in JSON files

This approach ensures that uploaded images and videos work correctly on Vercel without requiring external storage services.

#### Configuration

The `vercel.json` file configures the deployment:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "backend/server.js"
    }
  ]
}
```

## 📡 API Endpoints

### Public Endpoints

- `GET /api/products` - Retrieve all products
- `GET /api/hero` - Retrieve hero section data
- `GET /api/config` - Retrieve site configuration

### Admin Endpoints (Require Authentication)

- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update existing product
- `DELETE /api/products/:id` - Delete product
- `POST /api/hero` - Add new hero slide
- `PUT /api/hero/:index` - Update hero slide
- `DELETE /api/hero/:index` - Delete hero slide
- `POST /api/upload` - Upload files (images/videos)

Authentication is done using Bearer token: `Bearer admin123`

## 🐛 Troubleshooting

### Images/Videos Not Showing on Vercel

If images or videos aren't displaying correctly after deployment to Vercel:

1. Ensure you're using the latest version of the code which converts uploaded files to data URLs
2. Check the browser console for any error messages
3. Verify that the admin dashboard is properly uploading files (they should appear as data URLs in the JSON storage)

### Local Development Issues

If you encounter issues during local development:

1. Make sure all dependencies are installed: `npm install`
2. Check that port 3000 is available
3. Verify that the `uploads/` directory has proper write permissions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For support or inquiries, please contact:

- **Email**: info@replicawatchesdubai.com
- **WhatsApp**: +971 50 123 4567

---

<p align="center">
  <strong>Experience the pinnacle of luxury watch e-commerce</strong>
  <br><br>
  <img src="https://placehold.co/600x300/1a1a1a/ffffff?text=Premium+Timepieces" alt="Premium Timepieces">
</p>
