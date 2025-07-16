const passport = require('passport');
const { Strategy } = require('passport-local');
const db =  require('./database.js');
const bcrypt = require('bcrypt');

passport.use(
    new Strategy(
        {
            usernameField: 'email'
        },
        async (email, password, done) => {
            try {
                const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

                if(result.rows.length < 1) {
                    return done(new Error("Username does not exist"), false);
                }

                const matchedPassword = await bcrypt.compare(password,result.rows[0].password_hash)

                if(!matchedPassword) {
                    return done(new Error("Password is incorrect"), false);
                }

                return done(null, result.rows[0]);

            } catch (error) {
                console.log(error)
                return done(error);
            }
        }   
    )
)

passport.serializeUser((user, done) => {
    return done(null, user.user_id);
})

passport.deserializeUser(async (id, done) => {
    console.log("Deserializing User")
    const result = await db.query("SELECT * FROM users WHERE user_id = $1", [id]);
    return done(null, result.rows[0]);
})