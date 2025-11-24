# Deployment Guide

## Backend - Railway

1. Go to https://railway.app and login with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `cuongsam/ecommerce-laravel-react`
4. Set **Root Directory**: `ecommerce-backend`
5. Add **MySQL** plugin: Click "New" → "Database" → "Add MySQL"
6. Add Environment Variables:
   ```
   APP_KEY=base64:GENERATE_NEW_KEY_WITH_php_artisan_key:generate
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=${{RAILWAY_PUBLIC_DOMAIN}}
   DB_CONNECTION=mysql
   DB_HOST=${{MYSQL.MYSQLHOST}}
   DB_PORT=${{MYSQL.MYSQLPORT}}
   DB_DATABASE=${{MYSQL.MYSQLDATABASE}}
   DB_USERNAME=${{MYSQL.MYSQLUSER}}
   DB_PASSWORD=${{MYSQL.MYSQLPASSWORD}}
   SESSION_DRIVER=database
   CACHE_DRIVER=database
   QUEUE_CONNECTION=database
   ```
7. Click "Deploy"
8. Wait for deployment to complete
9. Copy your Railway URL (e.g., `https://yourapp.up.railway.app`)

## Frontend - Vercel

1. Go to https://vercel.com and login with GitHub
2. Click "Add New" → "Project"
3. Import `cuongsam/ecommerce-laravel-react`
4. Set **Root Directory**: `ecommerce-frontend`
5. Set **Framework Preset**: Vite
6. Add Environment Variables:
   ```
   VITE_API_URL=https://YOUR_RAILWAY_URL/api
   VITE_API_TIMEOUT=15000
   ```
7. Click "Deploy"
8. Wait for deployment
9. Your frontend URL: `https://your-project.vercel.app`

## Update CORS

After getting Vercel URL, update `ecommerce-backend/config/cors.php`:

```php
'allowed_origins' => [
    env('FRONTEND_URL', 'https://your-project.vercel.app'),
    'http://localhost:5173'
],
```

Add to Railway env: `FRONTEND_URL=https://your-project.vercel.app`

Then push to GitHub to trigger redeploy.
