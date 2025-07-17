const express = require('express'),
      db = require('../database.js'),
      cartRouter = express.Router()

cartRouter.get("/", async (req, res) => {
    if(req.user) {
        try {
            const user_id = req.user.user_id;
            const result = await db.query("SELECT items.name, items.price, cart.quantity FROM cart JOIN items ON items.item_id = cart.item_id WHERE user_id = $1", [user_id]);
            res.status(200).send(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).send({ error: 'Failed to fetch cart' });
        }
    } else {
        res.status(401).send();
    }
});

cartRouter.post("/", async (req, res) => {
    if(req.user) {
        try {
            const user_id = req.user.user_id;
            const { item_id, quantity } = req.body;
            const result = await db.query("INSERT INTO cart(user_id, item_id, quantity) VALUES ($1, $2, $3) RETURNING *", [user_id, item_id, quantity]);
            res.status(201).send(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).send({ error: 'Failed to add to cart' });
        }
    } else {
        res.status(401).send();
    }
});

cartRouter.put("/", async (req, res) => {
    if(req.user) {
        try {
            const user_id = req.user.user_id;
            const { item_id, quantity } = req.body;
            const result = await db.query("UPDATE cart SET quantity = $3 WHERE user_id = $1 AND item_id = $2 RETURNING *", [user_id, item_id, quantity]);
            res.status(200).send(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).send({ error: 'Failed to update cart' });
        }
    } else {
        res.status(401).send();
    }
});

cartRouter.delete("/", async (req, res) => {
    if(req.user) {
        try {
            const user_id = req.user.user_id;
            const { item_id } = req.body;
            await db.query("DELETE FROM cart WHERE user_id = $1 AND item_id = $2", [user_id, item_id]);
            res.status(204).send();
        } catch (err) {
            console.error(err);
            res.status(500).send({ error: 'Failed to delete from cart' });
        }
    }
});

module.exports = cartRouter;