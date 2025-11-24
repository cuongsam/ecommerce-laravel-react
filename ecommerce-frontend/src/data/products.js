
export const products = [
  // Nến thơm
  {
    id: 1,
    name: "Nến Thơm Lavender",
    category: "candles",
    price: 299000,
    originalPrice: 350000,
    image: "https://images.unsplash.com/photo-1602874801006-5dec0ce8e1c8?w=400",
    gallery: [
      "https://images.unsplash.com/photo-1602874801006-5dec0ce8e1c8?w=400",
      "https://images.unsplash.com/photo-1544144433-d50aff500b91?w=400"
    ],
    description: "Nến thơm lavender tự nhiên giúp thư giãn và ngủ ngon. Thời gian cháy lên đến 45 giờ.",
    benefits: ["Thư giãn tinh thần", "Giúp ngủ ngon", "Khử mùi tự nhiên"],
    featured: true,
    rating: 4.8,
    reviews: 124
  },
  {
    id: 2,
    name: "Nến Thơm Vanilla",
    category: "candles",
    price: 280000,
    originalPrice: 320000,
    image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400",
    gallery: [
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
    ],
    description: "Nến thơm vanilla ấm áp tạo không gian lãng mạn và dễ chịu.",
    benefits: ["Tạo không gian ấm cúng", "Mùi hương ngọt ngào", "Thời gian cháy dài"],
    featured: true,
    rating: 4.6,
    reviews: 89
  },
  {
    id: 3,
    name: "Nến Thơm Rose",
    category: "candles", 
    price: 320000,
    originalPrice: 380000,
    image: "https://images.unsplash.com/photo-1602874800204-94c6c4ba5c04?w=400",
    gallery: [
      "https://images.unsplash.com/photo-1602874800204-94c6c4ba5c04?w=400",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400"
    ],
    description: "Nến thơm hoa hồng cao cấp với hương thơm quyến rũ và lãng mạn.",
    benefits: ["Hương thơm lãng mạn", "Chất liệu cao cấp", "Thiết kế sang trọng"],
    featured: false,
    rating: 4.9,
    reviews: 156
  },

  // Tinh dầu
  {
    id: 4,
    name: "Tinh Dầu Eucalyptus",
    category: "essential-oils",
    price: 180000,
    originalPrice: 220000,
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400",
    gallery: [
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400",
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400"
    ],
    description: "Tinh dầu eucalyptus nguyên chất giúp thông mũi và làm sạch không khí.",
    benefits: ["Thông mũi hiệu quả", "Kháng khuẩn tự nhiên", "Làm sạch không khí"],
    featured: true,
    rating: 4.7,
    reviews: 98
  },
  {
    id: 5,
    name: "Tinh Dầu Tea Tree", 
    category: "essential-oils",
    price: 200000,
    originalPrice: 240000,
    image: "https://images.unsplash.com/photo-1594736797933-d0e501ba2fe6?w=400",
    gallery: [
      "https://images.unsplash.com/photo-1594736797933-d0e501ba2fe6?w=400",
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400"
    ],
    description: "Tinh dầu tea tree với đặc tính kháng khuẩn và chống viêm tự nhiên.",
    benefits: ["Kháng khuẩn mạnh", "Chống viêm", "Làm sạch da"],
    featured: false,
    rating: 4.5,
    reviews: 67
  },

  // Dầu gội
  {
    id: 6,
    name: "Dầu Gội Thảo Dược",
    category: "shampoo",
    price: 150000,
    originalPrice: 180000,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400",
    gallery: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400"
    ],
    description: "Dầu gội thảo dược tự nhiên giúp tóc mềm mượt và khỏe mạnh.",
    benefits: ["Tóc mềm mượt", "Thành phần tự nhiên", "Không sulfate"],
    featured: true,
    rating: 4.4,
    reviews: 201
  },
  {
    id: 7,
    name: "Dầu Gội Dưỡng Ẩm",
    category: "shampoo",
    price: 170000,
    originalPrice: 200000,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
    gallery: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400"
    ],
    description: "Dầu gội dưỡng ẩm sâu cho tóc khô và hư tổn.",
    benefits: ["Dưỡng ẩm sâu", "Phục hồi tóc hư tổn", "Hương thơm dịu nhẹ"],
    featured: false,
    rating: 4.6,
    reviews: 143
  },

  // Sữa tắm
  {
    id: 8,
    name: "Sữa Tắm Dưỡng Ẩm Oat",
    category: "body-wash",
    price: 120000,
    originalPrice: 150000,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
    gallery: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400"
    ],
    description: "Sữa tắm với chiết xuất yến mạch dưỡng ẩm và làm mềm da.",
    benefits: ["Dưỡng ẩm tự nhiên", "Làm mềm da", "Phù hợp da nhạy cảm"],
    featured: true,
    rating: 4.3,
    reviews: 178
  },
  {
    id: 9,
    name: "Sữa Tắm Hoa Hồng",
    category: "body-wash", 
    price: 140000,
    originalPrice: 170000,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400",
    gallery: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400"
    ],
    description: "Sữa tắm hoa hồng với hương thơm quyến rũ và dưỡng chất thiên nhiên.",
    benefits: ["Hương thơm lãng mạn", "Dưỡng ẩm da", "Chiết xuất hoa hồng"],
    featured: false,
    rating: 4.7,
    reviews: 134
  }
];

