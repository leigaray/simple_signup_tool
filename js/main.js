$(function () {
    console.log("🚀 Initializing application");

    // ✅ Initialize Nice Select for all dropdowns
    $('select').niceSelect();

    // ✅ Function to populate the birth year dropdown dynamically
    function populateYearDropdown(selector, startYear, endYear, descending = true) {
        console.log(`🚀 Populating ${selector} from ${startYear} to ${endYear}, Descending: ${descending}`);

        const dropdown = $(selector);
        if (!dropdown.length) {
            console.error(`❌ Dropdown ${selector} not found!`);
            return;
        }

        dropdown.empty(); // Clear existing options
        dropdown.append('<option value="" selected="selected">Select Year</option>');

        const years = [];
        for (let year = startYear; year <= endYear; year++) {
            years.push(year);
        }

        if (descending) {
            years.reverse();
        }

        years.forEach(year => {
            dropdown.append(`<option value="${year}">${year}</option>`);
        });

        // ✅ Refresh Nice Select UI
        if (dropdown.hasClass('nice-select')) {
            dropdown.niceSelect("destroy");
            dropdown.niceSelect();
        }

        console.log(`✅ ${selector} updated successfully.`);
    }

    // ✅ Function to dynamically show/hide an input field based on a select option
    function toggleVisibility(targetId, triggerElementId, triggerValue) {
        $(document).on("change", `#${triggerElementId}`, function () {
            const selectedValue = $(this).val();
            console.log(`🔄 ${triggerElementId} changed to:`, selectedValue);

            if (selectedValue === triggerValue) {
                $(`#${targetId}`).fadeIn(); // ✅ Show if selected value matches
            } else {
                $(`#${targetId}`).fadeOut(); // ✅ Hide otherwise
            }
        });

        // ✅ Ensure visibility is correct on page load
        if ($(`#${triggerElementId}`).val() === triggerValue) {
            $(`#${targetId}`).show();
        } else {
            $(`#${targetId}`).hide();
        }
    }

    // ✅ Function to populate a dropdown from a CSV file
    function populateDropdownFromCSV(selector, csvUrl) {
        fetch(csvUrl)
            .then(response => response.text())
            .then(data => {
                const rows = data.split("\n").map(row => row.trim()).filter(row => row);
                console.log(`✅ First 5 rows from ${csvUrl}:`, rows.slice(0, 5));

                const dropdown = $(selector);
                dropdown.empty(); // Clear existing options
                dropdown.append('<option value="" selected="selected">Select an option</option>');

                rows.slice(1).forEach(row => {
                    const match = row.match(/^"?(\d+)"?,?"?(.*?)"?$/);
                    if (match) {
                        const value = match[1].trim();
                        const label = match[2].trim();

                        dropdown.append(`<option value="${label}">${label}</option>`);
                    } else {
                        console.warn("⚠️ Skipping malformed row:", row);
                    }
                });

                // ✅ Reinitialize niceSelect to refresh UI
                dropdown.niceSelect("destroy");
                dropdown.niceSelect();

                console.log(`✅ ${selector} updated successfully.`);
            })
            .catch(error => console.error(`❌ Error loading ${csvUrl}:`, error));
    }

    // ✅ Function to load country-state data dynamically
    function setupCountryStateDropdown(countrySelector, stateSelector) {
        console.log(`⏳ Setting up ${countrySelector} → ${stateSelector}`);

        fetch("https://leigaray.github.io/simple_signup_tool/data/countries_states.csv")
            .then(response => response.text())
            .then(data => {
                const rows = data.split("\n").map(row => row.trim()).filter(row => row);
                console.log("✅ First 5 rows of CSV:", rows.slice(0, 5));

                const countryStateMap = {};

                rows.forEach((row, index) => {
                    if (index === 0) return; // Skip header
                    const [country, state] = row.split(",");

                    if (!country || !state) {
                        console.warn("⚠️ Skipping malformed row:", row);
                        return;
                    }

                    if (!countryStateMap[country]) {
                        countryStateMap[country] = [];
                    }
                    countryStateMap[country].push(state);
                });

                console.log("✅ Country to States Map:", countryStateMap);

                $(countrySelector).on("change", function() {
                    const selectedCountry = $(this).val();
                    console.log(`🌍 Country Selected: ${selectedCountry}`);

                    const stateDropdown = $(stateSelector);
                    stateDropdown.html('<option value="">Select State/Province/Region</option>');

                    if (selectedCountry && countryStateMap[selectedCountry]) {
                        countryStateMap[selectedCountry].forEach(state => {
                            stateDropdown.append(`<option value="${state}">${state}</option>`);
                        });

                        console.log(`✅ Updated ${stateSelector} for ${selectedCountry}`);
                    } else {
                        console.warn(`❌ No states found or country not selected. Resetting ${stateSelector}.`);
                    }

                    // ✅ Reinitialize niceSelect for visual update
                    stateDropdown.niceSelect("destroy");
                    stateDropdown.niceSelect();
                });
            })
            .catch(error => console.error("❌ Error loading CSV:", error));
    }

    // ✅ Populate the birth year dropdown
    populateYearDropdown("select[name='birth_year']", 1940, 2006, true);

    // ✅ Call function to show/hide "Other" field for referral source
    toggleVisibility("otherReferralContainer", "referralSource", "Other");

    // ✅ Load dropdowns from CSV files
    populateDropdownFromCSV("select[name='education']", "data/education.csv");
    populateDropdownFromCSV("select[name='referral_source']", "data/referrals.csv");

    // ✅ Load Country-State relationship
    setupCountryStateDropdown("select[name='native_country']", "#stateNativeSelect");
    setupCountryStateDropdown("select[name='current_country']", "#stateCurrentSelect");

    console.log("✅ All functions initialized.");
});
