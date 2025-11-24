@extends('layouts.admin')

@section('title', 'Order ' . $order->order_code)

@section('content')
<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Order: {{ $order->order_code }}</h1>
    <div>
        <a href="{{ route('admin.orders.index') }}" class="btn btn-secondary">
            <i class="bi bi-arrow-left"></i> Back to Orders
        </a>
    </div>
</div>

<div class="row">
    <div class="col-md-8">
        <!-- Order Items -->
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Order Items</h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($order->items as $item)
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center">
                                        @if($item->product->primaryImage)
                                            <img src="{{ asset($item->product->primaryImage->image_path) }}" 
                                                 alt="{{ $item->product->name }}" width="50" height="50" 
                                                 class="rounded me-2" style="object-fit: cover;">
                                        @endif
                                        <div>
                                            <strong>{{ $item->product->name }}</strong><br>
                                            <small class="text-muted">SKU: {{ $item->product->sku }}</small>
                                        </div>
                                    </div>
                                </td>
                                <td>${{ number_format($item->price, 2) }}</td>
                                <td>{{ $item->quantity }}</td>
                                <td>${{ number_format($item->total, 2) }}</td>
                            </tr>
                            @endforeach
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3" class="text-end"><strong>Subtotal:</strong></td>
                                <td><strong>${{ number_format($order->total_amount, 2) }}</strong></td>
                            </tr>
                            <tr>
                                <td colspan="3" class="text-end"><strong>Shipping Fee:</strong></td>
                                <td><strong>${{ number_format($order->shipping_fee, 2) }}</strong></td>
                            </tr>
                            <tr>
                                <td colspan="3" class="text-end"><strong>Grand Total:</strong></td>
                                <td><strong>${{ number_format($order->grand_total, 2) }}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>

        <!-- Shipping Information -->
        <div class="card mt-4">
            <div class="card-header">
                <h5 class="mb-0">Shipping Information</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Name:</strong> {{ $order->shipping_name }}</p>
                        <p><strong>Phone:</strong> {{ $order->shipping_phone }}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Address:</strong></p>
                        <p>{{ $order->shipping_address }}</p>
                    </div>
                </div>
                @if($order->note)
                <div class="row">
                    <div class="col-12">
                        <p><strong>Note:</strong> {{ $order->note }}</p>
                    </div>
                </div>
                @endif
            </div>
        </div>
    </div>

    <div class="col-md-4">
        <!-- Order Status -->
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Order Status</h5>
            </div>
            <div class="card-body">
                <form action="{{ route('admin.orders.update', $order) }}" method="POST">
                    @csrf
                    @method('PUT')
                    <div class="mb-3">
                        <label for="status" class="form-label">Update Status</label>
                        <select class="form-control" id="status" name="status">
                            <option value="pending" {{ $order->status == 'pending' ? 'selected' : '' }}>Pending</option>
                            <option value="confirmed" {{ $order->status == 'confirmed' ? 'selected' : '' }}>Confirmed</option>
                            <option value="shipping" {{ $order->status == 'shipping' ? 'selected' : '' }}>Shipping</option>
                            <option value="delivered" {{ $order->status == 'delivered' ? 'selected' : '' }}>Delivered</option>
                            <option value="cancelled" {{ $order->status == 'cancelled' ? 'selected' : '' }}>Cancelled</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Update Status</button>
                </form>

                <hr>

                <div class="order-timeline mt-4">
                    <h6>Order Timeline</h6>
                    <div class="mt-3">
                        <small class="d-block text-muted">Created: {{ $order->created_at->format('M d, Y H:i') }}</small>
                        <small class="d-block text-muted">Updated: {{ $order->updated_at->format('M d, Y H:i') }}</small>
                    </div>
                </div>
            </div>
        </div>

        <!-- Customer Information -->
        <div class="card mt-4">
            <div class="card-header">
                <h5 class="mb-0">Customer Information</h5>
            </div>
            <div class="card-body">
                @if($order->user)
                    <p><strong>Name:</strong> {{ $order->user->name }}</p>
                    <p><strong>Email:</strong> {{ $order->user->email }}</p>
                    <p><strong>Member since:</strong> {{ $order->user->created_at->format('M d, Y') }}</p>
                @else
                    <p class="text-muted">Guest order</p>
                @endif
            </div>
        </div>
    </div>
</div>
@endsection