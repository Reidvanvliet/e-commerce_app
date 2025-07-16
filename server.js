const express = require('express'),
      server = express(),
	  fs = require('fs');
      bodyParser = require('body-parser');
      bcrypt = require('bcrypt');
      db = require('./database.js');

require('./local_strategy');
	  
server.set('port', process.env.PORT || 3000);

server.use(bodyParser.json());

//Items endpoints

server.get('/items', async (req, res) => {
    const result = await db.query("SELECT * FROM items ORDER BY name LIMIT 25");

    res.status(200).send(result.rows);
});

server.post('/items', async (req, res) => {
    const {name, description, price, make} = req.body;
    const insertStmt = "INSERT INTO items(name, description, price, make) VALUES ($1, $2, $3, $4) RETURNING *"

    const result = await db.query(insertStmt, [name, description, price, make]);

    res.status(201).send(result.rows);
})

server.put('/items', async (req, res) => {
    const {item_id, name, description, price, make} = req.body;
    const updateStmt = "UPDATE items SET (name, description, price, make) = ($2, $3, $4, $5) WHERE item_id = $1 RETURNING *"

    const result = await db.query(updateStmt, [item_id, name, description, price, make]);

    res.status(200).send(result.rows)
})

server.delete('/items', async (req, res) => {
    const {item_id} = req.body;

    await db.query("DELETE FROM items WHERE item_id = $1", [item_id]);

    res.status(204).send();
})

//Register endpoint

server.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    const salt = await bcrypt.genSalt(5);
    const hashedPass = await bcrypt.hash(password, salt);

    db.query("INSERT INTO users(username, password_hash, email) VALUES ($1, $2, $3)", [username, hashedPass, email]);

    res.status(201).send();
})

//Login endpoint

server.get('/login', async (req, res) => {

})

//Pofile endpoints

server.get('/profile', async (req, res) => {
    const { user_id } = req.body;
    const result = await db.query("SELECT * FROM users WHERE user_id = $1", [user_id]);

    res.status(200).send(result.rows);
})



server.listen(3000,()=>{
 console.log('Express server started at port 3000');
});