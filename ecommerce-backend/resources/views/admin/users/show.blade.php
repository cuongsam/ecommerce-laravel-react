@extends('layouts.admin')

@section('title', 'Chi tiết người dùng')
@section('page-title', 'Chi tiết người dùng: ' . $user->name)

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-md-4">
            <!-- User Profile Card -->
            <div class="card mb-4">
                <div class="card-body text-center">
                    <img src="{{ $user->avatar_url }}" alt="{{ $user->name }}" class="rounded-circle mb-3" style="width: 150px; height: 150px; object-fit: cover;">
                    <h4>{{ $user->name }}</h4>
                    <p class="text-muted">{{ $user->email }}</p>
                    
                    @if($user->role == 'admin')
                        <span class="badge bg-danger mb-3">Admin</span>
                    @else
                        <span class="badge bg-info mb-3">User</span>
                    @endif

                    @if($user->is_active)
                        <span class="badge bg-success mb-3">Hoạt động</span>
                    @else
                        <span class="badge bg-secondary mb-3">Không hoạt động</span>
                    @endif

                    <hr>
                    
                    <div class="d-grid gap-2">
                        <a href="{{ route('admin.users.edit', $user) }}" class="btn btn-warning">
                            <i class="fas fa-edit"></i> Chỉnh sửa
                        </a>
                        <a href="{{ route('admin.users.index') }}" class="btn btn-secondary">
                            <i class="fas fa-arrow-left"></i> Quay lại
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-8">
            <!-- User Details Card -->
            <div class="card mb-4">
                <div class="card-header">
                    <h5 class="mb-0">Thông tin chi tiết</h5>
                </div>
                <div class="card-body">
                    <table class="table table-borderless">
                        <tbody>
                            <tr>
                                <th width="200">ID:</th>
                                <td>{{ $user->id }}</td>
                            </tr>
                            <tr>
                                <th>Tên:</th>
                                <td>{{ $user->name }}</td>
                            </tr>
                            <tr>
                                <th>Email:</th>
                                <td>{{ $user->email }}</td>
                            </tr>
                            <tr>
                                <th>Số điện thoại:</th>
                                <td>{{ $user->phone ?? 'N/A' }}</td>
                            </tr>
                            <tr>
                                <th>Địa chỉ:</th>
                                <td>{{ $user->address ?? 'N/A' }}</td>
                            </tr>
                            <tr>
                                <th>Vai trò:</th>
                                <td>
                                    @if($user->role == 'admin')
                                        <span class="badge bg-danger">Admin</span>
                                    @else
                                        <span class="badge bg-info">User</span>
                                    @endif
                                </td>
                            </tr>
                            <tr>
                                <th>Trạng thái:</th>
                                <td>
                                    @if($user->is_active)
                                        <span class="badge bg-success">Hoạt động</span>
                                    @else
                                        <span class="badge bg-secondary">Không hoạt động</span>
                                    @endif
                                </td>
                            </tr>
                            <tr>
                                <th>Email đã xác thực:</th>
                                <td>
                                    @if($user->email_verified_at)
                                        <span class="text-success"><i class="fas fa-check-circle"></i> Đã xác thực</span>
                                        <small class="text-muted d-block">{{ $user->email_verified_at->format('d/m/Y H:i') }}</small>
                                    @else
                                        <span class="text-warning"><i class="fas fa-exclamation-circle"></i> Chưa xác thực</span>
                                    @endif
                                </td>
                            </tr>
                            <tr>
                                <th>Đăng nhập lần cuối:</th>
                                <td>{{ $user->last_login_at ? $user->last_login_at->format('d/m/Y H:i') : 'Chưa đăng nhập' }}</td>
                            </tr>
                            <tr>
                                <th>Ngày tạo:</th>
                                <td>{{ $user->created_at->format('d/m/Y H:i') }}</td>
                            </tr>
                            <tr>
                                <th>Cập nhật lần cuối:</th>
                                <td>{{ $user->updated_at->format('d/m/Y H:i') }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- User Activity Card (có thể mở rộng sau) -->
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Hoạt động gần đây</h5>
                </div>
                <div class="card-body">
                    <p class="text-muted text-center py-4">
                        <i class="fas fa-clock fa-2x mb-3 d-block"></i>
                        Chức năng đang được phát triển
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
