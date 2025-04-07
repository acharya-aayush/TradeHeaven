// Authentication route handlers
import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticateUser, createUser, getUserById, updateUserProfile } from '../db/schemas/user.js';
import { authenticateToken } from '../middleware/auth.js';
// Import bcrypt is causing server to fail - commented out for development
// import bcrypt from 'bcrypt';
import { db, findUserByUsername } from '../db/index.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'tradeheaven-secret-key';
const TOKEN_EXPIRY = '24h';

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log(`${new Date().toISOString()} - Login attempt for username: ${username}`);
    
    // For testing purposes, allow any login
    // This is a temporary solution for debugging
    const user = {
      id: 'user1',
      username: username || 'testuser',
      email: 'test@example.com',
      full_name: 'Test User'
    };
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username 
      }, 
      JWT_SECRET, 
      { expiresIn: TOKEN_EXPIRY }
    );
    
    // Return user data and token
    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name
      }
    });
    
    /* 
    // Original authentication logic commented out for now
    // Note: findUserByUsername is not available, we would need to implement it
    // or use a different method to find the user
    
    // const user = await findUserByUsername(username);
    
    // Example alternative using db directly:
    // const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }
    
    // const passwordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }
    
    // Update last login timestamp
    db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username 
      }, 
      JWT_SECRET, 
      { expiresIn: TOKEN_EXPIRY }
    );
    
    // Return user data and token
    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name
      }
    });
    */
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullName, phoneNumber, dateOfBirth, country } = req.body;
    
    console.log('Registration request received:', req.body);
    
    // Package user data
    const userData = {
      username,
      email,
      password,
      fullName,
      phoneNumber,
      dateOfBirth,
      country
    };
    
    console.log('Creating user with data:', userData);
    
    // Create the user
    const user = await createUser(userData);
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create user'
      });
    }
    
    console.log('User created successfully:', user.id);
    
    // Return success response
    res.status(201).json({
      success: true,
      message: 'User created successfully!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name
      }
    });
  } catch (error) {
    console.error('User creation error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const {
      full_name,
      email,
      phone_number,
      date_of_birth,
      country
    } = req.body;
    
    const result = updateUserProfile(userId, {
      full_name,
      email,
      phone_number,
      date_of_birth,
      country
    });
    
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: result.user
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'An error occurred while updating profile' });
  }
});

// Verify token and get current user
router.get('/me', (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = getUserById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    console.error('Auth verification error:', error);
    res.status(500).json({ error: 'An error occurred during authentication' });
  }
});

export default router; 