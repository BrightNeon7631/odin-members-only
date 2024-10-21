require('dotenv').config();
const path = require('node:path');
const express = require('express');
const expressSession = require('express-session');
const pgSession = require('connect-pg-simple')(expressSession);
const passport = require('passport');
const pool = require('./db/pool');
const userRouter = require('./routes/userRouter');
const messagesRouter = require('./routes/messagesRouter');
require('./config/passport');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

const sessionStore = new pgSession({
    pool: pool,
    tableName: 'session'
});

app.use(expressSession({
    store: sessionStore,
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

app.use(passport.session());
app.use('/', userRouter);
app.use('/messages', messagesRouter);
app.use('*', (req, res) => {
    res.render('error', { error: '404 - Page not found.' });
});

// Error handling
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).render('error', { error: err.message });
});

const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => console.log(`App listening on port: ${PORT}`));