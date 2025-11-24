<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\ProfileController;

// Test route
Route::get('/test', function () {
    return 'Web routes working!';
});

// Admin Routes
Route::prefix('admin')->name('admin.')->group(function () {
    
    // Guest routes (chưa đăng nhập)
    Route::middleware('guest')->group(function () {
        Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
        Route::post('/login', [AuthController::class, 'login'])->name('login.post');
    });

    // Protected routes (cần đăng nhập và là admin)
    Route::middleware(['auth', 'admin'])->group(function () {
        
        // Logout
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
        
        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        
        // User Management
        Route::resource('users', UserController::class);
        Route::post('users/{user}/toggle-status', [UserController::class, 'toggleStatus'])
            ->name('users.toggle-status');
        
        // Category Management
        Route::resource('categories', CategoryController::class);
        
        // Product Management
        Route::resource('products', ProductController::class);
        Route::delete('/products/images/{image}', [ProductController::class, 'deleteImage'])
            ->name('products.images.destroy');
        Route::post('/upload-temp-image', [ProductController::class, 'uploadTempImage'])
            ->name('upload.temp.image');
        
        // Order Management
        Route::resource('orders', OrderController::class)->only(['index', 'show', 'update']);
        
        // Review Management
        Route::resource('reviews', ReviewController::class)->only(['index', 'update']);
        
        // Profile Management
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');
    });
});

// Client routes - React SPA
Route::get('/{any}', function () {
    return view('client');
})->where('any', '^(?!admin|api|storage).*$');

