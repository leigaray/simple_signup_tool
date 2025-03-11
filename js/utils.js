// utils.js

/**
 * Fetch a CSV file and return parsed rows.
 * @param {string} url - URL of the CSV file.
 * @returns {Promise<string[][]>} - Parsed CSV rows.
 */
async function fetchCSV(url) {
    try {
        console.log(`⏳ Fetching CSV from: ${url}`);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.text();
        const rows = data.split("\n").map(row => row.trim()).filter(row => row);
        console.log("✅ First 5 rows:", rows.slice(0, 5));
        return rows.map(row => row.split(",").map(cell => cell.replace(/^"|"$/g, ""))); // Remove surrounding quotes
    } catch (error) {
        console.error(`❌ Error fetching CSV from ${url}:`, error);
        return [];
    }
}
