<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Review;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'active_users' => User::where('is_active', true)->count(),
            'admin_users' => User::where('role', 'admin')->count(),
            'new_users_today' => User::whereDate('created_at', today())->count(),
        ];
        $recent_users = User::latest()->take(5)->get();

        $totalOrders = Order::count();
        $totalRevenue = Order::where('status', 'delivered')->sum('total_amount');
        $pendingReviews = Review::where('status', 'pending')->count();
        $totalProducts = Product::count();
        $totalCategories = Category::count();
        
        // Recent orders
        $recentOrders = Order::with('user')
            ->latest()
            ->take(5)
            ->get();
            
        // Top selling products
        $topProducts = Product::withCount(['orderItems as total_sold' => function($query) {
            $query->select(DB::raw('COALESCE(SUM(quantity), 0)'));
        }])
        ->orderByDesc('total_sold')
        ->take(5)
        ->get();

        // Monthly revenue data for chart
        $monthlyRevenue = Order::where('status', 'delivered')
            ->whereYear('created_at', date('Y'))
            ->select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(total_amount) as revenue')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Prepare chart data
        $chartLabels = [];
        $chartData = [];
        
        for ($month = 1; $month <= 12; $month++) {
            $chartLabels[] = Carbon::createFromFormat('!m', $month)->format('F');
            $revenue = $monthlyRevenue->firstWhere('month', $month);
            $chartData[] = $revenue ? $revenue->revenue : 0;
        }


        return view('admin.dashboard', compact(
            'stats', 
            'recent_users',
            'totalOrders',
            'totalRevenue', 
            'pendingReviews',
            'totalProducts',
            'totalCategories',
            'recentOrders',
            'topProducts',
            'chartLabels',
            'chartData'
        ));
    }

    


}
