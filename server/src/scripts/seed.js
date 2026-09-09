import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import connectDB from '../config/db.js';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

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

  const getImg = (text) => {
    const map = {
      'Wireless Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
      '55-inch Smart TV': 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&h=400&fit=crop',
      'Smartphone Pro Max': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop',
      'Mechanical Keyboard': 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&h=400&fit=crop',
      'Wireless Mouse': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop',
      'Portable Speaker': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=400&fit=crop',
      'Mirrorless Camera': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop',
      'Fitness Smartwatch': 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&h=400&fit=crop',
      'Wireless Earbuds': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=400&fit=crop',
      'Gaming Console': 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=600&h=400&fit=crop',
      'The Clean Coder Book': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop',
      'Atomic Habits Book': 'https://images.unsplash.com/photo-1686764288887-dae4e7d50d58?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'Dune Book': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
      'Psychology of Money': 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?q=80&w=1212&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'Sapiens Book': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=400&fit=crop',
      'Professional Blender': 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=400&fit=crop',
      'Cookware Set': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
      'Robot Vacuum': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
      'Coffee Maker': 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&h=400&fit=crop',
      'Air Purifier': 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&h=400&fit=crop',
      'White T-Shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop',
      'Mens Jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=400&fit=crop',
      'Running Shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
      'Puffer Jacket': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=400&fit=crop',
      'LEGO Set': 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=400&fit=crop',
      'RC Car': 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600&h=400&fit=crop',
      'Board Game': 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=600&h=400&fit=crop',
      'Yoga Mat': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=400&fit=crop',
      'Dumbbell Set': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=400&fit=crop',
      'Camping Tent': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=400&fit=crop',
      // NEW
      'Laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop',
      'Tablet': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop',
      'Smart Speaker': 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&h=400&fit=crop',
      '4K Monitor': 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=600&h=400&fit=crop',
      'Drone': 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=400&fit=crop',
      'Rich Dad Poor Dad': 'https://www.penguin.co.in/wp-content/uploads/2023/12/9781612681139-1-scaled.jpg',
      'Harry Potter Book': 'https://images.unsplash.com/photo-1663953322505-1238f663ede1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'The Alchemist': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop',
      'Stand Mixer': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop',
      'Electric Kettle': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
      'Toaster Oven': 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=400&fit=crop',
      'Hoodie': 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&h=400&fit=crop',
      'Oxford Shirt': 'https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=600&h=400&fit=crop',
      'Sunglasses': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=400&fit=crop',
      'Puzzle': 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=600&h=400&fit=crop',
      'Stuffed Animal': 'https://images.unsplash.com/photo-1558679908-541bcf1249ff?w=600&h=400&fit=crop',
      'Resistance Bands': 'https://images.unsplash.com/photo-1598289431512-b97b0917afed?w=600&h=400&fit=crop',
      'Water Bottle': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=400&fit=crop',
      'Bicycle Helmet': 'https://images.unsplash.com/photo-1557803175-b8f1db7ef1e6?w=600&h=400&fit=crop',
    };
    return map[text];
  };

  // Electronics (10 products)
  products.push({
    title: 'Wireless Noise Cancelling Headphones',
    description: 'Industry leading noise cancellation with dual noise sensor technology. Next-level music with Edge-AI, co-developed with Sony Music Studios Tokyo. Up to 30-hour battery life with quick charging.',
    price: 298.00,
    originalPrice: 349.99,
    images: [getImg('Wireless Headphones')],
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
    images: [getImg('55-inch Smart TV')],
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
    images: [getImg('Smartphone Pro Max')],
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
    images: [getImg('Mechanical Keyboard')],
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
    images: [getImg('Wireless Mouse')],
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
    images: [getImg('Portable Speaker')],
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
    images: [getImg('Mirrorless Camera')],
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
    images: [getImg('Fitness Smartwatch')],
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
    images: [getImg('Wireless Earbuds')],
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
    images: [getImg('Gaming Console')],
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
    images: [getImg('The Clean Coder Book')],
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
    images: [getImg('Atomic Habits Book')],
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
    images: [getImg('Dune Book')],
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
    images: [getImg('Psychology of Money')],
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
    images: [getImg('Sapiens Book')],
    category: getCatId('books'),
    brand: 'Harper',
    rating: 4.6,
    reviewCount: 62000,
    stock: 110
  });
  products.push({
    title: 'Rich Dad Poor Dad',
    description: 'What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not!',
    price: 19.95,
    images: [getImg('Rich Dad Poor Dad')],
    category: getCatId('books'),
    brand: 'Plata Publishing',
    rating: 4.7,
    reviewCount: 52000,
    stock: 150
  });
  products.push({
    title: 'Harry Potter and the Sorcerer\'s Stone',
    description: 'The first novel in the Harry Potter series and J.K. Rowling\'s debut novel.',
    price: 24.99,
    images: [getImg('Harry Potter Book')],
    category: getCatId('books'),
    brand: 'Scholastic',
    rating: 4.9,
    reviewCount: 98000,
    stock: 300
  });

  // Home & Kitchen (5 products)
  products.push({
    title: 'Professional Blender 1000W',
    description: 'Professional blender with 1000 watts of professional performance power. Features 64 oz maximum liquid capacity.',
    price: 89.99,
    originalPrice: 119.99,
    images: [getImg('Professional Blender')],
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
    images: [getImg('Cookware Set')],
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
    images: [getImg('Robot Vacuum')],
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
    images: [getImg('Coffee Maker')],
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
    images: [getImg('Air Purifier')],
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
    images: [getImg('White T-Shirt')],
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
    images: [getImg('Mens Jeans')],
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
    images: [getImg('Running Shoes')],
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
    images: [getImg('Puffer Jacket')],
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
    images: [getImg('LEGO Set')],
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
    images: [getImg('RC Car')],
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
    images: [getImg('Board Game')],
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
    images: [getImg('Yoga Mat')],
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
    images: [getImg('Dumbbell Set')],
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
    images: [getImg('Camping Tent')],
    category: getCatId('sports'),
    brand: 'Outdoorsy',
    rating: 4.5,
    reviewCount: 1400,
    stock: 40
  });

  // --- NEW: Electronics ---
  products.push({
    title: 'Pro Laptop 15-inch',
    description: 'Thin and light laptop with 15-inch Retina display, 16GB RAM, 512GB SSD, and all-day battery life. Perfect for work and creativity.',
    price: 1299.00,
    originalPrice: 1499.00,
    images: [getImg('Laptop')],
    category: getCatId('electronics'),
    brand: 'TechBook',
    rating: 4.8,
    reviewCount: 6800,
    stock: 30
  });
  products.push({
    title: 'Smart Tablet 10-inch',
    description: '10-inch tablet with stunning display, powerful processor, and all-day battery. Great for streaming, browsing, and light productivity.',
    price: 449.00,
    originalPrice: 499.00,
    images: [getImg('Tablet')],
    category: getCatId('electronics'),
    brand: 'TabPro',
    rating: 4.6,
    reviewCount: 3400,
    stock: 60
  });
  products.push({
    title: 'Smart Home Speaker',
    description: 'Voice-controlled smart speaker with rich sound. Control your smart home, play music, set timers, and more with just your voice.',
    price: 99.99,
    originalPrice: 129.99,
    images: [getImg('Smart Speaker')],
    category: getCatId('electronics'),
    brand: 'EchoHome',
    rating: 4.5,
    reviewCount: 18900,
    stock: 200
  });
  products.push({
    title: '4K Ultra HD Monitor 27-inch',
    description: '27-inch 4K IPS monitor with HDR support, 99% sRGB color accuracy, and ergonomic stand. Ideal for creative professionals.',
    price: 349.99,
    originalPrice: 429.99,
    images: [getImg('4K Monitor')],
    category: getCatId('electronics'),
    brand: 'ViewClear',
    rating: 4.7,
    reviewCount: 2100,
    stock: 40
  });
  products.push({
    title: 'Mini Drone with Camera',
    description: 'Compact foldable drone with 4K camera, 3-axis gimbal stabilization, and 30-minute flight time. GPS auto-return and obstacle avoidance.',
    price: 299.00,
    originalPrice: 399.00,
    images: [getImg('Drone')],
    category: getCatId('electronics'),
    brand: 'SkyFly',
    rating: 4.4,
    reviewCount: 1500,
    stock: 25
  });

  // --- NEW: Books ---
  products.push({
    title: 'Rich Dad Poor Dad',
    description: 'What the rich teach their kids about money that the poor and middle class do not. The #1 Personal Finance book of all time.',
    price: 12.99,
    originalPrice: 17.99,
    images: [getImg('Rich Dad Poor Dad')],
    category: getCatId('books'),
    brand: 'Plata Publishing',
    rating: 4.7,
    reviewCount: 112000,
    stock: 300
  });
  products.push({
    title: 'Harry Potter and the Sorcerer\'s Stone',
    description: 'The magical first book in J.K. Rowling\'s beloved series. Follow Harry Potter as he discovers he\'s a wizard and enters Hogwarts School of Witchcraft and Wizardry.',
    price: 14.99,
    images: [getImg('Harry Potter Book')],
    category: getCatId('books'),
    brand: 'Scholastic',
    rating: 4.9,
    reviewCount: 250000,
    stock: 500
  });
  products.push({
    title: 'The Alchemist',
    description: 'Paulo Coelho\'s enchanting novel, a worldwide phenomenon and a story that speaks to the heart about following your dreams.',
    price: 13.50,
    originalPrice: 16.99,
    images: [getImg('The Alchemist')],
    category: getCatId('books'),
    brand: 'HarperOne',
    rating: 4.8,
    reviewCount: 95000,
    stock: 200
  });

  // --- NEW: Home & Kitchen ---
  products.push({
    title: 'Electric Stand Mixer 5.5-Qt',
    description: '5.5-quart tilt-head stand mixer with 10 speeds and multiple attachments. Perfect for baking cakes, bread, and more.',
    price: 379.99,
    originalPrice: 449.99,
    images: [getImg('Stand Mixer')],
    category: getCatId('home-kitchen'),
    brand: 'BakePro',
    rating: 4.8,
    reviewCount: 7200,
    stock: 35
  });
  products.push({
    title: 'Stainless Steel Electric Kettle',
    description: 'Fast-boiling 1.7L electric kettle with temperature control, keep-warm function, and 360° swivel base. BPA-free inner lid.',
    price: 49.99,
    originalPrice: 69.99,
    images: [getImg('Electric Kettle')],
    category: getCatId('home-kitchen'),
    brand: 'BrewMaster',
    rating: 4.6,
    reviewCount: 3800,
    stock: 100
  });
  products.push({
    title: 'Countertop Toaster Oven',
    description: 'Versatile toaster oven with air fry, bake, broil, and toast functions. 21L capacity fits a 12-inch pizza. Non-stick interior for easy cleaning.',
    price: 89.99,
    originalPrice: 109.99,
    images: [getImg('Toaster Oven')],
    category: getCatId('home-kitchen'),
    brand: 'ChefChoice',
    rating: 4.5,
    reviewCount: 2900,
    stock: 55
  });

  // --- NEW: Clothing ---
  products.push({
    title: 'Unisex Pullover Hoodie',
    description: 'Ultra-soft fleece pullover hoodie with kangaroo pocket and adjustable drawstring hood. Available in multiple colors.',
    price: 45.00,
    originalPrice: 59.00,
    images: ['https://warriorworld.in/cdn/shop/files/N-2247-navy-blue.jpg?v=1764574254&width=1600'],
    category: getCatId('clothing'),
    brand: 'ComfyWear',
    rating: 4.7,
    reviewCount: 8900,
    stock: 250
  });
  products.push({
    title: 'Men\'s Classic Oxford Shirt',
    description: 'Timeless Oxford-weave button-down shirt in 100% cotton. Slim fit with button-down collar. Great for casual and smart-casual occasions.',
    price: 39.99,
    images: [getImg('Oxford Shirt')],
    category: getCatId('clothing'),
    brand: 'StyleCraft',
    rating: 4.5,
    reviewCount: 4100,
    stock: 180
  });
  products.push({
    title: 'Polarized Aviator Sunglasses',
    description: 'Classic aviator sunglasses with polarized UV400 lenses. Lightweight metal frame and scratch-resistant coating. Includes case and cleaning cloth.',
    price: 29.99,
    originalPrice: 49.99,
    images: [getImg('Sunglasses')],
    category: getCatId('clothing'),
    brand: 'SunShade',
    rating: 4.4,
    reviewCount: 5600,
    stock: 300
  });

  // --- NEW: Toys ---
  products.push({
    title: '1000-Piece Jigsaw Puzzle',
    description: 'Premium 1000-piece jigsaw puzzle featuring beautiful landscape artwork. High-quality pieces with precise fit. Great for all ages.',
    price: 19.99,
    images: [getImg('Puzzle')],
    category: getCatId('toys'),
    brand: 'PuzzleCraft',
    rating: 4.6,
    reviewCount: 3200,
    stock: 150
  });
  products.push({
    title: 'Giant Stuffed Teddy Bear',
    description: 'Super soft and huggable 24-inch stuffed teddy bear made from premium plush material. Perfect gift for kids and adults alike.',
    price: 34.99,
    originalPrice: 44.99,
    images: [getImg('Stuffed Animal')],
    category: getCatId('toys'),
    brand: 'CuddlePals',
    rating: 4.8,
    reviewCount: 4500,
    stock: 120
  });

  // --- NEW: Sports ---
  products.push({
    title: 'Resistance Bands Set (5-Pack)',
    description: 'Set of 5 resistance bands ranging from light to extra heavy. Perfect for home workouts, physical therapy, and stretching routines.',
    price: 24.99,
    originalPrice: 34.99,
    images: [getImg('Resistance Bands')],
    category: getCatId('sports'),
    brand: 'FlexFit',
    rating: 4.7,
    reviewCount: 12000,
    stock: 400
  });
  products.push({
    title: 'Insulated Stainless Steel Water Bottle',
    description: 'Double-wall vacuum insulated 32oz water bottle. Keeps drinks cold 24 hours and hot 12 hours. Leak-proof lid and BPA-free.',
    price: 32.99,
    images: [getImg('Water Bottle')],
    category: getCatId('sports'),
    brand: 'HydroFlow',
    rating: 4.8,
    reviewCount: 22000,
    stock: 500
  });
  products.push({
    title: 'Adjustable Bicycle Helmet',
    description: 'Lightweight CPSC-certified bicycle helmet with adjustable fit dial, 21 ventilation channels, and removable visor. Fits adults and teens.',
    price: 49.99,
    originalPrice: 64.99,
    images: ['https://m.media-amazon.com/images/I/61rMHmSsDDL._AC_UF894,1000_QL80_.jpg'],
    category: getCatId('sports'),
    brand: 'SafeRide',
    rating: 4.6,
    reviewCount: 3700,
    stock: 80
  });

  return products;
};

const importData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    
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
