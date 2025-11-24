<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $table = 'cart';

    protected $fillable = [
        'user_id',
        'session_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    // Tính tổng giá trị giỏ hàng
    public function getTotalAttribute()
    {
        return $this->items->sum(function($item) {
            return $item->quantity * ($item->product->sale_price ?? $item->product->price);
        });
    }
}
