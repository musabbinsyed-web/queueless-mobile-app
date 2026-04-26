require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Provider = require('../models/Provider');

// Mock data copied from frontend for DB seeding
const SEED_CATEGORIES = [
  { _id: 'cat-hospital', name: 'Hospital', icon: 'hospital' },
  { _id: 'cat-salon', name: 'Salon', icon: 'salon' },
  { _id: 'cat-college', name: 'College Office', icon: 'college' },
  { _id: 'cat-restaurant', name: 'Restaurant', icon: 'restaurant' },
];

const SEED_PROVIDERS = [
  {
    _id: 'prov-hosp-pmc',
    name: 'Providence Medical Center',
    categoryId: 'cat-hospital',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop&q=80',
    rating: 4.6,
    location: '1200 Wellness Blvd, Metro City',
    busyness: 'high',
    currentVisitors: 38,
    queue: { nowServing: 120, nextToken: 130 }, // 10 people ahead
    services: [
      { name: 'General Checkup', description: 'Routine visits and preventive care', duration: '45 min', price: '$125' },
      { name: 'Blood Test', description: 'Laboratory diagnostics and panels', duration: '20 min', price: '$48' },
      { name: 'X-Ray', description: 'Diagnostic imaging', duration: '30 min', price: '$210' },
      { name: 'Specialist Consultation', description: 'Expert physician review', duration: '60 min', price: '$280' },
    ],
  },
  {
    _id: 'prov-hosp-rch',
    name: 'Riverside Community Hospital',
    categoryId: 'cat-hospital',
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d3722dacf216?w=800&h=600&fit=crop&q=80',
    rating: 4.3,
    location: '88 River Road, Riverside',
    busyness: 'moderate',
    currentVisitors: 22,
    queue: { nowServing: 40, nextToken: 45 }, // 5 people ahead
    services: [
      { name: 'General Checkup', description: 'Routine visits and preventive care', duration: '40 min', price: '$110' },
      { name: 'Blood Test', description: 'Laboratory diagnostics and panels', duration: '25 min', price: '$42' },
      { name: 'X-Ray', description: 'Diagnostic imaging', duration: '35 min', price: '$195' },
    ],
  },
  {
    _id: 'prov-salon-urban',
    name: 'Urban Edge Studio',
    categoryId: 'cat-salon',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&q=80',
    rating: 4.8,
    location: '42 Style District, Downtown',
    busyness: 'moderate',
    currentVisitors: 14,
    queue: { nowServing: 15, nextToken: 18 }, // 3 people ahead
    services: [
      { name: 'Haircut', description: 'Cut, wash, and style', duration: '45 min', price: '$55' },
      { name: 'Beard Styling', description: 'Trim, line-up, and shaping', duration: '30 min', price: '$35' },
      { name: 'Facial', description: 'Skin treatment and consultation', duration: '60 min', price: '$95' },
    ],
  },
];

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    console.log('Clearing old categories and providers...');
    await Category.deleteMany({});
    await Provider.deleteMany({});
    
    // We optionally clear the users for a completely fresh seed, but it might delete user's existing test users.
    // Let's just try to find or create the provider user.
    const User = require('../models/User');
    const bcrypt = require('bcrypt');
    let providerUser = await User.findOne({ email: 'provider@example.com' });
    if (!providerUser) {
      const passwordHash = await bcrypt.hash('password123', 12);
      providerUser = await User.create({
        fullName: 'Demo Provider',
        email: 'provider@example.com',
        passwordHash,
        role: 'provider'
      });
      console.log('Created provider user: provider@example.com');
    }

    console.log('Inserting categories...');
    await Category.insertMany(SEED_CATEGORIES);

    console.log('Inserting providers...');
    // Link the provider user as the owner of these providers
    const providersWithOwner = SEED_PROVIDERS.map(p => ({
      ...p,
      ownerUserId: providerUser._id
    }));
    await Provider.insertMany(providersWithOwner);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
