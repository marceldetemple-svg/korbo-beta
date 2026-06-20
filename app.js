let state = {
  budget: 50,
  people: 1,
  days: 7
};

const meals = [
  {
    name: "Spaghetti mit Tomatensoße",
    costPerPerson: 2.20,
    ingredients: ["Spaghetti", "Passierte Tomaten", "Zwiebeln", "Gewürze"]
  },
  {
    name: "Reispfanne mit Gemüse",
    costPerPerson: 2.60,
    ingredients: ["Reis", "TK-Gemüse", "Sojasoße", "Öl"]
  },
  {
    name: "Kartoffelauflauf",
    costPerPerson: 2.80,
    ingredients: ["Kartoffeln", "Sahne", "Käse", "Zwiebeln"]
  },
  {
    name: "Chili sin Carne",
    costPerPerson: 2.90,
    ingredients: ["Kidneybohnen", "Mais", "Tomaten", "Reis"]
  },
  {
    name: "Wraps mit Hähnchen",
    costPerPerson: 3.60,
    ingredients: ["Wraps", "Hähnchen", "Salat", "Joghurtsoße"]
  },
  {
    name: "Nudelauflauf",
    costPerPerson: 2.70,
    ingredients: ["Nudeln", "Tomatensoße", "Käse", "Gemüse"]
  },
  {
    name: "Rührei mit Brot und Salat",
    costPerPerson: 2.40,
    ingredients: ["Eier", "Brot", "Salat", "Tomaten"]
  }
];

const budgetInput = document.getElementById("budgetInput");
const budgetValue = document.getElementById("budgetValue");

budgetInput.addEventListener("input", () => {
  state.budget = Number(budgetInput.value);
  budgetValue.textContent = state.budget;
});

function goTo(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });
  document.getElementById(screenId).classList.add("active");
}

function selectPeople(value, element) {
  state.people = value;
  element.parentElement.querySelectorAll(".choice").forEach(btn => {
    btn.classList.remove("selected");
  });
  element.classList.add("selected");
}

function selectDays(value, element) {
  state.days = value;
  element.parentElement.querySelectorAll(".choice").forEach(btn => {
    btn.classList.remove("selected");
  });
  element.classList.add("selected");
}

function generatePlan() {
  const selectedMeals = meals.slice(0, state.days);
  let totalCost = 0;
  let allIngredients = [];

  selectedMeals.forEach(meal => {
    totalCost += meal.costPerPerson * state.people;
    allIngredients.push(...meal.ingredients);
  });

  totalCost = Math.round(totalCost * 100) / 100;
  const rest = Math.round((state.budget - totalCost) * 100) / 100;

  document.getElementById("resultBudget").textContent = state.budget.toFixed(2).replace(".", ",");
  document.getElementById("resultCost").textContent = totalCost.toFixed(2).replace(".", ",");
  document.getElementById("resultRest").textContent = rest.toFixed(2).replace(".", ",");

  const mealPlan = document.getElementById("mealPlan");
  mealPlan.innerHTML = "";

  selectedMeals.forEach((meal, index) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<strong>Tag ${index + 1}: ${meal.name}</strong><small>ca. ${(meal.costPerPerson * state.people).toFixed(2).replace(".", ",")} €</small>`;
    mealPlan.appendChild(div);
  });

  const uniqueIngredients = [...new Set(allIngredients)];
  const shoppingList = document.getElementById("shoppingList");
  shoppingList.innerHTML = "";

  uniqueIngredients.forEach(ingredient => {
    const div = document.createElement("div");
    div.className = "item";
    div.textContent = ingredient;
    shoppingList.appendChild(div);
  });

  goTo("screen-result");
}

function resetApp() {
  goTo("screen-budget");
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
