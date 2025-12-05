# Quick Setup Guide - Profile Settings

## 🚀 Quick Start

### Step 1: Install Backend Dependencies
```bash
cd backend
pip install pillow==10.4.0
```

### Step 2: Update Database
Choose one option:

**Option A: Using Alembic (Recommended)**
```bash
alembic upgrade head
```

**Option B: Manual SQL**

For SQLite:
```bash
sqlite3 saaskit.db
```
```sql
ALTER TABLE users ADD COLUMN bio TEXT;
ALTER TABLE users ADD COLUMN profile_picture TEXT;
ALTER TABLE users ADD COLUMN phone TEXT;
.exit
```

For PostgreSQL:
```sql
ALTER TABLE users ADD COLUMN bio VARCHAR;
ALTER TABLE users ADD COLUMN profile_picture VARCHAR;
ALTER TABLE users ADD COLUMN phone VARCHAR;
```

### Step 3: Start Backend
```bash
cd backend
uvicorn app.main:app --reload
```

### Step 4: Start Frontend
```bash
cd frontend
npm run dev
```

### Step 5: Test the Feature
1. Open browser: `http://localhost:3000`
2. Login/Register
3. Go to: `Dashboard → Settings → Profile`
4. Upload profile picture and update information

## ✅ What Was Implemented

### Backend
- ✅ Profile picture upload/delete endpoints
- ✅ Personal info update endpoint
- ✅ Image validation & optimization
- ✅ Secure file storage
- ✅ Static file serving

### Frontend
- ✅ Interactive settings page
- ✅ Profile picture upload with preview
- ✅ Personal info form (name, bio, phone)
- ✅ Real-time validation
- ✅ Loading states & error handling
- ✅ Toast notifications

### Database
- ✅ Bio field (max 500 chars)
- ✅ Profile picture field (stores path)
- ✅ Phone number field

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/me` | Get user profile |
| PUT | `/api/v1/users/me` | Update profile info |
| POST | `/api/v1/users/me/profile-picture` | Upload image |
| DELETE | `/api/v1/users/me/profile-picture` | Delete image |

## 🎨 Frontend Page

**Location:** `/dashboard/settings`

**Features:**
- Profile picture management (upload, preview, delete)
- Personal information (full name, phone, bio)
- Organization settings (company name)
- Security settings
- Notifications preferences

## 🔒 Security Features

- File type validation (only images)
- File size limit (2MB max)
- Image verification (not just extension check)
- Secure file naming (UUID-based)
- Old image cleanup
- Authentication required

## 📁 Files Modified/Created

### Backend
- ✅ `backend/app/models/user.py` - Added profile fields
- ✅ `backend/app/schemas/user.py` - Added ProfileUpdate schema
- ✅ `backend/app/api/endpoints/users.py` - Implemented endpoints
- ✅ `backend/app/core/upload.py` - NEW: Upload utilities
- ✅ `backend/app/main.py` - Added static file serving
- ✅ `backend/requirements.txt` - Added Pillow

### Frontend
- ✅ `frontend/app/dashboard/settings/page.tsx` - Complete rewrite with API integration

### Documentation
- ✅ `docs/profile-settings-guide.md` - Complete documentation
- ✅ `setup_profile_features.md` - This file

### Database
- ✅ `backend/alembic/versions/add_profile_fields.py` - Migration script

## 🧪 Testing

### Test Profile Picture Upload
```bash
# Get auth token first (login)
TOKEN="your_access_token_here"

# Upload image
curl -X POST "http://127.0.0.1:8000/api/v1/users/me/profile-picture" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/image.jpg"
```

### Test Profile Update
```bash
curl -X PUT "http://127.0.0.1:8000/api/v1/users/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"John Doe","bio":"Developer","phone":"+1234567890"}'
```

## ⚠️ Troubleshooting

### "Upload directories initialized" not showing
- Check console output when starting backend
- Should see: "Upload directories initialized"

### Profile picture not displaying
- Check if file exists: `backend/uploads/profile_pictures/`
- Access directly: `http://127.0.0.1:8000/uploads/profile_pictures/filename.jpg`

### "Failed to load profile"
- Ensure backend is running
- Check if you're logged in (token in localStorage)
- Check browser console for errors

### Upload fails
- File must be under 2MB
- File must be an image (jpg, png, gif, webp)
- Check backend console for errors

## 📚 Documentation

For detailed documentation, see: `docs/profile-settings-guide.md`

## 🎉 You're Done!

The profile settings page is now fully functional with:
- ✅ Profile picture upload
- ✅ Personal information updates
- ✅ Real-time validation
- ✅ Beautiful UI
- ✅ Secure backend

Navigate to `http://localhost:3000/dashboard/settings` to try it out!
