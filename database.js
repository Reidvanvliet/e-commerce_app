const {Client} = require('pg');

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "postgres",
    database: "e-commerce"
})

client.connect();

export const query = (text, params) => {
  return pool.query(text, params)
}

//use import * as db from '../db/server.js' and db.query instead of pg directly