# Profile Settings & Upload Guide

Complete guide for the user profile settings page with personal information updates and profile picture upload functionality.

## Features Implemented

### ✅ Backend Features

1. **User Model Updates**
   - Added `bio` field (max 500 characters)
   - Added `profile_picture` field (stores file path/URL)
   - Added `phone` field for contact information

2. **API Endpoints**
   - `GET /api/v1/users/me` - Get current user profile
   - `PUT /api/v1/users/me` - Update user profile information
   - `POST /api/v1/users/me/profile-picture` - Upload profile picture
   - `DELETE /api/v1/users/me/profile-picture` - Delete profile picture

3. **Image Upload System**
   - Automatic image validation (file type, size)
   - Image optimization and resizing
   - Secure file storage
   - Old image cleanup on replacement

### ✅ Frontend Features

1. **Interactive Profile Page**
   - Real-time form updates
   - Profile picture preview
   - Drag & drop support
   - Loading states and error handling
   - Toast notifications

2. **User Information Fields**
   - Full name
   - Email (read-only)
   - Phone number
   - Bio (500 character limit with counter)
   - Company name

3. **Profile Picture Management**
   - Upload new images
   - Preview before upload
   - Remove existing images
   - Avatar initials fallback
   - 2MB size limit
   - Supported formats: JPG, PNG, GIF, WEBP

## Installation & Setup

### 1. Install Backend Dependencies

```bash
cd backend
pip install pillow==10.4.0
```

### 2. Run Database Migration

```bash
# If using Alembic (recommended)
alembic revision --autogenerate -m "add profile fields"
alembic upgrade head

# Or manually add columns to your database
```

For SQLite:
```sql
ALTER TABLE users ADD COLUMN bio TEXT;
ALTER TABLE users ADD COLUMN profile_picture TEXT;
ALTER TABLE users ADD COLUMN phone TEXT;
```

For PostgreSQL:
```sql
ALTER TABLE users ADD COLUMN bio VARCHAR;
ALTER TABLE users ADD COLUMN profile_picture VARCHAR;
ALTER TABLE users ADD COLUMN phone VARCHAR;
```

### 3. Configure Upload Directory

The upload directories are automatically created on server startup. The structure is:

```
backend/
  uploads/
    profile_pictures/
```

Make sure the backend has write permissions to create these directories.

### 4. Start the Backend Server

```bash
cd backend
uvicorn app.main:app --reload
```

The server will:
- Initialize upload directories
- Mount static files at `/uploads`
- Enable CORS for the frontend

### 5. Configure Frontend Environment

Create or update `.env.local` in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

### 6. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints Documentation

### Get User Profile

**Endpoint:** `GET /api/v1/users/me`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "company_name": "Acme Inc",
  "bio": "Software developer",
  "profile_picture": "/uploads/profile_pictures/user-uuid_abc123.jpg",
  "phone": "+1234567890",
  "is_active": true,
  "is_verified": true,
  "role": "user",
  "created_at": "2024-01-01T00:00:00"
}
```

### Update User Profile

**Endpoint:** `PUT /api/v1/users/me`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "full_name": "John Doe",
  "company_name": "Acme Inc",
  "bio": "Software developer and tech enthusiast",
  "phone": "+1234567890"
}
```

**Notes:**
- All fields are optional
- Only provided fields will be updated
- `email` cannot be changed through this endpoint

**Response:**
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  ...
}
```

### Upload Profile Picture

**Endpoint:** `POST /api/v1/users/me/profile-picture`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
- Content-Type: `multipart/form-data`
- Field: `file` (image file)

**Validation:**
- Max file size: 2MB
- Allowed formats: JPG, JPEG, PNG, GIF, WEBP
- Max dimensions: 2048x2048 (auto-resized)

**Response:**
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "profile_picture": "/uploads/profile_pictures/user-uuid_abc123.jpg",
  ...
}
```

**Error Responses:**
```json
// File too large
{
  "detail": "File size exceeds maximum limit of 2MB"
}

// Invalid file type
{
  "detail": "File type not allowed. Allowed types: .jpg, .jpeg, .png, .gif, .webp"
}

// Not an image
{
  "detail": "Invalid image file"
}
```

### Delete Profile Picture

**Endpoint:** `DELETE /api/v1/users/me/profile-picture`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "profile_picture": null,
  ...
}
```

## Frontend Usage

### Accessing the Settings Page

Navigate to: `http://localhost:3000/dashboard/settings`

### Profile Tab Features

1. **Profile Picture**
   - Click "Change Photo" to upload new image
   - Click "Remove" to delete current image
   - Shows initials if no image uploaded
   - Loading spinner during upload

