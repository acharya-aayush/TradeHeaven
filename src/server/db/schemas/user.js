// User database schema definition
import { db } from '../index.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const initUserSchema = () => {
  // Check if default admin user exists, if not create one
  const adminUser = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
  if (!adminUser) {
    // Create a default admin user with password "admin123"
    const passwordHash = bcrypt.hashSync('admin123', 10);
    const userId = uuidv4();
    
    db.prepare(
      'INSERT INTO users (id, username, email, password_hash, full_name) VALUES (?, ?, ?, ?, ?)'
    ).run(userId, 'admin', 'admin@tradeheaven.com', passwordHash, 'Admin User');
    
    // Create a wallet for the admin user
    const existingWallet = db.prepare('SELECT * FROM wallets WHERE user_id = ?').get(userId);
    if (!existingWallet) {
      db.prepare('INSERT INTO wallets (user_id, balance, collateral_locked) VALUES (?, ?, ?)').run(userId, 10000, 0);
    }
  }
  
  // Check if default test user exists, if not create one
  const testUser = db.prepare('SELECT * FROM users WHERE username = ?').get('user1');
  if (!testUser) {
    // Create a default test user with password "password123"
    const passwordHash = bcrypt.hashSync('password123', 10);
    const userId = 'user1'; // Keep the existing user_id for compatibility
    
    db.prepare(
      'INSERT INTO users (id, username, email, password_hash, full_name) VALUES (?, ?, ?, ?, ?)'
    ).run(userId, 'user1', 'user1@tradeheaven.com', passwordHash, 'Test User');
    
    // Wallet for user1 should already exist from the main initDb function
  }
};

// User authentication functions
export const authenticateUser = (username, password) => {
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) return null;
  
  const passwordMatch = bcrypt.compareSync(password, user.password_hash);
  if (!passwordMatch) return null;
  
  // Update last login time
  db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);
  
  // Return user without password hash
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Create a new user
export const createUser = (userData) => {
  try {
    console.log('createUser called with data:', JSON.stringify(userData, null, 2));
    
    const { 
      username, 
      email, 
      password, 
      fullName = '',
      phoneNumber = null, 
      dateOfBirth = null, 
      country = null 
    } = userData;
    
    if (!username || !email || !password) {
      console.log('Missing required fields');
      return { error: 'Username, email, and password are required' };
    }
    
    // Check if username or email already exists
    const existingUser = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(username, email);
    if (existingUser) {
      if (existingUser.username === username) {
        console.log('Username already taken:', username);
        return { error: 'Username already taken' };
      } else {
        console.log('Email already registered:', email);
        return { error: 'Email already registered' };
      }
    }
    
    try {
      // Create new user
      const passwordHash = bcrypt.hashSync(password, 10);
      const userId = uuidv4();
      
      console.log('Inserting new user with ID:', userId);
      
      // Check which columns are available in the users table
      const columns = db.prepare('PRAGMA table_info(users)').all();
      const columnNames = columns.map(col => col.name);
      
      // Build dynamic insert query based on available columns
      let insertColumns = ['id', 'username', 'email', 'password_hash', 'full_name'];
      let insertParams = [userId, username, email, passwordHash, fullName];
      
      // Add phone_number if column exists
      if (columnNames.includes('phone_number') && phoneNumber !== null) {
        insertColumns.push('phone_number');
        insertParams.push(phoneNumber);
      }
      
      // Add date_of_birth if column exists
      if (columnNames.includes('date_of_birth') && dateOfBirth !== null) {
        insertColumns.push('date_of_birth');
        insertParams.push(dateOfBirth);
      }
      
      // Add country if column exists
      if (columnNames.includes('country') && country !== null) {
        insertColumns.push('country');
        insertParams.push(country);
      }
      
      // Create placeholders for the SQL query
      const placeholders = insertParams.map(() => '?').join(', ');
      
      // Create and execute the INSERT query
      const insertQuery = `
        INSERT INTO users (${insertColumns.join(', ')})
        VALUES (${placeholders})
      `;
      
      db.prepare(insertQuery).run(...insertParams);
      
      console.log('Creating wallet for user:', userId);
      
      // Create wallet for new user with zero balance
      db.prepare('INSERT INTO wallets (user_id, balance, collateral_locked) VALUES (?, ?, ?)').run(userId, 0, 0);
      
      // Return user without password
      const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
      
      if (!newUser) {
        console.error('User created but not found in subsequent query');
        return { error: 'Failed to create user' };
      }
      
      const { password_hash, ...userWithoutPassword } = newUser;
      
      console.log('User created successfully:', userId);
      return { user: userWithoutPassword };
    } catch (dbError) {
      console.error('Database error creating user:', dbError);
      return { error: 'Database error: ' + dbError.message };
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return { error: 'Failed to create user: ' + error.message };
  }
};

// Update user profile
export const updateUserProfile = (userId, userData) => {
  try {
    const { full_name, phone_number, date_of_birth, country, email } = userData;
    
    // Check if email already exists (if updating email)
    if (email) {
      const existingUser = db.prepare('SELECT * FROM users WHERE email = ? AND id != ?').get(email, userId);
      if (existingUser) {
        return { error: 'Email already registered by another user' };
      }
    }
    
    // Build update query based on provided fields
    let updateFields = [];
    let updateValues = [];
    
    if (full_name !== undefined) {
      updateFields.push('full_name = ?');
      updateValues.push(full_name);
    }
    
    if (phone_number !== undefined) {
      updateFields.push('phone_number = ?');
      updateValues.push(phone_number);
    }
    
    if (date_of_birth !== undefined) {
      updateFields.push('date_of_birth = ?');
      updateValues.push(date_of_birth);
    }
    
    if (country !== undefined) {
      updateFields.push('country = ?');
      updateValues.push(country);
    }
    
    if (email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    
    if (updateFields.length === 0) {
      return { error: 'No fields to update' };
    }
    
    // Add user_id to values array
    updateValues.push(userId);
    
    // Update user
    const updateQuery = `
      UPDATE users 
      SET ${updateFields.join(', ')} 
      WHERE id = ?
    `;
    
    db.prepare(updateQuery).run(...updateValues);
    
    // Return updated user
    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    const { password_hash, ...userWithoutPassword } = updatedUser;
    
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { error: 'Failed to update user profile' };
  }
};

// Get user by ID
export const getUserById = (userId) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  if (!user) return null;
  
  // Return user without password hash
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}; 