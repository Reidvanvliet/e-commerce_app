const express = require('express'),
      db = require('../database.js'),
      itemsRouter = express.Router()

//Items endpoints

/**
 * @swagger
 * definitions:
 *   Item:
 *     properties:
 *       item_id:
 *         type: integer
 *       name:
 *         type: string
 *       description:
 *         type: integer
 *       price:
 *         type: numeric
 *       make:
 *         type: string
 */

/**
 * @swagger
 * /items:
 *   get:
 *     tags:
 *       - Items
 *     description: Returns all items
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of items
 *         schema:
 *           $ref: '#/definitions/Item'
 *       500:
 *         description: Failed to fetch items
 */

itemsRouter.get('/', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM items ORDER BY name LIMIT 25");
        res.status(200).send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to fetch items' });
    }
});

/**
 * @swagger
 * /items/:itemId:
 *   get:
 *     tags:
 *       - Items
 *     description: Returns an item by id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An item object
 *         schema:
 *           $ref: '#/definitions/Item'
 *       500:
 *         description: Failed to fetch item
 */

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

/**
 * @swagger
 * /items:
 *   post:
 *     tags:
 *       - Items
 *     description: Adds an item to the items table
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Item has been added to table
 *         schema:
 *           $ref: '#/definitions/Item'
 *       500:
 *         description: Failed to add item
 */

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

/**
 * @swagger
 * /items:
 *   put:
 *     tags:
 *       - Items
 *     description: Modifies an existing item
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Item has been updated
 *         schema:
 *           $ref: '#/definitions/Item'
 *       500:
 *         description: Failed to update item
 */

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

/**
 * @swagger
 * /items:
 *   delete:
 *     tags:
 *       - Items
 *     description: Deletes an existing item
 *     produces:
 *       - application/json
 *     responses:
 *       204:
 *         description: Item has been deleted
 *         schema:
 *           $ref: '#/definitions/Item'
 *       500:
 *         description: Failed to delete item
 */

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