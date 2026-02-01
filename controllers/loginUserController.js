const DriveTest = require('../models/DriveTest');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await DriveTest.findOne({ username: username });

        if (!user) {
            console.log("User not found:", username);
            return res.redirect('/auth/login');
        }

        bcrypt.compare(password, user.password, (error, same) => {
            if (error) {
                console.error("Error comparing passwords:", error);
                return res.redirect('/auth/login');
            }

            if (same) {
                console.log("Login successful for:", username);

                // ✅ Correct field names in session
                req.session.user = {
                    _id: user._id,
                    username: user.username,
                    userType: user.userType,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: user.age,
                    car_details: user.car_details
                };

                console.log("Session user:", req.session.user);

                const userType = user.userType?.trim().toLowerCase();

                if (user.userType === 'Admin') {
                    return res.redirect('/admin/dashboard');
                } else if (user.userType === 'Examiner') {
                    return res.redirect('/examiner');
                } else if (user.userType === 'Driver') {
                    return res.redirect('/'); // Redirect to driver's dashboard or home page
                } else {
                    return res.redirect('/');
                }
                


            } else {
                console.log("Invalid password for user:", username);
                return res.redirect('/auth/login');
            }
        });

    } catch (error) {
        console.error("Error during login:", error);
        res.redirect('/auth/login');
    }
};
