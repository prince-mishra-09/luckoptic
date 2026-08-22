require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');

const categories = [
  {
    name: 'Eyeglasses',
    slug: 'eyeglasses',
    description: 'Find your perfect pair of daily eyeglasses with premium designs.',
    image: 'https://ik.imagekit.io/bzdikkis8/glasses/eyeglasses-first-category.webp?updatedAt=1787246499354'
  },
  {
    name: 'Sunglasses',
    slug: 'sunglasses',
    description: 'Protect your eyes from UV rays with trending designer sunglasses.',
    image: 'https://ik.imagekit.io/bzdikkis8/glasses/sunglasses-first-category.webp?updatedAt=1787246498793'
  },
  {
    name: 'Screen Glasses',
    slug: 'screen-glasses',
    description: 'Blue light blocking glasses for computer and mobile screens.',
    image: 'https://ik.imagekit.io/bzdikkis8/glasses/screenglasses-first-catergory.webp?updatedAt=1787246498926'
  },
  {
    name: 'Kids Glasses',
    slug: 'kids-glasses',
    description: 'Flexible, durable, and colorful glasses designed specifically for kids.',
    image: 'https://ik.imagekit.io/bzdikkis8/glasses/kidsglasses-first-category.webp?updatedAt=1787246499294'
  }
];

// Sample images of products
const sampleImages = [
  'https://ik.imagekit.io/luckoptical/products/glass1.jpg',
  'https://ik.imagekit.io/luckoptical/products/glass2.jpg',
  'https://ik.imagekit.io/luckoptical/products/glass3.jpg'
];

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database Connected for seeding...');

    // Clear existing data
    await Category.deleteMany();
    await Product.deleteMany();
    console.log('Existing Categories & Products deleted.');

    // Insert Categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Categories seeded.');

    // Helper to find category id by name
    const getCategoryId = (name) => {
      return createdCategories.find((cat) => cat.name === name)._id;
    };

    const products = [
      {
        name: 'Vincent Chase Black Full Rim Rectangle',
        description: 'Elevate your daily style with these classic rectangular full-rim spectacles. Crafted from premium acetate for maximum comfort and durability.',
        price: 1500,
        discountPrice: 999,
        category: getCategoryId('Eyeglasses'),
        stock: 15,
        images: [
          'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=500&auto=format&fit=crop'
        ],
        shape: 'Rectangle',
        material: 'Acetate',
        frameType: 'Full Rim',
        gender: 'Men',
        color: 'Black',
        size: 'Medium',
        featured: true,
        ratings: 4.8
      },
      {
        name: 'John Jacobs Golden Round Spectacles',
        description: 'Vibe with the retro charm of round golden thin-metal eyeglasses. Sleek, lightweight, and perfect for a stylish profile.',
        price: 2500,
        discountPrice: 1999,
        category: getCategoryId('Eyeglasses'),
        stock: 8,
        images: [
          'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=500&auto=format&fit=crop'
        ],
        shape: 'Round',
        material: 'Metal',
        frameType: 'Full Rim',
        gender: 'Unisex',
        color: 'Gold',
        size: 'Small',
        featured: true,
        ratings: 4.6
      },
      {
        name: 'LuckOptics Air Rimless Oval spectacles',
        description: 'Feel weightless with LuckOptics Air collection. Oval shape frameless eyewear built from durable Titanium alloy.',
        price: 3200,
        discountPrice: 2499,
        category: getCategoryId('Eyeglasses'),
        stock: 12,
        images: [
          'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500&auto=format&fit=crop'
        ],
        shape: 'Oval',
        material: 'Titanium',
        frameType: 'Rimless',
        gender: 'Women',
        color: 'Silver',
        size: 'Medium',
        featured: false,
        ratings: 4.5
      },
      {
        name: 'Vincent Chase Polarized Aviator Sunglasses',
        description: 'The iconic pilot look. Premium green-polarized lenses matching double-bridged golden frame structure. Maximum UV protection.',
        price: 1999,
        discountPrice: 1299,
        category: getCategoryId('Sunglasses'),
        stock: 20,
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop'
        ],
        shape: 'Aviator',
        material: 'Stainless Steel',
        frameType: 'Full Rim',
        gender: 'Men',
        color: 'Gold',
        size: 'Wide',
        featured: true,
        ratings: 4.9
      },
      {
        name: 'Vincent Chase Cat Eye Oversized Sunglasses',
        description: 'Chic cat-eye sunglasses featuring gloss-black frame and gradient grey lenses. Add high-fashion accent to your look.',
        price: 1800,
        discountPrice: 1199,
        category: getCategoryId('Sunglasses'),
        stock: 10,
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop'
        ],
        shape: 'Cat Eye',
        material: 'Acetate',
        frameType: 'Full Rim',
        gender: 'Women',
        color: 'Black',
        size: 'Wide',
        featured: false,
        ratings: 4.4
      },
      {
        name: 'LuckOptics Air Screen Matte Blue Light Blockers',
        description: 'Zero-power computer glasses keeping screen glare away. Super-flexible TR90 frame body suitable for work and play.',
        price: 1200,
        discountPrice: 799,
        category: getCategoryId('Screen Glasses'),
        stock: 30,
        images: [
          'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=500&auto=format&fit=crop'
        ],
        shape: 'Wayfarer',
        material: 'TR90',
        frameType: 'Full Rim',
        gender: 'Unisex',
        color: 'Blue',
        size: 'Medium',
        featured: true,
        ratings: 4.7
      },
      {
        name: 'Vincent Chase Kids Flexible Round Spec',
        description: 'Durable eyeglasses for children. Twistable plastic composite frame that does not snap easily. Playproof design.',
        price: 999,
        discountPrice: 699,
        category: getCategoryId('Kids Glasses'),
        stock: 15,
        images: [
          'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500&auto=format&fit=crop'
        ],
        shape: 'Round',
        material: 'Plastic',
        frameType: 'Full Rim',
        gender: 'Kids',
        color: 'Pink',
        size: 'Small',
        featured: false,
        ratings: 4.3
      }
    ];

    await Product.insertMany(products);
    console.log('Products seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding data: ${error}`);
    process.exit(1);
  }
};

seedData();
