$(function () {
    console.log("🚀 Initializing application");

    // ✅ Initialize Nice Select for all dropdowns
    $('select').niceSelect();

    /**
     * ✅ Load Sidebar
     */
    $("#sidebarContainer").load("components/sidebar.html", function(response, status, xhr) {
        if (status === "error") {
            console.error("❌ Error loading sidebar:", xhr.status, xhr.statusText);
        } else {
            console.log("✅ Sidebar loaded successfully.");
            updateLastModified(); // Ensure last updated time works
        }
    });

    /**
     * ✅ Load Progress Bar & Multi-Step Form
     */
    $("#progressContainer").load("components/progress.html", function(response, status, xhr) {
        if (status === "error") {
            console.error("❌ Error loading progress bar:", xhr.status, xhr.statusText);
        } else {
            console.log("✅ Progress bar loaded successfully.");

            // ✅ Load Multi-Step Form JS After Progress Bar Loads
            $.getScript("js/multi-step.js", function() {
                console.log("✅ Multi-Step JS Initialized");
            });
        }
    });

    /**
     * ✅ Populate Data Functions
     */
    function updateLastModified() {
        const lastModified = new Date(document.lastModified);
        $("#lastUpdated").text(`Last updated: ${lastModified.toLocaleString("en-US")}`);
    }

    function populateYearDropdown(selector, startYear, endYear, descending = true) {
        const dropdown = $(selector);
        if (!dropdown.length) return console.error(`❌ Dropdown ${selector} not found!`);
        dropdown.empty().append('<option value="" selected="selected">Select Year</option>');
        const years = Array.from({length: endYear - startYear + 1}, (_, i) => startYear + i);
        if (descending) years.reverse();
        years.forEach(year => dropdown.append(`<option value="${year}">${year}</option>`));
        setTimeout(() => dropdown.niceSelect("destroy").niceSelect(), 500);
    }

    /**
     * ✅ Toggle Functionality
     */
    function toggleVisibility(targetId, triggerElementId, triggerValue) {
        $(document).on("change", `#${triggerElementId}, .nice-select`, function () {
            const selectedValue = $(`#${triggerElementId}`).val();
            if (selectedValue === triggerValue) {
                $(`#${targetId}`).fadeIn();
            } else {
                $(`#${targetId}`).fadeOut();
            }
        });
    }

    function toggleCheckboxVisibility(targetId, checkboxId) {
        $(document).on("change", `#${checkboxId}`, function () {
            if ($(this).is(":checked")) {
                $(`#${targetId}`).fadeIn();
            } else {
                $(`#${targetId}`).fadeOut();
            }
        });

        setTimeout(() => {
            if ($(`#${checkboxId}`).is(":checked")) {
                $(`#${targetId}`).show();
            } else {
                $(`#${targetId}`).hide();
            }
        }, 500);
    }

    /**
     * ✅ Initialize Form Elements on Page Load
     */
    $(document).ready(function () {
        console.log("🚀 Initializing form elements...");
        updateLastModified();
        populateYearDropdown("#birthYearSelect", 1990, 2006, true);
        toggleVisibility("otherReferralContainer", "referralSource", "Other");
        toggleVisibility("otherLanguageContainer", "languageSelect", "Other");
        toggleVisibility("microphoneTypeContainer", "recording_microphone", "Yes");

        // ✅ Toggle visibility for "Other" Experience
        toggleCheckboxVisibility("otherExperienceContainer", "experience-16");

        console.log("✅ Form elements initialized.");
    });
});
