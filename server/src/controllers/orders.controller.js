import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Shipping address and payment method required' });
    }

    // Recalculate prices and validate stock on the server
    let calculatedSubtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const dbProduct = await Product.findById(item.product);
      
      if (!dbProduct) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      }
      
      if (dbProduct.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${dbProduct.title}` });
      }

      orderItems.push({
        product: dbProduct._id,
        title: dbProduct.title,
        image: dbProduct.images[0] || '',
        quantity: item.quantity,
        price: dbProduct.price
      });

      calculatedSubtotal += dbProduct.price * item.quantity;
      
      // Decrease stock
      dbProduct.stock -= item.quantity;
      await dbProduct.save();
    }

    // Shipping and tax logic
    const shipping = calculatedSubtotal > 100 ? 0 : 10;
    const tax = calculatedSubtotal * 0.08; // 8% tax
    const total = calculatedSubtotal + shipping + tax;

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal: Number(calculatedSubtotal.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
      status: 'Pending'
    });

    const createdOrder = await order.save();

    // Clear user cart after successful order
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({ success: true, order: createdOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if the user is the owner of the order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Invalid order ID or server error' });
  }
};
