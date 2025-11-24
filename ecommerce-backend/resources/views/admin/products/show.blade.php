@extends('layouts.admin')

@section('title', $product->name)
@section('page-title', 'Chi tiết sản phẩm')

@push('styles')
<style>
    .product-detail-card {
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        border: 1px solid #f0f0f0;
        margin-bottom: 20px;
    }

    .product-carousel img {
        border-radius: 12px;
        height: 450px;
        object-fit: cover;
    }

    .thumbnail-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        gap: 10px;
        margin-top: 15px;
    }

    .thumbnail-item {
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        border: 3px solid transparent;
        transition: all 0.3s ease;
    }

    .thumbnail-item:hover,
    .thumbnail-item.active {
        border-color: var(--primary-color);
        box-shadow: 0 3px 10px rgba(139, 115, 85, 0.3);
    }

    .thumbnail-item img {
        width: 100%;
        height: 80px;
        object-fit: cover;
    }

    .detail-section {
        margin-bottom: 25px;
        padding-bottom: 20px;
        border-bottom: 1px solid #f0f0f0;
    }

    .detail-section:last-child {
        border-bottom: none;
    }

    .info-label {
        font-weight: 600;
        color: #6c757d;
        margin-bottom: 8px;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .info-value {
        color: #2c3e50;
        font-size: 15px;
    }

    .review-item {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 15px;
        border-left: 3px solid var(--primary-color);
    }

    .review-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .reviewer-name {
        font-weight: 600;
        color: #2c3e50;
    }

    .rating-stars {
        color: #ffc107;
    }

    .action-buttons {
        position: sticky;
        top: 80px;
        background: #fff;
        padding: 15px;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        border: 1px solid #f0f0f0;
        margin-bottom: 20px;
    }
</style>
@endpush

@section('content')
<div class="container-fluid">
    <!-- Header & Actions -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 class="mb-1">{{ $product->name }}</h2>
            <p class="text-muted mb-0">
                <small>SKU: <code>{{ $product->sku }}</code></small>
            </p>
        </div>
        <div class="action-buttons-group d-flex gap-2">
            <a href="{{ route('admin.products.edit', $product) }}" class="btn btn-primary">
                <i class="fas fa-edit me-1"></i> Chỉnh sửa
            </a>
            <a href="{{ route('admin.products.index') }}" class="btn btn-outline-secondary">
                <i class="fas fa-arrow-left me-1"></i> Quay lại
            </a>
        </div>
    </div>

    <div class="row">
        <!-- Left Column: Images -->
        <div class="col-lg-5">
            <div class="product-detail-card p-3">
                @if($product->images->count() > 0)
                    <!-- Main Carousel -->
                    <div id="productCarousel" class="carousel slide product-carousel" data-bs-ride="false">
                        <div class="carousel-inner">
                            @foreach($product->images as $index => $image)
                            <div class="carousel-item {{ $index === 0 ? 'active' : '' }}">
                                <img src="{{ asset($image->image_path) }}" class="d-block w-100"
                                     alt="{{ $image->alt_text ?? $product->name }}">
                                @if($image->is_primary)
                                    <div class="position-absolute top-0 start-0 m-3">
                                        <span class="badge bg-primary">Ảnh chính</span>
                                    </div>
                                @endif
                            </div>
                            @endforeach
                        </div>
                        @if($product->images->count() > 1)
                            <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon"></span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                                <span class="carousel-control-next-icon"></span>
                            </button>
                        @endif
                    </div>

                    <!-- Thumbnails -->
                    <div class="thumbnail-grid">
                        @foreach($product->images as $index => $image)
                        <div class="thumbnail-item {{ $index === 0 ? 'active' : '' }}"
                             data-index="{{ $index }}"
                             onclick="changeSlide({{ $index }})">
                            <img src="{{ asset($image->image_path) }}" alt="{{ $image->alt_text ?? $product->name }}">
                        </div>
                        @endforeach
                    </div>
                @else
                    <div class="text-center py-5">
                        <i class="fas fa-image display-1 text-muted"></i>
                        <p class="text-muted mt-3">Chưa có hình ảnh</p>
                    </div>
                @endif
            </div>
        </div>

        <!-- Right Column: Details -->
        <div class="col-lg-7">
            <!-- Product Information -->
            <div class="product-detail-card p-4">
                <h4 class="mb-4">Thông tin sản phẩm</h4>

                <!-- Price Section -->
                <div class="detail-section">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="info-label">Giá bán</div>
                            @if($product->sale_price)
                                <h3 class="text-danger mb-1">${{ number_format($product->sale_price, 2) }}</h3>
                                <p class="text-muted text-decoration-line-through">${{ number_format($product->price, 2) }}</p>
                            @else
                                <h3 class="text-dark mb-0">${{ number_format($product->price, 2) }}</h3>
                            @endif
                        </div>
                        <div class="col-md-6">
                            <div class="info-label">Tồn kho</div>
                            <h4>
                                <span class="badge {{ $product->in_stock > 10 ? 'bg-success' : ($product->in_stock > 0 ? 'bg-warning text-dark' : 'bg-danger') }} fs-6">
                                    {{ $product->in_stock }} sản phẩm
                                </span>
                            </h4>
                        </div>
                    </div>
                </div>

                <!-- Status Section -->
                <div class="detail-section">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="info-label">Danh mục</div>
                            <span class="badge bg-secondary fs-6">{{ $product->category->name }}</span>
                        </div>
                        <div class="col-md-4">
                            <div class="info-label">Trạng thái</div>
                            <span class="badge {{ $product->is_active ? 'bg-success' : 'bg-secondary' }} fs-6">
                                {{ $product->is_active ? 'Hoạt động' : 'Tạm ngừng' }}
                            </span>
                        </div>
                        <div class="col-md-4">
                            <div class="info-label">Nổi bật</div>
                            @if($product->featured)
                                <i class="fas fa-star text-warning fs-4"></i>
                                <span class="text-muted">Có</span>
                            @else
                                <i class="far fa-star text-muted fs-4"></i>
                                <span class="text-muted">Không</span>
                            @endif
                        </div>
                    </div>
                </div>

                <!-- Attributes Section -->
                @if($product->material || $product->fragrance || $product->weight)
                <div class="detail-section">
                    <div class="row">
                        @if($product->material)
                        <div class="col-md-4">
                            <div class="info-label">Chất liệu</div>
                            <div class="info-value">{{ $product->material }}</div>
                        </div>
                        @endif

                        @if($product->fragrance)
                        <div class="col-md-4">
                            <div class="info-label">Hương thơm</div>
                            <div class="info-value">
                                <i class="fas fa-spray-can text-info me-1"></i>
                                {{ $product->fragrance }}
                            </div>
                        </div>
                        @endif

                        @if($product->weight)
                        <div class="col-md-4">
                            <div class="info-label">Trọng lượng</div>
                            <div class="info-value">{{ $product->weight }}g</div>
                        </div>
                        @endif
                    </div>
                </div>
                @endif

                <!-- Description -->
                @if($product->description)
                <div class="detail-section">
                    <div class="info-label">Mô tả sản phẩm</div>
                    <p class="text-muted mb-0">{{ $product->description }}</p>
                </div>
                @endif

                <!-- Timestamps -->
                <div class="row text-muted small">
                    <div class="col-md-6">
                        <i class="fas fa-calendar-plus me-1"></i>
                        Tạo lúc: {{ $product->created_at->format('d/m/Y H:i') }}
                    </div>
                    <div class="col-md-6">
                        <i class="fas fa-calendar-edit me-1"></i>
                        Cập nhật: {{ $product->updated_at->format('d/m/Y H:i') }}
                    </div>
                </div>
            </div>

            <!-- Reviews Section -->
            <div class="product-detail-card p-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="mb-0">
                        <i class="fas fa-star text-warning me-2"></i>
                        Đánh giá sản phẩm ({{ $product->reviews->count() }})
                    </h5>
                    @if($product->reviews->count() > 0)
                        <a href="{{ route('admin.reviews.index') }}?product_id={{ $product->id }}"
                           class="btn btn-sm btn-outline-primary">
                            Xem tất cả
                        </a>
                    @endif
                </div>

                @if($product->reviews->count() > 0)
                    @foreach($product->reviews->take(3) as $review)
                    <div class="review-item">
                        <div class="review-header">
                            <div>
                                <div class="reviewer-name">{{ $review->user->name }}</div>
                                <div class="rating-stars">
                                    @for($i = 1; $i <= 5; $i++)
                                        <i class="fas fa-star{{ $i <= $review->rating ? '' : '-o' }}"></i>
                                    @endfor
                                    <span class="text-muted small ms-1">({{ $review->rating }}/5)</span>
                                </div>
                            </div>
                            <span class="badge {{ $review->status == 'approved' ? 'bg-success' : 'bg-warning text-dark' }}">
                                {{ $review->status == 'approved' ? 'Đã duyệt' : 'Chờ duyệt' }}
                            </span>
                        </div>
                        @if($review->comment)
                            <p class="mb-2 text-muted">{{ $review->comment }}</p>
                        @endif
                        <small class="text-muted">
                            <i class="fas fa-clock me-1"></i>
                            {{ $review->created_at->format('d/m/Y H:i') }}
                        </small>
                    </div>
                    @endforeach
                @else
                    <div class="text-center py-4">
                        <i class="fas fa-comments display-4 text-muted mb-3"></i>
                        <p class="text-muted mb-0">Chưa có đánh giá nào</p>
                    </div>
                @endif
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    function changeSlide(index) {
        const carousel = new bootstrap.Carousel(document.getElementById('productCarousel'));
        carousel.to(index);

        // Update active thumbnail
        document.querySelectorAll('.thumbnail-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`.thumbnail-item[data-index="${index}"]`).classList.add('active');
    }

    // Update active thumbnail on carousel slide
    const carouselElement = document.getElementById('productCarousel');
    if (carouselElement) {
        carouselElement.addEventListener('slid.bs.carousel', function (e) {
            const activeIndex = Array.from(e.target.querySelectorAll('.carousel-item')).indexOf(e.relatedTarget);
            document.querySelectorAll('.thumbnail-item').forEach(item => {
                item.classList.remove('active');
            });
            document.querySelector(`.thumbnail-item[data-index="${activeIndex}"]`).classList.add('active');
        });
    }
</script>
@endpush
