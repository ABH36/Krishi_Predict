const mongoose = require('mongoose');

const MarketListingSchema = new mongoose.Schema({
  // Seller Identity (Connected to User)
  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' // Future-proofing: Link to User model
  },
  sellerName: { type: String, required: true },
  sellerPhone: { type: String, required: true },

  // Location (Critical for Trader Filtering)
  district: { 
    type: String, 
    required: true,
    index: true // Makes searching by district very fast ⚡
  },
  state: { type: String, default: 'Madhya Pradesh' },

  // Crop Details
  crop: { type: String, required: true },       // e.g. Wheat
  variety: { type: String, default: 'Standard' }, // e.g. Sharbati
  quantity: { type: Number, required: true },   // Amount
  unit: { type: String, default: 'Quintal' },   // Unit

  // Financials
  expectedPrice: { type: Number, required: true }, // Price per unit

  // Listing Management
  status: { 
    type: String, 
    enum: ['active', 'sold', 'expired'], 
    default: 'active' 
  },
  
  // Visual Proof (Optional for now, but ready for Phase 2)
  image: { type: String }, // Base64 string for crop photo

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MarketListing', MarketListingSchema);