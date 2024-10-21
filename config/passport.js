const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../db/queries');
const bcrypt = require('bcryptjs');

const verifyCallback = async (username, password, done) => {
    try {
        const user = await db.queryGetUserByEmail(username);
        if (!user) {
            return done(null, false, { message: `User with email: ${username} doesn't exist.` });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return done(null, false, { message: 'Password is incorrect.' });
        }
        // user successfully authenticated
        return done(null, user);
    } catch(err) {
        return done(err);
    }
};

const strategy = new LocalStrategy(verifyCallback);
passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.queryGetUserById(id);
        done(null, user);
    } catch(err) {
        done(err);
    }
});