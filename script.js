/* ================= VARIABLES ================= */

var total = 0;
var basePrice = 0;

var currentOrder = [];
var orders = [];
var orderPrices = [];
var dailyOrders = [];
var prepaOrders = JSON.parse(localStorage.getItem("prepaOrders")) || [];

var bouleMax = 0;
var bouleCount = 0;

var saved = localStorage.getItem("dailyOrders");
if(saved){
  dailyOrders = JSON.parse(saved);
}

/* ================= TOTAL ================= */

function updateTotal(){
  document.getElementById("total").innerHTML = total.toFixed(2) + "€";
}

function getCartTotal(){
  return orderPrices.reduce((a,b)=>a+b,0);
}

/* ================= MENU ================= */

function toggleMenu(){
  document.getElementById("menu").classList.toggle("hidden");
}

function showCaisse(){
  document.getElementById("caisseView").classList.remove("hidden");
  document.getElementById("bilanView").classList.add("hidden");
  document.getElementById("prepaView").classList.add("hidden"); // ✅ AJOUT

  toggleMenu();
}

function showBilan(){
  document.getElementById("caisseView").classList.add("hidden");
  document.getElementById("bilanView").classList.remove("hidden");
  document.getElementById("prepaView").classList.add("hidden"); // ✅ AJOUT

  toggleMenu();
  renderBilan();
}

function showPrepa(){
  document.getElementById("caisseView").classList.add("hidden");
  document.getElementById("bilanView").classList.add("hidden");
  document.getElementById("prepaView").classList.remove("hidden");

  toggleMenu();
  renderPrepa();
}

/* ================= CART ================= */

function updateCart(){

  var html = "";

  for(var i=0;i<orders.length;i++){
    html += '<div onclick="removeOrder('+i+')" style="cursor:pointer;margin:5px;padding:6px;background:#ffe3e6;border-radius:8px;font-size:14px;">';
    var visibleItems = orders[i].filter(item => item !== "NoChantilly");

    html += '❌ #' + (i+1) + ' : ' + visibleItems.join(", ");
    html += '<b> — ' + orderPrices[i].toFixed(2) + '€</b></div>';
  }

  html += '<div style="margin-top:10px;font-weight:bold;font-size:16px;">';
  html += 'Total panier : ' + getCartTotal().toFixed(2) + '€</div>';

  document.getElementById("cart").innerHTML = html;
}

/* ================= RESET ================= */

function resetAll(){

  total = 0;
  basePrice = 0;

  currentOrder = [];
  orders = [];
  orderPrices = [];

  bouleMax = 0;
  bouleCount = 0;

  document.getElementById("dynamic").innerHTML = "";

  document.querySelectorAll(".selected").forEach(el => el.classList.remove("selected"));

  updateTotal();
  updateCart();
}

/* ================= ADD CART ================= */

function addToCart(){

  if(currentOrder.length === 0) return;

  if(currentOrder.includes("Pot") || currentOrder.includes("Cornet")){
var hasChantilly = currentOrder.includes("Chantilly") || currentOrder.includes("NoChantilly");
    if(!hasChantilly){
      alert("Choisissez la crème fouettée !");
      return;
    }

    if(bouleMax > 0 && bouleCount < bouleMax){
      alert("Choisissez le parfum de glace !");
      return;
    }
  }

  if(hasBouleDeGlaceOption()){
    var hasParfumCrepe = currentOrder.some(item => isParfumGlaceCrepe(item));
    if(!hasParfumCrepe){
      alert("Choisissez le parfum de glace !");
      return;
    }
  }

  orders.push(currentOrder.slice());
  orderPrices.push(total);

  currentOrder = [];
  total = 0;
  basePrice = 0;
  bouleMax = 0;
  bouleCount = 0;

  document.getElementById("dynamic").innerHTML = "";

  document.querySelectorAll(".selected").forEach(el => el.classList.remove("selected"));

  updateTotal();
  updateCart();
}

/* ================= VALIDER ================= */

function validateCart(){

  if(orders.length === 0) return;

  // 👉 ouvre la fenêtre de paiement
  document.getElementById("paymentModal").classList.remove("hidden");
}

