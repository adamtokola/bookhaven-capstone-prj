
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).send("User already exists.");

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully!", user: newUser });
    } catch (error) {
        res.status(500).send("Server error");
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).send("Invalid email or password.");

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).send("Invalid email or password.");

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ token, message: "Login successful!" });
    } catch (error) {
        res.status(500).send("Server error");
    }
});

module.exports = router;
