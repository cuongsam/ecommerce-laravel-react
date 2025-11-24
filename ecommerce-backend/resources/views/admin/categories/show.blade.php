@extends('layouts.admin')

@section('title', $category->name)

@section('content')
<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">{{ $category->name }}</h1>
    <div>
        <a href="{{ route('admin.categories.edit', $category) }}" class="btn btn-primary">
            <i class="bi bi-pencil"></i> Edit
        </a>
        <a href="{{ route('admin.categories.index') }}" class="btn btn-secondary">
            <i class="bi bi-arrow-left"></i> Back to Categories
        </a>
    </div>
</div>

<div class="row">
    <div class="col-md-4">
        <div class="card">
            <div class="card-body text-center">
                @if($category->image)
                    <img src="{{ asset($category->image) }}" alt="{{ $category->name }}" 
                         class="img-fluid rounded" style="max-height: 300px;">
                @else
                    <div class="bg-light rounded d-flex align-items-center justify-content-center" 
                         style="height: 200px;">
                        <i class="bi bi-image display-4 text-muted"></i>
                    </div>
                @endif
                
                <h4 class="mt-3">{{ $category->name }}</h4>
                <span class="badge {{ $category->status ? 'bg-success' : 'bg-secondary' }}">
                    {{ $category->status ? 'Active' : 'Inactive' }}
                </span>
                
                @if($category->description)
                    <p class="mt-3">{{ $category->description }}</p>
                @endif
                
                <div class="mt-3">
                    <small class="text-muted">
                        <strong>Slug:</strong> {{ $category->slug }}<br>
                        <strong>Created:</strong> {{ $category->created_at->format('M d, Y') }}<br>
                        <strong>Updated:</strong> {{ $category->updated_at->format('M d, Y') }}
                    </small>
                </div>
            </div>
        </div>
    </div>
    
    <div class="col-md-8">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Products in this Category ({{ $category->products->count() }})</h5>
            </div>
            <div class="card-body">
                @if($category->products->count() > 0)
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($category->products as $product)
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            @if($product->primaryImage)
                                                <img src="{{ asset($product->primaryImage->image_path) }}" 
                                                     alt="{{ $product->name }}" width="40" height="40" 
                                                     class="rounded me-2" style="object-fit: cover;">
                                            @endif
                                            <div>
                                                <strong>{{ $product->name }}</strong><br>
                                                <small class="text-muted">SKU: {{ $product->sku }}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        @if($product->sale_price)
                                            <span class="text-danger">${{ $product->sale_price }}</span>
                                            <small class="text-muted text-decoration-line-through">${{ $product->price }}</small>
                                        @else
                                            ${{ $product->price }}
                                        @endif
                                    </td>
                                    <td>
                                        <span class="badge {{ $product->in_stock > 0 ? 'bg-success' : 'bg-danger' }}">
                                            {{ $product->in_stock }}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="badge {{ $product->is_active ? 'bg-success' : 'bg-secondary' }}">
                                            {{ $product->is_active ? 'Active' : 'Inactive' }}
                                        </span>
                                    </td>
                                    <td>
                                        <a href="{{ route('admin.products.edit', $product) }}" 
                                           class="btn btn-sm btn-outline-primary">
                                            <i class="bi bi-pencil"></i>
                                        </a>
                                    </td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                @else
                    <div class="text-center py-4">
                        <i class="bi bi-box display-4 text-muted"></i>
                        <h5 class="mt-3">No products in this category</h5>
                        <p class="text-muted">Add products to this category to see them here.</p>
                        <a href="{{ route('admin.products.create') }}" class="btn btn-primary">
                            <i class="bi bi-plus-circle"></i> Add Product
                        </a>
                    </div>
                @endif
            </div>
        </div>
    </div>
</div>
@endsection