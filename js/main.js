$(function () {
    // ✅ Initialize Nice Select for all dropdowns
    $('select').niceSelect();

    // ✅ Function to fetch and populate states dynamically based on selected country
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

                    $(stateSelector).html('<option value="">Select a State/Province</option>');

                    if (countryStateMap[selectedCountry]) {
                        countryStateMap[selectedCountry].forEach(state => {
                            $(stateSelector).append(`<option value="${state}">${state}</option>`);
                        });

                        console.log(`✅ Updated ${stateSelector} for ${selectedCountry}`);
                    } else {
                        console.warn(`❌ No states found for ${selectedCountry}`);
                    }

                    $(stateSelector).niceSelect("destroy");
                    $(stateSelector).niceSelect();
                });
            })
            .catch(error => console.error("❌ Error loading CSV:", error));
    }

    // ✅ Function to load Ethnicities dynamically from CSV
    function loadEthnicities() {
        fetch("https://leigaray.github.io/simple_signup_tool/data/ethnicities.csv")
            .then(response => response.text())
            .then(data => {
                console.log("✅ Ethnicities script is running");
                const rows = data.split("\n").map(row => row.trim()).filter(row => row);
                console.log("First 5 rows of Ethnicities CSV:", rows.slice(0, 5));

                const ethnicityContainer = $("#ethnicityContainer");
                ethnicityContainer.empty();

                rows.slice(1).forEach(row => {
                    const match = row.match(/^"(\d+)","(.*)"$/);
                    if (match) {
                        const id = match[1];
                        const ethnicity = match[2];

                        const checkboxHtml = `
                            <div class="single-checkbox">
                                <input type="checkbox" id="ethnicity-${id}" name="ethnicity[]" value="${ethnicity}" class="ethnicity-checkbox">
                                <label for="ethnicity-${id}">${ethnicity}</label>
                            </div>`;

                        ethnicityContainer.append(checkboxHtml);
                    } else {
                        console.warn("⚠️ Skipping malformed row:", row);
                    }
                });

                // ✅ Attach exclusive selection behavior for Ethnicity group
                enforceExclusiveSelection("#ethnicityContainer", "ethnicity-8"); // Adjust ID if needed

                console.log("✅ Final Ethnicity Container:", ethnicityContainer.html());
            })
            .catch(error => console.error("❌ Error loading Ethnicities CSV:", error));
    }

    // ✅ Generic function to enforce a mutually exclusive selection rule within a group
    function enforceExclusiveSelection(groupSelector, exclusiveOptionId) {
        $(document).on("change", `${groupSelector} input[type="checkbox"], ${groupSelector} input[type="radio"]`, function () {
            const isExclusive = $(this).attr("id") === exclusiveOptionId;

            if (isExclusive && $(this).is(":checked")) {
                // ✅ Uncheck all other checkboxes/radio buttons in the group
                $(`${groupSelector} input[type="checkbox"], ${groupSelector} input[type="radio"]`).not(this).prop("checked", false);
            } else if (!isExclusive) {
                // ✅ Uncheck the exclusive option if any other option is selected
                $(`#${exclusiveOptionId}`).prop("checked", false);
            }
        });
    }

    function loadLanguages() {
        fetch("https://leigaray.github.io/simple_signup_tool/data/languages.csv")
            .then(response => response.text())
            .then(data => {
                console.log("✅ Languages script is running");
                const rows = data.split("\n").map(row => row.trim()).filter(row => row);
                console.log("First 5 rows of Languages CSV:", rows.slice(0, 5));

                const languageSelect = $("select[name='language']");
                languageSelect.empty(); // Clear existing options

                // Add default placeholder option
                languageSelect.append('<option value="" selected="selected">Select a Language</option>');

                rows.slice(1).forEach(row => {
                    const match = row.match(/^"?(.*?)"?,?"?(.*?)"?$/);
                    if (match) {
                        const language = match[2] || match[1]; // Handles optional ID column
                        languageSelect.append(`<option value="${language}">${language}</option>`);
                    } else {
                        console.warn("⚠️ Skipping malformed row:", row);
                    }
                });

                // ✅ Refresh Nice Select
                languageSelect.niceSelect("destroy");
                languageSelect.niceSelect();

                console.log("✅ Final Language Dropdown:", languageSelect.html());
            })
            .catch(error => console.error("❌ Error loading Languages CSV:", error));
    }

    // ✅ Load Languages
    loadLanguages();
    // ✅ Load both ethnicity & state data
    loadEthnicities();
    setupCountryStateDropdown("select[name='native_country']", "#stateNativeSelect");
    setupCountryStateDropdown("select[name='current_country']", "#stateCurrentSelect");
});
