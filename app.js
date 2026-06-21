let supabaseClient = null;
let pendingVote = null;
let selectedReason = "";

function initSupabase() {
  if (
    typeof isSupabaseConfigured !== "undefined" &&
    isSupabaseConfigured &&
    typeof SUPABASE_URL !== "undefined" &&
    typeof SUPABASE_ANON_KEY !== "undefined" &&
    window.supabase &&
    typeof window.supabase.createClient === "function"
  ) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Korbo 0.6.1: Supabase verbunden");
  } else {
    console.warn("Korbo: Supabase nicht verbunden", {
      configured: typeof isSupabaseConfigured !== "undefined" ? isSupabaseConfigured : "missing",
      hasSupabaseLibrary: !!window.supabase
    });
  }
}

initSupabase();

let state = {goal:"sparen",budget:50,people:2,days:7,diet:"normal",maxTime:30,markets:["Aldi"],pantry:[],avoid:[]};
let currentMeals = [];
const labels = {sparen:"Sparen",abnehmen:"Abnehmen",muskelaufbau:"Muskelaufbau",familie:"Familie"};
const markets = ["Aldi","Lidl","Kaufland","Rewe","Netto","Edeka","Penny","Egal"];
const pantryItems = ["Öl","Salz","Pfeffer","Paprikapulver","Gewürze","Nudeln","Reis","Mehl","Zucker","Eier","Kartoffeln","Zwiebeln","Knoblauch","Haferflocken","Brühe","Milch","Sojasoße","Tomatenmark"];

document.getElementById("budgetInput").addEventListener("input", e => {
  state.budget = Number(e.target.value);
  document.getElementById("budgetValue").textContent = state.budget;
});

function buildOptions(){
  document.getElementById("marketOptions").innerHTML = markets.map((m,i)=>`<button class="choice ${i===0?"selected":""}" onclick="toggleMarket('${m}',this)">${m}</button>`).join("");
  document.getElementById("pantryOptions").innerHTML = pantryItems.map(p=>`<button class="choice" onclick="togglePantry('${p}',this)">${p}</button>`).join("");
  document.getElementById("avoidOptions").innerHTML = AVOID_OPTIONS.map(p=>`<button class="choice" onclick="toggleAvoid('${p}',this)">${p}</button>`).join("");
}
buildOptions();

function goTo(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));document.getElementById(id).classList.add("active");window.scrollTo(0,0)}
function markSelected(el){el.parentElement.querySelectorAll(".choice").forEach(b=>b.classList.remove("selected"));el.classList.add("selected")}
function setOne(key,value,el){state[key]=value;markSelected(el)}
function toggleMarket(v,el){if(v==="Egal"){state.markets=["Egal"];el.parentElement.querySelectorAll(".choice").forEach(b=>b.classList.remove("selected"));el.classList.add("selected");return}state.markets=state.markets.filter(x=>x!=="Egal");const idx=state.markets.indexOf(v);idx>=0?state.markets.splice(idx,1):state.markets.push(v);el.classList.toggle("selected")}
function togglePantry(v,el){const idx=state.pantry.indexOf(v);idx>=0?state.pantry.splice(idx,1):state.pantry.push(v);el.classList.toggle("selected")}
function toggleAvoid(v,el){const idx=state.avoid.indexOf(v);idx>=0?state.avoid.splice(idx,1):state.avoid.push(v);el.classList.toggle("selected")}
function shuffle(a){return[...a].sort(()=>Math.random()-.5)}
function dietOk(recipe){if(state.diet==="normal")return true;if(state.diet==="vegetarisch")return recipe.diet==="vegetarisch"||recipe.diet==="vegan";if(state.diet==="vegan")return recipe.diet==="vegan";return true}
function avoidOk(recipe){return !state.avoid.some(tag => recipe.excludeTags && recipe.excludeTags.includes(tag))}