export const categories = [
  {
    id: "candles",
    name: "Nến Thơm",
    icon: "🕯️",
    description: "Nến thơm tự nhiên tạo không gian thư giãn"
  },
  {
    id: "essential-oils", 
    name: "Tinh Dầu",
    icon: "🌿",
    description: "Tinh dầu nguyên chất từ thiên nhiên"
  },
  {
    id: "shampoo",
    name: "Dầu Gội",
    icon: "🧴",
    description: "Dầu gội thảo dược dưỡng tóc"
  },
  {
    id: "body-wash",
    name: "Sữa Tắm", 
    icon: "🧼",
    description: "Sữa tắm dưỡng ẩm tự nhiên"
  }
];

export const banners = [
  {
    id: 1,
    title: "Nến Thơm Tự Nhiên",
    subtitle: "Tạo không gian thư giãn trong ngôi nhà của bạn",
    image: "https://images.unsplash.com/photo-1602874801006-5dec0ce8e1c8?w=1200",
    buttonText: "Khám Phá Ngay",
    link: "/shop/candles"
  },
  {
    id: 2,
    title: "Tinh Dầu Nguyên Chất",
    subtitle: "Hương thơm thiên nhiên cho sức khỏe và tinh thần",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200",
    buttonText: "Xem Sản Phẩm",
    link: "/shop/essential-oils"
  },
  {
    id: 3,
    title: "Chăm Sóc Cơ Thể",
    subtitle: "Dầu gội và sữa tắm từ thảo dược tự nhiên",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200",
    buttonText: "Mua Sắm Ngay",
    link: "/shop"
  }
];

export const reviews = [
  {
    id: 1,
    name: "Nguyễn Thu Hà",
    rating: 5,
    comment: "Nến thơm lavender rất thơm và cháy lâu. Giúp tôi thư giãn sau ngày làm việc căng thẳng.",
    product: "Nến Thơm Lavender",
    date: "2024-10-15"
  },
  {
    id: 2,
    name: "Trần Minh Anh",
    rating: 5,
    comment: "Tinh dầu eucalyptus rất tốt, giúp tôi thông mũi khi bị cảm. Chất lượng tuyệt vời!",
    product: "Tinh Dầu Eucalyptus", 
    date: "2024-10-12"
  },
  {
    id: 3,
    name: "Lê Thị Mai",
    rating: 4,
    comment: "Dầu gội thảo dược làm tóc mềm mượt hơn hẳn. Hương thơm dịu nhẹ rất dễ chịu.",
    product: "Dầu Gội Thảo Dược",
    date: "2024-10-10"
  },
  {
    id: 4,
    name: "Phạm Văn Nam",
    rating: 5,
    comment: "Sữa tắm oat rất phù hợp với da nhạy cảm của tôi. Không bị khô căng sau khi tắm.",
    product: "Sữa Tắm Dưỡng Ẩm Oat",
    date: "2024-10-08"
  },
  {
    id: 5,
    name: "Hoàng Thị Lan",
    rating: 5,
    comment: "Nến thơm vanilla tạo không gian ấm cúng cho buổi tối. Rất hài lòng với sản phẩm!",
    product: "Nến Thơm Vanilla",
    date: "2024-10-05"
  }
];