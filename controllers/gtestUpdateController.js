const DriveTest = require("../models/DriveTest");

module.exports = async (req, res) => {
    try {
        if (!req.session.user || !req.session.user._id) {
            return res.redirect("/auth/login"); // Ensure user is logged in
        }

        // Extract car details from the request body only
        const { car_information } = req.body;
        const { model, make, year, platNo } = car_information || {};

        // Validate car fields before updating
        if (!model || !make || !year || !platNo) {
            return res.status(400).send("Please provide all car details.");
        }

        // Find user and update only car details
        const user = await DriveTest.findById(req.session.user._id);
        if (!user) return res.send("User not found.");

        user.car_details = { model, make, year, platNo };
        user.testType = "G"; // ✅ Mark this as G test

        await user.save();

        res.redirect("/gtest");
    } catch (err) {
        console.error("Error updating car information:", err);
        res.status(500).send("Error updating data");
    }
};
