const DriveTest = require('../models/DriveTest');
const Appointment = require('../models/Appointment');

module.exports = async (req, res) => {
  try {
    // 🔐 Check if user is logged in
    if (!req.session.user || !req.session.user._id) {
      console.log("User session not found.");
      return res.redirect('/auth/login');
    }

    const userId = req.session.user._id;

    // 📅 Get selected date from query or use today
    const selectedDate = req.query.date || new Date().toISOString().split('T')[0];

    // 👤 Find user from DB
    const user = await DriveTest.findById(userId);
    if (!user) {
      console.log("User not found in DB.");
      return res.redirect('/auth/login');
    }

    // 🕑 Fetch available slots for selected date
    const slots = await Appointment.find({
      date: selectedDate,
      isTimeSlotAvailable: true
    });

    // 🎯 Render with all required flags and messages
    res.render('g2test', {
      user,
      selectedDate,
      slots,
      success: req.flash('success') || [],
      error: req.flash('error') || [],
      isBooked: user.isBooked || false
    });

  } catch (err) {
    console.error("G2 Test Page Error:", err);
    res.status(500).send('Error loading G2 test page');
  }
};