function generateTicketText(ordersData, pricesData, totalPanier, paiement, ticketNum){

  let now = new Date();

  let tvaData = calculateTVA(totalPanier);

  let text = "";

  text += "🍦 LA VAGUE SUCRÉE 🍦\n";
  text += "EURL PIROU FUN BEACH\n";
  text += "Rue des Bergeoronettes\n";
  text += "50770 PIROU\n";
  text += "SIRET : 95213371800017\n";
  text += "--------------------------\n";

  text += "Ticket n° : " + ticketNum + "\n";
  text += now.toLocaleDateString() + " " + now.toLocaleTimeString() + "\n";

  text += "--------------------------\n";

  ordersData.forEach((order, index)=>{

    let visibleItems = order.filter(e => e !== "NoChantilly");

    text += visibleItems.join(", ") + "\n";
    text += pricesData[index].toFixed(2) + "€\n\n";
  });

  text += "--------------------------\n";

  text += "TOTAL TTC : " + totalPanier.toFixed(2) + "€\n";
  text += "TVA 5.5% : " + tvaData.tva.toFixed(2) + "€\n";
  text += "TOTAL HT : " + tvaData.ht.toFixed(2) + "€\n";

  text += "--------------------------\n";

  text += "Paiement : " + paiement + "\n";

  text += "Merci de votre visite 🍦";

  return text;
}


/* ================= REMOVE ================= */

function removeOrder(index){
  orders.splice(index,1);
  orderPrices.splice(index,1);
  updateCart();
}

/* ================= MAIN ================= */

function selectMain(name, price, el){

  document.querySelectorAll(".selected").forEach(e => e.classList.remove("selected"));
  el.classList.add("selected");

  basePrice = price;
  total = price;
  currentOrder = [name];

  updateTotal();
  updateCart();

  if(name === "Glace") showGlaceStep1();
  else if(name === "Boissons") showBoissons();
  else if(name === "Gateau") showGateau();
  else if(name === "Sale") showSale();
  else if(name === "Panini") showPaniniGelato();
  else showCrepePanini(); // 🔥 garde ton système intact
}

/* ================= CREPES ================= */

function showPaniniGelato(){

  if(!currentOrder.includes("Boule glace")){
    currentOrder.push("Boule glace");
  }

  showCrepePanini(optionsGlace);
  showExtraParfums();

  var extraParfum = document.getElementById("extraParfum");
  if(extraParfum){
    document.getElementById("dynamic").prepend(extraParfum);
  }

  updateTotal();
  updateCart();
}

function showCrepePanini(optionItems){

  var html = "";
  var optionsToShow = optionItems || options;

  html += "<h3>Nappage</h3><div class='row'>" + build(nappage) + "</div>";
  html += "<h3>Topping</h3><div class='row'>" + build(topping) + "</div>";
  html += "<h3>Options</h3><div class='row'>" + build(optionsToShow) + "</div>";

  document.getElementById("dynamic").innerHTML = html;
}

/* ================= DATA ================= */

var nappage = [
["icon-nappage-nutella.png","Nutella",0.5],
["icon-nappage-sucre.png","Sucre",0],
["icon-nappage-chocolat.png","Chocolat",0.5],
["icon-nappage-creme-noisette-blanche.png","Crème noisette blanche",0.5],
["icon-nappage-confiture-fraise.png","Confiture de fraise",0.5],
["icon-nappage-fraise.png","Fraise",0.5],
["icon-nappage-speculoos.png","Spéculoos",0.5],
["icon-nappage-caramel.png","Caramel",0.5]
];

var topping = [
["icon-topping-oreo.png","Oréo",0.5],
["icon-topping-kinder-bueno.png","Kinder Bueno",0.5],
["icon-topping-speculoos.png","Spéculoos",0.5],
["icon-topping-boule-choco.png","Boule choco",0.5],
["icon-topping-amandes.png","Amandes",0.5],
["icon-topping-shortbread.png","Shortbread",0.5]
];

var options = [
["icon-options-banane.png","Morceaux de bananes",1],
["icon-options-fraise.png","Morceaux de fraises",1],
["icon-creme-fouettee.png","Crème fouettée",1],
["icon-options-boule-de-glace.png","Boule de glace",3]
];

var optionsGlace = [
["icon-options-banane.png","Morceaux de bananes",1],
["icon-options-fraise.png","Morceaux de fraises",1],
["icon-creme-fouettee.png","Crème fouettée",1]
];

/* ================= BUILD ================= */

function build(list){

  var html = "";

  for(var i=0;i<list.length;i++){

    let prix = list[i][2] || 0;

    html += "<div class='card' onclick=\"toggle(this,'" + list[i][1] + "'," + prix + ")\">";

    html += "<img src='" + list[i][0] + "'>";
    html += "<p>" + list[i][1] + "</p></div>";
  }

  return html;
}

