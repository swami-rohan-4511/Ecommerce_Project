-- =====================================================
-- E-COMMERCE DATABASE SCHEMA
-- =====================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- =====================================================
-- 1. ROLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS roles (
  role_id INT PRIMARY KEY AUTO_INCREMENT,
  role_name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  role_id INT NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  profile_image_url VARCHAR(500),
  address VARCHAR(500),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE RESTRICT,
  INDEX idx_email (email),
  INDEX idx_user_role (role_id),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  product_name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  stock_quantity INT NOT NULL DEFAULT 0,
  category VARCHAR(100),
  brand VARCHAR(100),
  product_image_url VARCHAR(500),
  sku VARCHAR(100) UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_category (category),
  INDEX idx_brand (brand),
  INDEX idx_is_active (is_active),
  INDEX idx_price (price),
  INDEX idx_sku (sku)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  total_amount DECIMAL(12, 2) NOT NULL,
  discount_amount DECIMAL(12, 2) DEFAULT 0,
  tax_amount DECIMAL(12, 2) DEFAULT 0,
  final_amount DECIMAL(12, 2) NOT NULL,
  order_status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
  payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  payment_method VARCHAR(50),
  shipping_address VARCHAR(500),
  billing_address VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_order_number (order_number),
  INDEX idx_order_status (order_status),
  INDEX idx_payment_status (payment_status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
  order_item_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  discount_per_item DECIMAL(10, 2) DEFAULT 0,
  subtotal DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT,
  INDEX idx_order_id (order_id),
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at);
CREATE INDEX idx_order_items_order_product ON order_items(order_id, product_id);

-- =====================================================
-- INITIAL DATA INSERTION
-- =====================================================

-- Insert Roles
INSERT INTO roles (role_name, description) VALUES 
('admin', 'Administrator with full access'),
('vendor', 'Vendor/Seller with product management access'),
('customer', 'Regular customer');

-- Insert Sample Users
INSERT INTO users (role_id, first_name, last_name, email, password_hash, phone_number, address, city, state, postal_code, country) VALUES 
(1, 'Admin', 'User', 'admin@ecommerce.com', '$2a$10$Dn2qkQvIUhcHZlNNiZwPi.mR7vqBcZqoXnKTvwV5HV8pKJVn0dJJm', '9999999999', '123 Admin St', 'New York', 'NY', '10001', 'USA'),
(2, 'John', 'Vendor', 'vendor@ecommerce.com', '$2a$10$Dn2qkQvIUhcHZlNNiZwPi.mR7vqBcZqoXnKTvwV5HV8pKJVn0dJJm', '9999999998', '456 Vendor Ave', 'Los Angeles', 'CA', '90001', 'USA'),
(3, 'Alice', 'Customer', 'alice@customer.com', '$2a$10$Dn2qkQvIUhcHZlNNiZwPi.mR7vqBcZqoXnKTvwV5HV8pKJVn0dJJm', '9999999997', '789 Customer Ln', 'Chicago', 'IL', '60601', 'USA'),
(3, 'Bob', 'Customer', 'bob@customer.com', '$2a$10$Dn2qkQvIUhcHZlNNiZwPi.mR7vqBcZqoXnKTvwV5HV8pKJVn0dJJm', '9999999996', '321 Buyer Rd', 'Houston', 'TX', '77001', 'USA');

-- Insert Sample Products
INSERT INTO products (product_name, description, price, discount_price, stock_quantity, category, brand, sku, created_by) VALUES 
('Wireless Headphones', 'Premium noise-cancelling wireless headphones', 199.99, 149.99, 50, 'Electronics', 'AudioBrand', 'SKU001', 2),
('USB-C Cable', 'High-speed USB-C charging cable', 29.99, 19.99, 200, 'Accessories', 'CableCorp', 'SKU002', 2),
('Phone Case', 'Protective phone case with shock absorption', 24.99, 19.99, 150, 'Accessories', 'ProtectCo', 'SKU003', 2),
('Laptop Stand', 'Ergonomic aluminum laptop stand', 79.99, 59.99, 75, 'Office', 'StandTech', 'SKU004', 2),
('Keyboard', 'Mechanical gaming keyboard RGB', 149.99, 99.99, 100, 'Electronics', 'KeyMaster', 'SKU005', 2);

-- Insert Sample Orders
INSERT INTO orders (user_id, order_number, total_amount, tax_amount, final_amount, order_status, payment_status, payment_method, shipping_address) VALUES 
(3, 'ORD-20260409-001', 249.98, 25.00, 274.98, 'confirmed', 'completed', 'credit_card', '789 Customer Ln, Chicago, IL 60601'),
(4, 'ORD-20260409-002', 99.99, 10.00, 109.99, 'shipped', 'completed', 'debit_card', '321 Buyer Rd, Houston, TX 77001'),
(3, 'ORD-20260408-001', 59.99, 6.00, 65.99, 'delivered', 'completed', 'paypal', '789 Customer Ln, Chicago, IL 60601');

-- Insert Sample Order Items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES 
(1, 1, 1, 149.99, 149.99),
(1, 3, 1, 19.99, 19.99),
(2, 5, 1, 99.99, 99.99),
(3, 4, 1, 59.99, 59.99);
