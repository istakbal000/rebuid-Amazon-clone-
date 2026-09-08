import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import connectDB from '../config/db.js';

dotenv.config({ path: '../../.env' }); // Adjust if run from root vs src

const categories = [
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Books', slug: 'books' },
  { name: 'Home & Kitchen', slug: 'home-kitchen' },
  { name: 'Clothing', slug: 'clothing' },
  { name: 'Toys', slug: 'toys' },
  { name: 'Sports', slug: 'sports' }
];

const generateProducts = (categoryDocs) => {
  const products = [];
  
  const getCatId = (slug) => categoryDocs.find(c => c.slug === slug)._id;

  // Electronics (10 products)
  products.push({
    title: 'Wireless Noise Cancelling Headphones',
    description: 'Industry leading noise cancellation with dual noise sensor technology. Next-level music with Edge-AI, co-developed with Sony Music Studios Tokyo. Up to 30-hour battery life with quick charging.',
    price: 298.00,
    originalPrice: 349.99,
    images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('electronics'),
    brand: 'AudioTech',
    rating: 4.8,
    reviewCount: 4521,
    stock: 50
  });
  products.push({
    title: 'Ultra HD Smart TV 55-inch',
    description: 'Experience stunning 4K Ultra HD picture quality with over 8 million pixels. Smart TV capabilities with built-in streaming apps.',
    price: 499.99,
    originalPrice: 599.99,
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('electronics'),
    brand: 'VisionPlus',
    rating: 4.5,
    reviewCount: 2100,
    stock: 20
  });
  products.push({
    title: 'Smartphone Pro Max 256GB',
    description: 'A dramatically more powerful camera system. A display so responsive, every interaction feels new. The world’s fastest smartphone chip. Exceptional durability.',
    price: 1099.00,
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('electronics'),
    brand: 'Pear',
    rating: 4.9,
    reviewCount: 15400,
    stock: 100
  });
  products.push({
    title: 'Minimalist Mechanical Keyboard',
    description: 'Wireless mechanical keyboard with tactile switches. Connects up to 3 devices. Long battery life and customizable RGB backlighting.',
    price: 129.50,
    originalPrice: 149.00,
    images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('electronics'),
    brand: 'TypeMaster',
    rating: 4.6,
    reviewCount: 890,
    stock: 45
  });
  products.push({
    title: 'Ergonomic Wireless Mouse',
    description: 'Advanced ergonomic design promotes natural hand positioning. Hyper-fast scrolling and customizable buttons for ultimate productivity.',
    price: 79.99,
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('electronics'),
    brand: 'ClickPro',
    rating: 4.7,
    reviewCount: 3200,
    stock: 120
  });
  products.push({
    title: 'Bluetooth Portable Speaker',
    description: 'Waterproof portable Bluetooth speaker with deep bass. Up to 12 hours of playtime. Wirelessly connect up to 2 smartphones or tablets.',
    price: 89.95,
    originalPrice: 119.95,
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('electronics'),
    brand: 'SoundWave',
    rating: 4.8,
    reviewCount: 5600,
    stock: 200
  });
  products.push({
    title: 'Digital Camera Mirrorless',
    description: '24.2MP mirrorless camera with 4K video capabilities. Includes standard zoom lens. Eye detection AF and high-speed continuous shooting.',
    price: 898.00,
    originalPrice: 998.00,
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('electronics'),
    brand: 'PhotoGen',
    rating: 4.5,
    reviewCount: 410,
    stock: 15
  });
  products.push({
    title: 'Smartwatch Fitness Tracker',
    description: 'Advanced health and fitness tracking. Built-in GPS, heart rate monitor, and sleep tracking. Water-resistant up to 50 meters.',
    price: 199.99,
    images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('electronics'),
    brand: 'FitLife',
    rating: 4.4,
    reviewCount: 8900,
    stock: 300
  });
  products.push({
    title: 'Noise Cancelling Earbuds',
    description: 'True wireless earbuds with active noise cancellation. Transparency mode for hearing your surroundings. Sweat and water-resistant.',
    price: 149.00,
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('electronics'),
    brand: 'AudioTech',
    rating: 4.6,
    reviewCount: 12500,
    stock: 150
  });
  products.push({
    title: 'Gaming Console NextGen',
    description: 'Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with support for haptic feedback, adaptive triggers and 3D Audio.',
    price: 499.00,
    images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('electronics'),
    brand: 'PlayTech',
    rating: 4.9,
    reviewCount: 22000,
    stock: 5
  });

  // Books (5 products)
  products.push({
    title: 'The Clean Coder: A Code of Conduct',
    description: 'Practical advice for professional programmers. Covers estimation, coding, testing, and more.',
    price: 34.99,
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('books'),
    brand: 'Pearson',
    rating: 4.7,
    reviewCount: 1200,
    stock: 40
  });
  products.push({
    title: 'Atomic Habits',
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. A comprehensive, practical guide on how to change your habits and get 1% better every day.',
    price: 16.99,
    originalPrice: 27.00,
    images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('books'),
    brand: 'Penguin',
    rating: 4.8,
    reviewCount: 85000,
    stock: 200
  });
  products.push({
    title: 'Dune (Penguin Galaxy)',
    description: 'Frank Herbert’s classic masterpiece—a triumph of the imagination and one of the bestselling science fiction novels of all time.',
    price: 18.00,
    images: ['https://images.unsplash.com/photo-1614113489855-66422ad300a4?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('books'),
    brand: 'Ace Books',
    rating: 4.7,
    reviewCount: 34000,
    stock: 80
  });
  products.push({
    title: 'The Psychology of Money',
    description: 'Timeless lessons on wealth, greed, and happiness. Doing well with money isn’t necessarily about what you know. It’s about how you behave.',
    price: 14.50,
    originalPrice: 19.99,
    images: ['https://images.unsplash.com/photo-1554774853-719586f82d77?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('books'),
    brand: 'Harriman House',
    rating: 4.6,
    reviewCount: 41000,
    stock: 150
  });
  products.push({
    title: 'Sapiens: A Brief History of Humankind',
    description: 'From a renowned historian comes a groundbreaking narrative of humanity’s creation and evolution.',
    price: 22.00,
    originalPrice: 25.00,
    images: ['https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('books'),
    brand: 'Harper',
    rating: 4.6,
    reviewCount: 62000,
    stock: 110
  });

  // Home & Kitchen (5 products)
  products.push({
    title: 'Professional Blender 1000W',
    description: 'Professional blender with 1000 watts of professional performance power. Features 64 oz maximum liquid capacity.',
    price: 89.99,
    originalPrice: 119.99,
    images: ['https://images.unsplash.com/photo-1585237405603-75210134bdbe?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('home-kitchen'),
    brand: 'KitchenPro',
    rating: 4.7,
    reviewCount: 3100,
    stock: 60
  });
  products.push({
    title: 'Non-Stick Cookware Set 10-Piece',
    description: '10-piece non-stick cookware set includes fry pans, saucepans, and dutch oven. Aluminum body with non-stick coating for easy cooking and cleaning.',
    price: 149.50,
    images: ['https://images.unsplash.com/photo-1584990347449-a6e492215c0e?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('home-kitchen'),
    brand: 'ChefChoice',
    rating: 4.5,
    reviewCount: 1800,
    stock: 40
  });
  products.push({
    title: 'Robot Vacuum Cleaner',
    description: 'Wi-Fi connected robot vacuum cleaner. Works with voice assistants. Self-charging, good for pet hair, carpets, and hard floors.',
    price: 249.99,
    originalPrice: 299.99,
    images: ['https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('home-kitchen'),
    brand: 'CleanBot',
    rating: 4.4,
    reviewCount: 5200,
    stock: 25
  });
  products.push({
    title: 'Stainless Steel Coffee Maker',
    description: '12-cup programmable coffee maker with thermal carafe. Keep warm setting and brew strength control.',
    price: 79.00,
    images: ['https://images.unsplash.com/photo-1520970014086-2208d157c9e2?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('home-kitchen'),
    brand: 'BrewMaster',
    rating: 4.6,
    reviewCount: 4300,
    stock: 80
  });
  products.push({
    title: 'Air Purifier for Home',
    description: 'True HEPA air purifier for large rooms. Filters allergies, pets, smoke, dust. Ultra-quiet operation.',
    price: 129.99,
    originalPrice: 159.99,
    images: ['https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('home-kitchen'),
    brand: 'PureAir',
    rating: 4.8,
    reviewCount: 2900,
    stock: 50
  });

  // Clothing (4 products)
  products.push({
    title: 'Classic White T-Shirt',
    description: '100% cotton classic fit crewneck t-shirt. Soft, breathable, and durable for everyday wear.',
    price: 15.00,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('clothing'),
    brand: 'Basics',
    rating: 4.5,
    reviewCount: 12000,
    stock: 500
  });
  products.push({
    title: 'Men\'s Slim Fit Jeans',
    description: 'Classic five-pocket styling. Sits below the waist with a slim fit from hip to ankle.',
    price: 49.99,
    originalPrice: 59.99,
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('clothing'),
    brand: 'DenimCo',
    rating: 4.4,
    reviewCount: 3400,
    stock: 120
  });
  products.push({
    title: 'Women\'s Running Shoes',
    description: 'Lightweight and breathable mesh upper. Cushioned midsole for comfort and support during runs.',
    price: 85.00,
    originalPrice: 100.00,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('clothing'),
    brand: 'RunFast',
    rating: 4.7,
    reviewCount: 2800,
    stock: 90
  });
  products.push({
    title: 'Winter Puffer Jacket',
    description: 'Water-resistant and windproof puffer jacket. Insulated for extra warmth in cold weather conditions.',
    price: 110.00,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('clothing'),
    brand: 'ArcticWear',
    rating: 4.8,
    reviewCount: 950,
    stock: 45
  });

  // Toys (3 products)
  products.push({
    title: 'Classic LEGO Bricks Set',
    description: 'Unleash creativity with this classic building blocks set. Includes 790 pieces in 33 different colors.',
    price: 45.99,
    images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('toys'),
    brand: 'LEGO',
    rating: 4.9,
    reviewCount: 15000,
    stock: 200
  });
  products.push({
    title: 'Remote Control Car 4WD',
    description: 'High-speed off-road remote control car. 4-wheel drive, durable design, and long battery life.',
    price: 39.99,
    originalPrice: 49.99,
    images: ['https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('toys'),
    brand: 'SpeedTech',
    rating: 4.3,
    reviewCount: 800,
    stock: 75
  });
  products.push({
    title: 'Educational Board Game',
    description: 'Fun and educational board game for the whole family. Teaches strategy and resource management.',
    price: 29.50,
    images: ['https://images.unsplash.com/photo-1610890716171-6b1bb98ffaed?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('toys'),
    brand: 'GameNight',
    rating: 4.7,
    reviewCount: 2100,
    stock: 120
  });

  // Sports (3 products)
  products.push({
    title: 'Yoga Mat with Alignment Lines',
    description: 'Eco-friendly TPE yoga mat with alignment markers. Non-slip, thick, and durable for all types of yoga.',
    price: 35.00,
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('sports'),
    brand: 'ZenFit',
    rating: 4.6,
    reviewCount: 3200,
    stock: 150
  });
  products.push({
    title: 'Adjustable Dumbbell Set',
    description: 'Space-saving adjustable dumbbells. Change weights from 5 to 52.5 lbs with a simple dial mechanism.',
    price: 199.00,
    originalPrice: 249.00,
    images: ['https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('sports'),
    brand: 'IronStrength',
    rating: 4.8,
    reviewCount: 5600,
    stock: 30
  });
  products.push({
    title: 'Camping Tent 4-Person',
    description: 'Spacious 4-person dome tent. Weather-resistant with easy 10-minute setup. Includes rainfly and carrying bag.',
    price: 125.00,
    images: ['https://images.unsplash.com/photo-1504280390226-e172a392b4fa?auto=format&fit=crop&q=80&w=800'],
    category: getCatId('sports'),
    brand: 'Outdoorsy',
    rating: 4.5,
    reviewCount: 1400,
    stock: 40
  });

  return products;
};

const importData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://127.0.0.1:27017/amazon-rebuild');
    
    console.log('Clearing old data...');
    await Category.deleteMany();
    await Product.deleteMany();

    console.log('Inserting categories...');
    const insertedCategories = await Category.insertMany(categories);

    console.log('Inserting products...');
    const products = generateProducts(insertedCategories);
    await Product.insertMany(products);

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
