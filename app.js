document.addEventListener("DOMContentLoaded", () => {
    const screens = document.querySelectorAll(".screen");
    const navButtons = document.querySelectorAll(".bottom-nav button");
    const actionCards = document.querySelectorAll(".action-card");
    const tipButton = document.getElementById("tipButton");

    const plannerProgressText = document.getElementById("plannerProgressText");
    const plannerProgressFill = document.getElementById("plannerProgressFill");
    const plannerStepPeople = document.getElementById("plannerStepPeople");
    const plannerStepBudget = document.getElementById("plannerStepBudget");
    const plannerPreview = document.getElementById("plannerPreview");

    const plannerNextButton = document.getElementById("plannerNextButton");
    const plannerBackButton = document.getElementById("plannerBackButton");
    const plannerBudgetNextButton = document.getElementById("plannerBudgetNextButton");
    const budgetSlider = document.getElementById("budgetSlider");
    const budgetValue = document.getElementById("budgetValue");

    let selectedPeople = "2";
    let selectedBudget = 80;
    let currentPlannerStep = 1;

    function openScreen(screenId) {
        screens.forEach(screen => screen.classList.remove("active"));

        const target = document.getElementById(screenId);
        if (target) target.classList.add("active");

        navButtons.forEach(button => {
            button.classList.toggle("active", button.dataset.screen === screenId);
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function updatePlannerProgress() {
        if (!plannerProgressText || !plannerProgressFill) return;

        plannerProgressText.textContent = "Schritt " + currentPlannerStep + " von 9";
        plannerProgressFill.style.width = currentPlannerStep === 1 ? "11.11%" : "22.22%";
    }

    function showPlannerStep(step) {
        currentPlannerStep = step;

        if (plannerStepPeople && plannerStepBudget) {
            plannerStepPeople.classList.toggle("active", step === 1);
            plannerStepBudget.classList.toggle("active", step === 2);
        }

        if (plannerPreview) {
            if (step === 1) {
                plannerPreview.querySelector("p").textContent = "Als Nächstes fragt Korbo nach deinem Wochenbudget.";
            } else {
                plannerPreview.querySelector("p").textContent = "Als Nächstes fragt Korbo nach der Anzahl deiner Planungstage.";
            }
        }

        updatePlannerProgress();
    }

    function updateBudgetDisplay() {
        if (!budgetSlider || !budgetValue) return;

        selectedBudget = Number(budgetSlider.value);
        budgetValue.textContent = selectedBudget + " €";

        const min = Number(budgetSlider.min);
        const max = Number(budgetSlider.max);
        const percentage = ((selectedBudget - min) / (max - min)) * 100;

        budgetSlider.style.setProperty("--budget-progress", percentage + "%");
    }

    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            openScreen(button.dataset.screen);
        });
    });

    actionCards.forEach(card => {
        card.addEventListener("click", () => {
            openScreen(card.dataset.screen);
        });
    });

    document.querySelectorAll("[data-people]").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll("[data-people]").forEach(item => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");
            selectedPeople = button.dataset.people;
        });
    });

    if (plannerNextButton) {
        plannerNextButton.addEventListener("click", () => {
            showPlannerStep(2);
        });
    }

    if (plannerBackButton) {
        plannerBackButton.addEventListener("click", () => {
            showPlannerStep(1);
        });
    }

    if (plannerBudgetNextButton) {
        plannerBudgetNextButton.addEventListener("click", () => {
            alert(
                "Korbo Planung\n\n" +
                "Personen: " + selectedPeople + "\n" +
                "Wochenbudget: " + selectedBudget + " €\n\n" +
                "Als Nächstes folgt Schritt 3: Tage auswählen."
            );
        });
    }

    if (budgetSlider) {
        budgetSlider.addEventListener("input", updateBudgetDisplay);
        updateBudgetDisplay();
    }

    if (tipButton) {
        tipButton.addEventListener("click", () => {
            alert(
                "Korbo Tipp\n\n" +
                "Dieser Bereich wird später personalisierte Empfehlungen enthalten.\n\n" +
                "Korbo macht Vorschläge – du entscheidest."
            );
        });
    }

    showPlannerStep(1);
    openScreen("homeScreen");
});
