<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        $name = $this->faker->randomElement([
            'Nến thơm',
            'Nến trang trí',
            'Nến sinh nhật',
            'Nến tinh dầu',
            'Nến handmade',
            'Nến sáp ong',
            'Nến sáp đậu nành',
            'Nến thảo mộc',
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $this->faker->sentence(10),
            'image' => $this->faker->imageUrl(400, 300, 'candles', true),
            'status' => true,
        ];
    }
}
