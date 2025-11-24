<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Review;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductionSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        if (!User::where('email', 'admin@example.com')->exists()) {
            User::create([
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'email_verified_at' => now(),
                'password' => bcrypt('123123'),
                'role' => 'admin',
                'phone' => '0123456789',
                'address' => 'Hanoi, Vietnam',
            ]);
        }

        // Create regular users
        $users = [
            ['name' => 'John Doe', 'email' => 'john@example.com', 'phone' => '0987654321', 'address' => 'Ho Chi Minh City'],
            ['name' => 'Jane Smith', 'email' => 'jane@example.com', 'phone' => '0976543210', 'address' => 'Da Nang'],
            ['name' => 'Mike Johnson', 'email' => 'mike@example.com', 'phone' => '0965432109', 'address' => 'Hanoi'],
            ['name' => 'Sarah Williams', 'email' => 'sarah@example.com', 'phone' => '0954321098', 'address' => 'Can Tho'],
            ['name' => 'David Brown', 'email' => 'david@example.com', 'phone' => '0943210987', 'address' => 'Hai Phong'],
        ];

        foreach ($users as $userData) {
            if (!User::where('email', $userData['email'])->exists()) {
                User::create([
                    'name' => $userData['name'],
                    'email' => $userData['email'],
                    'email_verified_at' => now(),
                    'password' => bcrypt('password'),
                    'role' => '0',
                    'phone' => $userData['phone'],
                    'address' => $userData['address'],
                ]);
            }
        }

        // Create categories
        $categories = [
            [
                'name' => 'Scented Candles',
                'slug' => 'scented-candles',
                'description' => 'Premium scented candles with various fragrances for relaxation and aromatherapy',
                'status' => true,
            ],
            [
                'name' => 'Decorative Candles',
                'slug' => 'decorative-candles',
                'description' => 'Beautiful decorative candles perfect for home decor and special occasions',
                'status' => true,
            ],
            [
                'name' => 'Essential Oil Candles',
                'slug' => 'essential-oil-candles',
                'description' => 'Natural essential oil candles for therapeutic relaxation and wellness',
                'status' => true,
            ],
            [
                'name' => 'Soy Wax Candles',
                'slug' => 'soy-wax-candles',
                'description' => 'Eco-friendly soy wax candles that burn cleaner and longer',
                'status' => true,
            ],
            [
                'name' => 'Luxury Candles',
                'slug' => 'luxury-candles',
                'description' => 'High-end luxury candles with sophisticated fragrances',
                'status' => true,
            ],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['slug' => $cat['slug']], $cat);
        }

        // Get categories
        $scentedCat = Category::where('slug', 'scented-candles')->first();
        $decorativeCat = Category::where('slug', 'decorative-candles')->first();
        $essentialCat = Category::where('slug', 'essential-oil-candles')->first();
        $soyCat = Category::where('slug', 'soy-wax-candles')->first();
        $luxuryCat = Category::where('slug', 'luxury-candles')->first();

        // Create products with images
        $productsData = [
            // Scented Candles
            [
                'name' => 'Lavender Dreams Candle',
                'slug' => 'lavender-dreams-candle',
                'description' => 'Indulge in the calming essence of pure lavender. This premium scented candle helps reduce stress, promotes relaxation, and improves sleep quality. Hand-poured with natural soy wax for a clean, long-lasting burn.',
                'price' => 250000,
                'sale_price' => 199000,
                'stock' => 150,
                'category_id' => $scentedCat->id,
                'is_featured' => true,
                'status' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1602874801006-c2c0b6d6b602?w=800',
                    'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800',
                    'https://images.unsplash.com/photo-1598662957477-3a5217f1a5e3?w=800',
                ]
            ],
            [
                'name' => 'Vanilla Bliss Candle',
                'slug' => 'vanilla-bliss-candle',
                'description' => 'Experience pure comfort with our Vanilla Bliss candle. The sweet, warm aroma of Madagascar vanilla creates a cozy and inviting atmosphere in any room.',
                'price' => 280000,
                'sale_price' => null,
                'stock' => 120,
                'category_id' => $scentedCat->id,
                'is_featured' => true,
                'status' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1604762524889-4b0e41d0e5d7?w=800',
                    'https://images.unsplash.com/photo-1602874801006-c2c0b6d6b602?w=800',
                ]
            ],
            [
                'name' => 'Ocean Breeze Candle',
                'slug' => 'ocean-breeze-candle',
                'description' => 'Bring the refreshing scent of the ocean into your home. Notes of sea salt, jasmine, and marine accord create a crisp, clean fragrance.',
                'price' => 220000,
                'sale_price' => 180000,
                'stock' => 100,
                'category_id' => $scentedCat->id,
                'is_featured' => false,
                'status' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800',
                ]
            ],
            [
                'name' => 'Cinnamon Spice Candle',
                'slug' => 'cinnamon-spice-candle',
                'description' => 'Warm and inviting cinnamon spice fragrance perfect for autumn and winter. Creates a cozy, festive atmosphere.',
                'price' => 240000,
                'sale_price' => null,
                'stock' => 90,
                'category_id' => $scentedCat->id,
                'is_featured' => true,
                'status' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1602874801006-c2c0b6d6b602?w=800',
                    'https://images.unsplash.com/photo-1598662957477-3a5217f1a5e3?w=800',
                ]
            ],
            
            // Decorative Candles
            [
                'name' => 'Rose Gold Pillar Candle',
                'slug' => 'rose-gold-pillar-candle',
                'description' => 'Elegant rose gold metallic finish pillar candle. Perfect centerpiece for weddings, parties, or everyday luxury home decor.',
                'price' => 320000,
                'sale_price' => 280000,
                'stock' => 80,
                'category_id' => $decorativeCat->id,
                'is_featured' => true,
                'status' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1598662957477-3a5217f1a5e3?w=800',
                ]
            ],
            [
                'name' => 'Crystal Glass Jar Candle',
                'slug' => 'crystal-glass-jar-candle',
                'description' => 'Stunning crystal-cut glass jar filled with premium scented wax. Reusable jar makes a beautiful decorative piece after use.',
                'price' => 380000,
                'sale_price' => null,
                'stock' => 60,
                'category_id' => $decorativeCat->id,
                'is_featured' => true,
                'status' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1604762524889-4b0e41d0e5d7?w=800',
                    'https://images.unsplash.com/photo-1602874801006-c2c0b6d6b602?w=800',
                ]
            ],
            
            // Essential Oil Candles
            [
                'name' => 'Eucalyptus Mint Wellness Candle',
                'slug' => 'eucalyptus-mint-wellness-candle',
                'description' => 'Therapeutic blend of eucalyptus and peppermint essential oils. Helps clear the mind, ease breathing, and promote mental clarity.',
                'price' => 290000,
                'sale_price' => 250000,
                'stock' => 110,
                'category_id' => $essentialCat->id,
                'is_featured' => true,
                'status' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800',
                    'https://images.unsplash.com/photo-1598662957477-3a5217f1a5e3?w=800',
                ]
            ],
            [
                'name' => 'Tea Tree & Lemon Candle',
                'slug' => 'tea-tree-lemon-candle',
                'description' => 'Refreshing combination of tea tree and lemon essential oils. Natural antibacterial properties with an uplifting citrus scent.',
                'price' => 270000,
                'sale_price' => null,
                'stock' => 95,
                'category_id' => $essentialCat->id,
                'is_featured' => false,
                'status' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1602874801006-c2c0b6d6b602?w=800',
                ]
            ],
            
            // Soy Wax Candles
            [
                'name' => 'Pure Soy Lavender Candle',
                'slug' => 'pure-soy-lavender-candle',
                'description' => 'Eco-friendly 100% natural soy wax candle with lavender essential oil. Burns cleaner and longer than traditional paraffin candles.',
                'price' => 260000,
                'sale_price' => 220000,
                'stock' => 140,
                'category_id' => $soyCat->id,
                'is_featured' => true,
                'status' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1604762524889-4b0e41d0e5d7?w=800',
                ]
            ],
            [
                'name' => 'Soy Wax Coffee Candle',
                'slug' => 'soy-wax-coffee-candle',
                'description' => 'Rich coffee aroma in eco-friendly soy wax. Perfect for coffee lovers and creates an energizing atmosphere.',
                'price' => 245000,
                'sale_price' => null,
                'stock' => 85,
                'category_id' => $soyCat->id,
                'is_featured' => false,
                'status' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1598662957477-3a5217f1a5e3?w=800',
                    'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800',
                ]
            ],
            
            // Luxury Candles
            [
                'name' => 'French Provence Luxury Candle',
                'slug' => 'french-provence-luxury-candle',
                'description' => 'Sophisticated blend of lavender fields, rosemary, and thyme inspired by the French countryside. Hand-poured in elegant glass vessel.',
                'price' => 450000,
                'sale_price' => 399000,
                'stock' => 50,
                'category_id' => $luxuryCat->id,
                'is_featured' => true,
                'status' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1602874801006-c2c0b6d6b602?w=800',
                    'https://images.unsplash.com/photo-1604762524889-4b0e41d0e5d7?w=800',
                    'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800',
                ]
            ],
            [
                'name' => 'Oud Wood Luxury Candle',
                'slug' => 'oud-wood-luxury-candle',
                'description' => 'Exotic oud wood fragrance blended with amber and sandalwood. Luxurious Middle Eastern inspired scent in premium packaging.',
                'price' => 520000,
                'sale_price' => null,
                'stock' => 40,
                'category_id' => $luxuryCat->id,
                'is_featured' => true,
                'status' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1598662957477-3a5217f1a5e3?w=800',
                ]
            ],
            [
                'name' => 'White Jasmine Luxury Candle',
                'slug' => 'white-jasmine-luxury-candle',
                'description' => 'Delicate white jasmine petals with hints of gardenia. Elegant and timeless fragrance in handcrafted ceramic vessel.',
                'price' => 480000,
                'sale_price' => 420000,
                'stock' => 55,
                'category_id' => $luxuryCat->id,
                'is_featured' => true,
                'status' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1604762524889-4b0e41d0e5d7?w=800',
                    'https://images.unsplash.com/photo-1602874801006-c2c0b6d6b602?w=800',
                ]
            ],
        ];

        foreach ($productsData as $prodData) {
            $images = $prodData['images'];
            unset($prodData['images']);
            
            $product = Product::firstOrCreate(['slug' => $prodData['slug']], $prodData);
            
            // Add product images
            if (!$product->images()->exists()) {
                foreach ($images as $index => $imageUrl) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_url' => $imageUrl,
                        'is_primary' => $index === 0,
                    ]);
                }
            }
        }

        // Create reviews
        $reviewsData = [
            ['product_slug' => 'lavender-dreams-candle', 'rating' => 5, 'comment' => 'Absolutely love this candle! The lavender scent is so calming and helps me sleep better.'],
            ['product_slug' => 'lavender-dreams-candle', 'rating' => 5, 'comment' => 'Best candle I have ever purchased. Burns evenly and the scent lasts for hours.'],
            ['product_slug' => 'lavender-dreams-candle', 'rating' => 4, 'comment' => 'Great quality candle. The only reason it is not 5 stars is the price, but worth it for the quality.'],
            ['product_slug' => 'vanilla-bliss-candle', 'rating' => 5, 'comment' => 'The vanilla scent is amazing! Not too strong, just perfect for my living room.'],
            ['product_slug' => 'vanilla-bliss-candle', 'rating' => 5, 'comment' => 'Creates such a cozy atmosphere. I have bought 3 more as gifts!'],
            ['product_slug' => 'ocean-breeze-candle', 'rating' => 4, 'comment' => 'Refreshing scent, reminds me of the beach. Would definitely buy again.'],
            ['product_slug' => 'cinnamon-spice-candle', 'rating' => 5, 'comment' => 'Perfect for fall and winter! The cinnamon smell fills the whole house.'],
            ['product_slug' => 'rose-gold-pillar-candle', 'rating' => 5, 'comment' => 'So beautiful! Used it as a centerpiece for my wedding and everyone loved it.'],
            ['product_slug' => 'crystal-glass-jar-candle', 'rating' => 5, 'comment' => 'The jar is gorgeous and I can reuse it after. Great value!'],
            ['product_slug' => 'eucalyptus-mint-wellness-candle', 'rating' => 5, 'comment' => 'Helps clear my sinuses and smells wonderful. Highly recommend!'],
            ['product_slug' => 'french-provence-luxury-candle', 'rating' => 5, 'comment' => 'Worth every penny! The most luxurious candle I have owned.'],
            ['product_slug' => 'oud-wood-luxury-candle', 'rating' => 5, 'comment' => 'Exotic and sophisticated scent. Makes my home smell like a 5-star hotel.'],
        ];

        $regularUsers = User::where('role', '0')->get();
        foreach ($reviewsData as $index => $reviewData) {
            $product = Product::where('slug', $reviewData['product_slug'])->first();
            if ($product && !$product->reviews()->where('user_id', $regularUsers[$index % $regularUsers->count()]->id)->exists()) {
                Review::create([
                    'product_id' => $product->id,
                    'user_id' => $regularUsers[$index % $regularUsers->count()]->id,
                    'rating' => $reviewData['rating'],
                    'comment' => $reviewData['comment'],
                ]);
            }
        }

        $this->command->info('========================================');
        $this->command->info('Production data seeded successfully!');
        $this->command->info('========================================');
        $this->command->info('Admin credentials:');
        $this->command->info('  Email: admin@example.com');
        $this->command->info('  Password: 123123');
        $this->command->info('----------------------------------------');
        $this->command->info('Statistics:');
        $this->command->info('  Categories: ' . Category::count());
        $this->command->info('  Products: ' . Product::count());
        $this->command->info('  Users: ' . User::count());
        $this->command->info('  Reviews: ' . Review::count());
        $this->command->info('========================================');
    }
}
