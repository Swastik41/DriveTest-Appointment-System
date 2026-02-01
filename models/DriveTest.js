const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for DriveTest
const DriveTestSchema = new Schema({
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    age: { type: String, default: "" },
    licenseNo: { type: String, default: "" },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ["Driver", "Examiner", "Admin"], required: true },
    car_details: {
        make: { type: String, default: "" },
        model: { type: String, default: "" },
        year: { type: Number, default: "" },
        platNo: { type: String, default: "" }
    },
    testType: { type: String, enum: ["G", "G2"], default: null },
    comment: { type: String, default: "" },
    passed: { type: Boolean, default: null },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        default: null
    },
    isBooked: { type: Boolean, default: false },   
});

const DriveTest = mongoose.model('DriveTest', DriveTestSchema);
module.exports = DriveTest;
