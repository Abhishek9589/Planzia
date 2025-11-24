# Planzia

> Simplified & humanized event venue booking platform

Planzia is a modern web application that streamlines the process of discovering, booking, and managing event venues. Built with cutting-edge technologies, it provides a seamless experience for both venue owners and event planners.

## 🌟 Features

- **Venue Discovery**: Browse and filter event venues by location, capacity, amenities, and price
- **Smart Booking System**: Real-time availability checking and instant booking confirmation
- **Payment Integration**: Secure payments via Razorpay with multiple payment methods
- **User Authentication**: Google OAuth 2.0 and email-based authentication
- **Favorites Management**: Save favorite venues for quick access
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Notifications**: Email notifications for booking confirmations and updates
- **Image Management**: Cloudinary integration for optimized image handling
- **Scalable Architecture**: Built to handle high traffic and concurrent users

## 🚀 Tech Stack

### Frontend
- **React 18.3** - UI library
- **Vite 6.2** - Build tool and dev server
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI component library
- **TanStack Query** - Server state management
- **Framer Motion** - Animation library
- **React Hook Form** - Form state management

### Backend
- **Node.js** - JavaScript runtime
- **Express 4.18** - Web framework
- **MongoDB 8.8** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Token authentication
- **Nodemailer** - Email service
- **Passport.js** - Authentication middleware

### Infrastructure & Services
- **AWS** - Frontend and backend hosting
- **Cloudinary** - Image storage and optimization
- **Google OAuth 2.0** - Social authentication
- **Razorpay** - Payment processing
- **MongoDB Atlas** - Cloud database hosting

## 📋 Prerequisites

- Node.js >= 16.0.0
- npm or yarn package manager
- MongoDB connection string (local or Atlas)
- Cloudinary account credentials
- Razorpay API keys
- Google OAuth 2.0 credentials (optional)

## 🔧 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd planzia
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:
```env
# Server Configuration
API_PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Service
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_email_password
SENDER_EMAIL=noreply@planzia.com

# Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Image Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create a `server/.env` file with server-specific configurations:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
# ... other server-specific variables
```

## 🚀 Getting Started

### Development

Run the development server with hot-reload:
```bash
npm run dev
```

This starts:
- Vite dev server on `http://localhost:5173`
- Express API server on `http://localhost:5001`

### Build

Build for production:
```bash
npm run build
```

This creates:
- Client build in `dist/spa`
- Server build in `dist/server`

### Start Production Build

```bash
npm start
```

## 📁 Project Structure

```
planzia/
├── client/                 # Frontend React application
│   ├── components/        # Reusable React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API client services
│   ├── contexts/         # React context providers
│   ├── lib/              # Utility functions
│   ├── public/           # Static assets
│   ├── App.jsx          # Root App component
│   └── index.html       # HTML entry point
├── server/                # Backend Node.js application
│   ├── routes/          # API routes
│   ├── models/          # MongoDB models
│   ├── middleware/      # Express middleware
│   ├── services/        # Business logic services
│   ├── config/          # Configuration files
│   ├── utils/           # Utility functions
│   ├── index.js        # Server entry point
│   └── dev-server.js   # Development server
├── package.json         # Project dependencies
├── vite.config.js      # Vite client configuration
└── vite.config.server.js # Vite server configuration
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/google` - Google OAuth callback

### Venues
- `GET /api/venues` - List all venues
- `GET /api/venues/:id` - Get venue details
- `POST /api/venues` - Create new venue (admin)
- `PUT /api/venues/:id` - Update venue (admin)
- `DELETE /api/venues/:id` - Delete venue (admin)

### Bookings
- `GET /api/bookings` - List user bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Favorites
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites/:venueId` - Add to favorites
- `DELETE /api/favorites/:venueId` - Remove from favorites

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Anurag Yadav** - CEO & Full Stack Developer
- **Abhishek Kushwaha** - CTO & Full Stack Developer

## 📧 Support

For support, email support@planzia.com or open an issue in the repository.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Video venue tours
- [ ] AI-powered venue recommendations
- [ ] Vendor marketplace integration
- [ ] Invoice and contract generation

---

**Built with ❤️ by Planzia Team**
