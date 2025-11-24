<?php

namespace Database\Factories;

use App\Models\Review;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
{
    protected $model = Review::class;

    public function definition(): array
    {
        $reviews = [
            'Sản phẩm rất tuyệt vời, mùi thơm dễ chịu!',
            'Nến cháy đều, không bị đen khói. Rất hài lòng!',
            'Chất lượng tốt, giá cả hợp lý.',
            'Mùi hương rất thư giãn, phù hợp để thắp vào buổi tối.',
            'Đóng gói đẹp, sản phẩm chất lượng cao.',
            'Nến thơm lâu, mùi không quá nồng.',
            'Rất đáng để mua, sẽ ủng hộ shop tiếp!',
            'Sản phẩm đúng như mô tả, giao hàng nhanh.',
            'Mùi thơm tự nhiên, không gây kích ứng.',
            'Thiết kế đẹp mắt, phù hợp làm quà tặng.',
        ];

        return [
            'product_id' => Product::inRandomOrder()->first()?->id ?? 1,
            'user_id' => User::inRandomOrder()->first()?->id ?? 1,
            'rating' => $this->faker->numberBetween(3, 5),
            'comment' => $this->faker->randomElement($reviews),
            'status' => $this->faker->randomElement(['pending', 'approved']),
        ];
    }
}
