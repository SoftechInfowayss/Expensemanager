const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Contact = require("../models/Contact");
const router = express.Router();
const nodemailer = require("nodemailer");
const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey';
router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save message in the database
    const contact = new Contact({ name, email, message });
    await contact.save();

    // Configure Nodemailer transporter using environment variables
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email from environment variables
        pass: process.env.EMAIL_PASSWORD, // Your email password or app password from environment variables
      },
    });

    // Email to customer
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank You for Contacting Us!",
      text: `Dear ${name},\n\nThank you for contacting us. Your message was: "${message}".\nWe will get back to you shortly.\n\nBest Regards,\nYour Team`,
    };

    // Email to yourself (admin)
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Sending to yourself
      subject: `New Contact Form Submission from ${name}`,
      text: `You have received a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // Send both emails
    await transporter.sendMail(customerMailOptions);
    await transporter.sendMail(adminMailOptions);

    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error sending message", error: error.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name,  email,phoneno,address,dob, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(201).json({ message: 'Email already in use' });
    }
    const newUser = new User({ name,  email,phoneno,address,dob, password });
    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error signing up user', error });
  }
  });
  
  router.post("/check-email", async (req, res) => {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
  
    if (existingUser) {
      return res.json({ exists: true });
    }
  
    res.json({ exists: false });
  });
  
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if the password matches (you should hash and compare passwords in production)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Payload data to include in the token
      JWT_SECRET, // Secret key
      { expiresIn: '1h' } // Token expiration (1 hour in this case)
    );

    // If valid credentials, send success response with the token
    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in', error });
  }
});
router.put("/profile", async (req, res) => {
  try {
    const { email, name, phoneno, address, dob } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user profile fields
    if (name) user.name = name;
    if (phoneno) user.phoneno = phoneno;
    if (address) user.address = address;
    if (dob) user.dob = dob;

    await user.save(); // Save the updated user data

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating profile", error });
  }
});
router.get("/profile", async (req, res) => {
  try {
    const { email } = req.query; // Get email from query parameters

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user profile data (excluding sensitive fields like password)
    const profileData = {
      name: user.name,
      email: user.email,
      phoneno: user.phoneno,
      address: user.address,
      dob: user.dob,
    };

    return res.status(200).json(profileData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching profile data", error });
  }
});
module.exports = router;
