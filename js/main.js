// main.js

$(function () {
    console.log("🚀 Initializing application");

    // ✅ Initialize Nice Select for all dropdowns
    $('select').niceSelect();

    // ✅ Populate dropdowns
    populateDropdown("select[name='native_country']", "https://leigaray.github.io/simple_signup_tool/data/countries_states.csv");
    populateDropdown("select[name='current_country']", "https://leigaray.github.io/simple_signup_tool/data/countries_states.csv");
    populateDropdown("select[name='language']", "https://leigaray.github.io/simple_signup_tool/data/languages.csv");

    // ✅ Populate checkboxes
    populateCheckboxGroup("#ethnicityContainer", "https://leigaray.github.io/simple_signup_tool/data/ethnicities.csv", "8");
    populateCheckboxGroup("#experienceContainer", "https://leigaray.github.io/simple_signup_tool/data/recording_experience.csv", "0");
});
