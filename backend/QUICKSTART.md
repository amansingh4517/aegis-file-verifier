# 🚀 AEGIS Backend - Quick Start Commands

## Prerequisites Check
```powershell
# Check Node.js version (need v18+)
node --version

# Check npm
npm --version

# Check if MongoDB is installed
mongod --version
```

## Initial Setup (One-time)

```powershell
# 1. Navigate to backend
cd d:\Coding\Web\aegis-file-verifier\backend

# 2. Dependencies are already installed!
# If you need to reinstall:
# npm install

# 3. Configure .env file
# - Open .env in editor
# - Add your Gemini API key from: https://makersuite.google.com/app/apikey
# - Update MONGODB_URI if using MongoDB Atlas

# 4. Start MongoDB (if using local)
mongod
```

## Run the Server

```powershell
# Development mode (auto-reload on changes)
npm run dev

# Production mode
npm start
```

## Test the API

```powershell
# Health check
curl http://localhost:5000/health

# Sign up a test user
curl -X POST http://localhost:5000/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"test123\"}'

# Login (save the token from response)
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"test123\"}'
```

## Common Commands

```powershell
# Stop the server
# Press Ctrl+C in terminal

# View logs
Get-Content logs\combined.log -Tail 50

# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process on port 5000 (if needed)
# Get PID from above command, then:
taskkill /PID <PID> /F
```

## MongoDB Commands

```powershell
# Start MongoDB
mongod

# Connect to MongoDB shell
mongosh

# In mongosh:
use aegis-file-verifier
show collections
db.users.find()
db.fileverifications.find()
```

## Postman Testing

```
1. Open Postman
2. Import > Upload Files
3. Select: postman_collection.json
4. Set environment variable:
   - baseUrl = http://localhost:5000
   - token = (get from login response)
5. Test all endpoints!
```

## Frontend Connection

```javascript
// In your frontend .env or config:
NEXT_PUBLIC_API_URL=http://localhost:5000/api

// Example API call:
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

## Environment Variables Checklist

Before starting the server, ensure these are set in `.env`:

- [x] NODE_ENV=development
- [x] PORT=5000
- [x] JWT_SECRET=<your-secret>
- [ ] MONGODB_URI=<your-mongo-uri>  ⚠️ UPDATE IF USING ATLAS
- [ ] GEMINI_API_KEY=<your-key>     ⚠️ REQUIRED!
- [x] CORS_ORIGIN=http://localhost:3000

## Troubleshooting

**Error: Cannot connect to MongoDB**
```powershell
# Start MongoDB
mongod

# OR use MongoDB Atlas and update MONGODB_URI in .env
```

**Error: Gemini API key invalid**
```
1. Get key from: https://makersuite.google.com/app/apikey
2. Update GEMINI_API_KEY in .env
3. Restart server
```

**Error: Port 5000 already in use**
```powershell
# Option 1: Change port in .env
PORT=5001

# Option 2: Kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

## File Upload Testing

```powershell
# Using curl with file upload:
curl -X POST http://localhost:5000/api/verify/upload `
  -H "Authorization: Bearer <your-token>" `
  -F "file=@C:\path\to\your\image.jpg" `
  -F "quickScanOnly=false"
```

## Project Structure

```
backend/
├── src/              # Source code
├── uploads/          # Uploaded files (auto-created)
├── logs/             # Application logs (auto-created)
├── .env              # Your config (DO NOT COMMIT)
├── package.json      # Dependencies
└── README.md         # Full documentation
```

## Next Steps

1. ✅ Backend is fully set up
2. ⚠️ Add Gemini API key to `.env`
3. ⚠️ Start MongoDB
4. ✅ Run `npm run dev`
5. ✅ Test with Postman or curl
6. 🔗 Connect your frontend to `http://localhost:5000/api`

## Support

- Full docs: `README.md`
- Setup guide: `SETUP.md`
- Implementation details: `IMPLEMENTATION.md`
- Postman collection: `postman_collection.json`

---

**Your backend is ready! Just add the Gemini API key and start coding! 🎉**
