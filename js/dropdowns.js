// dropdowns.js

/**
 * Populate a dropdown with options from a CSV file.
 * @param {string} selector - The dropdown selector.
 * @param {string} url - URL of the CSV file.
 */
async function populateDropdown(selector, url) {
    const rows = await fetchCSV(url);
    if (rows.length === 0) return;

    const dropdown = $(selector);
    dropdown.empty();
    dropdown.append('<option value="" selected="selected">Select an option</option>');

    rows.slice(1).forEach(row => {
        if (row.length >= 2) {
            const value = row[1]; // Assuming second column contains the actual value
            dropdown.append(`<option value="${value}">${value}</option>`);
        }
    });

    dropdown.niceSelect("destroy");
    dropdown.niceSelect();
}
