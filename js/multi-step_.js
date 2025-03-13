// Make these functions globally accessible so multi-step_.js can call them
window.populateYearDropdown = populateYearDropdown;
window.populateDropdownFromCSV = populateDropdownFromCSV;

$(function () {
    console.log("🚀 Multi-step form initialized");

    // Track current step index
    let currentStepIndex = 0;

    // Store step files (modify if filenames differ)
    const steps = [
        "steps/step1-personal-info.html",
        "steps/step2-birth-location.html",
        "steps/step3-ethnicity-language.html",
        "steps/step4-voice-experience.html",
        "steps/step5-voice-samples.html"
    ];

    // Function to load a specific step dynamically
    // Function to load a specific step dynamically
    function loadStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= steps.length) return;

        console.log(`🔄 Loading Step ${stepIndex + 1}: ${steps[stepIndex]}`);

        $("#formStepsContainer").load(steps[stepIndex], function (response, status, xhr) {
            if (status === "error") {
                console.error("❌ Error loading step:", xhr.status, xhr.statusText);
            } else {
                console.log(`✅ Step ${stepIndex + 1} loaded successfully.`);
                currentStepIndex = stepIndex;

                // ✅ Debugging: Check if Step 1 elements exist
                console.log(`Step ${stepIndex + 1} Exists?`, $("#birthYearSelect").length > 0);

                // Load navigation buttons inside the step
                $("#navigationContainer").load("components/form-navigation.html", function (response, status, xhr) {
                    if (status === "error") {
                        console.error("❌ Error loading navigation:", xhr.status, xhr.statusText);
                    } else {
                        console.log("✅ Navigation loaded.");
                    }
                });

                // ✅ Populate dropdowns only for Step 1 (Ensure functions exist)
                if (stepIndex === 0) {
                    console.log("📥 Populating dropdowns for Step 1...");
                    setTimeout(() => {
                        if (typeof window.populateYearDropdown === "function") {
                            window.populateYearDropdown("#birthYearSelect", 1990, 2006, true);
                        } else {
                            console.error("❌ populateYearDropdown is not available!");
                        }

                        if (typeof window.populateDropdownFromCSV === "function") {
                            window.populateDropdownFromCSV("select[name='education']", "data/education.csv");
                            window.populateDropdownFromCSV("select[name='referral_source']", "data/referrals.csv");
                        } else {
                            console.error("❌ populateDropdownFromCSV is not available!");
                        }
                    }, 500); // Small delay ensures elements exist
                }

                // Reinitialize multi-step logic
                initializeMultiStepLogic();
            }
        });
    }

    // Function to initialize the step form logic
    function initializeMultiStepLogic() {
        console.log("🔄 Reinitializing Multi-Step Logic...");

        const DOMstrings = {
            stepsBtnClass: 'bforum-form__progress-btn',
            stepsBtns: document.querySelectorAll(`.bforum-form__progress-btn`),
            stepsBar: document.querySelector('.bforum-form__progress'),
            stepsForm: document.querySelector('.multisteps-form__form'),
            stepFormPanelClass: 'multisteps-form__panel',
            stepFormPanels: document.querySelectorAll('.multisteps-form__panel'),
            stepPrevBtnClass: 'js-btn-prev',
            stepNextBtnClass: 'js-btn-next'
        };

        if (!DOMstrings.stepsForm) {
            console.warn("⚠️ Form not found yet, skipping re-init.");
            return;
        }

        // Update progress bar
        updateProgressBar(currentStepIndex);

        // Attach button handlers
        $(document).off("click", ".js-btn-next").on("click", ".js-btn-next", function () {
            if (currentStepIndex < steps.length - 1) {
                loadStep(currentStepIndex + 1);
            }
        });

        $(document).off("click", ".js-btn-prev").on("click", ".js-btn-prev", function () {
            if (currentStepIndex > 0) {
                loadStep(currentStepIndex - 1);
            }
        });

        console.log("✅ Multi-step logic reinitialized.");
    }

    // Function to update progress bar
    function updateProgressBar(activeStepIndex) {
        $(".bforum-form__progress-btn").removeClass("js-active current");
        $(".bforum-form__progress-btn").each(function (index) {
            if (index <= activeStepIndex) {
                $(this).addClass("js-active");
            }
            if (index === activeStepIndex) {
                $(this).addClass("current");
            }
        });
    }

    // Load the first step initially
    loadStep(0);
});