function buildGlaceAddons(list, category){

  var html = "";

  for(var i=0;i<list.length;i++){

    let prix = list[i][2] || 0;
    let orderName = category + " : " + list[i][1];

    html += "<div class='card' onclick=\"toggle(this,'" + orderName + "'," + prix + ")\">";
    html += "<img src='" + list[i][0] + "'>";
    html += "<p>" + list[i][1] + "</p></div>";
  }

  return html;
}

/* ================= TOGGLE ================= */

function toggle(el,name,price){

  if(el.classList.contains("selected")){

    el.classList.remove("selected");

    total -= price;

    currentOrder = currentOrder.filter(item => item !== name);

    if(isBouleDeGlace(name)){
      removeExtraParfums();
    }

  } else {

    el.classList.add("selected");

    total += price;

    currentOrder.push(name);

    if(isBouleDeGlace(name)){
      showExtraParfums();
    }
  }

  updateTotal();
  updateCart();
}

/* ================= EXTRA PARFUM CREPE ================= */

var crepeParfums = [
"Vanille de Madagascar",
"Caramel",
"Chocolat façon brownies",
"Guimauve",
"Mangue",
"Fraise",
"Rhum raisin",
"Café",
"Pistache",
"Citron",
"Parfum du moment"
];

function isBouleDeGlace(name){
  return name === "Boule de glace" || name === "Boule glace";
}

function hasBouleDeGlaceOption(){
  return currentOrder.some(item => isBouleDeGlace(item));
}

function getParfumGlaceCrepeItem(name){
  return "Parfum glace : " + name;
}

function isParfumGlaceCrepe(item){
  return item.indexOf("Parfum glace : ") === 0;
}

function showExtraParfums(){

  if(document.getElementById("extraParfum")) return;

  var html = "<div id='extraParfum'><h3>Parfum</h3><div class='row'>";

  crepeParfums.forEach(name => {
    var img = getParfumImage(name);

    html += "<div class='card' onclick=\"selectParfumCrepe(this,'" + name + "')\">";
    html += "<img src='" + img + "'><p>" + name + "</p></div>";
  });

  html += "</div></div>";

  document.getElementById("dynamic").innerHTML += html;
}

function removeExtraParfums(){
  var el = document.getElementById("extraParfum");
  if(el) el.remove();

  currentOrder = currentOrder.filter(item => !isParfumGlaceCrepe(item));
}

function selectParfumCrepe(el,name){

  document.querySelectorAll("#extraParfum .card").forEach(c => c.classList.remove("selected"));

  el.classList.add("selected");

  currentOrder = currentOrder.filter(item => !isParfumGlaceCrepe(item));

  currentOrder.push(getParfumGlaceCrepeItem(name));

  updateCart();
}
/* ================= GLACE ================= */

function showGlaceStep1(){

  document.getElementById("dynamic").innerHTML = `
    <div class='two'>
      <div class='card' onclick="selectType(this,'Pot')">
        <img src='icon-pot.png'><p>Pot</p>
      </div>
      <div class='card' onclick="selectType(this,'Cornet')">
        <img src='icon-cornet.png'><p>Cornet</p>
      </div>
    </div>`;
}

function selectType(el,name){

  document.querySelectorAll(".selected").forEach(e => e.classList.remove("selected"));
  el.classList.add("selected");

  currentOrder.push(name);

  showGlaceStep2();
}

function showGlaceStep2(){

  document.getElementById("dynamic").innerHTML = `
    <div class='three'>
     <div class='card' onclick="chooseBoules(this,1,3)">
  <img src='icon-1-boule.png'><p>1 boule</p>
</div>

<div class='card' onclick="chooseBoules(this,2,5)">
  <img src='icon-2-boules.png'><p>2 boules</p>
</div>
    </div>`;
}

function chooseBoules(el,nb,price){

  document.querySelectorAll(".selected").forEach(e => e.classList.remove("selected"));
  el.classList.add("selected");

  total = price;
  bouleMax = nb;
  bouleCount = 0;

  currentOrder.push(nb + " boules");

  updateTotal();
  updateCart();

  showGlaceFinal();
}

/* ================= GLACE FINAL ================= */

