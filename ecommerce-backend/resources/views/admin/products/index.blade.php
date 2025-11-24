@extends('layouts.admin')

@section('title', 'Quản lý sản phẩm')
@section('page-title', 'Quản lý sản phẩm')

@push('styles')
<style>
    .product-table-img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .filter-card {
        background: #fff;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        margin-bottom: 20px;
        border: 1px solid #f0f0f0;
    }

    .stats-badge {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
    }

    .action-btn-group {
        display: flex;
        gap: 5px;
    }

    .table-card {
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        border: 1px solid #f0f0f0;
        overflow: hidden;
    }
</style>
@endpush

@section('content')
<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3">
    <div>
        <h1 class="h2 mb-0">Quản lý sản phẩm</h1>
        <p class="text-muted small mb-0">Quản lý toàn bộ sản phẩm trong hệ thống</p>
    </div>
    <a href="{{ route('admin.products.create') }}" class="btn btn-primary">
        <i class="fas fa-plus-circle me-1"></i> Thêm sản phẩm
    </a>
</div>

<!-- Filters -->
<div class="filter-card">
    <form method="GET" action="{{ route('admin.products.index') }}">
        <div class="row g-3">
            <div class="col-md-3">
                <label class="form-label small text-muted">Tìm kiếm</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-search"></i></span>
                    <input type="text" name="search" class="form-control" placeholder="Tên sản phẩm, SKU..." value="{{ request('search') }}">
                </div>
            </div>
            <div class="col-md-2">
                <label class="form-label small text-muted">Danh mục</label>
                <select name="category_id" class="form-select">
                    <option value="">Tất cả</option>
                    @foreach($categories as $category)
                        <option value="{{ $category->id }}" {{ request('category_id') == $category->id ? 'selected' : '' }}>
                            {{ $category->name }}
                        </option>
                    @endforeach
                </select>
            </div>
            <div class="col-md-2">
                <label class="form-label small text-muted">Trạng thái</label>
                <select name="status" class="form-select">
                    <option value="">Tất cả</option>
                    <option value="1" {{ request('status') == '1' ? 'selected' : '' }}>Hoạt động</option>
                    <option value="0" {{ request('status') == '0' ? 'selected' : '' }}>Tạm ngừng</option>
                </select>
            </div>
            <div class="col-md-2">
                <label class="form-label small text-muted">Nổi bật</label>
                <select name="featured" class="form-select">
                    <option value="">Tất cả</option>
                    <option value="1" {{ request('featured') == '1' ? 'selected' : '' }}>Nổi bật</option>
                    <option value="0" {{ request('featured') == '0' ? 'selected' : '' }}>Thường</option>
                </select>
            </div>
            <div class="col-md-2">
                <label class="form-label small text-muted">Tồn kho</label>
                <select name="stock" class="form-select">
                    <option value="">Tất cả</option>
                    <option value="low" {{ request('stock') == 'low' ? 'selected' : '' }}>Sắp hết</option>
                    <option value="out" {{ request('stock') == 'out' ? 'selected' : '' }}>Hết hàng</option>
                </select>
            </div>
            <div class="col-md-1 d-flex align-items-end">
                <button type="submit" class="btn btn-outline-primary w-100">
                    <i class="fas fa-filter"></i>
                </button>
            </div>
        </div>
    </form>
</div>

