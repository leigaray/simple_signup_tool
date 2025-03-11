// checkboxes.js

/**
 * Populate a container with checkboxes from a CSV file.
 * @param {string} containerSelector - The container to populate.
 * @param {string} url - The URL to fetch the CSV file.
 * @param {string} exclusiveOptionId - The ID of the exclusive option (e.g., "No Experience").
 */
async function populateCheckboxGroup(containerSelector, url, exclusiveOptionId = null) {
    const rows = await fetchCSV(url);
    if (rows.length === 0) return;

    const container = $(containerSelector);
    container.empty();

    rows.slice(1).forEach(row => {
        if (row.length >= 2) {
            const id = `option-${row[0]}`;
            const label = row[1];

            const checkboxHtml = `
                <div class="col-sm-6 col-md-6">
                    <div class="single-checkbox">
                        <input type="checkbox" id="${id}" name="${containerSelector}[]" value="${label}">
                        <label for="${id}">${label}</label>
                    </div>
                </div>`;

            container.append(checkboxHtml);
        }
    });

    // ✅ Enforce Exclusive Selection (if applicable)
    if (exclusiveOptionId) {
        enforceExclusiveSelection(containerSelector, `option-${exclusiveOptionId}`);
    }
}

/**
 * Ensure a mutually exclusive selection rule.
 * @param {string} groupSelector - The checkbox/radio group selector.
 * @param {string} exclusiveOptionId - The ID of the exclusive option.
 */
function enforceExclusiveSelection(groupSelector, exclusiveOptionId) {
    $(document).on("change", `${groupSelector} input[type="checkbox"], ${groupSelector} input[type="radio"]`, function () {
        if ($(this).attr("id") === exclusiveOptionId && $(this).is(":checked")) {
            $(`${groupSelector} input[type="checkbox"], ${groupSelector} input[type="radio"]`).not(this).prop("checked", false);
        } else {
            $(`#${exclusiveOptionId}`).prop("checked", false);
        }
    });
}
