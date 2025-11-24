<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of active categories
     */
    public function index()
    {
        $categories = Category::where('status', true)
            ->orderBy('name')
            ->get();

        return response()->json(['data' => $categories]);
    }

    /**
     * Display the specified category
     */
    public function show(Category $category)
    {
        return response()->json(['data' => $category]);
    }
}
