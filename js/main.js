$(function() {
    // Initialize Nice Select
    $('select').niceSelect();

    const countrySelect = $("select[name='language']"); // Country dropdown (Nice Select)
    const stateSelect = $("#stateSelect"); // State dropdown

    // Function to fetch and parse CSV
    function loadCSV() {
        fetch("data/countries_states.csv")
            .then(response => response.text())
            .then(data => {
                const rows = data.split("\n").map(row => row.trim()).filter(row => row);
                const countryStateMap = {};

                // Parse CSV into country → states mapping
                rows.forEach((row, index) => {
                    if (index === 0) return; // Skip header
                    const [country, state] = row.split(",");
                    if (!countryStateMap[country]) {
                        countryStateMap[country] = [];
                    }
                    countryStateMap[country].push(state);
                });

                // Listen for country selection change
                countrySelect.on("change", function() {
                    const selectedCountry = $(this).val();
                    stateSelect.html('<option value="">Select a State/Province</option>'); // Reset

                    if (countryStateMap[selectedCountry]) {
                        countryStateMap[selectedCountry].forEach(state => {
                            stateSelect.append(`<option value="${state}">${state}</option>`);
                        });

                        // Refresh Nice Select for state dropdown
                        stateSelect.niceSelect("update");
                    }
                });
            })
            .catch(error => console.error("Error loading CSV:", error));
    }

    // Load CSV data
    loadCSV();
});
