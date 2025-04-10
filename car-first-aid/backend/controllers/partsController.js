import asyncHandler from 'express-async-handler';
import Part from '../models/part.js';

// @desc    Get all parts
// @route   GET /api/parts
// @access  Public
const getParts = asyncHandler(async (req, res) => {
  const parts = await Part.find({});
  res.json(parts);
});

// @desc    Create a part
// @route   POST /api/parts
// @access  Private/Admin
const createPart = asyncHandler(async (req, res) => {
  const { name, description, category, price, image, stock } = req.body;

  const part = await Part.create({
    name,
    description,
    category,
    price,
    image,
    stock
  });

  res.status(201).json(part);
});

// @desc    Get single part by ID
// @route   GET /api/parts/:id
// @access  Public
const getPartById = asyncHandler(async (req, res) => {
  const part = await Part.findById(req.params.id);

  if (part) {
    res.json(part);
  } else {
    res.status(404);
    throw new Error('Part not found');
  }
});

export {
  getParts,
  createPart,
  getPartById
};
