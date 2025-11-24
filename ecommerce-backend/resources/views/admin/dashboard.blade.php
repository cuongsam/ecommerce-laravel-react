@extends('layouts.admin')

@section('title', 'Dashboard')
@section('page-title', 'Tổng quan')

@push('styles')
<style>
    .chart-card {
        background: #fff;
        border-radius: 12px;
        padding: 25px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        margin-bottom: 20px;
        border: 1px solid #f0f0f0;
    }   

    .chart-card h5 {
        font-size: 18px;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 2px solid #f0f0f0;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .chart-card h5 i {
        color: var(--primary-color);
    }

    .table-card {
        background: #fff;
        border-radius: 12px;
        padding: 25px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        border: 1px solid #f0f0f0;
    }

    .table-card h5 {
        font-size: 18px;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .custom-table {
        width: 100%;
        border-collapse: collapse;
    }

    .custom-table thead {
        background: #f8f9fa;
    }

    .custom-table th {
        padding: 12px 15px;
        font-weight: 600;
        color: #495057;
        font-size: 14px;
        border: none;
        text-align: left;
    }

    .custom-table td {
        padding: 12px 15px;
        color: #6c757d;
        font-size: 14px;
        border-bottom: 1px solid #f0f0f0;
    }

    .custom-table tbody tr:hover {
        background: #f8f9fa;
    }

    .badge-status {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
    }

    .badge-pending {
        background: #fff3cd;
        color: #856404;
    }

    .badge-processing {
        background: #cce5ff;
        color: #004085;
    }

    .badge-completed {
        background: #d4edda;
        color: #155724;
    }

    .badge-cancelled {
        background: #f8d7da;
        color: #721c24;
    }

    .product-img {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 8px;
    }

    .list-group-item {
        border: none;
        padding: 15px 0;
        border-bottom: 1px solid #f0f0f0;
    }

    .list-group-item:last-child {
        border-bottom: none;
    }
</style>
@endpush

@section('content')
<div class="container-fluid">
    <!-- Stats Cards Row -->
    <div class="row mb-4">
        <div class="col-xl-3 col-lg-6 col-md-6">
            <div class="stats-card">
                <div class="stats-icon primary">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <div class="stats-number">${{ number_format($totalRevenue, 2) }}</div>
                <div class="stats-label">Doanh thu tháng này</div>
                <div class="stats-change positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>12.5% so với tháng trước</span>
                </div>
            </div>
        </div>

        <div class="col-xl-3 col-lg-6 col-md-6">
            <div class="stats-card">
                <div class="stats-icon success">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <div class="stats-number">{{ $totalOrders }}</div>
                <div class="stats-label">Đơn hàng mới</div>
                <div class="stats-change positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>8.3% so với tháng trước</span>
                </div>
            </div>
        </div>

        <div class="col-xl-3 col-lg-6 col-md-6">
            <div class="stats-card">
                <div class="stats-icon warning">
                    <i class="fas fa-box"></i>
                </div>
                <div class="stats-number">{{ $totalProducts }}</div>
                <div class="stats-label">Tổng sản phẩm</div>
                <div class="stats-change positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>15 sản phẩm mới</span>
                </div>
            </div>
        </div>

        <div class="col-xl-3 col-lg-6 col-md-6">
            <div class="stats-card">
                <div class="stats-icon danger">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stats-number">{{ $totalCategories }}</div>
                <div class="stats-label">Danh mục</div>
                <div class="stats-change positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>5 danh mục mới</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Charts Row -->
    <div class="row mb-4">
        <div class="col-xl-8 col-lg-7">
            <div class="chart-card">
                <h5><i class="fas fa-chart-line me-2"></i>Biểu đồ doanh thu 12 tháng</h5>
                <canvas id="revenueChart" height="80"></canvas>
            </div>
        </div>

        <div class="col-xl-4 col-lg-5">
            <div class="chart-card">
                <h5><i class="fas fa-chart-pie me-2"></i>Top danh mục bán chạy</h5>
                <canvas id="categoryChart" height="160"></canvas>
            </div>
        </div>
    </div>

    <!-- Recent Orders & Top Products -->
    <div class="row">
        <div class="col-xl-8">
            <div class="table-card">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="mb-0"><i class="fas fa-shopping-bag me-2"></i>Đơn hàng gần đây</h5>
                    <a href="{{ route('admin.orders.index') }}" class="btn btn-sm btn-outline-primary">
                        Xem tất cả <i class="fas fa-arrow-right ms-1"></i>
                    </a>
                </div>
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Khách hàng</th>
                                <th>Sản phẩm</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Ngày đặt</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($recentOrders as $order)
                            <tr>
                                <td><strong>{{ $order->order_code }}</strong></td>
                                <td>{{ $order->shipping_name }}</td>
                                <td>
                                    @foreach($order->items->take(1) as $item)
                                        {{ $item->product->name }}
                                        @if($order->items->count() > 1)
                                            + {{ $order->items->count() - 1 }} sản phẩm khác
                                        @endif
                                    @endforeach
                                </td>
                                <td><strong>${{ number_format($order->total_amount, 2) }}</strong></td>
                                <td>
                                    <span class="badge-status 
                                        @if($order->status == 'pending') badge-pending
                                        @elseif($order->status == 'confirmed') badge-processing
                                        @elseif($order->status == 'shipping') badge-processing
                                        @elseif($order->status == 'delivered') badge-completed
                                        @else badge-cancelled @endif">
                                        {{ ucfirst($order->status) }}
                                    </span>
                                </td>
                                <td>{{ $order->created_at->format('d/m/Y') }}</td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="col-xl-4">
            <div class="table-card">
                <h5 class="mb-3"><i class="fas fa-fire me-2"></i>Sản phẩm bán chạy</h5>
                <div class="list-group list-group-flush">
                    @foreach($topProducts as $product)
                    <div class="list-group-item d-flex align-items-center">
                        @if($product->primaryImage)
                            <img src="{{ asset($product->primaryImage->image_path) }}" alt="{{ $product->name }}" class="product-img me-3">
                        @else
                            <div class="product-img bg-light d-flex align-items-center justify-content-center me-3">
                                <i class="fas fa-box text-muted"></i>
                            </div>
                        @endif
                        <div class="flex-grow-1">
                            <h6 class="mb-0" style="font-size: 14px;">{{ Str::limit($product->name, 25) }}</h6>
                            <small class="text-muted">Đã bán: {{ $product->total_sold ?? 0 }} sản phẩm</small>
                        </div>
                        <strong class="text-success">${{ number_format($product->price, 2) }}</strong>
                    </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<!-- Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

<script>
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: @json($chartLabels),
            datasets: [{
                label: 'Doanh thu ($)',
                data: @json($chartData),
                borderColor: '#8B7355',
                backgroundColor: 'rgba(139, 115, 85, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#8B7355',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return 'Doanh thu: $' + context.parsed.y;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        borderDash: [5, 5],
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Category Chart
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: ['Nến thơm', 'Tinh dầu', 'Sữa tắm', 'Dầu gội', 'Khác'],
            datasets: [{
                data: [45, 25, 15, 10, 5],
                backgroundColor: [
                    '#8B7355',
                    '#D4A574',
                    '#C19A6B',
                    '#A67C52',
                    '#E5C9A8'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });

    // Auto refresh data every 30 seconds
    setInterval(function() {
        console.log('Refreshing dashboard data...');
    }, 30000);
</script>
@endpush