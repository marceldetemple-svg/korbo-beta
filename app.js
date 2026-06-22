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
    console.log("Korbo 0.7.0: Supabase verbunden");
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
let currentOpenRecipe = null;
let generatedShoppingItems = [];
const labels = {sparen:"Sparen",abnehmen:"Abnehmen",muskelaufbau:"Muskelaufbau",familie:"Familie"};
const markets = ["Aldi","Lidl","Kaufland","Rewe","Netto","Edeka","Penny","Egal"];
const pantryItems = ["Öl","Salz","Pfeffer","Paprikapulver","Gewürze","Nudeln","Reis","Mehl","Zucker","Eier","Kartoffeln","Zwiebeln","Knoblauch","Haferflocken","Brühe","Milch","Sojasoße","Tomatenmark"];

const SHOPPING_STORAGE_KEY = "korbo_shopping_list_v1";

function normalizeShoppingName(name){
  return String(name || "").trim().replace(/\s+/g, " ");
}

function loadShoppingList(){
  try{
    return JSON.parse(localStorage.getItem(SHOPPING_STORAGE_KEY) || "[]");
  }catch(e){
    console.warn("Einkaufsliste konnte nicht geladen werden", e);
    return [];
  }
}

function saveShoppingList(items){
  localStorage.setItem(SHOPPING_STORAGE_KEY, JSON.stringify(items));
}

function makeShoppingId(){
  return "shop_" + Date.now() + "_" + Math.random().toString(16).slice(2);
}

function formatQtyUnit(qty, unit){
  if(qty === null || qty === undefined || qty === "") return "";
  if(unit === "nach Geschmack") return "";
  return `${qty} ${unit}`.trim();
}

function formatShoppingItem(item){
  const qty = formatQtyUnit(item.qty, item.unit);
  return qty ? `${qty} ${item.name}` : item.name;
}

function ingredientToShoppingItem(entry, source){
  if(typeof entry === "string"){
    return {id: makeShoppingId(), name: normalizeShoppingName(entry), qty: "", unit: "", checked:false, source: source || "manual"};
  }

  let qty = entry.qty;
  let unit = entry.unit || "";
  const name = normalizeShoppingName(entry.item);

  if(unit === "nach Geschmack"){
    qty = "";
    unit = "";
  }

  return {id: makeShoppingId(), name, qty, unit, checked:false, source: source || "recipe"};
}

function sameShoppingItem(a,b){
  return normalizeShoppingName(a.name).toLowerCase() === normalizeShoppingName(b.name).toLowerCase()
    && String(a.unit || "").toLowerCase() === String(b.unit || "").toLowerCase();
}

function mergeShoppingItems(existing, incoming){
  const items = [...existing];

  incoming.forEach(newItem => {
    if(!newItem.name) return;

    const idx = items.findIndex(old => !old.checked && sameShoppingItem(old, newItem));

    if(idx >= 0 && typeof items[idx].qty === "number" && typeof newItem.qty === "number"){
      items[idx].qty = Math.round((items[idx].qty + newItem.qty) * 100) / 100;
      if(newItem.source && !String(items[idx].source || "").includes(newItem.source)){
        items[idx].source = `${items[idx].source || "Liste"}, ${newItem.source}`;
      }
    } else {
      items.push({...newItem, id: makeShoppingId(), checked:false});
    }
  });

  return items;
}

function addItemsToShoppingList(items){
  const current = loadShoppingList();
  const merged = mergeShoppingItems(current, items);
  saveShoppingList(merged);
  renderShoppingList();

  const count = items.filter(i => i.name).length;
  if(count > 0){
    alert(`${count} Artikel wurden zur Einkaufsliste hinzugefügt.`);
  }
}

function addManualShoppingItem(){
  const nameInput = document.getElementById("shoppingNameInput");
  const qtyInput = document.getElementById("shoppingQtyInput");
  const name = normalizeShoppingName(nameInput.value);
  const qtyRaw = normalizeShoppingName(qtyInput.value);

  if(!name){
    alert("Bitte gib ein Produkt ein.");
    return;
  }

  const parsed = parseManualQuantity(qtyRaw);
  addItemsToShoppingList([{id: makeShoppingId(), name, qty: parsed.qty, unit: parsed.unit, checked:false, source:"manual"}]);

  nameInput.value = "";
  qtyInput.value = "";
  nameInput.focus();
}

function parseManualQuantity(value){
  if(!value) return {qty:"", unit:""};

  const match = value.match(/^(\d+(?:[,.]\d+)?)\s*(.*)$/);
  if(!match) return {qty:value, unit:""};

  const qty = Number(match[1].replace(",", "."));
  const unit = match[2].trim();

  if(Number.isFinite(qty)){
    return {qty, unit};
  }
  return {qty:value, unit:""};
}

function toggleShoppingItem(id){
  const items = loadShoppingList().map(item => item.id === id ? {...item, checked:!item.checked} : item);
  saveShoppingList(items);
  renderShoppingList();
}

function deleteShoppingItem(id){
  const items = loadShoppingList().filter(item => item.id !== id);
  saveShoppingList(items);
  renderShoppingList();
}

function clearCheckedShoppingItems(){
  const items = loadShoppingList();
  const remaining = items.filter(item => !item.checked);
  saveShoppingList(remaining);
  renderShoppingList();
}

function clearAllShoppingItems(){
  if(confirm("Willst du die komplette Einkaufsliste löschen?")){
    saveShoppingList([]);
    renderShoppingList();
  }
}

