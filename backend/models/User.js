const mongoose = require('mongoose');

// Sub-schema for Land Details (Clean Structure)
const LandSchema = new mongoose.Schema({
  area_acres: { type: Number, default: 0 },
  soil_type: { 
    type: String, 
    enum: ['alluvial', 'black', 'red', 'laterite', 'desert', 'loamy', 'unknown'],
    default: 'unknown' 
  },
  irrigation: { 
    type: String, 
    enum: ['rainfed', 'tube_well', 'canal', 'drip', 'unknown'],
    default: 'unknown' 
  }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  // Identity
  phone: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  name: { type: String, default: 'Kisan Bhai' },
  
  // Location & Prefs
  district: { type: String, default: 'Sehore' },
  state: { type: String, default: 'Madhya Pradesh' },
  language: { type: String, default: 'hi' },
  
  // Role Based Access (Farmer vs Trader)
  role: { 
    type: String, 
    enum: ['farmer', 'trader'], 
    default: 'farmer' 
  },

  // Farming Details
  land: { type: LandSchema, default: () => ({}) },
  preferred_crops: [String], // e.g. ['wheat', 'garlic']
  
  // Notification Logic (Critical for Alerts)
  fcm_token: { type: String, default: null }, // Mobile Push Token
  notifications_enabled: { type: Boolean, default: true },

  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);