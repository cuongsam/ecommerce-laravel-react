<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Log;


class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category', 'images');

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('sku', 'like', '%' . $request->search . '%')
                    ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Filters
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->status);
        }

        if ($request->filled('featured')) {
            $query->where('featured', $request->featured);
        }

        if ($request->filled('stock')) {
            if ($request->stock == 'low') {
                $query->where('in_stock', '<', 10);
            } elseif ($request->stock == 'out') {
                $query->where('in_stock', 0);
            }
        }

        $products = $query->latest()->paginate(12);
        $categories = Category::where('status', true)->get();

        return view('admin.products.index', compact('products', 'categories'));
    }

    public function create()
    {
        $categories = Category::where('status', true)->get();
        return view('admin.products.create', compact('categories'));
    }



    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:products,slug',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
        'sale_price' => 'nullable|numeric|min:0|lt:price',
        'sku' => 'required|string|unique:products,sku',
        'category_id' => 'required|exists:categories,id',
        'material' => 'nullable|string|max:255',
        'fragrance' => 'nullable|string|max:255',
        'in_stock' => 'required|integer|min:0',
        'weight' => 'nullable|numeric|min:0',
        'is_active' => 'boolean',
        'featured' => 'boolean',
        'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120', // Tăng kích thước lên 5MB
    ]);

    if (empty($validated['slug'])) {
        $validated['slug'] = Str::slug($validated['name']);
    }

    $product = Product::create($validated);


   
      if ($request->hasFile('images')) {
        Log::info('Total images received: ' . count($request->file('images')));  // Nên log 4

        foreach ($request->file('images') as $index => $image) {
            Log::info("Processing image $index: " . $image->getClientOriginalName());

            try {
                $filename = time() . '_product_' . $index . '.' . $image->getClientOriginalExtension();
                $path = public_path('storage/products/' . $filename);

                if (!file_exists(public_path('storage/products'))) {
                    mkdir(public_path('storage/products'), 0777, true);
                    Log::info('Created directory: storage/products');
                }

                $manager = new ImageManager(new Driver());
                $manager->read($image)->scaleDown(400, 400)->save($path);

                Log::info("Saved image $index to: $path");

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => 'storage/products/' . $filename,
                    'is_primary' => $index === 0,
                    'alt_text' => $validated['name'] . ' image ' . ($index + 1),
                    'created_at' => now(),
                ]);

                Log::info("Inserted DB for image $index");
            } catch (\Exception $e) {
                Log::error("Error processing image $index: " . $e->getMessage());
            }
        }
    }

    return redirect()->route('admin.products.index')->with('success', 'Tạo sản phẩm thành công.');
}
    public function show(Product $product)
    {
        $product->load('category', 'images', 'reviews.user');
        return view('admin.products.show', compact('product'));
    }

    public function edit(Product $product)
    {
        $categories = Category::where('status', true)->get();
        $product->load('images');
        return view('admin.products.edit', compact('product', 'categories'));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:products,name,' . $product->id,
            'slug' => 'required|string|unique:products,slug,' . $product->id,
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:price',
            'sku' => 'required|string|unique:products,sku,' . $product->id,
            'category_id' => 'required|exists:categories,id',
            'material' => 'nullable|string|max:255',
            'fragrance' => 'nullable|string|max:255',
            'in_stock' => 'required|integer|min:0',
            'weight' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
            'featured' => 'boolean',
           'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
    ]);


        $product->update($validated);

        // Handle new image uploads
        if ($request->hasFile('images')) {
        foreach ($request->file('images') as $index => $image) {
            $filename = 'product_' . time() . '_' . $index . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $path = public_path('storage/products/' . $filename);

            $manager = new ImageManager(new Driver());
            $manager->read($image)
                ->scaleDown(800, 800)
                ->save($path);

            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => 'storage/products/' . $filename,
                'is_primary' => false, // Không đặt ảnh mới làm ảnh chính mặc định
                'alt_text' => $validated['name'] . ' image ' . ($index + 1),
            ]);
        }
    }

        // Handle primary image change
        if ($request->filled('primary_image')) {
        ProductImage::where('product_id', $product->id)->update(['is_primary' => false]);
        ProductImage::where('id', $request->primary_image)->update(['is_primary' => true]);
    }

    return redirect()->route('admin.products.index')
        ->with('success', 'Cập nhật sản phẩm thành công.');
}

    public function destroy(Product $product)
    {
        // Delete product images
        foreach ($product->images as $image) {
            if (file_exists(public_path($image->image_path))) {
                unlink(public_path($image->image_path));
            }
            $image->delete();
        }

        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Xóa sản phẩm thành công.');
    }

   public function uploadTempImage(Request $request)
{
    $request->validate([
        'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
    ]);

    if ($request->hasFile('image')) {
        $image = $request->file('image');
        $filename = 'temp_' . time() . '.' . $image->getClientOriginalExtension();
        $path = public_path('storage/temp/' . $filename);

        // Tạo thư mục nếu chưa có
        if (!file_exists(public_path('storage/temp'))) {
            mkdir(public_path('storage/temp'), 0777, true);
        }

        // ✅ Sử dụng driver đúng kiểu (v3.x)
        $imageManager = new ImageManager(new Driver());
        $imageManager->read($image)->scaleDown(400, 400)->save($path);

        return response()->json([
            'success' => true,
            'location' => asset('storage/temp/' . $filename)
        ]);
    }

    return response()->json(['success' => false], 400);
}

    public function deleteImage(ProductImage $image)
    {
        if (file_exists(public_path($image->image_path))) {
            unlink(public_path($image->image_path));
        }

        $image->delete();

        return response()->json(['success' => true]);
    }
}
