<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CartController extends Controller
{
    /**
     * Get or create cart for current session/user
     */
    private function getOrCreateCart(Request $request)
    {
        if ($request->user()) {
            $cart = Cart::firstOrCreate([
                'user_id' => $request->user()->id,
                'session_id' => null,
            ]);
        } else {
            // ⭐ Ensure session is started before getting ID
            if (!$request->hasSession()) {
                $request->setLaravelSession(app('session.store'));
            }

            $sessionId = $request->session()->getId();

            // ⭐ If session ID is empty, generate a new one
            if (empty($sessionId)) {
                $request->session()->regenerate();
                $sessionId = $request->session()->getId();
            }

            $cart = Cart::firstOrCreate([
                'session_id' => $sessionId,
                'user_id' => null,
            ]);
        }

        return $cart;
    }

    /**
     * Display cart
     */
    public function show(Request $request)
    {
        try {
            $cart = $this->getOrCreateCart($request);
            $cart->load('items.product.primaryImage', 'items.product.category');
            foreach ($cart->items as $item) {
                if (!$item->product || !$item->product->is_active) {
                    $item->delete();
                }
            }
            return response()->json(['data' => $cart]);
        } catch (\Exception $e) {
            Log::error('Cart show error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'user' => $request->user()?->id,
                'session' => $request->session()->getId() ?? 'no-session'
            ]);

            return response()->json([
                'message' => 'Failed to load cart',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Add item to cart
     */
    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1|max:10',
        ]);

        $cart = $this->getOrCreateCart($request);
        $product = Product::where('is_active', true)
                      ->findOrFail($request->product_id);

        // Check if item already exists in cart
        $cartItem = $cart->items()->where('product_id', $product->id)->first();

        if ($cartItem) {
            // Update quantity
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            // Create new cart item
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $request->quantity,
            ]);
        }

        $cart->load('items.product.primaryImage', 'items.product.category');

        return response()->json(['data' => $cart]);
    }

    /**
     * Update cart item quantity
     */
    public function updateItem(Request $request, CartItem $item)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $item->update(['quantity' => $request->quantity]);

        $cart = $item->cart;
        $cart->load('items.product.primaryImage', 'items.product.category');

        return response()->json(['data' => $cart]);
    }

    /**
     * Remove item from cart
     */
    public function removeItem(CartItem $item)
    {
        $cart = $item->cart;
        $item->delete();

        $cart->load('items.product.primaryImage', 'items.product.category');

        return response()->json(['data' => $cart]);
    }

    /**
     * Clear cart
     */
    public function clear(Request $request)
    {
        $cart = $this->getOrCreateCart($request);
        $cart->items()->delete();

        return response()->json(['data' => null]);
    }
}
