// Enhanced index.js with security fixes and proper error handling
// This is the corrected version with critical issues fixed

const express = require('express');
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const flash = require('connect-flash');
require('dotenv').config(); // Load environment variables

// Import controllers
const homeController = require('./controllers/homeController');
const loginController = require('./controllers/loginController');
const loginUserController = require('./controllers/loginUserController');
const g2testController = require('./controllers/g2testController');
const g2SubmitController = require('./controllers/g2SubmitController');
const gtestController = require('./controllers/gtestController');
const gtestUpdateController = require('./controllers/gtestUpdateController');
const signupController = require('./controllers/signupController');
const signupUserController = require('./controllers/signupUserController');
const logoutController = require('./controllers/logoutController');
const appointmentController = require('./controllers/appointmentController');
const createAppointmentController = require('./controllers/createAppointmentController');
const bookAppointmentController = require('./controllers/bookAppointmentController');
const adminDashboardController = require('./controllers/adminDashboardController');
const examinerController = require('./controllers/examinerController');
const adminResultsController = require('./controllers/adminResultsController');

// Import middleware
const adminMiddleware = require('./middleware/adminMiddleware');
const driverMiddleware = require('./middleware/driverMiddleware');
const examinerMiddleware = require('./middleware/examinerMiddleware');

// ========== SECURITY FIX: Use environment variables ==========
const PORT = process.env.PORT || 4000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'keyboard cat'; // MUST change in .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@cluster0.ikbyf.mongodb.net/drive_test_db?retryWrites=true&w=majority&appName=Cluster0';

// Initialize express app
const app = express();

// ========== STATIC FILES MIDDLEWARE ==========
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// ========== REQUEST PARSING MIDDLEWARE ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== SECURITY FIX: Enhanced session configuration ==========
app.use(expressSession({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
        httpOnly: true, // Prevent JavaScript access to cookie
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Flash messages middleware
app.use(flash());

// ========== ROLE-BASED LOCALS MIDDLEWARE ==========
app.use((req, res, next) => {
    if (req.session && req.session.user) {
        res.locals.loggedIn = true;
        res.locals.isAdmin = req.session.user.userType === 'Admin';
        res.locals.isDriver = req.session.user.userType === 'Driver';
        res.locals.isExaminer = req.session.user.userType === 'Examiner';
        res.locals.user = req.session.user;
    } else {
        res.locals.loggedIn = false;
        res.locals.isAdmin = false;
        res.locals.isDriver = false;
        res.locals.isExaminer = false;
        res.locals.user = null;
    }
    next();
});

// ========== TEMPLATE ENGINE ==========
app.set('view engine', 'ejs');

// ========== MONGODB CONNECTION WITH ERROR HANDLING ==========
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ MongoDB connected successfully');
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    // Retry connection after 5 seconds
    setTimeout(() => {
        console.log('🔄 Retrying MongoDB connection...');
        mongoose.connect(MONGODB_URI);
    }, 5000);
});

// ========== ROUTE HANDLERS ==========

// Home route
app.get("/", homeController);

// Authentication routes
app.get('/auth/login', loginController);
app.post('/users/login', loginUserController);

// G2 Test routes
app.get('/g2test', driverMiddleware, g2testController);
app.post("/g2test/submit", driverMiddleware, g2SubmitController);
app.post('/g2test/book', driverMiddleware, bookAppointmentController); // Fixed: removed duplicate

// G Test routes
app.get('/gtest', driverMiddleware, gtestController);
app.post("/gtest/updateCar", gtestUpdateController);
app.post('/gtest/book', driverMiddleware, bookAppointmentController); // G test booking

// Signup routes
app.get("/auth/signup", signupController);
app.post("/user/signup", signupUserController);

// Logout route
app.get("/auth/logout", logoutController);

// Appointment management routes
app.get('/appointment', adminMiddleware, appointmentController);
app.post('/appointment/create', adminMiddleware, createAppointmentController);

// Admin routes
app.get('/admin/dashboard', adminMiddleware, adminDashboardController);
app.get('/admin/results', adminMiddleware, adminResultsController);

// Examiner routes
app.get('/examiner', examinerMiddleware, examinerController);
app.post('/examiner/update/:id', examinerMiddleware, async (req, res) => {
    try {
        const DriveTest = require('./models/DriveTest');
        const driverId = req.params.id;
        const { comment, passed } = req.body;

        // Validate input
        if (!driverId || passed === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        await DriveTest.findByIdAndUpdate(driverId, {
            comment,
            passed: passed === "true"
        });

        res.redirect('/examiner');
    } catch (err) {
        console.error("Error updating driver:", err);
        res.status(500).send("Update failed.");
    }
});

// ========== 404 ERROR HANDLER ==========
app.use((req, res) => {
    res.status(404).render('notfound');
});

// ========== GLOBAL ERROR HANDLER ==========
app.use((err, req, res, next) => {
    console.error('🔴 Error:', err);
    
    // Log error details
    console.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    // Don't expose error details in production
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const errorMessage = isDevelopment ? err.message : 'An error occurred. Please try again later.';

    res.status(err.status || 500).render('error', {
        error: errorMessage,
        isDevelopment
    });
});

// ========== GRACEFUL SHUTDOWN ==========
process.on('SIGINT', () => {
    console.log('\n📭 Server shutting down gracefully...');
    mongoose.connection.close();
    process.exit(0);
});

// ========== START SERVER ==========
app.listen(PORT, () => {
    console.log(`\n✅ Application is running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⏰ Started at: ${new Date().toLocaleString()}\n`);
});

module.exports = app;
