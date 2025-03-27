require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const parseCSV = require("./csvparser");
const { createTable, insertData } = require("./database");
const calculateAgeDistribution = require("./agedistribution");

const app = express();
const port = process.env.PORT || 3000;

const csvFolderPath = process.env.CSV_FOLDER_PATH;

async function processAllCSVFiles() {
  if (!fs.existsSync(csvFolderPath)) {
    console.error(`Error: CSV folder "${csvFolderPath}" does not exist.`);
    return;
  }

  const files = fs.readdirSync(csvFolderPath).filter(file => file.endsWith(".csv"));

  if (files.length === 0) {
    console.log("No CSV files found in the directory.");
    return;
  }

  console.log(`Processing ${files.length} CSV files...`);

  await createTable();

  for (const file of files) {
    const filePath = path.join(csvFolderPath, file);
    try {
      console.log(`Processing file: ${filePath}`);
      const { data } = await parseCSV(filePath);
      await insertData(data);
      console.log(`Successfully processed: ${file}`);
    } catch (error) {
      console.error(`Error processing file "${file}":`, error.message);
    }
  }

  console.log("All CSV files processed successfully!");
}

app.post("/process-all-csvs", async (req, res) => {
  try {
    await processAllCSVFiles();
    await calculateAgeDistribution();
    res.status(200).json({ message: "All CSV files processed successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));