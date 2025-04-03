CREATE DATABASE maintenance_system;

USE maintenance_system;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    reg_no VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    block VARCHAR(50),
    room_number VARCHAR(10),
    role ENUM('student', 'admin') DEFAULT 'student'
);

CREATE TABLE requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    type_of_work ENUM('electrical', 'plumbing', 'cleaning', 'internet', 'laundry', 'other'),
    suggestions TEXT,
    comments TEXT,
    proof VARCHAR(255),
    status ENUM('pending', 'completed', 'in_progress') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);