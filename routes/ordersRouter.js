const express = require('express'),
      db = require('../database.js'),
      ordersRouter = express.Router()

ordersRouter.post("/", async (req, res) => {
    if(req.user) { 
        const { user_id, address } = req.user;
        try {
            await db.query('BEGIN');
            const itemsInCart = await db.query("SELECT cart.item_id AS item_id, items.price AS price, cart.quantity AS quantity FROM cart JOIN items ON cart.item_id = items.item_id WHERE user_id = $1", [user_id]);
            const items = itemsInCart.rows;
            const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
            const orderResult = await db.query("INSERT INTO orders (user_id, shipping_address, total_amount) VALUES ($1, $2, $3) RETURNING id", [user_id, address, total]);
            const order_id = orderResult.rows[0].id;
            for (const item of items) {
                await db.query(`INSERT INTO order_items (order_id, item_id, quantity, price_each) VALUES ($1, $2, $3, $4)`, [order_id, item.item_id, item.quantity, item.price]);
            }
            await db.query("DELETE FROM cart WHERE user_id = $1", [user_id]);
            await db.query('COMMIT');
            res.status(201).json({ message: 'Order placed successfully', order_id });
        } catch (err) {
            await db.query('ROLLBACK');
            console.error(err);
            res.status(500).json({ error: 'Failed to place order' });
        }
    } else {
        res.status(401).send();
    }
});

ordersRouter.get('/', async (req, res) => {
    if(req.user) {
        try {
            const user_id = req.user.user_id;
            const orders = await db.query("SELECT * FROM orders WHERE user_id = $1", [user_id]);
            res.status(200).send(orders.rows);
        } catch (err) {
            console.error(err);
            res.status(500).send({ error: 'Failed to fetch orders' });
        }
    } else {
        res.status(401).send();
    }
});

ordersRouter.get('/:orderId', async (req, res) => {
    if(req.user) {
        try {
            const user_id = req.user.user_id;
            const order_id = req.params.orderId;
            const orderDetails = await db.query("SELECT orders.order_date AS date, orders.total_amount AS total, orders.shipping_address AS address,order_items.quantity AS quantity, order_items.price_each AS price_each, items.name AS name FROM orders INNER JOIN order_items ON orders.id = order_items.order_id INNER JOIN items ON order_items.item_id = items.item_id WHERE orders.user_id = $1 AND orders.id = $2;", [user_id, order_id]);
            res.status(200).send(orderDetails.rows);
        } catch (err) {
            console.error(err);
            res.status(500).send({ error: 'Failed to fetch order details' });
        }
    } else {
        res.status(401).send();
    }
});

module.exports = ordersRouter;