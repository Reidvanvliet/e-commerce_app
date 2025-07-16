const passport = require('passport');
const { Strategy } = require('passport-local');
const db =  require('./database.js');

passport.use(
    new Strategy(
        (username, password, done) => {
            console.log(username);
            console.log(password);
    })
)