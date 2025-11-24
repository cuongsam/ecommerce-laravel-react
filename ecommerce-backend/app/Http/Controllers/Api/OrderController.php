<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use App\Models\Product;

class OrderController extends Controller
{
    /**
     * Display a listing of user's orders
     */
    public function index(Request $request)
    {
        $orders = $request->user()->orders()
            ->with('items.product.primaryImage')
            ->latest()
            ->get();

        return response()->json(['data' => $orders]);
    }

    /**
     * Store a newly created order
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'district' => 'required|string|max:100',
            'note' => 'nullable|string|max:1000',
            'payment_method' => 'required|in:cod,bank_transfer',
            'items' => 'required|array|min:1',
        'items.*.product_id' => 'required|exists:products,id',
        'items.*.quantity' => 'required|integer|min:1',
        'items.*.price' => 'required|numeric|min:0',
        ]);

        foreach ($request->items as $item) {
        $product = Product::findOrFail($item['product_id']);
        if ($product->in_stock < $item['quantity']) {
            return response()->json([
                'message' => "Sản phẩm {$product->name} không đủ hàng"
            ], 422);
        }
    }
        // Calculate totals
        $subtotal = collect($request->items)->sum(fn($item) => 
        $item['price'] * $item['quantity']
    );

        $shippingFee = $subtotal >= 500000 ? 0 : 30000;
        $total = $subtotal + $shippingFee;

        // Create order
        $order = $request->user()->orders()->create([
           'order_code' => 'ORDER-' . strtoupper(uniqid()),
        'shipping_name' => $request->name,      // ← THAY
        'shipping_phone' => $request->phone,    // ← THAY
        'shipping_address' => $request->address, // ← THAY
            'city' => $request->city,
            'district' => $request->district,
            'note' => $request->note,
            'payment_method' => $request->payment_method,
            'subtotal' => $subtotal,
            'shipping_fee' => $shippingFee,
            'total' => $total,
            'status' => 'pending',
        ]);

     foreach ($request->items as $item) {
        $product = Product::findOrFail($item['product_id']);
        $product->decrement('in_stock', $item['quantity']);
        
        $order->items()->create([
            'product_id' => $item['product_id'],
            'quantity' => $item['quantity'],
            'price' => $item['price'],
            'total' => $item['price'] * $item['quantity'],
        ]);
    }
        $order->load('items.product.primaryImage');

        return response()->json([
            'data' => $order,
            'message' => 'Đặt hàng thành công'
        ], 201);
    }

    /**
     * Display the specified order
     */
    public function show(Order $order)
    {
        // Ensure user owns this order
        if ($order->user_id !== request()->user()->id) {
            return response()->json([
                'message' => 'Không có quyền truy cập đơn hàng này'
            ], 403);
        }

        $order->load('items.product.primaryImage', 'items.product.category');

        return response()->json(['data' => $order]);
    }
    
}