function renderShoppingList(){
  const openBox = document.getElementById("shoppingOpenList");
  const doneBox = document.getElementById("shoppingDoneList");
  if(!openBox || !doneBox) return;

  const items = loadShoppingList();
  const open = items.filter(item => !item.checked);
  const done = items.filter(item => item.checked);

  openBox.innerHTML = open.length ? open.map(renderShoppingRow).join("") : `<div class="item"><small>Noch keine offenen Artikel.</small></div>`;
  doneBox.innerHTML = done.length ? done.map(renderShoppingRow).join("") : `<div class="item"><small>Noch nichts abgehakt.</small></div>`;
}

function renderShoppingRow(item){
  const checked = item.checked ? "checked" : "";
  const doneClass = item.checked ? " done" : "";
  const source = item.source && item.source !== "manual" ? `<small>${item.source}</small>` : "";
  return `<div class="item shopping-row${doneClass}">
    <label>
      <input type="checkbox" ${checked} onchange="toggleShoppingItem('${item.id}')"/>
      <span>${escapeHtml(formatShoppingItem(item))}</span>
    </label>
    ${source}
    <button class="icon-button" onclick="deleteShoppingItem('${item.id}')">Löschen</button>
  </div>`;
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, m => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#039;"
  }[m]));
}

function goToShopping(){
  goTo("shopping");
  renderShoppingList();
}

function recipeIngredientsToShopping(recipe){
  if(!recipe || !recipe.ingredients) return [];
  return recipe.ingredients
    .filter(entry => !(entry.unit === "nach Geschmack"))
    .map(entry => ingredientToShoppingItem(entry, recipe.name));
}

function addOpenRecipeToShopping(){
  if(!currentOpenRecipe){
    alert("Kein Rezept geöffnet.");
    return;
  }
  addItemsToShoppingList(recipeIngredientsToShopping(currentOpenRecipe));
}

function addRecipeByIndexToShopping(index){
  const recipe = currentMeals[index];
  if(recipe){
    addItemsToShoppingList(recipeIngredientsToShopping(recipe));
  }
}

function addGeneratedListToShopping(){
  if(!generatedShoppingItems || generatedShoppingItems.length === 0){
    alert("Es gibt noch keine generierte Einkaufsliste.");
    return;
  }
  addItemsToShoppingList(generatedShoppingItems);
}

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
  meals.forEach(m=>{total+=m.costPerPerson*state.people;ingredients.push(...(m.ingredients || []).filter(x => !(x.unit === "nach Geschmack")).map(x => ingredientToShoppingItem(x, m.name)))});
  generatedShoppingItems = mergeShoppingItems([], ingredients);
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
    div.innerHTML=`<strong>Tag ${i+1}: ${m.name}</strong><small>${m.time} Min. · ${m.diet} · geschätzt ca. ${(m.costPerPerson*state.people).toFixed(2).replace(".",",")} €</small><div class="rating-buttons"><button onclick="openRecipeByIndex(${i})">Rezept anzeigen</button><button onclick="addRecipeByIndexToShopping(${i})">Zur Einkaufsliste</button><button onclick="openRatingByIndex(${i},'like')">👍 Lecker</button><button class="dislike" onclick="openRatingByIndex(${i},'dislike')">👎 Nicht meins</button></div>`;
    mp.appendChild(div)
  });

  const cleanPantry=state.pantry.map(x=>x.toLowerCase());
  const filtered = generatedShoppingItems.filter(x=>!cleanPantry.includes(x.name.toLowerCase()));
  generatedShoppingItems = filtered;
  const sl=document.getElementById("shoppingList");sl.innerHTML="";
  if(filtered.length === 0){
    sl.innerHTML = `<div class="item"><small>Keine zusätzlichen Zutaten nötig.</small></div>`;
  } else {
    filtered.forEach(i=>{
      const div=document.createElement("div");
      div.className="item";
      div.textContent=formatShoppingItem(i);
      sl.appendChild(div)
    });
  }
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
  currentOpenRecipe = recipe;
  document.getElementById("recipeTitle").textContent=recipe.name;
  document.getElementById("recipeMeta").textContent=`Für ${state.people} Personen · ${recipe.time} Minuten · geschätzt ca. ${(recipe.costPerPerson*state.people).toFixed(2).replace(".",",")} €`;

  const amountList = recipe.ingredients
    ? recipe.ingredients.map(formatIngredient)
    : (recipe.amountItems ? recipe.amountItems.map(formatIngredient) : (recipe.amounts || []));

  document.getElementById("recipeIngredients").innerHTML=amountList.map(i=>`<div class="item">${i}</div>`).join("");
  document.getElementById("recipeSteps").innerHTML=(recipe.steps||[]).map((s,i)=>`<div class="item"><strong>Schritt ${i+1}</strong><small>${s}</small></div>`).join("");
  document.getElementById("recipeModal").classList.add("show");
}
function closeRecipe(){document.getElementById("recipeModal").classList.remove("show");currentOpenRecipe=null}

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


document.addEventListener("DOMContentLoaded", () => {
  renderShoppingList();
  const nameInput = document.getElementById("shoppingNameInput");
  const qtyInput = document.getElementById("shoppingQtyInput");
  [nameInput, qtyInput].forEach(input => {
    if(input){
      input.addEventListener("keydown", e => {
        if(e.key === "Enter"){
          addManualShoppingItem();
        }
      });
    }
  });
});
