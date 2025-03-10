$(function() {
    // Initialize Nice Select
    $('select').niceSelect();

    // Function to fetch and populate states dynamically based on selected country
    function setupCountryStateDropdown(countrySelector, stateSelector) {
        fetch("https://leigaray.github.io/simple_signup_tool/data/countries_states.csv")
            .then(response => response.text())
            .then(data => {
                const rows = data.split("\n").map(row => row.trim()).filter(row => row);

                // ✅ Debugging: Print first 5 rows to console
                console.log("First 5 rows of CSV:", rows.slice(0, 5));

                const countryStateMap = {};

                // Parse CSV into country → states mapping
                rows.forEach((row, index) => {
                    if (index === 0) return; // Skip header
                    const [country, state] = row.split(",");

                    if (!country || !state) {
                        console.warn("Skipping malformed row:", row);
                        return; // Skip if there's a parsing issue
                    }

                    if (!countryStateMap[country]) {
                        countryStateMap[country] = [];
                    }
                    countryStateMap[country].push(state);
                });

                console.log("Country to States Map:", countryStateMap); // Debug mapping

                // Listen for country selection change
                $(countrySelector).on("change", function() {
                    const selectedCountry = $(this).val();
                    $(stateSelector).html('<option value="">Select a State/Province</option>'); // Reset

                    if (countryStateMap[selectedCountry]) {
                        countryStateMap[selectedCountry].forEach(state => {
                            $(stateSelector).append(`<option value="${state}">${state}</option>`);
                        });

                        // Refresh Nice Select for state dropdown
                        $(stateSelector).niceSelect("update");
                    }
                });
            })
            .catch(error => console.error("Error loading CSV:", error));
    }

    // ✅ Set up both country → state dropdowns
    setupCountryStateDropdown("select[name='native_country']", "#stateNativeSelect");
    setupCountryStateDropdown("select[name='current_country']", "#stateCurrentSelect");
});
