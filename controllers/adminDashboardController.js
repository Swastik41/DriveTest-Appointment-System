const Appointment = require('../models/Appointment');
const DriveTest = require('../models/DriveTest'); // Assuming you have a DriveTest model

module.exports = async (req, res) => {
    try {
        const appointments = await Appointment.find({ isTimeSlotAvailable: false })
            .populate('bookedBy'); // joins with DriveTest schema

        res.render('adminDashboard', {
            appointments
        });
    } catch (err) {
        console.error("Failed to load booked appointments:", err);
        res.status(500).send("Error loading admin dashboard");
    }
};