function showGlaceFinal(){

  currentOrder = currentOrder.filter(item =>
    item !== "Chantilly" && item !== "NoChantilly"
  );
  currentOrder.push("NoChantilly");

  var html = "";
  html += "<h3>Parfums</h3><div class='row'>" + buildParfums() + "</div>";
  html += "<h3>Nappage</h3><div class='row'>" + buildGlaceAddons(nappage, "Nappage") + "</div>";
  html += "<h3>Topping</h3><div class='row'>" + buildGlaceAddons(topping, "Topping") + "</div>";
  html += "<h3>Options</h3><div class='row'>" + buildGlaceAddons(optionsGlace, "Option") + "</div>";

  document.getElementById("dynamic").innerHTML = html;
}

/* ================= PARFUM GLACE ================= */

function buildParfums(){

  var html = "";

  crepeParfums.forEach(name => {
    var img = getParfumImage(name);

    html += "<div class='card' onclick=\"selectParfumGlace(this,'" + name + "')\">";
    html += "<img src='" + img + "'><p>" + name + "</p></div>";
  });

  return html;
}

function getParfumImage(name){
  return "icon-parfum-glace-" +
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g,"-")
    + ".png";
}

function selectParfumGlace(el,name){
  var parfumItem = getParfumGlaceCrepeItem(name);

  if(el.classList.contains("selected")){
    el.classList.remove("selected");
    bouleCount--;
    var index = currentOrder.indexOf(parfumItem);
    if(index > -1) currentOrder.splice(index,1);
  } else {

    if(bouleCount >= bouleMax) return;

    el.classList.add("selected");
    bouleCount++;
    currentOrder.push(parfumItem);
  }

  updateCart();
}

/* ================= CHANTILLY ================= */

function buildChantilly(){

  return `
  <div id='chantillyBlock'>
    <h3>Crème fouettée</h3>
    <div class='two'>
      <div class='card' onclick="selectChantilly(this,'Oui',1)">
        <img src='icon-chantilly-oui.png'><p>Oui</p>
      </div>
    </div>
  </div>`;
}

function selectChantilly(el, choix, prix){

  var hadChantilly = currentOrder.includes("Chantilly");

  document.querySelectorAll("#chantillyBlock .card").forEach(c => c.classList.remove("selected"));
  el.classList.add("selected");

  // 🔥 On retire les anciennes valeurs
  currentOrder = currentOrder.filter(item =>
    item !== "Chantilly" && item !== "NoChantilly"
  );

  // 🔥 On ajoute un flag interne
  if(choix === "Oui"){
    currentOrder.push("Chantilly");
    if(!hadChantilly){
      total += prix;
    }
  } else {
    currentOrder.push("NoChantilly"); // 👈 invisible pour l'utilisateur
  }

  updateTotal();
  updateCart();
}

/* ================= GLACE ================= */
/* (inchangé — ton code original fonctionne déjà) */

/* ================= NOUVEAUX MENUS ================= */

