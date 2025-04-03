const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const router = express.Router();

// Register
router.post('/register', (req, res) => {
    const { reg_no, name, password, block, room_number } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const sql = 'INSERT INTO users (reg_no, name, password, block, room_number) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [reg_no, name, hashedPassword, block, room_number], (err, result) => {
        if (err) return res.status(500).send("Error registering user.");
        res.status(200).send("User  registered successfully.");
    });
});

// Login
router.post('/login', (req, res) => {
    const { reg_no, password } = req.body;
    const sql = 'SELECT * FROM users WHERE reg_no = ?';
    db.query(sql, [reg_no], (err, results) => {
        if (err) return res.status(500).send("Error logging in.");
        if (results.length === 0) return res.status(404).send("User  not found.");
        
        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).send("Invalid password.");

        const token = jwt.sign({ id: user.user_id }, 'your_secret_key', { expiresIn: 86400 });
        res.status(200).send({ auth: true, token });
    });
});

module.exports = router;