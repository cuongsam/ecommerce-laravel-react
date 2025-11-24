<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Kiểm tra user đã đăng nhập chưa
        if (!Auth::check()) {
            return redirect()->route('admin.login')->with('error', 'Vui lòng đăng nhập');
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Kiểm tra có phải admin không
        if ($user->role !== 'admin') {
            abort(403, 'Bạn không có quyền truy cập trang này');
        }

        return $next($request);
    }
}