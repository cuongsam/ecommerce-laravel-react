<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Get all approved reviews
     */
    public function index(Request $request)
    {
        $query = Review::with([
                'user:id,name', 
                'product:id,name,slug,price,sale_price',
                'product.images' => function($query) {
                    $query->where('is_primary', true)->orWhereRaw('id = (SELECT MIN(id) FROM product_images WHERE product_id = product_images.product_id)');
                }
            ])
            ->where('status', 'approved');

        // Filter by product if provided
        if ($request->has('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        // Filter by rating if provided
        if ($request->has('rating')) {
            $query->where('rating', $request->rating);
        }

        // Sort
        $sort = $request->get('sort', 'newest');
        switch ($sort) {
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'highest_rating':
                $query->orderBy('rating', 'desc');
                break;
            case 'lowest_rating':
                $query->orderBy('rating', 'asc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        // Pagination
        $perPage = $request->get('limit', 12);
        $reviews = $query->paginate($perPage);

        return response()->json([
            'data' => $reviews->items(),
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
            ]
        ]);
    }

    /**
     * Get review statistics
     */
    public function statistics()
    {
        $totalReviews = Review::where('status', 'approved')->count();
        $averageRating = Review::where('status', 'approved')->avg('rating');
        
        $ratingDistribution = [
            5 => Review::where('status', 'approved')->where('rating', 5)->count(),
            4 => Review::where('status', 'approved')->where('rating', 4)->count(),
            3 => Review::where('status', 'approved')->where('rating', 3)->count(),
            2 => Review::where('status', 'approved')->where('rating', 2)->count(),
            1 => Review::where('status', 'approved')->where('rating', 1)->count(),
        ];

        return response()->json([
            'data' => [
                'total_reviews' => $totalReviews,
                'average_rating' => round($averageRating, 2),
                'rating_distribution' => $ratingDistribution,
            ]
        ]);
    }
}
