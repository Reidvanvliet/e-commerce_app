const express = require('express'),
      bcrypt = require('bcrypt'),
      db = require('./database.js'),
      router = express.Router(),
      passport = require("passport");

//Items endpoints

router.get('/items', async (req, res) => {
    const result = await db.query("SELECT * FROM items ORDER BY name LIMIT 25");

    res.status(200).send(result.rows);
});

router.post('/items', async (req, res) => {
    const {name, description, price, make} = req.body;
    const insertStmt = "INSERT INTO items(name, description, price, make) VALUES ($1, $2, $3, $4) RETURNING *"

    const result = await db.query(insertStmt, [name, description, price, make]);

    res.status(201).send(result.rows);
})

router.put('/items', async (req, res) => {
    const {item_id, name, description, price, make} = req.body;
    const updateStmt = "UPDATE items SET (name, description, price, make) = ($2, $3, $4, $5) WHERE item_id = $1 RETURNING *"

    const result = await db.query(updateStmt, [item_id, name, description, price, make]);

    res.status(200).send(result.rows)
})

router.delete('/items', async (req, res) => {
    const {item_id} = req.body;

    await db.query("DELETE FROM items WHERE item_id = $1", [item_id]);

    res.status(204).send();
})

//Register endpoint

router.post('/register', async (req, res) => {
    const { first_name, last_name, password, email, address } = req.body;
    const salt = await bcrypt.genSalt(5);
    const hashedPass = await bcrypt.hash(password, salt);

    db.query("INSERT INTO users(first_name, last_name, password_hash, email, address) VALUES ($1, $2, $3, $4, $5)", [first_name, last_name, hashedPass, email, address]);

    res.status(201).send();
})

//Login endpoint

router.post('/login', passport.authenticate('local', { failureRedirect: "login"}), (req, res) => {
    res.status(200).send();
});

//Pofile endpoints

router.get('/profile', (req, res) => {
    if(req.user) {
        res.status(200).send(req.user);
    } else {
        res.status(401).send();
    }
})

router.put('/profile', async (req, res) => {
    if(req.user) {
        db.query("UPDATE users SET (name, description, price, make) = ($2, $3, $4, $5) WHERE item_id = $1 RETURNING * ")
    }
})

module.exports = router;
