# AEGIS File Verifier - Backend API

Backend API for the AEGIS File Verification System. Built with Express.js, MongoDB, and Google Gemini AI for advanced file authenticity verification, deepfake detection, and document validation.

## 🚀 Features

- **User Authentication**: Secure signup/login with JWT tokens and bcrypt password hashing
- **File Upload**: Support for images, videos, documents, and audio files
- **AI-Powered Verification**: Integration with Google Gemini AI for:
  - Deepfake detection
  - Document authenticity validation
  - Metadata analysis
  - Pixel-level anomaly detection
  - Content manipulation detection
- **Verification History**: Track and manage all file verifications
- **Detailed Reports**: Generate comprehensive verification reports
- **Statistics & Analytics**: User verification statistics and insights
- **Security**: Rate limiting, CORS, helmet, input validation
- **Logging**: Comprehensive logging with Winston

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- Google Gemini API key

## 🛠️ Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** in `.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   
   # MongoDB connection string
   MONGODB_URI=mongodb://localhost:27017/aegis-file-verifier
   
   # JWT Secret (generate a strong random string)
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRE=7d
   
   # Google Gemini API Key
   GEMINI_API_KEY=your-gemini-api-key-here
   
   # File Upload Configuration
   MAX_FILE_SIZE=10485760  # 10MB in bytes
   UPLOAD_DIR=uploads
   
   # CORS
   CORS_ORIGIN=http://localhost:3000
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000      # 15 minutes
   RATE_LIMIT_MAX_REQUESTS=100
   ```

5. **Get a Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file

6. **Start MongoDB**:
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI with your Atlas connection string
   ```

7. **Run the server**:
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### 3. Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### 4. Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.new@example.com"
}
```

### Verification Endpoints

#### 1. Upload and Verify File
```http
POST /api/verify/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary file>
quickScanOnly: false  # optional, set to "true" for quick scan
```

**Response:**
```json
{
  "success": true,
  "message": "File verified successfully",
  "data": {
    "verification": {
      "id": "...",
      "fileName": "image.jpg",
      "fileType": ".jpg",
      "fileSize": 1024000,
      "status": "completed",
      "result": {
        "isAuthentic": true,
        "confidenceScore": 85,
        "riskLevel": "low",
        "detectedIssues": [],
        "analysis": "File appears authentic...",
        "recommendations": ["No immediate action required"],
        "metadata": {}
      },
      "processingTime": 3500,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### 2. Get Verification History
```http
GET /api/verify/history?page=1&limit=10&status=completed&riskLevel=high
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (pending, processing, completed, failed)
- `riskLevel` (optional): Filter by risk level (low, medium, high, critical)

#### 3. Get Single Verification
```http
GET /api/verify/:id
Authorization: Bearer <token>
```

#### 4. Delete Verification
```http
DELETE /api/verify/:id
Authorization: Bearer <token>
```

#### 5. Get Statistics
```http
GET /api/verify/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total": 100,
      "completed": 95,
      "failed": 5,
      "riskLevels": {
        "low": 60,
        "medium": 25,
        "high": 8,
        "critical": 2
      }
    },
    "recentActivity": [...]
  }
}
```

#### 6. Get Detailed Report
```http
GET /api/verify/:id/report
Authorization: Bearer <token>
```

Returns a comprehensive markdown report generated by Gemini AI.

### Health Check
```http
GET /health
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: 
  - General: 100 requests per 15 minutes
  - Auth: 5 requests per 15 minutes
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Input Validation**: express-validator for request validation
- **File Upload Security**: File type and size validation

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js       # MongoDB connection
│   │   └── multer.js          # File upload configuration
│   ├── controllers/
│   │   ├── authController.js      # Auth logic
│   │   └── verificationController.js  # Verification logic
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   └── errorHandler.js   # Error handling
│   ├── models/
│   │   ├── User.js            # User model
│   │   └── FileVerification.js  # Verification model
│   ├── routes/
│   │   ├── authRoutes.js      # Auth routes
│   │   └── verificationRoutes.js  # Verification routes
│   ├── services/
│   │   └── geminiService.js   # Gemini AI integration
│   ├── utils/
│   │   ├── jwt.js             # JWT utilities
│   │   └── logger.js          # Winston logger
│   └── server.js              # App entry point
├── uploads/                   # Uploaded files (gitignored)
├── logs/                      # Application logs (gitignored)
├── .env                       # Environment variables (gitignored)
├── .env.example               # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🧪 Supported File Types

- **Images**: JPEG, PNG, GIF, WebP, SVG
- **Videos**: MP4, MPEG, MOV, AVI, WebM
- **Documents**: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
- **Text**: TXT, CSV
- **Audio**: MP3, WAV, OGG

## 📊 Database Models

### User Model
- name, email, password (hashed)
- role (user/admin)
- verificationCount
- lastLogin
- timestamps

### FileVerification Model
- user (ref to User)
- fileName, originalName, fileSize, fileType, mimeType, filePath
- status (pending, processing, completed, failed)
- verificationResult (isAuthentic, confidenceScore, riskLevel, detectedIssues, analysis, recommendations, metadata)
- geminiResponse (raw AI response)
- processingTime
- timestamps

## 🔧 Development

```bash
# Install nodemon for auto-reload
npm install -D nodemon

# Run in development mode
npm run dev

# Check for errors
npm run lint  # (add eslint if needed)
```

## 🚀 Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Configure MongoDB Atlas or production database
4. Set appropriate CORS origins
5. Configure file upload limits based on server capacity
6. Set up monitoring and logging
7. Use PM2 or similar process manager:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name aegis-backend
   ```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access (for MongoDB Atlas)

### Gemini API Errors
- Verify API key is correct
- Check API quota/limits
- Ensure proper file format for analysis

### File Upload Issues
- Check file size limits
- Verify file type is supported
- Ensure uploads directory has write permissions

## 📝 License

MIT License

## 👥 Contributing

Contributions are welcome! Please follow the existing code style and add tests for new features.

## 📧 Support

For issues and questions, please open an issue on GitHub.
