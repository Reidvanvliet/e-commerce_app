const express = require('express'),
      server = express(),
	  fs = require('fs');
      bodyParser = require('body-parser');

const db =  require('./database.js');
	  
server.set('port', process.env.PORT || 3000);

//items endpoints

server.get('/items', async (req, res) => {
    const result = await db.query("SELECT * FROM items ORDER BY name LIMIT 25");

    res.status(200).send(result.rows);
});

server.post('/items', async (req, res) => {
    console.log(req.body);
    const {name, description, price, make} = JSON.stringify(req.body);
    const insertStmt = "INSERT INTO items(name, description, price, make) VALUES ($1, $2, $3, $4)"

    const result = await db.query(insertStmt, [name, description, price, make]);

    res.status(201).send(result.rows);
})

server.put('/items', (req, res) => {
    const {item_id, name, description, price, make} = req.body;
    const updateStmt = `UPDATE items SET (name, description, price, make) = (${name}, ${description}, ${price}, ${make}) WHERE item_id = ${item_id}`

    db.query(updateStmt, [], (error, result) => {
        if (error) {
            res.status(500).json({"error": error.message});
        } else {
            res.json({
                item_id,
                name,
                description,
                price,
                make
            })
        }
    })
})

server.delete('/items', (req, res) => {
    const {item_id} = req.body;

    db.query('DELETE FROM items WHERE item_id = ')
})



server.listen(3000,()=>{
 console.log('Express server started at port 3000');
});