module.exports = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.userType?.toLowerCase() === 'examiner') {
        return next();
    }
    return res.redirect('/auth/login');
};
