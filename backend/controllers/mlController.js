const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const DiseaseReport = require('../models/DiseaseReport');
require('dotenv').config();


// ML server (FastAPI)
const ML_SERVER_URL = process.env.ML_SERVER_URL;

// =========================
// GROQ SETUP (LLAMA 3)
// =========================
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions';

// =========================
// 1. PRICE PREDICTION
// =========================
exports.predictPrice = async (req, res) => {
    try {
        const { crop, district, state, area_acres } = req.body;

        const response = await axios.post(
            `${ML_SERVER_URL}/v1/predict`,
            {
                crop,
                district,
                state,
                area_acres: area_acres || 1.0
            },
            {
                timeout: 60_000 // ⏳ ML cold-start safe
            }
        );

        res.json(response.data);

    } catch (error) {
        console.error("❌ ML Error:", error.message);
        res.status(500).json({
            error: "ML Server unavailable. Please try again."
        });
    }
};

// =========================
// 2. DISEASE DETECTION
// =========================
exports.detectDisease = async (req, res) => {
    try {
        const response = await axios.post(
            `${ML_SERVER_URL}/v1/detect-disease`,
            req.body,
            {
                timeout: 60_000
            }
        );

        const result = response.data;
        const userDistrict = req.body.district || "Sehore";

        // Auto-save disease report (for alerts)
        if (
            result &&
            result.status !== "Safe" &&
            result.status !== "System Busy" &&
            !result.error
        ) {
            await DiseaseReport.create({
                district: userDistrict,
                disease: result.disease_name,
                confidence: result.confidence
            });
        }

        res.json(result);

    } catch (error) {
        console.error("❌ Vision Error:", error.message);
        res.status(500).json({
            error: "Disease analysis failed"
        });
    }
};

// =========================
// 3. AI CHATBOT (GROQ)
// =========================
exports.chatWithAI = async (req, res) => {
    const { message } = req.body;

    if (!GROQ_API_KEY) {
        return res.json({
            reply: "AI सेवा अभी उपलब्ध नहीं है।"
        });
    }

    try {
        const response = await axios.post(
            GROQ_CHAT_URL,
            {
                model: "llama3-8b-8192",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are Kisan Mitra, an expert Indian agriculture AI. Reply in simple Hindi or Hinglish. Be practical."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                temperature: 0.4
            },
            {
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                timeout: 30_000
            }
        );

        res.json({
            reply: response.data.choices[0].message.content
        });

    } catch (error) {
        console.error("❌ Groq AI Error:", error.message);
        res.status(500).json({
            reply: "नेटवर्क समस्या है, बाद में कोशिश करें।"
        });
    }
};
