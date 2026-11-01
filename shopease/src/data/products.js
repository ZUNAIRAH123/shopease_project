// Sample products used the FIRST time the app runs.
// After that, products are loaded from localStorage (so admin changes are kept).
//
// Images are loaded from Unsplash by URL. If an image cannot load
// (for example you are offline) the app shows a grey placeholder instead.

const img = (photoId) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=800&q=80`;

export const initialProducts = [
  {
    id: 1,
    name: "Wireless Noise-Canceling Headphones",
    price: 129.99,
    category: "Electronics",
    description:
      "Over-ear Bluetooth headphones with active noise cancellation, deep bass and up to 30 hours of battery life. Foldable design with a soft carry pouch.",
    image: img("photo-1505740420928-5e560c06d30e"),
    stock: 25,
    createdAt: "2026-08-12T09:00:00.000Z",
  },
  {
    id: 2,
    name: "Smart Watch Series 5",
    price: 199.99,
    category: "Electronics",
    description:
      "Fitness-focused smart watch with heart-rate monitoring, GPS, sleep tracking and a bright always-on display. Water resistant up to 50 meters.",
    image: img("photo-1546868871-7041f2a55e12"),
    stock: 18,
    createdAt: "2026-08-20T09:00:00.000Z",
  },
  {
    id: 3,
    name: "Ultrabook Laptop 14\"",
    price: 899.0,
    category: "Electronics",
    description:
      "Thin and light 14-inch laptop with a full HD display, 16GB RAM, 512GB SSD and all-day battery life. Perfect for work, study and travel.",
    image: img("photo-1496181133206-80ce9b88a853"),
    stock: 8,
    createdAt: "2026-09-02T09:00:00.000Z",
  },
  {
    id: 4,
    name: "Smartphone 128GB",
    price: 499.0,
    category: "Electronics",
    description:
      "6.5-inch OLED smartphone with a dual-lens camera, fast charging and 128GB of storage. Comes unlocked and works with all major carriers.",
    image: img("photo-1511707171634-5f897ff02aa9"),
    stock: 14,
    createdAt: "2026-09-10T09:00:00.000Z",
  },
  {
    id: 5,
    name: "Mirrorless Camera Kit",
    price: 649.0,
    category: "Electronics",
    description:
      "24MP mirrorless camera with a versatile kit lens, 4K video, built-in Wi-Fi and a tilting touchscreen. Great for beginners and hobbyists.",
    image: img("photo-1526170375885-4d8ecf77b99f"),
    stock: 5,
    createdAt: "2026-10-05T09:00:00.000Z",
  },
  {
    id: 6,
    name: "Performance Running Sneakers",
    price: 79.99,
    category: "Fashion",
    description:
      "Lightweight running shoes with a breathable mesh upper and cushioned sole for all-day comfort. Available for daily runs and gym sessions.",
    image: img("photo-1542291026-7eec264c27ff"),
    stock: 40,
    createdAt: "2026-09-18T09:00:00.000Z",
  },
  {
    id: 7,
    name: "Urban Street Sneakers",
    price: 64.99,
    category: "Fashion",
    description:
      "Clean, minimal sneakers with a durable rubber sole. Easy to pair with jeans, shorts or chinos. Only a few pairs left.",
    image: img("photo-1491553895911-0055eca6402d"),
    stock: 3,
    createdAt: "2026-10-12T09:00:00.000Z",
  },
  {
    id: 8,
    name: "Classic Cotton Shirt",
    price: 29.99,
    category: "Fashion",
    description:
      "Soft 100% cotton casual shirt with a relaxed fit. Breathable, easy to wash and ideal for work or weekends.",
    image: img("photo-1434389677669-e08b4cac3105"),
    stock: 60,
    createdAt: "2026-10-18T09:00:00.000Z",
  },
  {
    id: 9,
    name: "Floral Summer Dress",
    price: 49.99,
    category: "Fashion",
    description:
      "Light and airy knee-length dress with a floral print and adjustable waist tie. Perfect for warm days and weekend outings.",
    image: img("photo-1515886657613-9f3515b0c78f"),
    stock: 22,
    createdAt: "2026-10-22T09:00:00.000Z",
  },
  {
    id: 10,
    name: "Aviator Sunglasses",
    price: 39.99,
    category: "Accessories",
    description:
      "Classic metal-frame aviator sunglasses with UV400 protection and polarized lenses. Includes a protective case.",
    image: img("photo-1572635196237-14b3f281503f"),
    stock: 35,
    createdAt: "2026-08-30T09:00:00.000Z",
  },
  {
    id: 11,
    name: "Classic Analog Watch",
    price: 89.0,
    category: "Accessories",
    description:
      "Timeless analog watch with a stainless steel case, sapphire-style glass and a genuine leather strap. Water resistant up to 30 meters.",
    image: img("photo-1523275335684-37898b6baf30"),
    stock: 16,
    createdAt: "2026-10-25T09:00:00.000Z",
  },
  {
    id: 12,
    name: "Everyday Travel Backpack",
    price: 54.99,
    category: "Accessories",
    description:
      "Water-resistant 25L backpack with a padded laptop sleeve, hidden anti-theft pocket and USB charging port. Comfortable for commuting and trips.",
    image: img("photo-1553062407-98eeb64c6a62"),
    stock: 30,
    createdAt: "2026-10-27T09:00:00.000Z",
  },
  {
    id: 13,
    name: "Modern Accent Armchair",
    price: 249.0,
    category: "Home & Living",
    description:
      "Comfortable upholstered armchair with solid wood legs and a deep seat. Adds a modern touch to any living room or reading corner.",
    image: img("photo-1586023492125-27b2c045efd7"),
    stock: 0,
    createdAt: "2026-10-28T09:00:00.000Z",
  },
  {
    id: 14,
    name: "Solid Wood Dining Chair",
    price: 119.0,
    category: "Home & Living",
    description:
      "Sturdy dining chair made from solid wood with a smooth natural finish. Easy to assemble and easy to clean.",
    image: img("photo-1503602642458-232111445657"),
    stock: 12,
    createdAt: "2026-10-30T09:00:00.000Z",
  },
];