function buildSimple(list, multi=false){

  var html = "<div class='center'>";

  list.forEach(item => {
    var encodedName = encodeURIComponent(item[1]).replace(/'/g,"%27");
    var nameArg = "decodeURIComponent('" + encodedName + "')";

    if(multi){
      html += `<div class="card" onclick="toggleSimple(${nameArg},${item[2]},this)">
      <img src="${item[0]}"><p>${item[1]}</p></div>`;
    } else {
      html += `<div class="card" onclick="selectSimple(${nameArg},${item[2]},this)">
      <img src="${item[0]}"><p>${item[1]}</p></div>`;
    }

  });

  html += "</div>";
  return html;
}

function selectSimple(name,price,el){
  document.querySelectorAll(".selected").forEach(e => e.classList.remove("selected"));
  el.classList.add("selected");

  total = price;
  currentOrder=[name];
  updateTotal();
}

/* BOISSONS */
function showBoissons(){
  document.getElementById("dynamic").innerHTML = `
  <div class="two">

    <div class="card" onclick="showBoissonsFroides()">
      <img src="icon-boisson-froide.png">
      <p>Boissons froides</p>
    </div>

    <div class="card" onclick="showBoissonsChaudes()">
      <img src="icon-boisson-chaude.png">
      <p>Boissons chaudes</p>
    </div>

  </div>`;
}

function showBoissonsFroides(){
  document.getElementById("dynamic").innerHTML = buildSimple([

    ["icon-cocacola.png","Coca Cola",2.5],
    ["icon-cocacola-zero.png","Coca Cola Zéro",2.5],
    ["icon-oasis-tropical.png","Oasis Tropical",2.5],
    ["icon-fanta.png","Fanta",2.5],
    ["icon-icetea.png","Ice Tea",2.5],
    ["icon-sprite.png","Sprite",2.5],
    ["icon-schweppes-agrumes.png","Schweppes Agrumes",2.5],
    ["icon-jus-ananas.png","Jus d'ananas",2.5],
    ["icon-jus-banane.png","Jus de banane",2.5],
    ["icon-redbull.png","Redbull",3],
    ["icon-eau.png","Eau",1]

  ], true); // 👈 IMPORTANT
}

function showBoissonsChaudes(){
  document.getElementById("dynamic").innerHTML = buildSimple([
    ["icon-cafe.png","Café",1.5],
    ["icon-the.png","Thé",2.5],
    ["icon-chocolat-chaud.png","Chocolat chaud",3]
  ], true); // 👈 IMPORTANT
}

/* GATEAU */
function showGateau(){
  document.getElementById("dynamic").innerHTML = buildSimple([
    ["icon-cookie.png","Cookie américain",3],
    ["icon-brownies.png","Brownies",3]
  ], true);
}

/* SALE */
function showSale(){
  document.getElementById("dynamic").innerHTML = buildSimple([
    ["icon-panini-boeuf.png","Beef on the Beach",4.5],
    ["icon-panini-poulet.png","Surf Chicken",4.5],
    ["icon-panini-vegan.png","Marin Green",4.5]
  ], true);
}

/* ================= BILAN ================= */

function renderBilan(){

  var html = "";

  // 🔥 COMMANDES
  dailyOrders.forEach((order, index)=>{

    let paiementLabel = order.paiement || "Non défini";

    if(paiementLabel === "Autres"){
      paiementLabel = "Autre moyen de paiement";
    }

    html += "<div class='bilan-card' onclick='sendTicketFromBilan("+index+")' style='cursor:pointer'>";
    html += "<b>Commande #" + (index+1) + "</b><br>";
    html += order.date + " - " + order.time + "<br>";
    html += "💳 Paiement : <b>" + paiementLabel + "</b><br><br>";

    order.items.forEach((item,i)=>{
      html += "• " + item.join(", ");
      html += " — " + order.prices[i].toFixed(2) + "€<br>";
    });

    html += "<br><b>Total : " + order.total.toFixed(2) + "€</b>";
    html += "</div>";
  });

  // 🔥 STATS
  let stats = getStats();

  html += "<div class='bilan-card'>";
  html += "<h3>📊 Statistiques</h3>";

  html += "Total du jour : <b>" + stats.total.toFixed(2) + "€</b><br>";
  html += "Nombre de commandes : <b>" + stats.commandes + "</b><br><br>";

  // ✅ PRODUITS
  html += "<b>Produits vendus :</b><br>";
  for(let p in stats.produits){
    html += "• " + p + " : " + stats.produits[p] + "<br>";
  }

  // ✅ PAIEMENTS
  html += "<br><b>💳 Modes de paiement :</b><br>";
  for(let p in stats.paiements){
    html += "• " + p + " : " + stats.paiements[p] + "<br>";
  }

  html += "</div>";

  document.getElementById("bilan").innerHTML = html;
}


/* ================= FIN JOURNEE ================= */

function endDay(){
  if(!confirm("Effacer le bilan ?")) return;

  dailyOrders = [];
  localStorage.removeItem("dailyOrders"); // ✅ IMPORTANT

  renderBilan();
}

function exportPDF(){

  try {

    if(dailyOrders.length === 0){
      alert("Aucun bilan à exporter");
      return;
    }

    // ✅ Sécurité chargement jsPDF
    var jsPDFLib = window.jspdf && window.jspdf.jsPDF;
    if(!jsPDFLib){
      exportBilanHTML();
      return;
    }

    const doc = new jsPDFLib();

    let y = 20;

    /* ================= TITRE ================= */

    doc.setFontSize(18);
    doc.text("Bilan - La Vague Sucrée", 105, y, { align: "center" });

    y += 10;

    doc.line(10, y, 200, y);
    y += 10;

    doc.setFontSize(11);

    /* ================= COMMANDES ================= */

    dailyOrders.forEach((order, index)=>{

      doc.setFont(undefined, "bold");
      doc.text("Commande #" + (index+1), 10, y);
      doc.setFont(undefined, "normal");

      y += 5;

      doc.text(order.date + " - " + order.time, 10, y);
      y += 6;

      order.items.forEach((item,i)=>{

        let visibleItems = item.filter(e => e !== "NoChantilly");

var text = "- " + visibleItems.join(", ");

// 🔥 nettoie les caractères spéciaux
text = text.replace(/€/g, "EUR");
text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        let price = order.prices[i].toFixed(2) + "€";

        doc.text(text, 10, y);
        doc.text(price, 200, y, { align: "right" });

        y += 5;

        if(y > 270){
          doc.addPage();
          y = 20;
        }
      });

      doc.setFont(undefined, "bold");
      doc.text("Total commande : " + order.total.toFixed(2) + "€", 10, y);
      doc.setFont(undefined, "normal");

      y += 10;
    });

    /* ================= TOTAL JOUR ================= */

    const totalJour = dailyOrders.reduce((sum,o)=>sum+o.total,0);

    doc.line(10, y, 200, y);

    y += 10;

    doc.setFontSize(14);
  doc.text("TOTAL JOUR : " + totalJour.toFixed(2) + " EUR", 105, y, { align: "center" });

    /* ================= STATS ================= */

    let stats = getStats();

    y += 10;

    if(y > 260){
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.text("STATISTIQUES", 105, y, { align: "center" });

    y += 10;

    doc.setFontSize(11);

    doc.text("Total du jour : " + stats.total.toFixed(2) + "€", 10, y);
    y += 6;

    doc.text("Nombre de commandes : " + stats.commandes, 10, y);
    y += 8;

    doc.text("Produits vendus :", 10, y);
    y += 6;

    for(let p in stats.produits){

      doc.text("- " + p + " : " + stats.produits[p], 10, y);
      y += 5;

      if(y > 280){
        doc.addPage();
        y = 20;
      }
    }
// ================= PAIEMENTS =================

y += 10;

if(y > 260){
  doc.addPage();
  y = 20;
}

function escapeHTML(value){
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildBilanExportHTML(){
  let stats = getStats();
  let totalJour = dailyOrders.reduce((sum,o)=>sum+o.total,0);
  let html = "";

  html += "<!DOCTYPE html><html lang='fr'><head><meta charset='UTF-8'>";
  html += "<title>Bilan - La Vague Sucrée</title>";
  html += "<style>";
  html += "body{font-family:Arial,sans-serif;margin:24px;color:#222}";
  html += "h1{text-align:center;color:#ed7985;margin-bottom:8px}";
  html += ".meta{text-align:center;margin-bottom:24px}";
  html += ".order{border-bottom:1px solid #ddd;padding:12px 0}";
  html += ".row{display:flex;justify-content:space-between;gap:16px}";
  html += ".stats{margin-top:24px;padding:16px;background:#ffe3e6;border-radius:10px}";
  html += "button{padding:10px 14px;background:#ed7985;color:white;border:0;border-radius:8px}";
  html += "@media print{button{display:none}body{margin:12mm}}";
  html += "</style></head><body>";
  html += "<button onclick='window.print()'>Imprimer / Enregistrer en PDF</button>";
  html += "<h1>Bilan - La Vague Sucrée</h1>";
  html += "<div class='meta'>Total jour : <b>" + totalJour.toFixed(2) + "€</b></div>";

  dailyOrders.forEach((order, index)=>{
    html += "<div class='order'>";
    html += "<h2>Commande #" + (index+1) + "</h2>";
    html += "<p>" + escapeHTML(order.date) + " - " + escapeHTML(order.time) + "<br>";
    html += "Paiement : <b>" + escapeHTML(order.paiement || "Non défini") + "</b></p>";

    order.items.forEach((item,i)=>{
      let visibleItems = item.filter(e => e !== "NoChantilly");
      html += "<div class='row'><span>" + escapeHTML(visibleItems.join(", ")) + "</span>";
      html += "<b>" + order.prices[i].toFixed(2) + "€</b></div>";
    });

    html += "<p><b>Total commande : " + order.total.toFixed(2) + "€</b></p>";
    html += "</div>";
  });

  html += "<div class='stats'><h2>Statistiques</h2>";
  html += "<p>Total du jour : <b>" + stats.total.toFixed(2) + "€</b><br>";
  html += "Nombre de commandes : <b>" + stats.commandes + "</b></p>";

  html += "<h3>Produits vendus</h3>";
  for(let p in stats.produits){
    html += "<div class='row'><span>" + escapeHTML(p) + "</span><b>" + stats.produits[p] + "</b></div>";
  }

  html += "<h3>Paiements</h3>";
  for(let p in stats.paiements){
    html += "<div class='row'><span>" + escapeHTML(p) + "</span><b>" + stats.paiements[p] + "</b></div>";
  }

  html += "</div></body></html>";
  return html;
}

function exportBilanHTML(){
  var blob = new Blob([buildBilanExportHTML()], { type: "text/html;charset=utf-8" });
  var url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}

doc.text("Paiements :", 10, y);
y += 6;

for(let p in stats.paiements){

  doc.text("- " + p + " : " + stats.paiements[p], 10, y);
  y += 5;

  if(y > 280){
    doc.addPage();
    y = 20;
  }
}

    /* ================= EXPORT SAFE ================= */

    // ✅ NE PAS utiliser blob / window.open (bug iPad PWA)

// 🔥 DEMANDE AVANT ACTION
if(confirm("Envoyer le bilan par mail ?")){

  let subject = "Bilan - La Vague Sucrée";
  let body = "";

  dailyOrders.forEach((order, index)=>{

    body += "Commande #" + (index+1) + "\n";
    body += order.date + " - " + order.time + "\n";
    body += "Paiement : " + order.paiement + "\n";

    order.items.forEach((item,i)=>{
      let visibleItems = item.filter(e => e !== "NoChantilly");
      body += "- " + visibleItems.join(", ") + " : " + order.prices[i].toFixed(2) + "€\n";
    });

    body += "Total : " + order.total.toFixed(2) + "€\n";
    body += "--------------------------\n";
  });

  let totalJour = dailyOrders.reduce((sum,o)=>sum+o.total,0);
  body += "\nTOTAL JOUR : " + totalJour.toFixed(2) + "€\n";

  let stats = getStats();

  body += "\nSTATISTIQUES\n";
  body += "Commandes : " + stats.commandes + "\n";

  body += "\nProduits :\n";
  for(let p in stats.produits){
    body += "- " + p + " : " + stats.produits[p] + "\n";
  }

  body += "\nPaiements :\n";
  for(let p in stats.paiements){
    body += "- " + p + " : " + stats.paiements[p] + "\n";
  }

  let mailto = `mailto:piroufunbeach@icloud.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;

} else {

  // 👉 sinon PDF normal
  var blob = doc.output("blob");
  var url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}

  } catch(e) {

    console.error("Erreur export PDF :", e);
    alert("Erreur lors de la génération du PDF");

  }
}

function getStats(){

  let stats = {
    total: 0,
    commandes: dailyOrders.length,
    produits: {},
    paiements: {} // 🔥 AJOUT
  };

  dailyOrders.forEach(order => {

    stats.total += order.total;

    // 🔥 COMPTE PAIEMENTS
    if(order.paiement){
      if(!stats.paiements[order.paiement]){
        stats.paiements[order.paiement] = 0;
      }
      stats.paiements[order.paiement]++;
    }

order.items.forEach(item => {

  item.forEach(element => {

    // 🔥 FILTRE ICI
    if(
      element === "NoChantilly" ||
      element === "Autres"
    ) return;

    if(!stats.produits[element]){
      stats.produits[element] = 0;
    }

    stats.produits[element]++;
  });

});

  });

  return stats;
}

function cleanText(text){
  return text
    .replace(/€/g, "EUR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function toggleSimple(name, price, el){

  if(el.classList.contains("selected")){
    el.classList.remove("selected");

    total -= price;

    // supprime UNE occurrence
    const index = currentOrder.indexOf(name);
    if(index > -1) currentOrder.splice(index,1);

  } else {
    el.classList.add("selected");

    total += price;
    currentOrder.push(name);
  }

  updateTotal();
  updateCart();
}

function saveBilan(){
  localStorage.setItem("dailyOrders", JSON.stringify(dailyOrders));
}

function sendEmail(){

  if(orders.length === 0){
    alert("Panier vide");
    return;
  }

  let subject = "Ticket - La Vague Sucrée";
  let body = "🍦 LA VAGUE SUCRÉE 🍦\n\n";

  let totalPanier = 0;

  orders.forEach((order, index)=>{

    body += "Commande #" + (index+1) + "\n";

    let visibleItems = order.filter(e => e !== "NoChantilly");

    body += "- " + visibleItems.join(", ") + "\n";
    body += "Prix : " + orderPrices[index].toFixed(2) + "€\n\n";

    totalPanier += orderPrices[index];
  });

  body += "--------------------------\n";
  body += "TOTAL : " + totalPanier.toFixed(2) + "€\n\n";
  body += "Merci et à bientôt 🍦";

  let mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = mailto;
}


function selectPayment(modePaiement){

  document.getElementById("paymentModal").classList.add("hidden");

  var now = new Date();

  let lastOrders = JSON.parse(JSON.stringify(orders));
  let lastPrices = [...orderPrices];
  let totalPanier = getCartTotal();

  // ✅ Ajout avec paiement
  dailyOrders.push({
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    items: lastOrders,
    prices: lastPrices,
    total: totalPanier,
    paiement: modePaiement
  });

// ✅ AJOUT PREPA
prepaOrders.push({
  items: lastOrders
});

localStorage.setItem("prepaOrders", JSON.stringify(prepaOrders));


  saveBilan();

  // RESET panier
  orders = [];
  orderPrices = [];

  updateCart();
}

function calculateTVA(totalTTC){
  let tvaRate = 5.5 / 100;
  let ht = totalTTC / (1 + tvaRate);
  let tva = totalTTC - ht;

  return {
    ht: ht,
    tva: tva
  };
}

function renderPrepa(){

  var html = "";

  if(prepaOrders.length === 0){
    html = "<p>Aucune commande en attente</p>";
  }

  prepaOrders.forEach((order, index)=>{

    html += "<div class='bilan-card'>";
    html += "<b>Commande #" + (index+1) + "</b><br><br>";

    order.items.forEach(item=>{
      let visibleItems = item.filter(e => e !== "NoChantilly");
      html += "• " + visibleItems.join(", ") + "<br>";
    });

    html += "<br>";
    html += "<button onclick='finishOrder("+index+")'>✅ OK</button>";
    html += "</div>";
  });

  document.getElementById("prepa").innerHTML = html;
}

function finishOrder(index){
  prepaOrders.splice(index,1);
  localStorage.setItem("prepaOrders", JSON.stringify(prepaOrders));
  renderPrepa();
}

function sendTicketFromBilan(index){

  let order = dailyOrders[index];

  let ticketText = generateTicketText(
    order.items,
    order.prices,
    order.total,
    order.paiement,
    index + 1
  );

  let email = prompt("Email du client :");

  let mailto = `mailto:${email}?subject=${encodeURIComponent("Ticket La Vague Sucrée")}&body=${encodeURIComponent(ticketText)}`;

  window.location.href = mailto;
}

function openCustomAmount(){
  document.getElementById("customInput").value = "";
  document.getElementById("customModal").classList.remove("hidden");
}

function closeCustomAmount(){
  document.getElementById("customModal").classList.add("hidden");
}

function addCustomAmount(){

  let value = parseFloat(document.getElementById("customInput").value);

  if(isNaN(value) || value <= 0){
    alert("Montant invalide");
    return;
  }

  // 🔥 Ajout direct au panier comme une commande
  orders.push(["Autres"]);
  orderPrices.push(value);

  closeCustomAmount();

  updateCart();
}

if("serviceWorker" in navigator){
  window.addEventListener("load", function(){
    navigator.serviceWorker.register("./service-worker.js").catch(function(error){
      console.error("Service worker non enregistré :", error);
    });
  });
}

var legacyCacheStatus = document.createElement("div");
legacyCacheStatus.style.position = "fixed";
legacyCacheStatus.style.right = "8px";
legacyCacheStatus.style.bottom = "8px";
legacyCacheStatus.style.zIndex = "3000";
legacyCacheStatus.style.padding = "6px 10px";
legacyCacheStatus.style.borderRadius = "8px";
legacyCacheStatus.style.background = "#4CAF50";
legacyCacheStatus.style.color = "white";
legacyCacheStatus.style.fontSize = "12px";
legacyCacheStatus.innerHTML = window.applicationCache ? "Cache iPad..." : "Cache iPad incompatible";

window.addEventListener("load", function(){
  document.body.appendChild(legacyCacheStatus);
});

if(window.applicationCache){

  window.applicationCache.addEventListener("cached", function(){
    legacyCacheStatus.innerHTML = "Hors-ligne prêt";
  });

  window.applicationCache.addEventListener("noupdate", function(){
    legacyCacheStatus.innerHTML = "Hors-ligne prêt";
  });

  window.applicationCache.addEventListener("downloading", function(){
    legacyCacheStatus.innerHTML = "Cache en cours...";
  });

  window.applicationCache.addEventListener("updateready", function(){
    if(window.applicationCache.status === window.applicationCache.UPDATEREADY){
      legacyCacheStatus.innerHTML = "Cache mis à jour";
      window.applicationCache.swapCache();
      window.location.reload();
    }
  });

  window.applicationCache.addEventListener("error", function(){
    legacyCacheStatus.style.background = "#d9534f";
    legacyCacheStatus.innerHTML = "Cache iPad échec";
    console.error("Cache hors-ligne ancien iPad non installé");
  });
}
