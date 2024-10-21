const CustomError = require ('../utils/customError');

const isAuth = (req, res, next) => {
    if (req.isAuthenticated() && req.user.member) {
        next();
    } else {
        throw new CustomError(`401 - Not authorized to make this requst.`);
    }
}

const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.member && req.user.admin) {
        next();
    } else {
        throw new CustomError(`401 - Not authorized to make this requst.`);
    }
}

const isLoggedInOrMember = (req, res, next) => {
    // redirect to the join-club view if the user is not a member
    if (req.isAuthenticated() && !req.user.member) {
        res.redirect('/join-club');
    // redirect to the index view if the user is a member
    } else if (req.isAuthenticated() && req.user.member) {
        res.redirect('/');
    // proceed if the user is not authenticated
    } else {
        next();
    }
}

module.exports = {
    isAuth,
    isAdmin,
    isLoggedInOrMember
}