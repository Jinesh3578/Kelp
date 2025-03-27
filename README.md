# Kelp Backend Task

## CSV to JSON API 

### Overview
This Node.js application reads CSV files from a configurable directory, parses them into JSON format using custom logic (without external CSV-to-JSON libraries), and uploads the data into a PostgreSQL database. It dynamically creates the table based on mandatory fields(name , age) and stores additional fields in a JSONB column. Additionally, it calculates age distribution and logs the results to the console.

### Features

- Reads multiple CSV files from a configurable directory (./uploads)

- Parses CSV files using custom logic into JSON format, handling nested properties

- Dynamically creates a PostgreSQL table with mandatory columns

- Inserts parsed data into the database

- Calculates age distribution and logs the results to the console

### Clone the Repository
```bash
 git clone <repo-url>
  ```

### Install Dependencies
```bash
npm install
```

### Configure Environment Variables

#### Create a .env file in the root directory and add the following:
```bash
DB_USER=your_db_user
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_PASS=your_db_password
DB_PORT=5432
UPLOAD_DIR=./uploads
```

1. Start PostgreSQL

Ensure PostgreSQL is running and a database is created with the configured name.

2. Start the Application
```bash
npm start
```
3. Upload CSV Files

    - Place CSV files inside the ./uploads directory.

    - The application will automatically process all files in this directory.

4. Trigger Processing Manually or using Postman

-   - You can manually trigger CSV processing via a POST request: 
```bash
            curl -X POST http://localhost:3000/upload
```
5. Age Distribution Calculation
    - The application will calculate the age distribution and log the results to the console.

    - Example :
```bash
    Age Distribution:
    0-18: 10
    19-35: 25
    36-50: 15
    51+: 8
```

### Database Schema

```bash
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    age INT,
    additional_info JSONB
);
```
### server.js
```
processAllCSVFiles()
    - Calls parseCSV() to convert CSV to JSON.
    - Calls insertData() to store parsed data into the database.
    - API endpoint to trigger CSV processing & age distribution analysis.
    - Calls processAllCSVFiles() to process CSV files.
    - Calls calculateAgeDistribution() to analyze age groups.
```

### csvparser.js
```
nestObject(obj, keyPath, value)
    - Converts dot-separated keys (a.b.c) into nested objects:

        nestObject({}, "address.city", "New York");
        Output: { address: { city: "New York" } }

    - Helps in handling structured CSV columns.

parseCSV(filePath)
    - Reads the CSV file content.
    - Extracts headers (column names).
    - Processes each row to build structured objects.
    - Returns a parsed JSON array.

splitCSVRow(row)
    - Splits a CSV row into separate values while handling:

        Quoted values ("Jinesh, Shah" → Jinesh, Shah).
        Empty values (,, → null).

    - Ensures that data remains structured and accurate.
```