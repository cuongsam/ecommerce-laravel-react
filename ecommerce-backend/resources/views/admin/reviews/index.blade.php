@extends('layouts.admin')

@section('title', 'Quản lý đánh giá')
@section('page-title', 'Quản lý đánh giá')

@push('styles')
<style>
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

    .product-thumb {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 6px;
    }

    .rating-stars {
        color: #ffc107;
        font-size: 14px;
    }
</style>
@endpush

@section('content')
<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3">
    <div>
        <h1 class="h2 mb-0">Quản lý đánh giá</h1>
        <p class="text-muted small mb-0">Quản lý đánh giá sản phẩm từ khách hàng</p>
    </div>
</div>

<!-- Filters -->
<div class="filter-card">
    <form method="GET" action="{{ route('admin.reviews.index') }}">
        <div class="row g-3">
            <div class="col-md-4">
                <label class="form-label small text-muted">Tìm kiếm</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-search"></i></span>
                    <input type="text" name="search" class="form-control"
                           placeholder="Tên sản phẩm, khách hàng..." value="{{ request('search') }}">
                </div>
            </div>
            <div class="col-md-3">
                <label class="form-label small text-muted">Trạng thái</label>
                <select name="status" class="form-select">
                    <option value="">Tất cả</option>
                    <option value="pending" {{ request('status') == 'pending' ? 'selected' : '' }}>Chờ duyệt</option>
                    <option value="approved" {{ request('status') == 'approved' ? 'selected' : '' }}>Đã duyệt</option>
                </select>
            </div>
            <div class="col-md-2 d-flex align-items-end gap-2">
                <button type="submit" class="btn btn-outline-primary flex-fill">
                    <i class="fas fa-filter"></i> Lọc
                </button>
                <a href="{{ route('admin.reviews.index') }}" class="btn btn-outline-secondary flex-fill">
                    <i class="fas fa-redo"></i>
                </a>
            </div>
        </div>
    </form>
</div>

<!-- Reviews Table -->
<div class="table-card">
    <div class="card-body p-0">
        @if($reviews->count() > 0)
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="table-light">
                        <tr>
                            <th width="250">Sản phẩm</th>
                            <th width="200">Khách hàng</th>
                            <th width="150" class="text-center">Đánh giá</th>
                            <th>Nhận xét</th>
                            <th width="120" class="text-center">Trạng thái</th>
                            <th width="120">Ngày đánh giá</th>
                            <th width="120" class="text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($reviews as $review)
                        <tr>
                            <td>
                                <div class="d-flex align-items-center gap-2">
                                    @if($review->product->primaryImage)
                                        <img src="{{ asset($review->product->primaryImage->image_path) }}"
                                             alt="{{ $review->product->name }}"
                                             class="product-thumb">
                                    @else
                                        <div class="bg-light rounded d-flex align-items-center justify-content-center product-thumb">
                                            <i class="fas fa-image text-muted"></i>
                                        </div>
                                    @endif
                                    <div>
                                        <div class="fw-bold text-dark">{{ Str::limit($review->product->name, 35) }}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="fw-bold text-dark">{{ $review->user->name }}</div>
                                <small class="text-muted d-block">{{ $review->user->email }}</small>
                            </td>
                            <td class="text-center">
                                <div class="rating-stars mb-1">
                                    @for($i = 1; $i <= 5; $i++)
                                        <i class="fas fa-star{{ $i <= $review->rating ? '' : '-o' }}"></i>
                                    @endfor
                                </div>
                                <small class="text-muted">({{ $review->rating }}/5)</small>
                            </td>
                            <td>
                                @if($review->comment)
                                    <p class="mb-0 text-muted">{{ Str::limit($review->comment, 80) }}</p>
                                @else
                                    <span class="text-muted fst-italic">Không có nhận xét</span>
                                @endif
                            </td>
                            <td class="text-center">
                                <span class="badge {{ $review->status == 'approved' ? 'bg-success' : 'bg-warning text-dark' }} rounded-pill">
                                    {{ $review->status == 'approved' ? 'Đã duyệt' : 'Chờ duyệt' }}
                                </span>
                            </td>
                            <td>
                                <div>{{ $review->created_at->format('d/m/Y') }}</div>
                                <small class="text-muted">{{ $review->created_at->format('H:i') }}</small>
                            </td>
                            <td class="text-center">
                                <div class="d-flex gap-1 justify-content-center">
                                    @if($review->status == 'pending')
                                        <form action="{{ route('admin.reviews.update', $review) }}" method="POST">
                                            @csrf
                                            @method('PUT')
                                            <input type="hidden" name="status" value="approved">
                                            <button type="submit"
                                                    class="btn btn-sm btn-outline-success"
                                                    title="Duyệt đánh giá"
                                                    data-bs-toggle="tooltip">
                                                <i class="fas fa-check"></i>
                                            </button>
                                        </form>
                                    @else
                                        <form action="{{ route('admin.reviews.update', $review) }}" method="POST">
                                            @csrf
                                            @method('PUT')
                                            <input type="hidden" name="status" value="pending">
                                            <button type="submit"
                                                    class="btn btn-sm btn-outline-warning"
                                                    title="Đặt chờ duyệt"
                                                    data-bs-toggle="tooltip">
                                                <i class="fas fa-clock"></i>
                                            </button>
                                        </form>
                                    @endif
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
                    Hiển thị {{ $reviews->firstItem() }} đến {{ $reviews->lastItem() }}
                    trong tổng số {{ $reviews->total() }} đánh giá
                </div>
                {{ $reviews->links() }}
            </div>
        @else
            <div class="text-center py-5">
                <i class="fas fa-star display-1 text-muted mb-3"></i>
                <h4 class="mt-3">Chưa có đánh giá</h4>
                <p class="text-muted">Đánh giá từ khách hàng sẽ xuất hiện ở đây.</p>
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