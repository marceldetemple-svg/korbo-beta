/* =========================
   KORBO 3.0 STATE
========================= */

const KorboState = {
  user: {
    goal: "sparen",
    budget: 50,
    people: 2,
    days: 7,
    diet: "normal",
    maxTime: 30,
    markets: [],
    avoid: [],
    pantry: []
  },

  shopping: {
    items: [],
    checkedItems: []
  },

  recipes: {
    selected: [],
    favorites: [],
    ratings: {}
  },

  offers: {
    results: [],
    lastUpdated: null
  }
};
