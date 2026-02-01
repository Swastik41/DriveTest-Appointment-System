const DriveTest = require('../models/DriveTest');
const Appointment = require('../models/Appointment');

module.exports = async (req, res) => {
  try {
    const { filter } = req.query;
    const query = {
      testType: filter === 'G' || filter === 'G2' ? filter : { $in: ['G', 'G2'] },
      appointmentId: { $ne: null }
    };

    const drivers = await DriveTest.find(query).populate('appointmentId');
    res.render('examiner', { drivers, selectedFilter: filter || '' });
  } catch (err) {
    console.error('Examiner page error:', err);
    res.status(500).send('Error loading examiner view.');
  }
};
