const mongoose = require('mongoose');
const purchaseOrderSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  supplier: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  file: {
    type: String,
    required: false,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);
module.exports = PurchaseOrder;
