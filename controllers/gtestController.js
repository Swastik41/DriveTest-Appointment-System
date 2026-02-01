const DriveTest = require("../models/DriveTest");
const Appointment = require("../models/Appointment"); // Make sure this model is defined

module.exports = async (req, res) => {
    try {
        if (!req.session.user || !req.session.user._id) {
            console.log("User not logged in. Redirecting to login.");
            return res.redirect("/auth/login");
        }

        const user = await DriveTest.findById(req.session.user._id);

        if (!user) {
            console.log("No user found with this ID.");
            return res.send("User not found.");
        }

        // Determine selected date: from query or default to today
        const selectedDate = req.query.date || new Date().toISOString().split("T")[0];

        // Fetch slots available for selected date (not booked)
        const slots = await Appointment.find({ date: selectedDate, bookedBy: null });

        // Render the view with user, selectedDate, and slots
        res.render("gtest", {
            user,
            selectedDate,
            slots
        });

    } catch (err) {
        console.error("Error loading G test page:", err);
        res.status(500).send("Internal Server Error");
    }
};
