module.exports = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Error destroying session:', err);
            return res.redirect('/');  // Redirect to home page
        }
        global.loggedIn = false; // Reset global loggedIn flag on logout
        res.redirect('/');  // Redirect to home page
    });
};
