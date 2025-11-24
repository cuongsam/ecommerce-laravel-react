<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('order_code')->unique();
            $table->decimal('subtotal', 10, 2);        // ← THÊM
            $table->decimal('total_amount', 10, 2);
            $table->decimal('shipping_fee', 10, 2)->default(0);
            $table->enum('status', [
                'pending',
                'confirmed',
                'shipping',
                'delivered',
                'cancelled'
            ])->default('pending');
            $table->enum('payment_method', [         // ← THÊM
                'cod',
                'bank_transfer',
                'momo',
                'vnpay'
            ])->default('cod');
            $table->string('shipping_name');
            $table->string('shipping_phone');
            $table->string('shipping_email')->nullable(); // ← THÊM
            $table->text('shipping_address');
            $table->string('shipping_city')->nullable();  // ← THÊM
            $table->string('shipping_district')->nullable(); // ← THÊM
            $table->string('shipping_ward')->nullable();  // ← THÊM
            $table->text('note')->nullable();
            $table->timestamps();
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
