import asyncHandler from 'express-async-handler';
import TowingService from '../models/towingService.js';

const getTowingServices = asyncHandler(async (req, res) => {
  const services = await TowingService.find();
  res.json(services);
});

const createTowingService = asyncHandler(async (req, res) => {
  const { name, location, contact } = req.body;

  const service = await TowingService.create({
    name,
    location,
    contact
  });

  res.status(201).json(service);
});

export { getTowingServices, createTowingService };
