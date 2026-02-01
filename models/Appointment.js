const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    date: {
        type: String, // format: "YYYY-MM-DD"
        required: true
    },
    time: {
        type: String, // format: "HH:mm"
        required: true
    },
    isTimeSlotAvailable: {
        type: Boolean,
        default: true
    },
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DriveTest',
        default: null
      },
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);
module.exports = Appointment;

