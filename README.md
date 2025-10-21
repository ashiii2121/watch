# Luxury Replica Watches E-commerce Platform

A sophisticated e-commerce platform for luxury replica watches with dynamic product display, video-based hero carousel, and comprehensive admin dashboard.

## Features

- **Dynamic Product Display**: Products loaded from backend API with real-time updates
- **Video Hero Carousel**: Auto-playing MP4 videos in the hero section with smooth transitions
- **Category Pages**: Dedicated pages for Rolex, Patek Philippe, and Richard Mille collections
- **Admin Dashboard**: Full CRUD operations for products and hero section management
- **Responsive Design**: Mobile-first approach with elegant gold-themed UI
- **Contact Integration**: WhatsApp integration for customer inquiries

## Technology Stack

- **Frontend**: HTML5, CSS3 (Flexbox/Grid), Vanilla JavaScript, Font Awesome, Google Fonts
- **Backend**: Node.js with Express framework
- **Storage**: JSON-based data storage with file upload capabilities
- **Authentication**: Token-based admin authentication

## Directory Structure

```
├── backend/           # Server-side code and data
│   ├── server.js      # Main server application
│   ├── admin.js       # Admin dashboard functionality
│   ├── config.json    # Site configuration
│   └── products.json  # Product data
├── frontend/          # Client-side code
│   ├── index.html     # Main page
│   ├── style.css      # Stylesheet
│   └── frontend.js    # Frontend JavaScript
├── img/               # Static images
├── uploads/           # Uploaded files (videos/images)
├── package.json       # Node.js dependencies
└── vercel.json        # Vercel deployment configuration
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node backend/server.js
   ```
4. Visit `http://localhost:3000`

## Admin Access

- **Login URL**: `/admin-login`
- **Credentials**:
  - Username: `admin`
  - Password: `admin123`

## Vercel Deployment

This application is configured for deployment on Vercel with the following considerations:

### File Upload Handling

Vercel's serverless architecture presents challenges for traditional file uploads because:

1. Filesystems are ephemeral (files don't persist between deployments)
2. Serverless functions may run on different instances

To address this, the application uses a hybrid approach:

- **Development/Local**: Files are stored in the `uploads/` directory
- **Vercel Production**: Files are converted to base64 data URLs and stored in JSON files

This approach ensures that uploaded images and videos work correctly on Vercel without requiring external storage services.

### Configuration

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

## API Endpoints

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

## Development

To run the development server:

```bash
node backend/server.js
```

The server will start on port 3000. Visit `http://localhost:3000` to view the application.

## Troubleshooting

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

## License

This project is licensed under the MIT License.
