const DriveTest = require('../models/DriveTest');
const Appointment = require('../models/Appointment');

module.exports = async (req, res) => {
  try {
    const { testType = '', date = '' } = req.query;

    const query = {
      passed: { $in: [true, false] }
    };

    if (testType === 'G' || testType === 'G2') {
      query.testType = testType;
    }

    if (date) {
      const appointments = await Appointment.find({ date });
      const appointmentIds = appointments.map(app => app._id);
      query.appointmentId = { $in: appointmentIds };
    }

    const drivers = await DriveTest.find(query).populate('appointmentId');

    res.render('adminResults', {
      drivers,
      selectedDate: date,
      selectedTestType: testType
    });

  } catch (err) {
    console.error("Error loading admin results:", err);
    res.status(500).send("Internal Server Error");
  }
};