function getMeals(){
  let list = RECIPE_DATABASE[state.goal].filter(r=>dietOk(r)&&avoidOk(r)&&r.time<=state.maxTime);
  if(list.length<state.days) list = RECIPE_DATABASE[state.goal].filter(r=>dietOk(r)&&avoidOk(r));
  if(list.length<state.days) list = RECIPE_DATABASE[state.goal].filter(r=>avoidOk(r));
  if(list.length<state.days) list = RECIPE_DATABASE[state.goal];

  const minTarget = state.budget * 0.75;
  let best = shuffle(list).slice(0,state.days);
  let bestTotal = best.reduce((s,m)=>s+m.costPerPerson*state.people,0);

  for(let i=0;i<250;i++){
    const candidate = shuffle(list).slice(0,state.days);
    const total = candidate.reduce((s,m)=>s+m.costPerPerson*state.people,0);
    if(total <= state.budget && total >= minTarget){
      return candidate;
    }
    if(total <= state.budget && total > bestTotal){
      best = candidate;
      bestTotal = total;
    }
  }
  return best;
}

function generatePlan(){
  const meals=getMeals();currentMeals = meals;let total=0,ingredients=[];
  meals.forEach(m=>{total+=m.costPerPerson*state.people;ingredients.push(...m.ingredients.map(x => typeof x === 'string' ? x : x.item))});
  total=Math.round(total*100)/100;const rest=Math.round((state.budget-total)*100)/100;
  document.getElementById("rGoal").textContent=labels[state.goal];
  document.getElementById("rBudget").textContent=state.budget.toFixed(2).replace(".",",")+" €";
  document.getElementById("rCost").textContent=total.toFixed(2).replace(".",",")+" €";
  document.getElementById("rRest").textContent=rest.toFixed(2).replace(".",",")+" €";

  const notice=document.getElementById("notice");notice.classList.remove("show");
  if(state.avoid.length>0){notice.textContent="Deine Ausschlüsse wurden berücksichtigt: "+state.avoid.join(", ");notice.classList.add("show")}
  if(rest<0){notice.textContent="Dein Budget ist sehr knapp. Korbo zeigt dir den günstigsten passenden Plan.";notice.classList.add("show")}
  else if(state.pantry.length>0 && !notice.classList.contains("show")){notice.textContent="Zutaten, die du zuhause hast, wurden aus der Einkaufsliste entfernt.";notice.classList.add("show")}

  const mp=document.getElementById("mealPlan");mp.innerHTML="";
  meals.forEach((m,i)=>{
    const div=document.createElement("div");div.className="item";
    div.innerHTML=`<strong>Tag ${i+1}: ${m.name}</strong><small>${m.time} Min. · ${m.diet} · geschätzt ca. ${(m.costPerPerson*state.people).toFixed(2).replace(".",",")} €</small><div class="rating-buttons"><button onclick="openRecipeByIndex(${i})">Rezept anzeigen</button><button onclick="openRatingByIndex(${i},'like')">👍 Lecker</button><button class="dislike" onclick="openRatingByIndex(${i},'dislike')">👎 Nicht meins</button></div>`;
    mp.appendChild(div)
  });

  const cleanPantry=state.pantry.map(x=>x.toLowerCase());
  const unique=[...new Set(ingredients)].filter(x=>!cleanPantry.includes(x.toLowerCase()));
  const sl=document.getElementById("shoppingList");sl.innerHTML="";
  unique.forEach(i=>{const div=document.createElement("div");div.className="item";div.textContent=i;sl.appendChild(div)});
  goTo("result")
}

function resetApp(){goTo("goal")}

if("serviceWorker"in navigator){navigator.serviceWorker.register("service-worker.js")}

function formatIngredient(entry){
  const factor = state.people / 2;

  if(typeof entry === "string"){
    return entry;
  }

  if(entry.unit === "nach Geschmack"){
    return `${entry.item}: nach Geschmack`;
  }

  let qty = entry.qty;

  if(typeof qty === "number"){
    let scaled = qty * factor;

    if(
      entry.unit.includes("Stück") ||
      entry.unit.includes("Dose") ||
      entry.unit.includes("Dosen") ||
      entry.unit.includes("Beutel") ||
      entry.unit.includes("Scheiben") ||
      entry.unit.includes("EL") ||
      entry.unit.includes("TL") ||
      entry.unit.includes("Zehe") ||
      entry.unit.includes("Bund") ||
      entry.unit.includes("Rolle")
    ){
      scaled = Math.max(1, Math.round(scaled));
    } else {
      scaled = Math.max(10, Math.round(scaled / 10) * 10);
    }

    return `${scaled} ${entry.unit} ${entry.item}`;
  }

  return `${entry.qty} ${entry.unit} ${entry.item}`;
}

