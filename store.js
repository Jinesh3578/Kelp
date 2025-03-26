const { Pool } = require("pg");
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Creates table with only mandatory fields
async function createTable() {
  const client = await pool.connect();
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        age INT,
        additional_info JSONB
      );
    `;
    await client.query(query);
  } finally {
    client.release();
  }
}

// Inserts parsed data into PostgreSQL
async function insertData(users) {
  const client = await pool.connect();
  try {
    for (const user of users) {
      const query = `
        INSERT INTO users (name, age, additional_info) 
        VALUES ($1, $2, $3);
      `;
      await client.query(query, [user.name, user.age, JSON.stringify(user.additional_info)]);
    }
  } finally {
    client.release();
  }
}

module.exports = { createTable, insertData };
