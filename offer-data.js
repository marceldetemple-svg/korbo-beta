const OFFER_MARKETS = ["Aldi","Lidl","Kaufland","Rewe","Netto","Edeka","Penny"];

const OFFER_DATABASE = {
  hackfleisch: {
    Aldi: 4.59,
    Lidl: 4.49,
    Kaufland: 3.99,
    Rewe: 5.49,
    Netto: 4.39,
    Edeka: 5.59,
    Penny: 4.29
  },
  milch: {
    Aldi: 0.99,
    Lidl: 0.99,
    Kaufland: 1.05,
    Rewe: 1.19,
    Netto: 0.99,
    Edeka: 1.19,
    Penny: 0.99
  },
  butter: {
    Aldi: 2.29,
    Lidl: 1.79,
    Kaufland: 2.19,
    Rewe: 2.49,
    Netto: 2.09,
    Edeka: 2.59,
    Penny: 1.99
  },
  kaese: {
    Aldi: 2.29,
    Lidl: 2.19,
    Kaufland: 1.79,
    Rewe: 2.79,
    Netto: 2.29,
    Edeka: 2.89,
    Penny: 2.19
  },
  paprika: {
    Aldi: 1.79,
    Lidl: 1.69,
    Kaufland: 1.89,
    Rewe: 2.29,
    Netto: 1.79,
    Edeka: 2.39,
    Penny: 1.75
  },
  nudeln: {
    Aldi: 1.19,
    Lidl: 1.19,
    Kaufland: 1.09,
    Rewe: 1.49,
    Netto: 1.29,
    Edeka: 1.59,
    Penny: 1.19
  },
  reis: {
    Aldi: 1.89,
    Lidl: 1.89,
    Kaufland: 1.79,
    Rewe: 2.29,
    Netto: 1.99,
    Edeka: 2.39,
    Penny: 1.95
  },
  kartoffeln: {
    Aldi: 2.29,
    Lidl: 2.19,
    Kaufland: 1.99,
    Rewe: 2.79,
    Netto: 2.29,
    Edeka: 2.89,
    Penny: 2.19
  },
  eier: {
    Aldi: 2.59,
    Lidl: 2.49,
    Kaufland: 2.39,
    Rewe: 3.19,
    Netto: 2.69,
    Edeka: 3.29,
    Penny: 2.59
  }
};

const FUTURE_OFFER_DATABASE = {
  butter: {
    market: "Lidl",
    day: "Montag",
    price: 1.49,
    saving: 0.80
  },
  hackfleisch: {
    market: "Kaufland",
    day: "Donnerstag",
    price: 3.49,
    saving: 0.50
  },
  kaese: {
    market: "Kaufland",
    day: "Donnerstag",
    price: 1.49,
    saving: 0.30
  }
};

function findOfferKey(productName){
  const key = normalizeShoppingKey(productName);

  if(key.includes("hackfleisch")) return "hackfleisch";
  if(key.includes("milch")) return "milch";
  if(key.includes("butter")) return "butter";
  if(key.includes("kaese")) return "kaese";
  if(key.includes("paprika")) return "paprika";
  if(key.includes("nudeln")) return "nudeln";
  if(key.includes("reis")) return "reis";
  if(key.includes("kartoffeln")) return "kartoffeln";
  if(key.includes("eier")) return "eier";

  return null;
}

function getOfferPricesForItem(productName){
  const offerKey = findOfferKey(productName);

  if(!offerKey || !OFFER_DATABASE[offerKey]){
    return OFFER_MARKETS.map(market => ({
      market,
      price: 2.49,
      status: "estimate",
      source: "Schätzwert"
    }));
  }

  return OFFER_MARKETS.map(market => ({
    market,
    price: OFFER_DATABASE[offerKey][market],
    status: "offer",
    source: "Angebotsdaten V1"
  }));
}

function getFutureOfferForItem(productName){
  const offerKey = findOfferKey(productName);
  if(!offerKey) return null;

  return FUTURE_OFFER_DATABASE[offerKey] || null;
}
