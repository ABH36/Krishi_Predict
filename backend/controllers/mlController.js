const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const DiseaseReport = require('../models/DiseaseReport');
require('dotenv').config();

const ML_SERVER_URL = process.env.ML_SERVER_URL;

// Gemini AI Setup (Safe Mode)
let chatModel = null;
if (process.env.GEMINI_API_KEY) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    chatModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

// 1. Price Prediction
exports.predictPrice = async (req, res) => {
    try {
        const { crop, district, state, area_acres } = req.body;
        // ML Server Call
        const response = await axios.post(`${ML_SERVER_URL}/v1/predict`, {
            crop, district, state, area_acres: area_acres || 1.0
        });
        res.json(response.data);
    } catch (error) {
        console.error("ML Error:", error.message);
        res.status(500).json({ error: "ML Server unavailable" });
    }
};

// 2. Disease Detection & Auto-Reporting
exports.detectDisease = async (req, res) => {
    try {
        const response = await axios.post(`${ML_SERVER_URL}/v1/detect-disease`, req.body);
        const result = response.data;
        const userDistrict = req.body.district || "Sehore"; 

        // Agar bimari hai, to chupchap report save karo (Community Alert ke liye)
        if (result.status !== "Safe" && result.status !== "System Busy" && !result.error) {
            await DiseaseReport.create({
                district: userDistrict,
                disease: result.disease_name,
                confidence: result.confidence
            });
        }
        res.json(result);
    } catch (error) {
        console.error("Vision Error:", error.message);
        res.status(500).json({ error: "Analysis Failed" });
    }
};

// 3. AI Chatbot (Gemini)
exports.chatWithAI = async (req, res) => {
    const { message } = req.body;
    if (!chatModel) return res.json({ reply: "AI सर्विस अभी उपलब्ध नहीं है।" });

    try {
        const prompt = `You are 'Kisan Mitra', an expert agricultural AI. Reply in Hindi/Hinglish. User: ${message}`;
        const result = await chatModel.generateContent(prompt);
        const response = await result.response;
        res.json({ reply: response.text() });
    } catch (error) {
        res.status(500).json({ reply: "नेटवर्क समस्या है।" });
    }
};