function formatIngredient(entry){
  const factor = state.people / 2;

  if(typeof entry === "string"){
    return entry;
  }

  if(entry.unit === "nach Geschmack"){
    return `${entry.item}: nach Geschmack`;
  }

  let qty = entry.qty;

  if(typeof qty === "number"){
    let scaled = qty * factor;

    if(
      entry.unit.includes("Stück") ||
      entry.unit.includes("Dose") ||
      entry.unit.includes("Dosen") ||
      entry.unit.includes("Beutel") ||
      entry.unit.includes("Scheiben") ||
      entry.unit.includes("EL") ||
      entry.unit.includes("TL") ||
      entry.unit.includes("Zehe") ||
      entry.unit.includes("Bund") ||
      entry.unit.includes("Rolle")
    ){
      scaled = Math.max(1, Math.round(scaled));
    } else {
      scaled = Math.max(10, Math.round(scaled / 10) * 10);
    }

    return `${scaled} ${entry.unit} ${entry.item}`;
  }

  return `${entry.qty} ${entry.unit} ${entry.item}`;
}

function openRecipeByIndex(index){
  const recipe = currentMeals[index];
  if(recipe){ openRecipe(recipe); }
}

function openRecipe(recipe){
  document.getElementById("recipeTitle").textContent=recipe.name;
  document.getElementById("recipeMeta").textContent=`Für ${state.people} Personen · ${recipe.time} Minuten · geschätzt ca. ${(recipe.costPerPerson*state.people).toFixed(2).replace(".",",")} €`;

  const amountList = recipe.ingredients
    ? recipe.ingredients.map(formatIngredient)
    : (recipe.amountItems ? recipe.amountItems.map(formatIngredient) : (recipe.amounts || []));

  document.getElementById("recipeIngredients").innerHTML=amountList.map(i=>`<div class="item">${i}</div>`).join("");
  document.getElementById("recipeSteps").innerHTML=(recipe.steps||[]).map((s,i)=>`<div class="item"><strong>Schritt ${i+1}</strong><small>${s}</small></div>`).join("");
  document.getElementById("recipeModal").classList.add("show");
}
function closeRecipe(){document.getElementById("recipeModal").classList.remove("show")}

function openRatingByIndex(index, voteType){
  const recipe = currentMeals[index];
  if(recipe){ openRating(recipe, voteType); }
}

function openRating(recipe,voteType){
  pendingVote={recipe,voteType};selectedReason="";
  document.getElementById("ratingTitle").textContent=voteType==="like"?"👍 Lecker":"👎 Nicht mein Geschmack";
  document.getElementById("ratingText").textContent=voteType==="like"?`Danke. Deine Bewertung für "${recipe.name}" wird gespeichert.`:`Was hat bei "${recipe.name}" nicht gepasst?`;
  document.querySelectorAll("#reasonBox .choice").forEach(b=>b.classList.remove("selected"));
  const reasonBox=document.getElementById("reasonBox");if(voteType==="dislike"){reasonBox.classList.add("show")}else{reasonBox.classList.remove("show")}
  document.getElementById("ratingModal").classList.add("show")
}
function setReason(reason,el){selectedReason=reason;markSelected(el)}
function closeRating(){document.getElementById("ratingModal").classList.remove("show");pendingVote=null;selectedReason=""}

async function sendVote(){
  if(!pendingVote){closeRating();return}
  if(!supabaseClient){initSupabase()}
  const payload={recipe_name:pendingVote.recipe.name,recipe_goal:state.goal,vote:pendingVote.voteType,reason:pendingVote.voteType==="dislike"?(selectedReason||"Kein Grund angegeben"):null,budget:state.budget,people:state.people,days:state.days,diet:state.diet,max_time:state.maxTime,markets:state.markets,avoid:state.avoid,user_agent:navigator.userAgent};

  if(!supabaseClient){
    alert("Supabase ist noch nicht verbunden. Lade die Seite bitte mit Strg + F5 neu und prüfe, ob config.js in GitHub ersetzt wurde.");
    closeRating();
    return;
  }

  const {error}=await supabaseClient.from("recipe_votes").insert(payload);
  if(error){alert("Bewertung konnte nicht gespeichert werden. Prüfe in Supabase die Tabelle recipe_votes und die RLS/Policies.");console.error(error);return}
  alert("Danke. Deine Bewertung wurde gespeichert.");closeRating()
}
