import asyncHandler from 'express-async-handler';
import Mechanic from '../models/mechanic.js';

// @desc    Get all mechanics
// @route   GET /api/mechanics
// @access  Public
const getMechanics = asyncHandler(async (req, res) => {
  const mechanics = await Mechanic.find();
  res.json({
    success: true,
    count: mechanics.length,
    data: mechanics
  });
});

// @desc    Create new mechanic
// @route   POST /api/mechanics
// @access  Private
const createMechanic = asyncHandler(async (req, res) => {
  const { name, location, specialization, contact } = req.body;

  const mechanic = await Mechanic.create({
    name,
    location,
    specialization,
    contact
  });

  res.status(201).json({
    success: true,
    data: mechanic
  });
});

// @desc    Get nearby mechanics
// @route   GET /api/mechanics/nearby
// @access  Public
const getNearbyMechanics = asyncHandler(async (req, res) => {
  try {
    const { longitude, latitude, maxDistance, sortBy, specialty, minRating } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide longitude and latitude'
      });
    }

    // Base query for location
    const query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance) || 10000 // Default 10km
        }
      }
    };

    // Add specialty filter if provided
    if (specialty) {
      query.specialization = specialty;
    }

    // Add minimum rating filter if provided
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    let mechanics = await Mechanic.find(query);

    // Apply sorting
    if (sortBy) {
      switch(sortBy) {
        case 'rating':
          mechanics.sort((a, b) => b.rating - a.rating);
          break;
        case 'distance':
          // Already sorted by $near
          break;
        default:
          // Default is distance (already sorted by $near)
      }
    }

    res.json({
      success: true,
      count: mechanics.length,
      data: mechanics
    });
  } catch (error) {
    console.error('Error getting nearby mechanics:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting nearby mechanics',
      error: error.message
    });
  }
});

export { getMechanics, createMechanic, getNearbyMechanics };
