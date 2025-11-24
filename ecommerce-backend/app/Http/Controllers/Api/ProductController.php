<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use App\Models\OrderItem;


class ProductController extends Controller
{
    /**
     * Display a listing of products with filters
     */
    public function index(Request $request)
    {
        $query = Product::with(['category', 'primaryImage', 'images'])
            ->where('is_active', true);

        // Search by name, description, SKU
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by featured
        if ($request->has('featured')) {
            $query->where('featured', $request->featured);
        }

        // Filter by price range
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Sort
        $sort = $request->get('sort', 'newest');
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'popular':
                $query->withCount('reviews')
                    ->orderBy('reviews_count', 'desc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        // Pagination
        $perPage = $request->get('limit', 12);
        $products = $query->paginate($perPage);

        // Add average rating and review count
        $products->getCollection()->transform(function ($product) {
            $product->average_rating = $product->reviews()->avg('rating') ?? 0;
            $product->reviews_count = $product->reviews()->count();
            return $product;
        });

        return response()->json([
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ]
        ]);
    }

    /**
     * Get featured products
     */
    public function featured()
    {
        $products = Product::with(['category', 'primaryImage', 'images'])
            ->where('is_active', true)
            ->where('featured', true)
            ->limit(8)
            ->get();

        // Add average rating and review count
        $products->transform(function ($product) {
            $product->average_rating = $product->reviews()->avg('rating') ?? 0;
            $product->reviews_count = $product->reviews()->count();
            return $product;
        });

        return response()->json(['data' => $products]);
    }

    /**
     * Display the specified product
     */
    public function show(Product $product)
    {
        $product->load([
            'category',
            'primaryImage',
            'images',
            'reviews' => function ($q) {  // ← THÊM
                $q->where('status', 'approved')
                    ->with('user:id,name')
                    ->orderBy('created_at', 'desc');
            }
        ]);

        $product->average_rating = $product->reviews()->avg('rating') ?? 0;
        $product->reviews_count = $product->reviews()->count();

        return response()->json(['data' => $product]);
    }

    /**
     * Get reviews for a product
     */
    public function reviews(Product $product)
    {
        $reviews = $product->reviews()
            ->with('user:id,name')
            ->latest()
            ->get();

        return response()->json(['data' => $reviews]);
    }

    /**
     * Store a review for a product (authenticated users only)
     */
    public function storeReview(Request $request, Product $product)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);
        $hasPurchased = OrderItem::whereHas('order', function ($q) use ($request) {
            $q->where('user_id', $request->user()->id)
                ->whereIn('status', ['delivered', 'completed']);
        })->where('product_id', $product->id)->exists();

        if (!$hasPurchased) {
            return response()->json([
                'message' => 'Bạn chỉ có thể đánh giá sản phẩm đã mua'
            ], 403);
        }
        // Check if user already reviewed this product
        $existingReview = $product->reviews()
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existingReview) {
            return response()->json([
                'message' => 'Bạn đã đánh giá sản phẩm này rồi'
            ], 422);
        }

        $review = $product->reviews()->create([
            'user_id' => $request->user()->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'status' => 'pending', // ← THÊM
        ]);

        $review->load('user:id,name');

        return response()->json([
            'data' => $review,
            'message' => 'Đánh giá thành công! Cảm ơn bạn'
        ], 201);
    }
}
