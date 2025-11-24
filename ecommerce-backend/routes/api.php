<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReviewController;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use App\Models\Review;

// Health check route
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API is running',
        'timestamp' => now(),
        'database' => DB::connection()->getDatabaseName()
    ]);
});

// Seed data route (chỉ dùng 1 lần để tạo data mẫu)
Route::post('/seed-data', function () {
    try {
        $results = [];
        
        // Create admin
        if (!User::where('email', 'admin@example.com')->exists()) {
            User::create([
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'email_verified_at' => now(),
                'password' => bcrypt('123123'),
                'role' => 'admin',
                'phone' => '0123456789',
                'address' => 'Hanoi, Vietnam',
            ]);
            $results[] = 'Admin created';
        }
        
        // Create categories
        if (!Category::where('slug', 'scented-candles')->exists()) {
            Category::create([
                'name' => 'Scented Candles',
                'slug' => 'scented-candles',
                'description' => 'Premium scented candles',
                'status' => true,
            ]);
        }
        
        if (!Category::where('slug', 'luxury-candles')->exists()) {
            Category::create([
                'name' => 'Luxury Candles',
                'slug' => 'luxury-candles',
                'description' => 'High-end luxury candles',
                'status' => true,
            ]);
        }
        
        $cat1 = Category::where('slug', 'scented-candles')->first();
        $cat2 = Category::where('slug', 'luxury-candles')->first();
        
        // Create products
        if (!Product::where('slug', 'lavender-dreams')->exists()) {
            $p1 = Product::create([
                'name' => 'Lavender Dreams Candle',
                'slug' => 'lavender-dreams',
                'description' => 'Calming lavender scented candle for relaxation and better sleep',
                'price' => 250000,
                'sale_price' => 199000,
                'stock' => 150,
                'category_id' => $cat1->id,
                'is_featured' => true,
                'status' => true,
            ]);
            
            ProductImage::create([
                'product_id' => $p1->id,
                'image_url' => 'https://images.unsplash.com/photo-1602874801006-c2c0b6d6b602?w=800',
                'is_primary' => true,
            ]);
            $results[] = 'Lavender Dreams created';
        }
        
        if (!Product::where('slug', 'vanilla-bliss')->exists()) {
            $p2 = Product::create([
                'name' => 'Vanilla Bliss Candle',
                'slug' => 'vanilla-bliss',
                'description' => 'Sweet vanilla scent creates a cozy atmosphere',
                'price' => 280000,
                'sale_price' => null,
                'stock' => 120,
                'category_id' => $cat1->id,
                'is_featured' => true,
                'status' => true,
            ]);
            
            ProductImage::create([
                'product_id' => $p2->id,
                'image_url' => 'https://images.unsplash.com/photo-1604762524889-4b0e41d0e5d7?w=800',
                'is_primary' => true,
            ]);
            $results[] = 'Vanilla Bliss created';
        }
        
        if (!Product::where('slug', 'french-provence')->exists()) {
            $p3 = Product::create([
                'name' => 'French Provence Luxury Candle',
                'slug' => 'french-provence',
                'description' => 'Sophisticated blend inspired by French countryside',
                'price' => 450000,
                'sale_price' => 399000,
                'stock' => 50,
                'category_id' => $cat2->id,
                'is_featured' => true,
                'status' => true,
            ]);
            
            ProductImage::create([
                'product_id' => $p3->id,
                'image_url' => 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800',
                'is_primary' => true,
            ]);
            $results[] = 'French Provence created';
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Data seeded successfully',
            'actions' => $results,
            'data' => [
                'admin_email' => 'admin@example.com',
                'admin_password' => '123123',
                'categories' => Category::count(),
                'products' => Product::count(),
                'images' => ProductImage::count(),
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getFile(),
        ], 500);
    }
});

// ===== PUBLIC ROUTES =====
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// Public Products & Categories
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'featured']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/products/{product}/reviews', [ProductController::class, 'reviews']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

// Public Reviews
Route::get('/reviews', [ReviewController::class, 'index']);
Route::get('/reviews/statistics', [ReviewController::class, 'statistics']);

// Public Cart (session-based)
Route::get('/cart', [CartController::class, 'show']);
Route::post('/cart/items', [CartController::class, 'addItem']);

// ===== PROTECTED ROUTES (Cần authentication) =====
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/change-password', [AuthController::class, 'changePassword']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
    });

    // Cart (authenticated)
    Route::put('/cart/items/{item}', [CartController::class, 'updateItem']);
    Route::delete('/cart/items/{item}', [CartController::class, 'removeItem']);
    Route::delete('/cart', [CartController::class, 'clear']);

    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);

    // Reviews
    Route::post('/products/{product}/reviews', [ProductController::class, 'storeReview']);
});