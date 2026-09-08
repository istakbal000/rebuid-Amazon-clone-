import express from 'express';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../controllers/addresses.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getAddresses)
  .post(protect, addAddress);

router.route('/:id')
  .patch(protect, updateAddress)
  .delete(protect, deleteAddress);

export default router;
