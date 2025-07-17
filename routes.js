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
        const user_id = req.user.user_id;
        const { first_name, last_name, address } = req.body;

        const result = await db.query("UPDATE users SET (first_name, last_name, address) = ($2, $3, $4) WHERE user_id = $1 RETURNING *", [user_id, first_name, last_name, address])

        res.status(200).send(result.rows);
    }
})

router.delete("/profile", async (req, res) => {
    if(req.user) {
        const user_id = req.user.user_id;

        await db.query("DELETE FROM users WHERE user_id = $1", [user_id]);

        res.status(204).send();
    }
})

//Cart routes

router.get("/cart", async (req, res) => {
    if(req.user) {
        const user_id = req.user.user_id;

        const result = await db.query("SELECT items.name, items.price, cart.quantity FROM cart JOIN items ON items.item_id = cart.item_id WHERE user_id = $1", [user_id]);

        res.status(200).send(result.rows);
    }
        res.status(401).send();
})

router.post("/cart", async (req, res) => {
    if(req.user) {
        const user_id = req.user.user_id;
        const { item_id, quantity } = req.body;

        const result = await db.query("INSERT INTO cart(user_id, item_id, quantity) VALUES ($1, $2, $3) RETURNING *", [user_id, item_id, quantity]);

        res.status(201).send(result.rows);
    }
    
    res.status(401).send();
})

router.put("/cart", async (req, res) => {
    if(req.user) {
        const user_id = req.user.user_id;
        const { item_id, quantity } = req.body;

        const result = await db.query("UPDATE cart SET quantity = $3 WHERE user_id = $1 AND item_id = $2 RETURNING *", [user_id, item_id, quantity]);

        res.status(200).send(result.rows);
    }
    res.status(401).send();
})

router.delete("/cart", async (req, res) => {
    if(req.user) {
        const user_id = req.user.user_id;
        const { item_id } = req.body;

        await db.query("DELETE FROM cart WHERE user_id = $1 AND item_id = $2", [user_id, item_id]);

        res.status(204).send();
    }
})

//Update order_history

router.post("/order_history", async (req, res) => {
    if(req.user) { 
        const user_id = req.user.user_id;
        
    }
})

module.exports = router;
