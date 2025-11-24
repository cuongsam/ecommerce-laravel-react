<?php

namespace Database\Factories;

use App\Models\ProductImage;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductImageFactory extends Factory
{
    protected $model = ProductImage::class;

    public function definition(): array
    {
        // Use placeholder image service
        $width = 600;
        $height = 600;
        $imageUrl = "https://picsum.photos/{$width}/{$height}?random=" . $this->faker->numberBetween(1, 1000);
        
        return [
            'product_id' => Product::factory(),
            'image_path' => $imageUrl,
            'is_primary' => false,
            'alt_text' => $this->faker->sentence(3),
        ];
    }

    public function primary()
    {
        return $this->state(function (array $attributes) {
            return [
                'is_primary' => true,
            ];
        });
    }
}
