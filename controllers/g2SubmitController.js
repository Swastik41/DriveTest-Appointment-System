const DriveTest = require('../models/DriveTest');
const Appointment = require('../models/Appointment');

module.exports = async (req, res) => {
  try {
    // 🔒 Validate session & driver type
    if (!req.session.user || !req.session.user._id || req.session.user.userType !== 'Driver') {
      console.log("No user in session or user is not a driver.");
      return res.redirect('/auth/login');
    }

    const user = await DriveTest.findById(req.session.user._id);
    if (!user) {
      console.log("User not found in DB.");
      return res.redirect('/auth/login');
    }

    //  Already booked? Prevent duplicate bookings
    if (user.isBooked) {
      console.log("User already booked an appointment.");
      req.flash('error', 'You have already booked an appointment.');
      return res.redirect('/g2test');
    }

    //  Destructure input
    const {
      firstName, lastName, age, licenseNo, dob,
      car_information,
      appointmentId
    } = req.body;

    //  Validate input fields
    if (
      !firstName || !lastName || !age || !licenseNo || !car_information ||
      !car_information.make || !car_information.model ||
      !car_information.year || !car_information.platNo || !appointmentId
    ) {
      return res.status(400).send('Please fill in all required fields.');
    }

    //  Update user info
    user.firstName = firstName;
    user.lastName = lastName;
    user.age = age;
    user.licenseNo = licenseNo;
    user.dob = dob;
    user.testType = "G2"; // G2 Test
    user.car_details = {
      make: car_information.make,
      model: car_information.model,
      year: car_information.year,
      platNo: car_information.platNo
    };

    //  Book appointment slot
    const appointment = await Appointment.findById(appointmentId);
    if (appointment && appointment.isTimeSlotAvailable) {
      appointment.isTimeSlotAvailable = false;
      appointment.bookedBy = user._id;
      await appointment.save();

      user.appointmentId = appointment._id;
      user.isBooked = true; // ✅ Important
    } else {
      req.flash('error', 'This appointment slot is no longer available.');
      return res.redirect('/g2test');
    }

    await user.save();

    console.log(`G2 Test details + appointment booked for user ${user.username}`);
    req.flash('success', 'G2 Test details submitted and appointment booked successfully!');
    res.redirect('/g2test');

  } catch (error) {
    console.error("Error during G2 test submission:", error);
    res.status(500).send('An error occurred while submitting your data.');
  }
};
