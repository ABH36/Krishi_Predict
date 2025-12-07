const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Path Corrected
const axios = require('axios'); 

// --- ⚙️ SETTINGS ⚙️ ---
const FAST2SMS_API_KEY = "YOUR_API_KEY_HERE"; 

// --- OTP SENDING LOGIC ---
async function sendOTP(phone, generatedOtp) {
  if (FAST2SMS_API_KEY === "YOUR_API_KEY_HERE") {
    console.log(`⚠️ [TEST MODE] SMS skipped.`);
    console.log(`📱 Phone: ${phone}`);
    console.log(`🔑 OTP: ${generatedOtp}`);
    return true; 
  }

  try {
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_API_KEY}&variables_values=${generatedOtp}&route=otp&numbers=${phone}`;
    await axios.get(url);
    console.log(`✅ [REAL MODE] SMS sent to ${phone}`);
    return true;
  } catch (error) {
    console.error("❌ SMS Failed:", error.message);
    return false; 
  }
}

// 1. Login / Register Route
router.post('/login', async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Phone number zaruri hai" });
  }

  try {
    let otp;
    if (FAST2SMS_API_KEY === "YOUR_API_KEY_HERE") {
      otp = 1234; 
    } else {
      otp = Math.floor(1000 + Math.random() * 9000);
    }

    const smsSent = await sendOTP(phone, otp);

    if (!smsSent && FAST2SMS_API_KEY !== "YOUR_API_KEY_HERE") {
      return res.status(500).json({ error: "SMS sending failed." });
    }

    let user = await User.findOne({ phone });
    let isNewUser = false;

    if (!user) {
      user = new User({ 
        phone,
        district: "Sehore", 
        preferred_crops: ["wheat"]
      });
      await user.save();
      isNewUser = true; 
      console.log(`🆕 New Signup: ${phone}`);
    } else {
      console.log(`👋 Login: ${phone}`);
    }

    res.json({ 
      status: "success", 
      user, 
      isNewUser, 
      message: "OTP Sent" 
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// 2. Profile Update Route (FIXED LOGIC HERE) 🛠️
router.post('/update', async (req, res) => {
  const { phone, name, district, crop, language, role } = req.body;

  try {
    const updateData = {};
    if (name) updateData.name = name;
    if (district) updateData.district = district;
    if (language) updateData.language = language;
    if (role) updateData.role = role;

    // --- FIX FOR CAST ERROR ---
    // Trader ke liye 'crop' empty array [] aata hai.
    // Hum check karenge ki kya ye array hai ya string.
    if (crop) {
        if (Array.isArray(crop)) {
            // Agar pehle se array hai (jaise [] trader ke liye), to direct daalo
            updateData.preferred_crops = crop;
        } else {
            // Agar string hai (jaise "wheat" farmer ke liye), to array mein daalo
            updateData.preferred_crops = [crop];
        }
    }
    // --------------------------

    const user = await User.findOneAndUpdate(
      { phone }, 
      updateData,
      { new: true } 
    );
    
    res.json({ status: "success", user });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Update Failed" });
  }
});

// 3. Get User Profile
router.get('/profile/:phone', async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: "User not found" });
  }
});

module.exports = router;