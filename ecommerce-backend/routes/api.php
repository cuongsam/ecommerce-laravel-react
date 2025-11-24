<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
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
    // Tạo categories
    $categories = [
        ['name' => 'Electronics', 'slug' => 'electronics', 'description' => 'Electronic devices and gadgets'],
        ['name' => 'Fashion', 'slug' => 'fashion', 'description' => 'Clothing and accessories'],
        ['name' => 'Home & Garden', 'slug' => 'home-garden', 'description' => 'Home and garden products'],
        ['name' => 'Sports', 'slug' => 'sports', 'description' => 'Sports equipment and gear'],
    ];
    
    foreach ($categories as $cat) {
        Category::firstOrCreate(['slug' => $cat['slug']], $cat);
    }
    
    // Tạo products
    $electronics = Category::where('slug', 'electronics')->first();
    $fashion = Category::where('slug', 'fashion')->first();
    
    $products = [
        [
            'name' => 'Wireless Headphones',
            'slug' => 'wireless-headphones',
            'description' => 'High-quality wireless headphones with noise cancellation',
            'price' => 99.99,
            'stock' => 50,
            'category_id' => $electronics->id,
            'is_featured' => true,
        ],
        [
            'name' => 'Smart Watch',
            'slug' => 'smart-watch',
            'description' => 'Feature-rich smartwatch with fitness tracking',
            'price' => 199.99,
            'stock' => 30,
            'category_id' => $electronics->id,
            'is_featured' => true,
        ],
        [
            'name' => 'Cotton T-Shirt',
            'slug' => 'cotton-tshirt',
            'description' => 'Comfortable 100% cotton t-shirt',
            'price' => 19.99,
            'stock' => 100,
            'category_id' => $fashion->id,
            'is_featured' => false,
        ],
    ];
    
    foreach ($products as $prod) {
        Product::firstOrCreate(['slug' => $prod['slug']], $prod);
    }
    
    // Tạo product images
    $headphones = Product::where('slug', 'wireless-headphones')->first();
    ProductImage::firstOrCreate([
        'product_id' => $headphones->id,
        'image_url' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        'is_primary' => true,
    ]);
    
    return response()->json([
        'message' => 'Data seeded successfully',
        'categories' => Category::count(),
        'products' => Product::count(),
        'images' => ProductImage::count(),
    ]);
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