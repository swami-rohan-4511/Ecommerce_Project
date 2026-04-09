const { executeQuery, executeQueryRaw } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  constructor(userData) {
    this.user_id = userData.user_id;
    this.role_id = userData.role_id;
    this.first_name = userData.first_name;
    this.last_name = userData.last_name;
    this.email = userData.email;
    this.password_hash = userData.password_hash;
    this.phone_number = userData.phone_number;
    this.profile_image_url = userData.profile_image_url;
    this.address = userData.address;
    this.city = userData.city;
    this.state = userData.state;
    this.postal_code = userData.postal_code;
    this.country = userData.country;
    this.is_active = userData.is_active;
    this.is_verified = userData.is_verified;
    this.last_login = userData.last_login;
    this.created_at = userData.created_at;
    this.updated_at = userData.updated_at;
  }

  // Get full name
  get fullName() {
    return `${this.first_name} ${this.last_name}`;
  }

  // Get user role name
  static async getUserWithRole(userId) {
    const query = `
      SELECT u.*, r.role_name
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.user_id = ? AND u.is_active = TRUE
    `;

    const users = await executeQueryRaw(query, [userId]);
    return users.length > 0 ? users[0] : null;
  }

  // Find user by email
  static async findByEmail(email) {
    const query = `
      SELECT u.*, r.role_name
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.email = ? AND u.is_active = TRUE
    `;

    const users = await executeQuery(query, [email]);
    return users.length > 0 ? users[0] : null;
  }

  // Find user by ID
  static async findById(userId) {
    const query = `
      SELECT u.*, r.role_name
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.user_id = ? AND u.is_active = TRUE
    `;

    const users = await executeQuery(query, [userId]);
    return users.length > 0 ? users[0] : null;
  }

  // Create new user
  
  static async create(userData) {

    
    const {
      first_name,
      last_name,
      email,
      password,
      phone_number,
      address,
      city,
      state,
      postal_code,
      country,
      role_name = 'CUSTOMER'
    } = userData;

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Get role ID
    const roleQuery = 'SELECT role_id FROM roles WHERE role_name = ?';
    const roles = await executeQuery(roleQuery, [role_name.toUpperCase()]);

    if (roles.length === 0) {
      throw new Error('Invalid role specified');
    }

    const role_id = roles[0].role_id;

    // Insert user
    const insertQuery = `
      INSERT INTO users (
        role_id, first_name, last_name, email, password_hash,
        phone_number, address, city, state, postal_code, country
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      role_id, first_name, last_name, email, password_hash,
      phone_number || null, address || null, city || null,
      state || null, postal_code || null, country || null
    ];

    const result = await executeQuery(insertQuery, values);

    // Return the created user
    return await this.findById(result.insertId);
  }

  // Update last login
  static async updateLastLogin(userId) {
    const query = 'UPDATE users SET last_login = NOW() WHERE user_id = ?';
    await executeQuery(query, [userId]);
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Get all users (admin only)
  static async getAllUsers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const query = `
      SELECT u.*, r.role_name
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.is_active = TRUE
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `;

     const users = await executeQueryRaw(query, [parseInt(limit), parseInt(offset)]);

    // Get total count
    const countQuery = 'SELECT COUNT(*) as total FROM users WHERE is_active = TRUE';
    const countResult = await executeQuery(countQuery);
    const total = countResult[0].total;

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Update user
  static async updateUser(userId, updateData) {
    const allowedFields = [
      'first_name', 'last_name', 'phone_number', 'address',
      'city', 'state', 'postal_code', 'country', 'is_verified'
    ];

    const updates = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(userId);

    const query = `
      UPDATE users
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE user_id = ?
    `;

    await executeQuery(query, values);
    return await this.findById(userId);
  }

  // Deactivate user (soft delete)
  static async deactivateUser(userId) {
    const query = 'UPDATE users SET is_active = FALSE WHERE user_id = ?';
    await executeQuery(query, [userId]);
  }
}

module.exports = User;
