const { Pool } = require("pg");
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

async function calculateAgeDistribution() {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT age FROM users");
    const ages = result.rows.map(row => row.age).filter(age => age !== null);

    if (ages.length === 0) {
      console.log("No age data found in the database.");
      return;
    }

    const ageGroups = {
      "<20": 0,
      "20-40": 0,
      "40-60": 0,
      ">60": 0
    };

    ages.forEach(age => {
      if (age < 20) ageGroups["<20"]++;
      else if (age >= 20 && age <= 40) ageGroups["20-40"]++;
      else if (age > 40 && age <= 60) ageGroups["40-60"]++;
      else ageGroups[">60"]++;
    });

    const total = ages.length;
    for (const group in ageGroups) {
      ageGroups[group] = ((ageGroups[group] / total) * 100).toFixed(2) + "%";
    }

    console.log("=== Age Distribution Report ===");
    console.table(ageGroups);
  } finally {
    client.release();
  }
}

module.exports = calculateAgeDistribution;
