const Appointment = require('../models/Appointment');

module.exports = async (req, res) => {
    const { date, time } = req.body;

    try {
        const exists = await Appointment.findOne({ date, time });
        if (exists) {
            req.flash('error', 'This time slot already exists for the selected date.');
            return res.redirect('/appointment?date=' + date);
        }

        await Appointment.create({ date, time });
        req.flash('success', 'Appointment slot created!');
        res.redirect('/appointment?date=' + date);
    } catch (err) {
        res.send('Error creating appointment');
    }
};
