const express = require('express'),
      bcrypt = require('bcrypt'),
      db = require('../database.js'),
      accountRouter = express.Router(),
      passport = require("passport");

//Register endpoint

accountRouter.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, password, email, address } = req.body;

        const emailCheck = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        
        if(emailCheck.rows.length > 0) {
            res.status(500).send({ error: 'User with email already exists' });
        }

        const salt = await bcrypt.genSalt(5);
        const hashedPass = await bcrypt.hash(password, salt);
        await db.query("INSERT INTO users(first_name, last_name, password_hash, email, address) VALUES ($1, $2, $3, $4, $5)", [first_name, last_name, hashedPass, email, address]);
        res.status(201).send();
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to register user' });
    }
});

//Login endpoint

accountRouter.post('/login', passport.authenticate('local', { failureRedirect: "login"}), (req, res) => {
    res.status(200).send();
});

//Pofile endpoints

accountRouter.get('/profile', (req, res) => {
    if(req.user) {
        res.status(200).send(req.user);
    } else {
        res.status(401).send();
    }
})

accountRouter.put('/profile', async (req, res) => {
    if(req.user) {
        try {
            const user_id = req.user.user_id;
            const { first_name, last_name, address } = req.body;
            const result = await db.query("UPDATE users SET (first_name, last_name, address) = ($2, $3, $4) WHERE user_id = $1 RETURNING *", [user_id, first_name, last_name, address]);
            res.status(200).send(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).send({ error: 'Failed to update profile' });
        }
    }
});

accountRouter.delete("/profile", async (req, res) => {
    if(req.user) {
        try {
            const user_id = req.user.user_id;
            await db.query("DELETE FROM users WHERE user_id = $1", [user_id]);
            res.status(204).send();
        } catch (err) {
            console.error(err);
            res.status(500).send({ error: 'Failed to delete profile' });
        }
    }
});

module.exports = accountRouter;
