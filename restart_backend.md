# Backend Server Restart Instructions

Your backend is running with old cached code. Follow these steps:

## Step 1: Stop the Backend Server

Press `Ctrl+C` in the terminal where the backend is running.

## Step 2: Clear Python Cache (Optional but Recommended)

```bash
cd backend
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null
# Or on Windows PowerShell:
# Get-ChildItem -Path . -Recurse -Directory -Filter "__pycache__" | Remove-Item -Recurse -Force
```

Or manually delete the `__pycache__` folders.

## Step 3: Verify Database Has New Columns

Run this to check if the columns exist:

**For SQLite:**
```bash
sqlite3 saaskit.db ".schema users"
```

You should see:
- `bio TEXT`
- `profile_picture TEXT`
- `phone TEXT`

If these columns are missing, run:
```bash
sqlite3 saaskit.db
```
```sql
ALTER TABLE users ADD COLUMN bio TEXT;
ALTER TABLE users ADD COLUMN profile_picture TEXT;
ALTER TABLE users ADD COLUMN phone TEXT;
.exit
```

**For PostgreSQL:**
```sql
\d users
```

If missing, run:
```sql
ALTER TABLE users ADD COLUMN bio VARCHAR;
ALTER TABLE users ADD COLUMN profile_picture VARCHAR;
ALTER TABLE users ADD COLUMN phone VARCHAR;
```

## Step 4: Restart Backend

```bash
cd backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## Step 5: Verify the Server Started Correctly

You should see in the console:
```
Database initialized
Upload directories initialized
INFO:     Uvicorn running on http://127.0.0.1:8000
```

## Step 6: Test the Endpoint

Open a new terminal and test:

```bash
# Get your token from browser localStorage or login again
curl -X PUT "http://127.0.0.1:8000/api/v1/users/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test User","bio":"Testing bio"}'
```

It should return your updated user profile, NOT a 501 error.

## Troubleshooting

### Still Getting 501?

1. **Check the file was actually saved:**
   ```bash
   cat backend/app/api/endpoints/users.py | grep -A 5 "async def update_current_user"
   ```

   You should see:
   ```python
   async def update_current_user(
       user_data: UserProfileUpdate,
       current_user: UserModel = Depends(get_current_user_from_token),
       db: AsyncSession = Depends(get_db)
   ):
   ```

2. **Check imports:**
   ```bash
   cat backend/app/api/endpoints/users.py | grep "UserProfileUpdate"
   ```

   Should show it in the imports.

3. **Check schema file:**
   ```bash
   cat backend/app/schemas/user.py | grep "UserProfileUpdate"
   ```

   Should exist.

### Database Error?

If you get a database error about missing columns:
```
(sqlite3.OperationalError) no such column: users.bio
```

Run the ALTER TABLE commands above.

### Import Error?

If you get:
```
ImportError: cannot import name 'UserProfileUpdate'
```

Check that `backend/app/schemas/user.py` contains:
```python
class UserProfileUpdate(BaseModel):
    """Schema for updating user profile information."""
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    company_name: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = Field(None, max_length=500)
    phone: Optional[str] = Field(None, max_length=20)
```

## Quick Test After Restart

1. Open browser: http://localhost:3000/dashboard/settings
2. Update your name or bio
3. Click "Save Changes"
4. Should see success toast and updated data

## Still Not Working?

Check the backend console for error messages. Copy any errors and I can help debug them.
