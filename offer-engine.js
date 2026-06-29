function formatEuro(value){
  return value.toFixed(2).replace(".",",") + " €";
}

function calculateKorboScore({
  savings,
  marketCount,
  distanceKm,
  futureSavings
}){

  let score = 80;

  if(savings > 5) score += 10;
  if(savings < 2) score -= 10;

  if(marketCount > 3) score -= 15;

  if(distanceKm > 18) score -= 15;

  if(futureSavings > 3) score += 5;

  return Math.max(0,Math.min(100,score));
}

function buildKorboRecommendation(
  marketCount,
  extraCostSingleMarket,
  distanceKm,
  futureSavings
){

  if(marketCount===1){
    return "Heute reicht ein einzelner Markt völlig aus.";
  }

  if(extraCostSingleMarket<3){
    return `Nur ${formatEuro(extraCostSingleMarket)} Mehrkosten. Korbo empfiehlt einen einzigen Markt.`;
  }

  if(distanceKm>18){
    return `Du würdest zwar sparen, musst aber etwa ${distanceKm} km mehr fahren.`;
  }

  if(futureSavings>3){
    return `Wenn du auf die nächsten Angebote wartest, sparst du zusätzlich ${formatEuro(futureSavings)}.`;
  }

  return "Mehrere Märkte lohnen sich aktuell.";
}
