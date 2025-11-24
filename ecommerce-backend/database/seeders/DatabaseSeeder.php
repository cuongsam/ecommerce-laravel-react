<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Review;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user if not exists
        if (!User::where('email', 'admin@example.com')->exists()) {
            User::factory()->create([
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'role' => '2',
                'password' => bcrypt('123123'),
            ]);
        }

        // Create regular users
        User::factory(10)->create();

        // Create categories
        Category::factory()->create([
            'name' => 'Nến thơm',
            'slug' => 'nen-thom',
            'description' => 'Các loại nến thơm cao cấp với nhiều mùi hương khác nhau',
            'status' => true,
        ]);

        Category::factory()->create([
            'name' => 'Nến trang trí',
            'slug' => 'nen-trang-tri',
            'description' => 'Nến trang trí đẹp mắt cho nhiều dịp khác nhau',
            'status' => true,
        ]);

        Category::factory()->create([
            'name' => 'Nến tinh dầu',
            'slug' => 'nen-tinh-dau',
            'description' => 'Nến tinh dầu thiên nhiên giúp thư giãn',
            'status' => true,
        ]);

        Category::factory()->create([
            'name' => 'Nến handmade',
            'slug' => 'nen-handmade',
            'description' => 'Nến làm thủ công với chất liệu cao cấp',
            'status' => true,
        ]);

        Category::factory()->create([
            'name' => 'Nến sáp đậu nành',
            'slug' => 'nen-sap-dau-nanh',
            'description' => 'Nến từ sáp đậu nành tự nhiên, thân thiện môi trường',
            'status' => true,
        ]);

        // Create products
        Product::factory(50)->create();

        // Create product images (1 primary + 2-3 secondary for each product)
        Product::all()->each(function ($product) {
            // Primary image
            ProductImage::factory()->primary()->create([
                'product_id' => $product->id,
            ]);

            // Secondary images (2-3 random)
            ProductImage::factory(rand(2, 3))->create([
                'product_id' => $product->id,
            ]);
        });

        // Create reviews
        Review::factory(100)->create();

        $this->command->info('Database seeded successfully!');
        $this->command->info('Admin credentials:');
        $this->command->info('Email: admin@example.com');
        $this->command->info('Password: 123123');
    }
}

