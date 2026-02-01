const bcrypt = require('bcrypt');
const DriveTest = require('../models/DriveTest');

module.exports = async (req, res) => {
    try {
        const { username, password, userType } = req.body; // Extract user details

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with hashed password
        const newUser = new DriveTest({ username, password: hashedPassword, userType });
        await newUser.save();

        console.log("User registered successfully:", username);
        res.redirect('/auth/login'); // Redirect to login after registration
    } catch (error) {
        console.error("Error in user registration:", error);
        res.redirect('/auth/signup');
    }
};
