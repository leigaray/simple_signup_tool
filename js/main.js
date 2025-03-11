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
        console.log("🚀 loadLanguages() started");

        fetch("https://leigaray.github.io/simple_signup_tool/data/languages.csv")
            .then(response => response.text())
            .then(data => {
                console.log("✅ Languages CSV loaded successfully");

                const rows = data.split("\n").map(row => row.trim()).filter(row => row);
                console.log("📌 First 5 rows of Languages CSV:", rows.slice(0, 5));

                const languageSelect = $("select[name='language']");
                languageSelect.empty(); // Clear existing options

                // Add default placeholder option
                languageSelect.append('<option value="" selected="selected">Select a Language</option>');

                let addedCount = 0;

                rows.slice(1).forEach(row => {
                    console.log("Processing row:", row); // Log each row

                    const match = row.match(/^"(\d+)","(.*?)"$/);
                    if (match) {
                        const id = match[1];
                        const language = match[2];
                        console.log(`✅ Adding Language: ${language} (ID: ${id})`);

                        languageSelect.append(`<option value="${language}">${language}</option>`);
                        addedCount++;
                    } else {
                        console.warn("⚠️ Skipping malformed row:", row);
                    }
                });

                console.log(`✅ Successfully added ${addedCount} languages.`);

                // ✅ Ensure that the dropdown updates visually
                languageSelect.niceSelect("destroy");
                languageSelect.niceSelect();

                console.log("✅ Final Language Dropdown HTML:", languageSelect.html());
            })
            .catch(error => console.error("❌ Error loading Languages CSV:", error));
    }

    function loadRecordingExperience() {
        console.log("🚀 loadRecordingExperience() started"); // Log function start

        fetch("https://leigaray.github.io/simple_signup_tool/data/recording_experience.csv")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                console.log("✅ Recording Experience CSV loaded successfully");
                const rows = data.split("\n").map(row => row.trim()).filter(row => row);
                console.log("📌 First 5 rows of Recording Experience CSV:", rows.slice(0, 5));

                const experienceContainer = $("#experienceContainer");
                experienceContainer.empty(); // Clear existing options

                rows.slice(1).forEach(row => {
                    console.log("Processing row:", row); // Log each row

                    const match = row.match(/^"(\d+)","(.*?)"$/);
                    if (match) {
                        const id = match[1];
                        const experience = match[2];

                        // ✅ Create checkbox dynamically
                        const checkboxHtml = `
                            <div class="col-sm-6 col-md-6">
                                <div class="single-checkbox">
                                    <input type="checkbox" id="experience-${id}" name="experience[]" value="${experience}" class="experience-checkbox">
                                    <label for="experience-${id}">${experience}</label>
                                </div>
                            </div>`;

                        experienceContainer.append(checkboxHtml);
                    } else {
                        console.warn("⚠️ Skipping malformed row:", row);
                    }
                });

                // ✅ Attach exclusive selection behavior for "No Experience"
                enforceExclusiveSelection("#experienceContainer", "experience-0");

                console.log("✅ Final Experience Container:", experienceContainer.html());
            })
            .catch(error => console.error("❌ Error loading Recording Experience CSV:", error));
    }

    // ✅ Function to populate dropdown from CSV file
    function populateDropdownFromCSV(selector, csvUrl) {
        fetch(csvUrl)
            .then(response => response.text())
            .then(data => {
                const rows = data.split("\n").map(row => row.trim()).filter(row => row);
                console.log(`✅ First 5 rows from ${csvUrl}:`, rows.slice(0, 5));

                const dropdown = $(selector);
                dropdown.empty(); // Clear existing options

                // Add default empty option
                dropdown.append('<option value="" selected="selected"></option>');

                rows.slice(1).forEach(row => {
                    // ✅ Remove extra quotes and split by comma, handling quoted values
                    const match = row.match(/^"?(\d+)"?,?"?(.*?)"?$/);
                    if (match) {
                        const value = match[1].trim();
                        const label = match[2].trim();

                        dropdown.append(`<option value="${value}">${label}</option>`);
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

        // ✅ Refresh Nice Select UI (if applicable)
        if (dropdown.hasClass('nice-select')) {
            dropdown.niceSelect("destroy");
            dropdown.niceSelect();
        }

        console.log(`✅ ${selector} updated successfully.`);
    }



    populateYearDropdown("select[name='birth_year']", 1940, 2006, true);

    populateDropdownFromCSV("select[name='education']", "data/education.csv");
    populateDropdownFromCSV("select[name='referral_source']", "data/referrals.csv");
    // ✅ Load Recording Experience when the page is ready
    loadRecordingExperience();
    // ✅ Load Languages
    loadLanguages();
    // ✅ Load both ethnicity & state data
    loadEthnicities();
    setupCountryStateDropdown("select[name='native_country']", "#stateNativeSelect");
    setupCountryStateDropdown("select[name='current_country']", "#stateCurrentSelect");
});
