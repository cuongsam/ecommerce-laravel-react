@extends('layouts.admin')

@section('title', 'Quản lý đơn hàng')
@section('page-title', 'Quản lý đơn hàng')

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

    .order-status-badge {
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .order-code {
        font-family: 'Courier New', monospace;
        font-weight: 700;
        color: var(--primary-color);
    }
</style>
@endpush

@section('content')
<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3">
    <div>
        <h1 class="h2 mb-0">Quản lý đơn hàng</h1>
        <p class="text-muted small mb-0">Quản lý tất cả đơn hàng trong hệ thống</p>
    </div>
</div>

<!-- Filters -->
<div class="filter-card">
    <form method="GET" action="{{ route('admin.orders.index') }}">
        <div class="row g-3">
            <div class="col-md-4">
                <label class="form-label small text-muted">Tìm kiếm</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-search"></i></span>
                    <input type="text" name="search" class="form-control"
                           placeholder="Mã đơn, tên KH, số điện thoại..." value="{{ request('search') }}">
                </div>
            </div>
            <div class="col-md-3">
                <label class="form-label small text-muted">Trạng thái</label>
                <select name="status" class="form-select">
                    <option value="">Tất cả</option>
                    <option value="pending" {{ request('status') == 'pending' ? 'selected' : '' }}>Chờ xác nhận</option>
                    <option value="confirmed" {{ request('status') == 'confirmed' ? 'selected' : '' }}>Đã xác nhận</option>
                    <option value="shipping" {{ request('status') == 'shipping' ? 'selected' : '' }}>Đang giao</option>
                    <option value="delivered" {{ request('status') == 'delivered' ? 'selected' : '' }}>Đã giao</option>
                    <option value="cancelled" {{ request('status') == 'cancelled' ? 'selected' : '' }}>Đã hủy</option>
                </select>
            </div>
            <div class="col-md-2 d-flex align-items-end gap-2">
                <button type="submit" class="btn btn-outline-primary flex-fill">
                    <i class="fas fa-filter"></i> Lọc
                </button>
                <a href="{{ route('admin.orders.index') }}" class="btn btn-outline-secondary flex-fill">
                    <i class="fas fa-redo"></i>
                </a>
            </div>
        </div>
    </form>
</div>

<!-- Orders Table -->
<div class="table-card">
    <div class="card-body p-0">
        @if($orders->count() > 0)
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="table-light">
                        <tr>
                            <th width="150">Mã đơn hàng</th>
                            <th>Thông tin khách hàng</th>
                            <th width="150" class="text-end">Tổng tiền</th>
                            <th width="150" class="text-center">Trạng thái</th>
                            <th width="130">Ngày đặt</th>
                            <th width="100" class="text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($orders as $order)
                        <tr>
                            <td>
                                <div class="order-code">{{ $order->order_code }}</div>
                            </td>
                            <td>
                                <div class="fw-bold text-dark">{{ $order->shipping_name }}</div>
                                <small class="text-muted d-block">
                                    <i class="fas fa-phone me-1"></i>{{ $order->shipping_phone }}
                                </small>
                                @if($order->shipping_email)
                                    <small class="text-muted d-block">
                                        <i class="fas fa-envelope me-1"></i>{{ $order->shipping_email }}
                                    </small>
                                @endif
                            </td>
                            <td class="text-end">
                                <div class="fw-bold text-success fs-6">
                                    ${{ number_format($order->total_amount, 2) }}
                                </div>
                            </td>
                            <td class="text-center">
                                @php
                                    $statusConfig = [
                                        'pending' => ['label' => 'Chờ xác nhận', 'class' => 'bg-warning text-dark'],
                                        'confirmed' => ['label' => 'Đã xác nhận', 'class' => 'bg-info text-white'],
                                        'shipping' => ['label' => 'Đang giao', 'class' => 'bg-primary text-white'],
                                        'delivered' => ['label' => 'Đã giao', 'class' => 'bg-success text-white'],
                                        'cancelled' => ['label' => 'Đã hủy', 'class' => 'bg-danger text-white']
                                    ];
                                    $status = $statusConfig[$order->status] ?? ['label' => ucfirst($order->status), 'class' => 'bg-secondary'];
                                @endphp
                                <span class="order-status-badge {{ $status['class'] }}">
                                    {{ $status['label'] }}
                                </span>
                            </td>
                            <td>
                                <div>{{ $order->created_at->format('d/m/Y') }}</div>
                                <small class="text-muted">{{ $order->created_at->format('H:i') }}</small>
                            </td>
                            <td class="text-center">
                                <a href="{{ route('admin.orders.show', $order) }}"
                                   class="btn btn-sm btn-outline-info"
                                   title="Xem chi tiết"
                                   data-bs-toggle="tooltip">
                                    <i class="fas fa-eye"></i>
                                </a>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="d-flex justify-content-between align-items-center p-3 border-top">
                <div class="text-muted small">
                    Hiển thị {{ $orders->firstItem() }} đến {{ $orders->lastItem() }}
                    trong tổng số {{ $orders->total() }} đơn hàng
                </div>
                {{ $orders->links() }}
            </div>
        @else
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart display-1 text-muted mb-3"></i>
                <h4 class="mt-3">Chưa có đơn hàng</h4>
                <p class="text-muted">Đơn hàng từ khách hàng sẽ xuất hiện ở đây.</p>
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