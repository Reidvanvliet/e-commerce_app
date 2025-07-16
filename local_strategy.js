const passport = require('passport');
const { Strategy } = require('passport-local');
const db =  require('./database.js');
const bcrypt = require('bcrypt');

passport.use(
    new Strategy(
        async (username, password, done) => {
            console.log(username);
            console.log(password);

            try {
                const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);

                if(result.rows.length < 1) {
                    return done(new Error("Username does not exist"), false);
                }

                const matchedPassword = await bcrypt.compare(password,result.rows[0].password_hash)

                if(!matchedPassword) {
                    return done(new Error("Password is incorrect"), false);
                }

                return done("Authenticated Successfully!", result.rows[0]);

            } catch (error) {
                console.log(error)
                return done(error);
            }
        }   
    )
)

passport.serializeUser((user, done) => {
  return done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    return done(null, result.rows[0]);
})