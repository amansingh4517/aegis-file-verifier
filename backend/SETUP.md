# AEGIS Backend - Quick Setup Guide

## ✅ Setup Completed!

Your backend has been created with the following structure:

```
backend/
├── src/
│   ├── config/          # Database & Multer configuration
│   ├── controllers/     # Business logic (auth, verification)
│   ├── middleware/      # Auth & error handling
│   ├── models/          # MongoDB models (User, FileVerification)
│   ├── routes/          # API routes
│   ├── services/        # Gemini AI integration
│   ├── utils/           # JWT & logging utilities
│   └── server.js        # Main entry point
├── .env                 # Environment variables (configured)
├── .env.example         # Environment template
├── package.json         # Dependencies
└── README.md            # Full documentation
```

## 🚀 Next Steps

### 1. Get Gemini API Key
Visit: https://makersuite.google.com/app/apikey
- Create a new API key
- Copy it to `.env` file as `GEMINI_API_KEY`

### 2. Install & Start MongoDB
```powershell
# Option A: Local MongoDB
# Download from: https://www.mongodb.com/try/download/community
# Then run:
mongod

# Option B: MongoDB Atlas (Cloud)
# Sign up at: https://www.mongodb.com/cloud/atlas
# Get connection string and update MONGODB_URI in .env
```

### 3. Start the Backend Server
```powershell
# Navigate to backend
cd backend

# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

### 4. Test the API

**Health Check:**
```powershell
curl http://localhost:5000/health
```

**Sign Up:**
```powershell
curl -X POST http://localhost:5000/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

## 📋 Environment Variables Checklist

- [x] NODE_ENV (set to 'development')
- [x] PORT (set to 5000)
- [x] JWT_SECRET (configured - CHANGE IN PRODUCTION!)
- [ ] MONGODB_URI (update if using Atlas)
- [ ] GEMINI_API_KEY (⚠️ REQUIRED - get from Google AI Studio)
- [x] CORS_ORIGIN (set to http://localhost:3000)

## 🔌 API Endpoints

### Authentication
- POST `/api/auth/signup` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user (requires token)
- PUT `/api/auth/profile` - Update profile (requires token)

### File Verification
- POST `/api/verify/upload` - Upload & verify file (requires token)
- GET `/api/verify/history` - Get verification history (requires token)
- GET `/api/verify/stats` - Get user statistics (requires token)
- GET `/api/verify/:id` - Get single verification (requires token)
- DELETE `/api/verify/:id` - Delete verification (requires token)
- GET `/api/verify/:id/report` - Get detailed report (requires token)

### Health
- GET `/health` - Server health check

## 🔐 Features Implemented

✅ User authentication (signup/login) with JWT
✅ Password hashing with bcrypt
✅ File upload with Multer (images, videos, documents, audio)
✅ Google Gemini AI integration for file verification
✅ Deepfake detection & document validation
✅ Verification history & statistics
✅ Detailed AI-generated reports
✅ Rate limiting & security (helmet, CORS)
✅ Error handling & logging (Winston)
✅ MongoDB models with validation

## 📱 Connect to Frontend

The backend is configured to accept requests from:
- Frontend URL: `http://localhost:3000`

Make sure your frontend makes API calls to:
- Backend URL: `http://localhost:5000/api`

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `mongod`
- Or update MONGODB_URI for Atlas connection

**Gemini API Error:**
- Add valid API key to `.env`
- Check quota at: https://makersuite.google.com/

**Port Already in Use:**
- Change PORT in `.env` file
- Or kill the process using port 5000

## 📚 Full Documentation

See `README.md` for complete API documentation, examples, and deployment guide.

## 🎉 Ready to Test!

Your AEGIS backend is fully configured and ready to run. Just add your Gemini API key and start MongoDB!
