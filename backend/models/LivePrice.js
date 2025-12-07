const mongoose = require('mongoose');

const LivePriceSchema = new mongoose.Schema({
  district: String,
  mandi: String,
  crop: String,
  price: Number,
  reporterName: String, 
  time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LivePrice', LivePriceSchema);