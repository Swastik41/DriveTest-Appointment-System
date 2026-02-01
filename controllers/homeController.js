const DriveTest = require('../models/DriveTest');

module.exports = async (req, res) => {
    try {
        if (!req.session.user || !req.session.user._id) {
            return res.redirect('/auth/login');
        }

        const user = await DriveTest.findById(req.session.user._id);

        res.render('dashboard', { 
            user 
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Dashboard error");
    }
};
