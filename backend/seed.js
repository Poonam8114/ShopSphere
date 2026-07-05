const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

// Load environment variables
dotenv.config();

// Sample Users
const seedUsers = async () => {
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const userPassword = await bcrypt.hash('user123', salt);

  return [
    {
      name: 'ShopSphere Admin',
      email: 'admin@shopsphere.com',
      password: adminPassword,
      role: 'admin',
    },
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      role: 'user',
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: userPassword,
      role: 'user',
    },
  ];
};

// Sample Products
const seedProducts = [
  {
    title: 'iPhone 15 Pro Max',
    description: 'Titanium design, A17 Pro chip, custom Action button, and a powerful camera system. The ultimate iPhone experience.',
    category: 'Electronics',
    price: 1199.99,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=60',
    rating: 4.8,
    numReviews: 2,
    featured: true,
    reviews: [
      { name: 'John Doe', rating: 5, comment: 'Amazing titanium build quality! Speed is blazing fast.' },
      { name: 'Jane Smith', rating: 4.6, comment: 'Excellent camera zoom, but it is quite expensive.' },
    ],
  },
  {
    title: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling wireless headphones with auto noise canceling optimizer, crystal clear hands-free calling.',
    category: 'Electronics',
    price: 398.0,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=60',
    rating: 4.7,
    numReviews: 1,
    featured: true,
    reviews: [
      { name: 'John Doe', rating: 5, comment: 'Active Noise Cancelling is top tier. Fits very comfortably for long hours.' },
    ],
  },
  {
    title: 'MacBook Pro 16" M3 Max',
    description: 'The M3 Max chip drives massive performance for heavy workloads. Beautiful Liquid Retina XDR screen with up to 22 hours of battery.',
    category: 'Electronics',
    price: 2499.0,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=60',
    rating: 4.9,
    numReviews: 1,
    featured: true,
    reviews: [
      { name: 'Jane Smith', rating: 5, comment: 'Incredible performance, compiling code is instant. Totally worth the investment.' },
    ],
  },
  {
    title: 'Logitech MX Master 3S',
    description: 'An ergonomic wireless mouse with silent clicks, 8K DPI tracking on any surface, and MagSpeed electromagnetic scrolling.',
    category: 'Accessories',
    price: 99.99,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=60',
    rating: 4.5,
    numReviews: 1,
    featured: false,
    reviews: [
      { name: 'John Doe', rating: 4, comment: 'Best mouse for developers. Horizontal wheel is super useful for spreadsheets.' },
    ],
  },
  {
    title: 'Keychron Q1 Mechanical Keyboard',
    description: 'Full metal custom mechanical keyboard. Gateron G Pro switches, double-gasket design, and customizable QMK/VIA support.',
    category: 'Accessories',
    price: 189.99,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=60',
    rating: 4.6,
    numReviews: 1,
    featured: false,
    reviews: [
      { name: 'Jane Smith', rating: 4, comment: 'Satisfying sound profile. Sturdy and heavy, high quality desk feel.' },
    ],
  },
  {
    title: 'Ultra-Comfort Ergonomic Office Chair',
    description: 'Adjustable 3D armrests, dynamic lumbar support, breathable mesh, and smooth-rolling wheels. Perfect for long developer sessions.',
    category: 'Furniture',
    price: 349.5,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600&auto=format&fit=crop&q=60',
    rating: 4.3,
    numReviews: 1,
    featured: false,
    reviews: [
      { name: 'John Doe', rating: 4.3, comment: 'My back pain has improved a lot since using this chair.' },
    ],
  },
  {
    title: 'Minimalist Leather Backpack',
    description: 'Water-resistant full-grain leather, padded laptop compartment fits up to 16", and hidden pockets for travelers.',
    category: 'Apparel',
    price: 149.0,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=60',
    rating: 4.4,
    numReviews: 1,
    featured: false,
    reviews: [
      { name: 'Jane Smith', rating: 4.5, comment: 'Smells like high-quality leather. The zippers are robust.' },
    ],
  },
  {
    title: 'Running Sports Shoes',
    description: 'Breathable running sneakers with high elasticity cushions, lightweight designs, and wear-resistant rubber outer sole.',
    category: 'Apparel',
    price: 89.99,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60',
    rating: 4.2,
    numReviews: 1,
    featured: false,
    reviews: [
      { name: 'John Doe', rating: 4, comment: 'Good running shoes, fits well, bouncy feel.' },
    ],
  },
];

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopsphere');

    console.log('Seeding Database...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});

    console.log('Database cleared.');

    // Seed users
    const users = await seedUsers();
    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} Users.`);

    const userMap = {};
    createdUsers.forEach((u) => {
      userMap[u.role] = u._id;
    });

    // Seed products with user ids injected into their reviews
    const productsWithReviews = seedProducts.map((p) => {
      const reviews = p.reviews.map((r) => {
        let userId = createdUsers[1]._id; // Default to John Doe
        if (r.name === 'Jane Smith') {
          userId = createdUsers[2]._id;
        }
        return { ...r, user: userId };
      });
      return { ...p, reviews };
    });

    const createdProducts = await Product.insertMany(productsWithReviews);
    console.log(`Created ${createdProducts.length} Products.`);

    // Seed sample orders to generate analytics
    console.log('Seeding sample orders for sales charts...');
    
    // Sample orders from John Doe and Jane Smith
    const order1 = new Order({
      user: createdUsers[1]._id, // John Doe
      items: [
        {
          product: createdProducts[0]._id, // iPhone 15
          title: createdProducts[0].title,
          quantity: 1,
          price: createdProducts[0].price,
          image: createdProducts[0].image,
        },
        {
          product: createdProducts[3]._id, // MX Master
          title: createdProducts[3].title,
          quantity: 1,
          price: createdProducts[3].price,
          image: createdProducts[3].image,
        },
      ],
      shippingAddress: {
        address: '123 Tech Lane',
        city: 'Silicon Valley',
        postalCode: '94025',
        country: 'USA',
      },
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      totalAmount: createdProducts[0].price + createdProducts[3].price,
      paidAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      deliveredAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
    });

    const order2 = new Order({
      user: createdUsers[2]._id, // Jane Smith
      items: [
        {
          product: createdProducts[1]._id, // Sony XM5
          title: createdProducts[1].title,
          quantity: 2,
          price: createdProducts[1].price,
          image: createdProducts[1].image,
        },
      ],
      shippingAddress: {
        address: '456 Oak Road',
        city: 'New York',
        postalCode: '10001',
        country: 'USA',
      },
      paymentMethod: 'PayPal',
      paymentStatus: 'Paid',
      orderStatus: 'Shipped',
      totalAmount: createdProducts[1].price * 2,
      paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    });

    await order1.save();
    await order2.save();
    console.log('Sample orders seeded.');

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
