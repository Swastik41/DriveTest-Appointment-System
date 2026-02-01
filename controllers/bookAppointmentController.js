const Appointment = require('../models/Appointment');
const DriveTest = require('../models/DriveTest');

module.exports = async (req, res) => {
    const { appointmentId } = req.body;
    const userId = req.session.user._id;

    try {
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment || !appointment.isTimeSlotAvailable) {
            req.flash('error', 'This slot is no longer available.');

            // Redirect based on user’s current testType
            const user = await DriveTest.findById(userId);
            const redirectPath = user.testType === 'G' ? '/gtest' : '/g2test';
            return res.redirect(redirectPath);
        }

        // Mark slot as booked
        appointment.isTimeSlotAvailable = false;
        appointment.bookedBy = userId;
        await appointment.save();

        // Link appointment to user
        await DriveTest.findByIdAndUpdate(userId, {
            appointmentId,
            isBooked: true
        });

        req.flash('success', 'Appointment booked successfully!');   

        // Redirect back to the test page the user came from
        const user = await DriveTest.findById(userId);
        const redirectPath = user.testType === 'G' ? '/gtest' : '/g2test';
        return res.redirect(redirectPath);

    } catch (err) {
        console.error("Error booking appointment:", err);
        res.status(500).send('Error booking appointment');
    }
};
