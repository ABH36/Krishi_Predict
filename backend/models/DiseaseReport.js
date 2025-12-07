const mongoose = require('mongoose');

const DiseaseReportSchema = new mongoose.Schema({
  district: { type: String, index: true },
  disease: String, // Detected Disease Name
  confidence: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DiseaseReport', DiseaseReportSchema);