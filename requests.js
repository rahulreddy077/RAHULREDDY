const express = require('express');
const multer = require('multer');
const db = require('../config/db');
const router = express.Router();
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});

const upload = multer({ storage: storage });

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send("No token provided.");
    
    jwt.verify(token, 'your_secret_key', (err, decoded) => {
        if (err) return res.status(500).send("Failed to authenticate token.");
        req.userId = decoded.id;
        next();
    });
};

// Create a maintenance request
router.post('/', verifyToken, upload.single('proof'), (req, res) => {
    const { type_of_work, suggestions, comments } = req.body;
    const proof = req.file ? req.file.path : null;

    const sql = 'INSERT INTO requests (user_id, type_of_work, suggestions, comments, proof) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [req.userId, type_of_work, suggestions, comments, proof], (err, result) => {
        if (err) return res.status(500).send("Error creating request.");
        res.status(200).send("Request created successfully.");
    });
});

// Get all requests for a user
router.get('/', verifyToken, (req, res) => {
    const sql = 'SELECT * FROM requests WHERE user_id = ?';
    db.query(sql, [req.userId], (err, results) => {
        if (err) return res.status(500).send("Error fetching requests.");
        res.status(200).json(results);
    });
});

// Admin: Get all requests
router.get('/admin', (req, res) => {
    const sql = 'SELECT * FROM requests';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send("Error fetching requests.");
        res.status(200).json(results);
    });
});

// Generate report (example for student-wise)
router.get('/report/student/:id', (req, res) => {
    const sql = 'SELECT * FROM requests WHERE user_id = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).send("Error generating report.");
        // Here you can implement Excel/PDF generation logic
        res.status(200).json(results);
    });
});

module.exports = router;