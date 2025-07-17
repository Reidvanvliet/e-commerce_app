const express = require('express'),
      db = require('../database.js'),
      itemsRouter = express.Router()

//Items endpoints

itemsRouter.get('/', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM items ORDER BY name LIMIT 25");
        res.status(200).send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to fetch items' });
    }
});

itemsRouter.get('/:itemId', async (req, res) => {
    try {
        const item_id = req.params.itemId;
        const item = await db.query("SELECT * FROM items WHERE item_id = $1", [item_id]);
        res.status(200).send(item.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to fetch item' });
    }
});

itemsRouter.post('/', async (req, res) => {
    try {
        const {name, description, price, make} = req.body;
        const insertStmt = "INSERT INTO items(name, description, price, make) VALUES ($1, $2, $3, $4) RETURNING *";
        const result = await db.query(insertStmt, [name, description, price, make]);
        res.status(201).send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to add item' });
    }
});

itemsRouter.put('/', async (req, res) => {
    try {
        const {item_id, name, description, price, make} = req.body;
        const updateStmt = "UPDATE items SET (name, description, price, make) = ($2, $3, $4, $5) WHERE item_id = $1 RETURNING *";
        const result = await db.query(updateStmt, [item_id, name, description, price, make]);
        res.status(200).send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to update item' });
    }
});

itemsRouter.delete('/', async (req, res) => {
    try {
        const {item_id} = req.body;
        await db.query("DELETE FROM items WHERE item_id = $1", [item_id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to delete item' });
    }
});

module.exports = itemsRouter;