2. **Personal Information**
   - Full Name (editable)
   - Email (read-only)
   - Phone Number (editable)
   - Bio (editable, 500 char limit)

3. **Save Changes**
   - Click "Save Changes" button
   - Shows loading state
   - Displays success/error toast

### Organization Tab

- Company name is synced with profile
- Additional organization settings
- Same save button updates company name

## File Upload Implementation Details

### Backend Processing

1. **Validation**
   - Check file extension
   - Verify file size (2MB limit)
   - Validate actual image content
   - Ensure it's not a malicious file

2. **Image Processing**
   - Convert RGBA to RGB for JPEG
   - Resize if larger than 2048x2048
   - Optimize quality (85%)
   - Generate unique filename with UUID

3. **Storage**
   - Save to `uploads/profile_pictures/`
   - Delete old image on replacement
   - Return relative path

4. **Security**
   - Unique filenames prevent overwrites
   - File type validation
   - Size limits prevent DoS
   - Image verification prevents executable uploads

### Frontend Implementation

```typescript
// Upload profile picture
const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/users/me/profile-picture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await response.json()
  // Update UI with new profile picture
}
```

## Testing

### Using cURL

1. **Get Profile:**
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/users/me" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

2. **Update Profile:**
```bash
curl -X PUT "http://127.0.0.1:8000/api/v1/users/me" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Jane Doe","bio":"Updated bio"}'
```

3. **Upload Image:**
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/users/me/profile-picture" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

4. **Delete Image:**
```bash
curl -X DELETE "http://127.0.0.1:8000/api/v1/users/me/profile-picture" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using the Frontend

1. Start the backend server
2. Start the frontend
3. Register/login to get an account
4. Navigate to Settings → Profile tab
5. Test all features:
   - Upload a profile picture
   - Update personal information
   - Save changes
   - Remove profile picture

## Troubleshooting

### Profile Picture Not Displaying

1. **Check file path format**
   - Should be: `/uploads/profile_pictures/filename.jpg`
   - Frontend automatically prepends base URL

2. **Verify static files are mounted**
   - Check `app/main.py` has StaticFiles mount
   - Access directly: `http://127.0.0.1:8000/uploads/profile_pictures/filename.jpg`

3. **Check CORS settings**
   - Ensure frontend URL is in allowed origins
   - Verify credentials are allowed

### Upload Fails

1. **Check file size** - Must be under 2MB
2. **Check file type** - Must be image/*
3. **Check permissions** - Backend can write to `uploads/` directory
4. **Check token** - Valid authentication token required

### Profile Updates Not Saving

1. **Check authentication** - Token must be valid
2. **Check network** - Backend must be running
3. **Check console** - Look for error messages
4. **Check validation** - Ensure data meets requirements

## Production Considerations

### File Storage

For production, consider using cloud storage:

1. **AWS S3**
   - Update `upload.py` to upload to S3
   - Store S3 URL in `profile_picture` field
   - Enable CloudFront for CDN

2. **Cloudinary**
   - Use Cloudinary SDK
   - Automatic image optimization
   - Built-in transformations

3. **Azure Blob Storage**
   - Similar to S3 implementation
   - Good for Microsoft stack

### Security

1. **Rate Limiting**
   - Limit upload frequency per user
   - Prevent abuse

2. **File Scanning**
   - Scan uploads for malware
   - Use antivirus API

3. **CDN**
   - Serve images through CDN
   - Reduce server load
   - Improve performance

### Performance

1. **Image Compression**
   - Already implemented (85% quality)
   - Consider WebP format

2. **Lazy Loading**
   - Load images on demand
   - Reduce initial page load

3. **Caching**
   - Cache profile pictures
   - Set appropriate headers

## Code Structure

```
backend/
├── app/
│   ├── api/endpoints/
│   │   └── users.py              # User endpoints
│   ├── core/
│   │   ├── upload.py             # Upload utilities
│   │   └── config.py             # Settings
│   ├── models/
│   │   └── user.py               # User model (+ profile fields)
│   ├── schemas/
│   │   └── user.py               # User schemas (+ ProfileUpdate)
│   └── main.py                   # App setup (+ static files)
└── uploads/
    └── profile_pictures/         # Uploaded images

frontend/
└── app/
    └── dashboard/
        └── settings/
            └── page.tsx          # Settings page (fully functional)
```

## Summary

You now have a fully functional profile settings page with:

✅ Personal information management
✅ Profile picture upload/update/delete
✅ Real-time validation
✅ Beautiful UI with loading states
✅ Proper error handling
✅ Secure file uploads
✅ Production-ready backend

The implementation follows best practices for security, user experience, and code quality.
