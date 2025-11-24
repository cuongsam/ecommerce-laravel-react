@extends('layouts.admin')

@section('title', 'Quản lý danh mục')
@section('page-title', 'Quản lý danh mục')

@push('styles')
<style>
    .category-table-img {
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

    .table-card {
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        border: 1px solid #f0f0f0;
        overflow: hidden;
    }

    .stats-badge {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
    }
</style>
@endpush

@section('content')
<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3">
    <div>
        <h1 class="h2 mb-0">Quản lý danh mục</h1>
        <p class="text-muted small mb-0">Quản lý danh mục sản phẩm trong hệ thống</p>
    </div>
    <a href="{{ route('admin.categories.create') }}" class="btn btn-primary">
        <i class="fas fa-plus-circle me-1"></i> Thêm danh mục
    </a>
</div>

<!-- Filters -->
<div class="filter-card">
    <form method="GET" action="{{ route('admin.categories.index') }}">
        <div class="row g-3">
            <div class="col-md-4">
                <label class="form-label small text-muted">Tìm kiếm</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-search"></i></span>
                    <input type="text" name="search" class="form-control"
                           placeholder="Tên danh mục..." value="{{ request('search') }}">
                </div>
            </div>
            <div class="col-md-3">
                <label class="form-label small text-muted">Trạng thái</label>
                <select name="status" class="form-select">
                    <option value="">Tất cả</option>
                    <option value="1" {{ request('status') == '1' ? 'selected' : '' }}>Hoạt động</option>
                    <option value="0" {{ request('status') == '0' ? 'selected' : '' }}>Tạm ngừng</option>
                </select>
            </div>
            <div class="col-md-2 d-flex align-items-end gap-2">
                <button type="submit" class="btn btn-outline-primary flex-fill">
                    <i class="fas fa-filter"></i> Lọc
                </button>
                <a href="{{ route('admin.categories.index') }}" class="btn btn-outline-secondary flex-fill">
                    <i class="fas fa-redo"></i>
                </a>
            </div>
        </div>
    </form>
</div>

<!-- Categories Table -->
<div class="table-card">
    <div class="card-body p-0">
        @if($categories->count() > 0)
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="table-light">
                        <tr>
                            <th width="60">#</th>
                            <th width="80">Hình ảnh</th>
                            <th>Thông tin danh mục</th>
                            <th width="200">Slug</th>
                            <th width="100" class="text-center">Số sản phẩm</th>
                            <th width="120" class="text-center">Trạng thái</th>
                            <th width="120">Ngày tạo</th>
                            <th width="150" class="text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($categories as $category)
                        <tr>
                            <td class="fw-bold text-muted">{{ $category->id }}</td>
                            <td>
                                @if($category->image)
                                    <img src="{{ asset($category->image) }}" alt="{{ $category->name }}"
                                         class="category-table-img">
                                @else
                                    <div class="bg-light rounded d-flex align-items-center justify-content-center"
                                         style="width: 60px; height: 60px;">
                                        <i class="fas fa-image text-muted"></i>
                                    </div>
                                @endif
                            </td>
                            <td>
                                <div class="fw-bold text-dark">{{ $category->name }}</div>
                                @if($category->description)
                                    <small class="text-muted d-block">{{ Str::limit($category->description, 60) }}</small>
                                @endif
                            </td>
                            <td><code class="text-muted">{{ $category->slug }}</code></td>
                            <td class="text-center">
                                <span class="stats-badge bg-info text-white">
                                    {{ $category->products_count ?? $category->products()->count() }}
                                </span>
                            </td>
                            <td class="text-center">
                                <span class="badge {{ $category->status ? 'bg-success' : 'bg-secondary' }} rounded-pill">
                                    {{ $category->status ? 'Hoạt động' : 'Tạm ngừng' }}
                                </span>
                            </td>
                            <td>{{ $category->created_at->format('d/m/Y') }}</td>
                            <td>
                                <div class="d-flex gap-1 justify-content-center">
                                    <a href="{{ route('admin.categories.show', $category) }}"
                                       class="btn btn-sm btn-outline-info"
                                       title="Xem chi tiết"
                                       data-bs-toggle="tooltip">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                    <a href="{{ route('admin.categories.edit', $category) }}"
                                       class="btn btn-sm btn-outline-primary"
                                       title="Chỉnh sửa"
                                       data-bs-toggle="tooltip">
                                        <i class="fas fa-edit"></i>
                                    </a>
                                    <form action="{{ route('admin.categories.destroy', $category) }}"
                                          method="POST"
                                          id="delete-category-{{ $category->id }}"
                                          class="d-inline">
                                        @csrf
                                        @method('DELETE')
                                        <button type="button"
                                                class="btn btn-sm btn-outline-danger"
                                                title="Xóa"
                                                data-bs-toggle="tooltip"
                                                onclick="confirmDelete('delete-category-{{ $category->id }}', 'Bạn có chắc chắn muốn xóa danh mục này? Tất cả sản phẩm trong danh mục sẽ bị ảnh hưởng.')">
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
                    Hiển thị {{ $categories->firstItem() }} đến {{ $categories->lastItem() }}
                    trong tổng số {{ $categories->total() }} danh mục
                </div>
                {{ $categories->links() }}
            </div>
        @else
            <div class="text-center py-5">
                <i class="fas fa-folder-open display-1 text-muted mb-3"></i>
                <h4 class="mt-3">Không tìm thấy danh mục</h4>
                <p class="text-muted">Bắt đầu bằng cách tạo danh mục đầu tiên của bạn.</p>
                <a href="{{ route('admin.categories.create') }}" class="btn btn-primary mt-2">
                    <i class="fas fa-plus-circle me-1"></i> Tạo danh mục mới
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