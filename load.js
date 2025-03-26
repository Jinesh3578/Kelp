const fs = require("fs");

// Converts "a.b.c" into nested JSON structure
function nestObject(obj, keyPath, value) {
  let keys = keyPath.split(".");
  let current = obj;

  while (keys.length > 1) {
    let key = keys.shift();
    if (!current[key]) current[key] = {};
    current = current[key];
  }

  current[keys[0]] = value;
}

// Parses CSV into JSON
async function parseCSV(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const lines = fileContent
    .split("\n")
    .map(line => line.trim())
    .filter(line => line !== "");

  if (lines.length < 2) throw new Error(`Invalid CSV file (${filePath}). It must have at least a header and one row.`);

  // Extract headers (first row)
  const headers = lines[0].split(",").map(h => h.trim());
  const records = [];

  // Process each row safely
  for (let i = 1; i < lines.length; i++) {
    const values = splitCSVRow(lines[i]);
    const record = { name: "", age: null, additional_info: {} };

    for (let j = 0; j < headers.length; j++) {
      const key = headers[j];
      const value = values[j] ? values[j].trim().replace(/^"(.*)"$/, "$1") : null; // Remove surrounding quotes

      if (key === "name.firstName" || key === "name.lastName") {
        record.name += value ? ` ${value}` : "";
      } else if (key === "age") {
        record.age = parseInt(value, 10) || null;
      } else {
        nestObject(record.additional_info, key, value);
      }
    }

    record.name = record.name.trim();
    records.push(record);
  }

  return { data: records };
}

// Custom function to properly handle CSV row splitting
function splitCSVRow(row) {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let char of row) {
    if (char === '"' && (current.length === 0 || current[current.length - 1] !== "\\")) {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

module.exports = parseCSV;
