import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  images: [{ type: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 0 },
  priceHistory: [{
    price: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now }
  }],
  specifications: [{ 
    name: { type: String },
    value: { type: String }
  }]
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;
