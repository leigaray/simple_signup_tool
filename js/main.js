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
     * ✅ Load Progress Bar & Initialize Multi-Step Form
     */
    $("#progressContainer").load("components/progress.html", function(response, status, xhr) {
        if (status === "error") {
            console.error("❌ Error loading progress bar:", xhr.status, xhr.statusText);
        } else {
            console.log("✅ Progress bar loaded successfully.");

            // ✅ Load Multi-Step Form JS After Progress Bar Loads
            $.getScript("js/multi-step.js", function() {
                console.log("✅ Multi-Step JS Initialized After Progress Bar Load");
                initializeMultiStepForm(); // Call the function to load steps dynamically
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
     * ✅ Initialize Multi-Step Form
     */
    function initializeMultiStepForm() {
        console.log("🚀 Loading multi-step form...");

        // Step files in order
        const steps = [
            "steps/step1-personal-info.html",
            "steps/step2-birth-location.html",
            "steps/step3-ethnicity-language.html",
            "steps/step4-voice-experience.html",
            "steps/step5-voice-samples.html"
        ];

        let currentStepIndex = 0; // Track current step

        // Function to load a specific step
        function loadStep(stepIndex) {
            if (stepIndex < 0 || stepIndex >= steps.length) return; // Prevent invalid index

            console.log(`🔄 Loading Step ${stepIndex + 1}: ${steps[stepIndex]}`);

            $("#formStepsContainer").load(steps[stepIndex], function (response, status, xhr) {
                if (status === "error") {
                    console.error("❌ Error loading step:", xhr.status, xhr.statusText);
                } else {
                    console.log(`✅ Step ${stepIndex + 1} loaded successfully.`);
                    currentStepIndex = stepIndex; // Update current step index

                    // Load Navigation Buttons inside each step
                    $("#navigationContainer").load("components/form-navigation.html", function (response, status, xhr) {
                        if (status === "error") {
                            console.error("❌ Error loading navigation:", xhr.status, xhr.statusText);
                        }
                    });
                }
            });
        }

        // Load first step initially
        loadStep(0);

        // Handle Next/Back button clicks
        $(document).on("click", ".js-btn-next", function () {
            if (currentStepIndex < steps.length - 1) {
                loadStep(currentStepIndex + 1); // Go to next step
            }
        });

        $(document).on("click", ".js-btn-prev", function () {
            if (currentStepIndex > 0) {
                loadStep(currentStepIndex - 1); // Go to previous step
            }
        });
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
