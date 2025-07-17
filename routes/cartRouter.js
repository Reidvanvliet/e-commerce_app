const express = require('express'),
      db = require('../database.js'),
      cartRouter = express.Router()

/**
 * @swagger
 * definitions:
 *   Cart:
 *     properties:
 *       id:
 *         type: integer
 *       user_id:
 *         type: integer
 *       item_id:
 *         type: integer
 *       quatity:
 *         type: integer
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     tags:
 *       - Cart
 *     description: Returns the currently logged in users cart
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns the contents of the users cart
 *         schema:
 *           $ref: '#/definitions/Cart'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to fetch cart
 */

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

/**
 * @swagger
 * /cart:
 *   post:
 *     tags:
 *       - Cart
 *     description: Adds an item to the current users cart
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Item added successfully
 *         schema:
 *           $ref: '#/definitions/Cart'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to add item to cart
 */

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

/**
 * @swagger
 * /cart:
 *   put:
 *     tags:
 *       - Cart
 *     description: Updates the item in the cart (quantity)
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Item successfully updated
 *         schema:
 *           $ref: '#/definitions/Cart'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to update cart
 */

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

/**
 * @swagger
 * /cart:
 *   delete:
 *     tags:
 *       - Cart
 *     description: Deletes the item in the cart
 *     produces:
 *       - application/json
 *     responses:
 *       204:
 *         description: Item successfully deleted
 *         schema:
 *           $ref: '#/definitions/Cart'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to delete from cart
 */

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