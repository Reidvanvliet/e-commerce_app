const { Client } = require('pg'); 

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "postgres",
    database: "e-commerce"
})

client.connect();

const query = (text, params) => {
  return client.query(text, params)
}

module.exports = {
  query
};

//use import * as db from './database.js' and db.query instead of pg directly