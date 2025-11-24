@extends('layouts.admin')

@section('title', isset($product) ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới')
@section('page-title', isset($product) ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới')

@push('styles')
<style>
    .form-card {
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        border: 1px solid #f0f0f0;
        padding: 30px;
        margin-bottom: 25px;
    }

    .form-section-title {
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

    .form-section-title i {
        color: var(--primary-color);
    }

    .form-label {
        font-weight: 600;
        color: #495057;
        margin-bottom: 8px;
        font-size: 14px;
    }

    .form-label .required {
        color: #dc3545;
    }

    .form-control, .form-select {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 10px 15px;
        font-size: 14px;
        transition: all 0.3s ease;
    }

    .form-control:focus, .form-select:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 0.2rem rgba(139, 115, 85, 0.15);
    }

    /* Image Upload Section */
    .image-upload-section {
        border: 2px dashed #e0e0e0;
        border-radius: 12px;
        padding: 30px;
        text-align: center;
        transition: all 0.3s ease;
        background: #f8f9fa;
        cursor: pointer;
        position: relative;
    }

    .image-upload-section:hover {
        border-color: var(--primary-color);
        background: rgba(139, 115, 85, 0.05);
    }

    .upload-icon {
        font-size: 48px;
        color: var(--primary-color);
        margin-bottom: 15px;
    }

    .upload-text h6 {
        color: #2c3e50;
        font-weight: 600;
        margin-bottom: 8px;
    }

    .upload-text p {
        color: #6c757d;
        font-size: 13px;
        margin: 0;
    }

    #productImages {
        display: none;
    }

    /* Image Preview */
    .image-preview-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 15px;
        margin-top: 20px;
    }

    .image-preview-item {
        position: relative;
        border-radius: 10px;
        overflow: hidden;
        border: 2px solid #e0e0e0;
        aspect-ratio: 1;
        background: #f8f9fa;
    }

    .image-preview-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .image-preview-item .remove-image {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: rgba(220, 53, 69, 0.9);
        color: #fff;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        font-size: 14px;
    }

    .image-preview-item:hover .remove-image {
        opacity: 1;
    }

    .image-preview-item .primary-badge {
        position: absolute;
        bottom: 8px;
        left: 8px;
        background: var(--primary-color);
        color: #fff;
        padding: 4px 10px;
        border-radius: 15px;
        font-size: 11px;
        font-weight: 600;
    }

    /* Action Buttons */
    .action-buttons-section {
        background: #fff;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        border: 1px solid #f0f0f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: sticky;
        bottom: 20px;
        z-index: 100;
    }

    .btn-save {
        background: var(--primary-color);
        color: #fff;
        padding: 12px 30px;
        border-radius: 10px;
        border: none;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .btn-save:hover {
        background: #6d5a43;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(139, 115, 85, 0.3);
    }

    .btn-cancel {
        background: #6c757d;
        color: #fff;
        padding: 12px 30px;
        border-radius: 10px;
        border: none;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .btn-cancel:hover {
        background: #5a6268;
    }

    /* Switch Toggle */
    .form-switch {
        padding-left: 2.5em;
    }

    .form-switch .form-check-input {
        width: 3em;
        height: 1.5em;
        cursor: pointer;
    }

    .form-switch .form-check-input:checked {
        background-color: var(--primary-color);
        border-color: var(--primary-color);
    }
</style>
@endpush

@section('content')
<div class="container-fluid">
    <form action="{{ isset($product) ? route('admin.products.update', $product->id) : route('admin.products.store') }}" 
          method="POST" 
          id="productForm" 
          enctype="multipart/form-data">
        @csrf
        @if(isset($product))
            @method('PUT')
        @endif

        <div class="row">
            <!-- Left Column -->
            <div class="col-lg-8">
                <!-- Basic Information -->
                <div class="form-card">
                    <div class="form-section-title">
                        <i class="fas fa-info-circle"></i>
                        Thông tin cơ bản
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Tên sản phẩm <span>*</span></label>
                        <input type="text" 
                               class="form-control @error('name') is-invalid @enderror" 
                               name="name" 
                               id="productName"
                               value="{{ old('name', $product->name ?? '') }}" 
                               placeholder="Nhập tên sản phẩm">
                        @error('name')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Slug</label>
                        <input type="text" 
                               class="form-control @error('slug') is-invalid @enderror" 
                               name="slug" 
                               id="productSlug"
                               value="{{ old('slug', $product->slug ?? '') }}" 
                               placeholder="ten-san-pham">
                        @error('slug')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Mô tả</label>
                        <textarea class="form-control @error('description') is-invalid @enderror" 
                                  name="description" 
                                  rows="4" 
                                  placeholder="Mô tả chi tiết về sản phẩm">{{ old('description', $product->description ?? '') }}</textarea>
                        @error('description')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                </div>

                <!-- Pricing & Inventory -->
                <div class="form-card">
                    <div class="form-section-title">
                        <i class="fas fa-tags"></i>
                        Giá & Tồn kho
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Giá gốc <span class="required">*</span></label>
                                <input type="number" 
                                       class="form-control @error('price') is-invalid @enderror" 
                                       name="price" 
                                       value="{{ old('price', $product->price ?? '') }}" 
                                       placeholder="0.00"
                                       step="0.01">
                                @error('price')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Giá khuyến mãi</label>
                                <input type="number" 
                                       class="form-control @error('sale_price') is-invalid @enderror" 
                                       name="sale_price" 
                                       value="{{ old('sale_price', $product->sale_price ?? '') }}" 
                                       placeholder="0.00">
                                @error('sale_price')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">SKU <span>*</span></label>
                                <input type="text" 
                                       class="form-control @error('sku') is-invalid @enderror" 
                                       name="sku" 
                                       value="{{ old('sku', $product->sku ?? '') }}" 
                                       placeholder="Mã sản phẩm">
                                @error('sku')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Số lượng <span>*</span></label>
                                <input type="number" 
                                       class="form-control @error('in_stock') is-invalid @enderror" 
                                       name="in_stock" 
                                       value="{{ old('in_stock', $product->in_stock ?? 0) }}" 
                                       placeholder="0">
                                @error('in_stock')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Product Images -->
                <div class="form-card">
                    <div class="form-section-title">
                        <i class="fas fa-images"></i>
                        Hình ảnh sản phẩm
                    </div>

                    <div class="image-upload-section" id="imageUploadArea" onclick="document.getElementById('productImages').click()">
                        <div class="upload-icon">
                            <i class="fas fa-cloud-upload-alt"></i>
                        </div>
                        <div class="upload-text">
                            <h6>Kéo thả ảnh vào đây hoặc click để chọn</h6>
                            <p>Hỗ trợ: JPG, PNG, WEBP. Tối đa 5MB mỗi ảnh</p>
                        </div>
                        <input type="file" 
                               id="productImages" 
                               name="images[]" 
                               multiple 
                               accept="image/*"
                               onchange="handleImageUpload(this.files)">
                    </div>

                    <div class="image-preview-container" id="imagePreviewContainer">
                        @if(isset($product) && $product->images->count() > 0)
                            @foreach($product->images as $image)
                            <div class="image-preview-item">
                                <img src="{{ asset($image->image_path) }}" alt="Product Image">
                                @if($image->is_primary)
                                    <span class="primary-badge">Ảnh chính</span>
                                @endif
                                <button type="button" class="remove-image" onclick="removeImage(this)">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            @endforeach
                        @endif
                    </div>
                </div>
            </div>

            <!-- Right Column -->
            <div class="col-lg-4">
                <!-- Status & Organization -->
                <div class="form-card">
                    <div class="form-section-title">
                        <i class="fas fa-toggle-on"></i>
                        Trạng thái & Phân loại
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Danh mục <span class="required">*</span></label>
                        <select class="form-select @error('category_id') is-invalid @enderror" name="category_id">
                            <option value="">Chọn danh mục</option>
                            @foreach($categories as $category)
                                <option value="{{ $category->id }}" 
                                    {{ old('category_id', $product->category_id ?? '') == $category->id ? 'selected' : '' }}>
                                    {{ $category->name }}
                                </option>
                            @endforeach
                        </select>
                        @error('category_id')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="mb-3">
                        <div class="form-check form-switch">
                            <input class="form-check-input" 
                                   type="checkbox" 
                                   id="statusSwitch" 
                                   name="is_active" 
                                   value="1"
                                   {{ old('is_active', $product->is_active ?? 1) ? 'checked' : '' }}>
                            <label class="form-check-label" for="statusSwitch">
                                Hiển thị sản phẩm
                            </label>
                        </div>
                    </div>

                    <div class="mb-3">
                        <div class="form-check form-switch">
                            <input class="form-check-input" 
                                   type="checkbox" 
                                   id="featuredSwitch" 
                                   name="featured" 
                                   value="1"
                                   {{ old('featured', $product->featured ?? 0) ? 'checked' : '' }}>
                            <label class="form-check-label" for="featuredSwitch">
                                Sản phẩm nổi bật
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Product Attributes -->
                <div class="form-card">
                    <div class="form-section-title">
                        <i class="fas fa-cube"></i>
                        Thuộc tính sản phẩm
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Chất liệu</label>
                        <input type="text" 
                               class="form-control" 
                               name="material" 
                               value="{{ old('material', $product->material ?? '') }}" 
                               placeholder="Ví dụ: Sáp đậu nành">
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Hương thơm</label>
                        <input type="text" 
                               class="form-control" 
                               name="fragrance" 
                               value="{{ old('fragrance', $product->fragrance ?? '') }}" 
                               placeholder="Ví dụ: Lavender, Vanilla">
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Trọng lượng (gram)</label>
                        <input type="number" 
                               class="form-control" 
                               name="weight" 
                               value="{{ old('weight', $product->weight ?? '') }}" 
                               placeholder="0"
                               step="0.01">
                    </div>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons-section">
            <a href="{{ route('admin.products.index') }}" class="btn btn-cancel">
                <i class="fas fa-arrow-left me-2"></i>Quay lại
            </a>
            <button type="submit" class="btn btn-save">
                <i class="fas fa-save me-2"></i>
                {{ isset($product) ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm' }}
            </button>
        </div>
    </form>
</div>
@endsection

@push('scripts')
<script>
    // Auto-generate slug from product name
    document.getElementById('productName').addEventListener('input', function() {
        const name = this.value;
        const slugField = document.getElementById('productSlug');

        // Convert Vietnamese to non-accented
        const vnString = name;
        const accentMap = {
            'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a', 'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
            'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
            'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
            'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
            'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
            'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
            'đ': 'd',
            'À': 'A', 'Á': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ã': 'A', 'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
            'È': 'E', 'É': 'E', 'Ẹ': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',
            'Ì': 'I', 'Í': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
            'Ò': 'O', 'Ó': 'O', 'Ọ': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',
            'Ù': 'U', 'Ú': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ử': 'U', 'Ữ': 'U',
            'Ỳ': 'Y', 'Ý': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
            'Đ': 'D'
        };

        let slug = vnString;
        for (let char in accentMap) {
            slug = slug.replace(new RegExp(char, 'g'), accentMap[char]);
        }

        slug = slug.toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        if (!slugField.value || slugField.dataset.autoFilled) {
            slugField.value = slug;
            slugField.dataset.autoFilled = 'true';
        }
    });

    // Reset auto-fill flag when user manually edits slug
    document.getElementById('productSlug').addEventListener('input', function() {
        this.dataset.autoFilled = 'false';
    });

    // Handle image upload and preview
    function handleImageUpload(files) {
        const previewContainer = document.getElementById('imagePreviewContainer');

        Array.from(files).forEach((file, index) => {
            if (!file.type.startsWith('image/')) {
                alert('File ' + file.name + ' không phải là hình ảnh!');
                return;
            }

            // Kiểm tra kích thước file (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File ' + file.name + ' vượt quá kích thước cho phép (5MB)!');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const previewItem = document.createElement('div');
                previewItem.className = 'image-preview-item';
                previewItem.setAttribute('data-index', index);

                const img = document.createElement('img');
                img.src = e.target.result;

                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'remove-image';
                removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                removeBtn.onclick = function() {
                    previewItem.remove();
                };

                previewItem.appendChild(img);
                previewItem.appendChild(removeBtn);
                previewContainer.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        });
    }

    // Remove image
    function removeImage(button) {
        button.closest('.image-preview-item').remove();
    }

    // Drag and drop functionality
    const uploadArea = document.getElementById('imageUploadArea');

    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.borderColor = 'var(--primary-color)';
        this.style.background = 'rgba(139, 115, 85, 0.1)';
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.borderColor = '#e0e0e0';
        this.style.background = '#f8f9fa';
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.borderColor = '#e0e0e0';
        this.style.background = '#f8f9fa';

        const files = e.dataTransfer.files;
        handleImageUpload(files);

        // Update file input
        const dataTransfer = new DataTransfer();
        Array.from(files).forEach(file => dataTransfer.items.add(file));
        document.getElementById('productImages').files = dataTransfer.files;
    });

    // Form validation
    document.getElementById('productForm').addEventListener('submit', function(e) {
        const requiredFields = ['name', 'price', 'sku', 'category_id'];
        let isValid = true;

        requiredFields.forEach(fieldName => {
            const field = document.querySelector(`[name="${fieldName}"]`);
            if (!field || !field.value.trim()) {
                isValid = false;
                if (field) {
                    field.classList.add('is-invalid');
                }
            }
        });

        if (!isValid) {
            e.preventDefault();
            alert('Vui lòng điền đầy đủ các trường bắt buộc!');
        }
    });
</script>
@endpush