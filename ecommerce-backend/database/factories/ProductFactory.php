<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $candleNames = [
            'Nến thơm Lavender',
            'Nến thơm Vanilla',
            'Nến thơm Hoa hồng',
            'Nến tinh dầu Sả chanh',
            'Nến thơm Quế',
            'Nến thơm Jasmine',
            'Nến thơm Eucalyptus',
            'Nến thơm Ocean',
            'Nến thơm Coffee',
            'Nến thơm Green Tea',
            'Nến thơm Sandalwood',
            'Nến thơm Peppermint',
            'Nến thơm Citrus',
            'Nến thơm Coconut',
            'Nến thơm Strawberry',
        ];

        $fragrances = [
            'Lavender', 'Vanilla', 'Rose', 'Lemongrass', 
            'Cinnamon', 'Jasmine', 'Eucalyptus', 'Ocean',
            'Coffee', 'Green Tea', 'Sandalwood', 'Peppermint',
            'Citrus', 'Coconut', 'Strawberry'
        ];

        $materials = [
            'Sáp đậu nành',
            'Sáp ong tự nhiên',
            'Sáp paraffin',
            'Sáp thực vật',
            'Sáp gel',
        ];

        $name = $this->faker->randomElement($candleNames);
        $price = $this->faker->randomFloat(2, 50000, 500000);
        $hasSale = $this->faker->boolean(30); // 30% chance of sale

        return [
            'name' => $name,
            'slug' => Str::slug($name) . '-' . $this->faker->unique()->numberBetween(1000, 9999),
            'description' => $this->faker->paragraph(3),
            'price' => $price,
            'sale_price' => $hasSale ? $price * $this->faker->randomFloat(2, 0.7, 0.9) : null,
            'sku' => 'CANDLE-' . strtoupper($this->faker->bothify('??###')),
            'category_id' => Category::inRandomOrder()->first()?->id ?? 1,
            'material' => $this->faker->randomElement($materials),
            'fragrance' => $this->faker->randomElement($fragrances),
            'in_stock' => $this->faker->numberBetween(0, 100),
            'is_active' => $this->faker->boolean(90), // 90% active
            'featured' => $this->faker->boolean(20), // 20% featured
            'weight' => $this->faker->randomFloat(2, 50, 500),
        ];
    }
}
