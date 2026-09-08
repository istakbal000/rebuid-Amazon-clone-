import express from 'express';
import { getProducts, getProductById } from '../controllers/products.controller.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/search', getProducts); // Handled in getProducts via ?q=
router.get('/category/:category', getProducts); // Handled in getProducts via ?category=
router.get('/:id', getProductById);

export default router;
