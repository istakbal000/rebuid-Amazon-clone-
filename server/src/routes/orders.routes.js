import express from 'express';
import { createOrder, getMyOrders, getOrderById } from '../controllers/orders.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

export default router;
