require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const connectDB = require('./config/db');
const generateToken = require('./utils/generateToken');

// Config
require('./config/passport');
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS: STRICTLY for frontend URL
app.use(cors({
  origin: process.env.CLIENT_URL, 
  credentials: true 
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/scan', require('./routes/scanRoutes'));

// Google OAuth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { session: false }), 
  (req, res) => {
    // Generate JWT and set cookie
    generateToken(res, req.user._id);
    // Redirect back to Frontend Home
    res.redirect(process.env.CLIENT_URL);
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));