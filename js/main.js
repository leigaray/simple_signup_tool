$(function() {
    // Initialize Nice Select for all select elements
    $('select').niceSelect();

    // Function to fetch and populate states dynamically based on selected country
    function setupCountryStateDropdown(countrySelector, stateSelector) {
        console.log(`⏳ Setting up ${countrySelector} → ${stateSelector}`);

        fetch("https://leigaray.github.io/simple_signup_tool/data/countries_states.csv")
            .then(response => response.text())
            .then(data => {
                const rows = data.split("\n").map(row => row.trim()).filter(row => row);

                console.log("✅ First 5 rows of CSV:", rows.slice(0, 5)); // Debugging

                const countryStateMap = {};

                // Parse CSV into country → states mapping
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

                // Listen for country selection change
                $(countrySelector).on("change", function() {
                    const selectedCountry = $(this).val();
                    console.log(`🌍 Country Selected: ${selectedCountry}`);

                    $(stateSelector).html('<option value="">Select a State/Province</option>'); // Reset options

                    if (countryStateMap[selectedCountry]) {
                        countryStateMap[selectedCountry].forEach(state => {
                            $(stateSelector).append(`<option value="${state}">${state}</option>`);
                        });

                        console.log(`✅ Updated ${stateSelector} for ${selectedCountry}`);
                    } else {
                        console.warn(`❌ No states found for ${selectedCountry}`);
                    }

                    // ✅ Force refresh Nice Select
                    $(stateSelector).niceSelect("destroy"); // Remove old instance
                    $(stateSelector).niceSelect(); // Reinitialize
                });
            })
            .catch(error => console.error("❌ Error loading CSV:", error));
    }

    function loadEthnicities() {
        fetch("https://leigaray.github.io/simple_signup_tool/data/ethnicities.csv")
            .then(response => response.text())
            .then(data => {
                const rows = data.split("\n").map(row => row.trim()).filter(row => row);
                console.log("✅ First 5 rows of Ethnicities CSV:", rows.slice(0, 5));

                const ethnicityContainer = $("#ethnicityContainer"); // Ensure this exists in HTML
                ethnicityContainer.empty(); // Clear previous content

                rows.slice(1).forEach(row => {
                    const match = row.match(/^"(\d+)","(.*)"$/);
                    if (match) {
                        const id = match[1];
                        const ethnicity = match[2];
                        const isPreferNotToAnswer = (ethnicity === "Prefer Not to Answer");

                        // Create checkbox HTML dynamically
                        const checkboxHtml = `
                            <div class="single-checkbox">
                                <input type="checkbox" id="ethnicity-${id}" name="ethnicity[]" value="${ethnicity}"
                                    class="ethnicity-checkbox" ${isPreferNotToAnswer ? 'data-prefer="true"' : ''}>
                                <label for="ethnicity-${id}">${ethnicity}</label>
                            </div>`;

                        ethnicityContainer.append(checkboxHtml);
                    } else {
                        console.warn("⚠️ Skipping malformed row:", row);
                    }
                });

                // ✅ Handle the "Prefer Not to Answer" logic
                $(".ethnicity-checkbox").on("change", function () {
                    const isPrefer = $(this).data("prefer"); // Is this the "Prefer Not to Answer" option?
                    if (isPrefer) {
                        // ✅ If "Prefer Not to Answer" is selected, uncheck all others
                        $(".ethnicity-checkbox").not(this).prop("checked", false).prop("disabled", this.checked);
                    } else {
                        // ✅ If another option is selected, uncheck "Prefer Not to Answer"
                        $(".ethnicity-checkbox[data-prefer='true']").prop("checked", false);
                    }
                });
            })
            .catch(error => console.error("❌ Error loading Ethnicities CSV:", error));
    }

    // ✅ Load ethnicities dynamically
    loadEthnicities();
    // ✅ Set up both country → state dropdowns
    setupCountryStateDropdown("select[name='native_country']", "#stateNativeSelect");
    setupCountryStateDropdown("select[name='current_country']", "#stateCurrentSelect");
});
