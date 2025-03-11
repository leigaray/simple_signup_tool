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

    // ✅ Function to dynamically load ethnicity checkboxes
    function loadEthnicities() {
        fetch("https://leigaray.github.io/simple_signup_tool/data/ethnicities.csv")
            .then(response => response.text())
            .then(data => {
                console.log("✅ Ethnicities script is running");
                const rows = data.split("\n").map(row => row.trim()).filter(row => row);
                console.log("First 5 rows of Ethnicities CSV:", rows.slice(0, 5));

                const ethnicityContainer = $("#ethnicityContainer");
                ethnicityContainer.empty(); // Clear existing content

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

                // ✅ Handle "Prefer Not to Answer" logic
                $(".ethnicity-checkbox").on("change", function() {
                    if ($(this).val() === "Prefer Not to Answer" && $(this).is(":checked")) {
                        $(".ethnicity-checkbox").prop("checked", false); // Uncheck all
                        $(this).prop("checked", true); // Keep "Prefer Not to Answer" checked
                    }
                });

                console.log("✅ Final Ethnicity Container:", ethnicityContainer.html());
            })
            .catch(error => console.error("❌ Error loading Ethnicities CSV:", error));
    }

    // ✅ Load both ethnicity & state data
    loadEthnicities();
    setupCountryStateDropdown("select[name='native_country']", "#stateNativeSelect");
    setupCountryStateDropdown("select[name='current_country']", "#stateCurrentSelect");
});
