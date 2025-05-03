import mongoose from 'mongoose';
import Mechanic from '../models/mechanic.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleMechanics = [
  {
    name: "Hyderabad Auto Clinic",
    location: {
      type: "Point",
      coordinates: [78.4867, 17.385]
    },
    specialization: ["Engine Diagnostics", "Battery Services"],
    rating: 4.6,
    contact: {
      phone: "+91-9001234567",
      email: "support@hydautoclinic.com"
    },
    availability: true,
    bio: "Expert car care in the heart of Hyderabad with certified professionals and modern tools.",
    services: ["Oil Change", "Brake Repair", "AC Recharge"],
    reviews: [
      {
        author: "Ali Khan",
        rating: 5,
        comment: "Very professional and quick service."
      }
    ]
  },
  {
    name: "GearBox Garage",
    location: {
      type: "Point",
      coordinates: [78.403, 17.4933]
    },
    specialization: ["Transmission Repair", "Clutch Systems"],
    rating: 4.3,
    contact: {
      phone: "+91-9876000001",
      email: "gearbox@fixitmail.com"
    },
    availability: false,
    bio: "Clutch and gear system specialists in Kukatpally with years of experience.",
    services: ["Transmission Fluid Change", "Clutch Repair"],
    reviews: [
      {
        author: "Meena Joshi",
        rating: 4,
        comment: "Great with gearbox issues, but the waiting time was long."
      }
    ]
  },
  {
    name: "FastFix Motors",
    location: {
      type: "Point",
      coordinates: [78.4456, 17.4375]
    },
    specialization: ["General Service", "Suspension"],
    rating: 4.8,
    contact: {
      phone: "+91-9988776655",
      email: "contact@fastfixmotors.in"
    },
    availability: true,
    bio: "A modern garage with state-of-the-art facilities and quick turnaround times.",
    services: ["Suspension Tuning", "Full Car Service", "Wheel Alignment"],
    reviews: [
      {
        author: "Ravi Teja",
        rating: 5,
        comment: "Perfect place for quick fixes!"
      },
      {
        author: "Lakshmi N.",
        rating: 4.5,
        comment: "Neat facility and polite staff."
      }
    ]
  },
  {
    name: "City Car Works",
    location: {
      type: "Point",
      coordinates: [78.4712, 17.4088]
    },
    specialization: ["Paint & Dent", "Insurance Claims"],
    rating: 4.1,
    contact: {
      phone: "+91-8123456789",
      email: "info@citycarworks.co"
    },
    availability: true,
    bio: "Get your car looking new again with our expert bodywork and painting services.",
    services: ["Dent Removal", "Full Body Paint", "Accident Repair"],
    reviews: [
      {
        author: "Kiran M.",
        rating: 4,
        comment: "Good finish, but took a few days extra."
      }
    ]
  },
  {
    name: "SmartAuto Services",
    location: {
      type: "Point",
      coordinates: [78.552, 17.3155]
    },
    specialization: ["Electricals", "Diagnostics"],
    rating: 4.7,
    contact: {
      phone: "+91-9090909090",
      email: "service@smartauto.in"
    },
    availability: false,
    bio: "We diagnose and fix complex car issues with cutting-edge diagnostic tools.",
    services: ["ECU Tuning", "Sensor Repairs", "Battery Replacement"],
    reviews: [
      {
        author: "Deepak Reddy",
        rating: 5,
        comment: "Diagnosed a problem 3 other garages missed!"
      }
    ]
  }
];

const seedMechanics = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-first-aid';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing mechanics
    await Mechanic.deleteMany({});
    console.log('Cleared existing mechanics');

    // Insert sample mechanics
    const mechanics = await Mechanic.insertMany(sampleMechanics);
    console.log(`Inserted ${mechanics.length} mechanics`);

    // Create 2D sphere index for location-based queries
    await Mechanic.collection.createIndex({ location: "2dsphere" });
    console.log('Created 2dsphere index for location');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding mechanics:', error);
    process.exit(1);
  }
};

seedMechanics(); 