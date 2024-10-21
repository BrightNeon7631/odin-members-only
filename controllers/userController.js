require('dotenv').config();
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../db/queries');
const passport = require('passport');

const validateSignUp = [
    body('firstname')
      .isLength({ min: 1, max: 100 })
      .withMessage('First name must be between 1 and 100 characters.'),
    body('lastname')
      .isLength({ min: 1, max: 100 })
      .withMessage('Last name must be between 1 and 100 characters.'),
    body('email')
      .trim()
      .isEmail()
      .isLength({ min: 1, max: 100 })
      .withMessage('Email must be between 1 and 100 characters.'),
    body('password')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Password must be between 1 and 100 characters.'),
    body('confirmPassword')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Confirm password must be between 1 and 100 characters.')
];

const validateLogin = [
    body('username')
      .trim()
      .isEmail()
      .isLength({ min: 1, max: 100 })
      .withMessage('Email must be between 1 and 100 characters.'),
    body('password')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Password must be between 1 and 100 characters.')
];

// and get all messages
const renderIndex = asyncHandler(async (req, res) => {
    const messages = await db.queryGetAllMessages();
    res.render('index', { user: req.user, messages: messages  });
});

const getSignUp = (req, res) => {
    res.render('sign-up-form');
}

const postSignUp = [
    validateSignUp,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).render('sign-up-form', {
            errors: errors.array()
          });
        }

        const { firstname, lastname, email, password, confirmPassword, isAdmin } = req.body;
        const userExists = await db.queryGetUserByEmail(email);
    
        if (userExists) {
            res.render('sign-up-form', { errors: [{ msg: `User with email: ${email} already exists.`}] })
        } else if (password !== confirmPassword) {
            res.render('sign-up-form', { errors: [{ msg: `Passwords don't match.` }] })
        } else {
            bcrypt.hash(password, 10, async (err, hashedPassword) => {
                if (err) {
                    throw err;
                } else {
                    // req.body.isAdmin == 'on' checks whether the checkbox is checked
                    await db.queryCreateUser(firstname, lastname, email, hashedPassword, isAdmin == 'on');
                    res.redirect('/');
                }
            })
        }
    }),
];

const getLogin = (req, res) => {
    res.render('login-form', { passportErrors: req.session.messages });
}

const postLogin = [
    validateLogin,
    passport.authenticate('local', {
        failureMessage: true,
        successRedirect: '/join-club',
        failureRedirect: '/login'
    }),
];

const postLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
}

const getJoinClub = (req, res) => {
    if (req.isAuthenticated() && !req.user.member) {
        res.render('join-club-form');
    } else if (req.isAuthenticated() && req.user.member) {
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
}

const postJoinClub = asyncHandler(async (req, res) => {
    const { password } = req.body;
    if (password === process.env.CLUB_PASSWORD && req.user) {
        await db.queryChangeMembership(req.user.id);
        res.redirect('/');
    } else {
        res.render('join-club-form', { errors: [{ msg: 'Incorrect club password.' }] });
    }
});

module.exports = {
    renderIndex,
    getSignUp,
    postSignUp,
    getLogin,
    postLogin,
    postLogout,
    getJoinClub,
    postJoinClub
}