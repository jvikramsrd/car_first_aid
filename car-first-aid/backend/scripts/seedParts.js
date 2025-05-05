import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Part from '../models/part.js';

dotenv.config();

const sampleParts = [
  {
    name: 'Front Brake Pads',
    description: 'High-quality ceramic brake pads for reliable stopping power.',
    category: 'brakes',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=400&q=80',
    brand: 'Brembo',
    compatibleCars: [
      { make: 'Ford', model: 'Figo', year: 2016 },
      { make: 'Honda', model: 'Civic', year: 2018 }
    ],
    stock: 25,
    featured: true
  },
  {
    name: 'Spark Plug',
    description: 'Platinum spark plug for improved engine performance and fuel efficiency.',
    category: 'ignition',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80',
    brand: 'Bosch',
    compatibleCars: [
      { make: 'Ford', model: 'Mustang', year: 2018 },
      { make: 'Toyota', model: 'Corolla', year: 2017 }
    ],
    stock: 100,
    featured: false
  },
  {
    name: 'Engine Oil Filter',
    description: 'Premium oil filter for extended engine life and protection.',
    category: 'engine',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    brand: 'Mobil 1',
    compatibleCars: [
      { make: 'Hyundai', model: 'i20', year: 2019 },
      { make: 'Ford', model: 'Figo', year: 2016 }
    ],
    stock: 50,
    featured: false
  },
  {
    name: 'Radiator Coolant',
    description: 'Long-life radiator coolant for optimal engine temperature.',
    category: 'cooling',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    brand: 'Prestone',
    compatibleCars: [
      { make: 'Toyota', model: 'Camry', year: 2020 },
      { make: 'Honda', model: 'Civic', year: 2018 }
    ],
    stock: 40,
    featured: true
  },
  {
    name: 'Shock Absorber',
    description: 'Durable shock absorber for a smooth and comfortable ride.',
    category: 'suspension',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    brand: 'Monroe',
    compatibleCars: [
      { make: 'Ford', model: 'Figo', year: 2016 },
      { make: 'Hyundai', model: 'i20', year: 2019 }
    ],
    stock: 15,
    featured: false
  }
];

async function seedParts() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/car-first-aid');
    await Part.deleteMany();
    await Part.insertMany(sampleParts);
    console.log('Sample parts inserted successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding parts:', err);
    process.exit(1);
  }
}

seedParts(); 