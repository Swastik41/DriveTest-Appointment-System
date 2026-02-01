const Appointment = require('../models/Appointment'); // Import the Appointment model
const DriveTest = require('../models/DriveTest'); // Import the DriveTest model


module.exports = async (req, res) => {
    const selectedDate = req.query.date || new Date().toISOString().split('T')[0];

    try {
        const existingAppointments = await Appointment.find({ date: selectedDate });
        const bookedTimes = existingAppointments.map(slot => slot.time);
        const success = req.flash('success')[0];
        const error = req.flash('error')[0];

        res.render('appointment', {
            date: selectedDate,
            bookedTimes,
            success,
            error,
            user: req.session.user || null // ✅ Add this line
        });
    } catch (err) {
        res.send('Error loading appointments');
    }
};


