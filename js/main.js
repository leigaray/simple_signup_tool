$(function () {
    console.log("🚀 Initializing application");

    // ✅ Initialize Nice Select for all dropdowns
    $('select').niceSelect();

    /**
     * ✅ Update Last Modified Date
     */
    function updateLastModified() {
        const lastModified = new Date(document.lastModified);
        const formattedDate = lastModified.toLocaleString("en-US", {
            weekday: "short", year: "numeric", month: "short", day: "numeric",
            hour: "2-digit", minute: "2-digit", second: "2-digit"
        });
        $("#lastUpdated").text(`Last updated: ${formattedDate}`);
    }

    /**
     * ✅ Populate Dropdown with Years
     */
    function populateYearDropdown(selector, startYear, endYear, descending = true) {
        console.log(`🚀 Populating ${selector} from ${startYear} to ${endYear}, Descending: ${descending}`);
        const dropdown = $(selector);
        if (!dropdown.length) return console.error(`❌ Dropdown ${selector} not found!`);
        dropdown.empty().append('<option value="" selected="selected">Select Year</option>');
        const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
        if (descending) years.reverse();
        years.forEach(year => dropdown.append(`<option value="${year}">${year}</option>`));
        setTimeout(() => dropdown.niceSelect("destroy").niceSelect(), 500);
    }

    /**
     * ✅ Show/Hide Elements Based on Selection
     */
    function toggleVisibility(targetId, triggerElementId, triggerValue) {
        $(document).on("change", `#${triggerElementId}, .nice-select`, function () {
            const selectedValue = $(`#${triggerElementId}`).val(); // Get value from the actual <select> element
            console.log(`🔄 ${triggerElementId} changed to:`, selectedValue);

            if (selectedValue === triggerValue) {
                $(`#${targetId}`).fadeIn(); // ✅ Show if selected value matches
            } else {
                $(`#${targetId}`).fadeOut(); // ✅ Hide otherwise
            }
        });

        // ✅ Ensure visibility is correct on page load
        setTimeout(() => {
            const selectedValue = $(`#${triggerElementId}`).val();
            if (selectedValue === triggerValue) {
                $(`#${targetId}`).show();
            } else {
                $(`#${targetId}`).hide();
            }
        }, 500);
    }


    /**
     * ✅ Populate Dropdowns from CSV
     */
    function populateDropdownFromCSV(selector, csvUrl) {
        fetch(csvUrl)
            .then(response => response.text())
            .then(data => {
                const rows = data.split("\n").map(row => row.trim()).filter(row => row);
                console.log(`✅ First 5 rows from ${csvUrl}:`, rows.slice(0, 5));
                const dropdown = $(selector);
                dropdown.empty().append('<option value="" selected="selected">Select an option</option>');
                rows.slice(1).forEach(row => {
                    const match = row.match(/^"?(\d+)"?,?"?(.*?)"?$/);
                    if (match) dropdown.append(`<option value="${match[2].trim()}">${match[2].trim()}</option>`);
                });
                dropdown.niceSelect("destroy").niceSelect();
            })
            .catch(error => console.error(`❌ Error loading ${csvUrl}:`, error));
    }

    /**
     * ✅ Load Country-State Data
     */
    function setupCountryStateDropdown(countrySelector, stateSelector) {
        fetch("data/countries_states.csv")
            .then(response => response.text())
            .then(data => {
                const countryStateMap = {};
                data.split("\n").slice(1).forEach(row => {
                    const [country, state] = row.split(",");
                    if (!country || !state) return;
                    if (!countryStateMap[country]) countryStateMap[country] = [];
                    countryStateMap[country].push(state);
                });
                $(countrySelector).on("change", function() {
                    const selectedCountry = $(this).val();
                    const stateDropdown = $(stateSelector);
                    stateDropdown.empty().append('<option value="">Select State/Province/Region</option>');
                    if (countryStateMap[selectedCountry]) {
                        countryStateMap[selectedCountry].forEach(state => stateDropdown.append(`<option value="${state}">${state}</option>`));
                    }
                    stateDropdown.niceSelect("destroy").niceSelect();
                });
            })
            .catch(error => console.error("❌ Error loading CSV:", error));
    }

    /**
     * ✅ Load Checkboxes from CSV (Ethnicity, Experience)
     */
    function loadCheckboxesFromCSV(containerSelector, csvUrl) {
        fetch(csvUrl)
            .then(response => response.text())
            .then(data => {
                const container = $(containerSelector).empty();
                data.split("\n").slice(1).forEach(row => {
                    const match = row.match(/^"(\d+)","(.*?)"$/);
                    if (match) {
                        container.append(`
                            <div class="single-checkbox">
                                <input type="checkbox" id="${containerSelector.replace('#', '')}-${match[1]}" name="${containerSelector.replace('#', '')}[]" value="${match[2]}" class="checkbox">
                                <label for="${containerSelector.replace('#', '')}-${match[1]}">${match[2]}</label>
                            </div>`);
                    }
                });
            })
            .catch(error => console.error(`❌ Error loading ${csvUrl}:`, error));
    }

    /**
     * ✅ Mutually Exclusive Selection (Checkboxes)
     */
    function enforceExclusiveSelection(groupSelector, exclusiveOptionId) {
        $(document).on("change", `${groupSelector} input[type="checkbox"]`, function () {
            if ($(this).attr("id") === exclusiveOptionId && $(this).is(":checked")) {
                $(`${groupSelector} input[type="checkbox"]`).not(this).prop("checked", false);
            } else {
                $(`#${exclusiveOptionId}`).prop("checked", false);
            }
        });
    }

    /**
     * ✅ Initialize All Functions on Document Ready
     */
    $(document).ready(function() {
        updateLastModified();
        populateYearDropdown("#birthYearSelect", 1990, 2006, true);
        toggleVisibility("otherReferralContainer", "referralSource", "Other");
        toggleVisibility("otherLanguageContainer", "languageSelect", "Other");

        loadCheckboxesFromCSV("#ethnicityContainer", "data/ethnicities.csv");
        loadCheckboxesFromCSV("#experienceContainer", "data/recording_experience.csv");
        enforceExclusiveSelection("#ethnicityContainer", "ethnicity-8");
        setupCountryStateDropdown("select[name='native_country']", "#stateNativeSelect");
        setupCountryStateDropdown("select[name='current_country']", "#stateCurrentSelect");
        populateDropdownFromCSV("select[name='education']", "data/education.csv");
        populateDropdownFromCSV("select[name='referral_source']", "data/referrals.csv");
        populateDropdownFromCSV("select[name='language']", "data/languages.csv");
        console.log("✅ All functions initialized.");
    });
});