<!-- Products Table -->
<div class="table-card">
    <div class="card-body p-0">
        @if($products->count() > 0)
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="table-light">
                        <tr>
                            <th width="80">Hình ảnh</th>
                            <th>Thông tin sản phẩm</th>
                            <th width="120">Danh mục</th>
                            <th width="120">Giá bán</th>
                            <th width="80" class="text-center">Tồn kho</th>
                            <th width="100" class="text-center">Trạng thái</th>
                            <th width="80" class="text-center">Nổi bật</th>
                            <th width="150" class="text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($products as $product)
                        <tr>
                            <td>
                                @if($product->primaryImage)
                                    <img src="{{ asset($product->primaryImage->image_path) }}" alt="{{ $product->name }}"
                                         class="product-table-img">
                                @else
                                    <div class="bg-light rounded d-flex align-items-center justify-content-center"
                                         style="width: 60px; height: 60px;">
                                        <i class="fas fa-image text-muted"></i>
                                    </div>
                                @endif
                            </td>
                            <td>
                                <div class="fw-bold text-dark">{{ $product->name }}</div>
                                <small class="text-muted d-block">SKU: <code>{{ $product->sku }}</code></small>
                                @if($product->fragrance)
                                    <small class="text-info d-block">
                                        <i class="fas fa-spray-can"></i> {{ $product->fragrance }}
                                    </small>
                                @endif
                            </td>
                            <td>
                                <span class="badge bg-secondary rounded-pill">{{ $product->category->name }}</span>
                            </td>
                            <td>
                                @if($product->sale_price)
                                    <div class="fw-bold text-danger">${{ number_format($product->sale_price, 2) }}</div>
                                    <small class="text-muted text-decoration-line-through">${{ number_format($product->price, 2) }}</small>
                                @else
                                    <div class="fw-bold text-dark">${{ number_format($product->price, 2) }}</div>
                                @endif
                            </td>
                            <td class="text-center">
                                <span class="stats-badge {{ $product->in_stock > 10 ? 'bg-success' : ($product->in_stock > 0 ? 'bg-warning text-dark' : 'bg-danger') }} text-white">
                                    {{ $product->in_stock }}
                                </span>
                            </td>
                            <td class="text-center">
                                <span class="badge {{ $product->is_active ? 'bg-success' : 'bg-secondary' }} rounded-pill">
                                    {{ $product->is_active ? 'Hoạt động' : 'Tạm ngừng' }}
                                </span>
                            </td>
                            <td class="text-center">
                                @if($product->featured)
                                    <i class="fas fa-star text-warning fs-5"></i>
                                @else
                                    <i class="far fa-star text-muted fs-5"></i>
                                @endif
                            </td>
                            <td>
                                <div class="action-btn-group justify-content-center">
                                    <a href="{{ route('admin.products.show', $product) }}"
                                       class="btn btn-sm btn-outline-info"
                                       title="Xem chi tiết"
                                       data-bs-toggle="tooltip">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                    <a href="{{ route('admin.products.edit', $product) }}"
                                       class="btn btn-sm btn-outline-primary"
                                       title="Chỉnh sửa"
                                       data-bs-toggle="tooltip">
                                        <i class="fas fa-edit"></i>
                                    </a>
                                    <form action="{{ route('admin.products.destroy', $product) }}"
                                          method="POST"
                                          id="delete-form-{{ $product->id }}"
                                          class="d-inline">
                                        @csrf
                                        @method('DELETE')
                                        <button type="button"
                                                class="btn btn-sm btn-outline-danger"
                                                title="Xóa"
                                                data-bs-toggle="tooltip"
                                                onclick="confirmDelete('delete-form-{{ $product->id }}', 'Bạn có chắc chắn muốn xóa sản phẩm này? Tất cả dữ liệu liên quan sẽ bị xóa.')">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="d-flex justify-content-between align-items-center p-3 border-top">
                <div class="text-muted small">
                    Hiển thị {{ $products->firstItem() }} đến {{ $products->lastItem() }}
                    trong tổng số {{ $products->total() }} sản phẩm
                </div>
                {{ $products->links() }}
            </div>
        @else
            <div class="text-center py-5">
                <i class="fas fa-box-open display-1 text-muted mb-3"></i>
                <h4 class="mt-3">Không tìm thấy sản phẩm</h4>
                <p class="text-muted">Bắt đầu bằng cách tạo sản phẩm đầu tiên của bạn.</p>
                <a href="{{ route('admin.products.create') }}" class="btn btn-primary mt-2">
                    <i class="fas fa-plus-circle me-1"></i> Tạo sản phẩm mới
                </a>
            </div>
        @endif
    </div>
</div>
@endsection

@push('scripts')
<script>
    // Initialize tooltips
    document.addEventListener('DOMContentLoaded', function() {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    });
</script>
@endpush