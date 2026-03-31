/* ================= VARIABLES ================= */

var total = 0;
var basePrice = 0;

var currentOrder = [];
var orders = [];
var orderPrices = [];
var dailyOrders = [];

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
  toggleMenu();
}

function showBilan(){
  document.getElementById("caisseView").classList.add("hidden");
  document.getElementById("bilanView").classList.remove("hidden");
  toggleMenu();
  renderBilan();
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

  var now = new Date();

  dailyOrders.push({
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    items: JSON.parse(JSON.stringify(orders)),
    prices: [...orderPrices],
    total: getCartTotal()
  });

  orders = [];
  orderPrices = [];

  saveBilan(); // ✅ AJOUT ICI

  updateCart();
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
  else showCrepePanini(); // 🔥 garde ton système intact
}

/* ================= CREPES ================= */

function showCrepePanini(){

  var html = "";
  html += "<h3>Nappage</h3><div class='row'>" + build(nappage) + "</div>";
  html += "<h3>Topping</h3><div class='row'>" + build(topping) + "</div>";
  html += "<h3>Options</h3><div class='row'>" + build(options) + "</div>";

  document.getElementById("dynamic").innerHTML = html;
}

/* ================= DATA ================= */

var nappage = [
["icon-nappage-nutella.png","Nutella"],
["icon-nappage-sucre.png","Sucre"],
["icon-nappage-chocolat.png","Chocolat"],
["icon-nappage-creme-de-marron.png","Crème de Marrons"],
["icon-nappage-fraise.png","Fraise"],
["icon-nappage-caramel.png","Caramel"]
];

var topping = [
["icon-topping-kinder-bueno.png","Kinder Bueno"],
["icon-topping-oreo.png","Oreo"],
["icon-topping-sprinkles.png","Sprinkles"],
["icon-topping-chantilly.png","Chantilly"],
["icon-topping-coco-rape.png","Coco Rapée"],
["icon-topping-speculos.png","Speculos"]
];

var options = [
["icon-options-boule-de-glace.png","Boule glace"],
["icon-options-banane.png","Banane"],
["icon-options-fraise.png","Fraise"],
["icon-options-myrtille.png","Myrtille"],
["icon-options-framboise.png","Framboise"],
["icon-options-pistache-concassees.png","Pistache Concassées"]
];

/* ================= BUILD ================= */

function build(list){

  var html = "";

  for(var i=0;i<list.length;i++){
    html += "<div class='card' onclick=\"toggle(this,'" + list[i][1] + "')\">";
    html += "<img src='" + list[i][0] + "'>";
    html += "<p>" + list[i][1] + "</p></div>";
  }

  return html;
}

/* ================= TOGGLE ================= */

function toggle(el,name){

  if(el.classList.contains("selected")){
    el.classList.remove("selected");
    total -= 1;

    currentOrder = currentOrder.filter(item => item !== name);

    if(name === "Boule glace") removeExtraParfums();

  } else {

    el.classList.add("selected");
    total += 1;
    currentOrder.push(name);

    if(name === "Boule glace") showExtraParfums();
  }

  updateTotal();
  updateCart();
}

/* ================= EXTRA PARFUM CREPE ================= */

function showExtraParfums(){

  if(document.getElementById("extraParfum")) return;

  var list = ["Chocolat","Fraise","Vanille","Menthe","Caramel","Noix de coco"];

  var html = "<div id='extraParfum'><h3>Parfum</h3><div class='row'>";

  list.forEach(name => {
    var img = "icon-parfum-glace-" + name.toLowerCase().replace(/ /g,"-") + ".png";

    html += "<div class='card' onclick=\"selectParfumCrepe(this,'" + name + "')\">";
    html += "<img src='" + img + "'><p>" + name + "</p></div>";
  });

  html += "</div></div>";

  document.getElementById("dynamic").innerHTML += html;
}

function removeExtraParfums(){
  var el = document.getElementById("extraParfum");
  if(el) el.remove();

  currentOrder = currentOrder.filter(item =>
    !["Chocolat","Fraise","Vanille","Menthe","Caramel","Noix de coco"].includes(item)
  );
}

function selectParfumCrepe(el,name){

  document.querySelectorAll("#extraParfum .card").forEach(c => c.classList.remove("selected"));

  el.classList.add("selected");

  var parfums = ["Chocolat","Fraise","Vanille","Menthe","Caramel","Noix de coco"];

  currentOrder = currentOrder.filter(item => !parfums.includes(item));

  currentOrder.push(name);

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
      <div class='card' onclick="chooseBoules(this,1,2.5)">
        <img src='icon-1-boule.png'><p>1 boule</p>
      </div>
      <div class='card' onclick="chooseBoules(this,2,4)">
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

  var html = "";
  html += "<h3>Parfums</h3><div class='row'>" + buildParfums() + "</div>";
  html += buildChantilly();

  document.getElementById("dynamic").innerHTML = html;
}

/* ================= PARFUM GLACE ================= */

function buildParfums(){

  var list = ["Chocolat","Fraise","Vanille","Menthe","Caramel","Noix de coco"];
  var html = "";

  list.forEach(name => {
    var img = "icon-parfum-glace-" + name.toLowerCase().replace(/ /g,"-") + ".png";

    html += "<div class='card' onclick=\"selectParfumGlace(this,'" + name + "')\">";
    html += "<img src='" + img + "'><p>" + name + "</p></div>";
  });

  return html;
}

function selectParfumGlace(el,name){

  if(el.classList.contains("selected")){
    el.classList.remove("selected");
    bouleCount--;
  } else {

    if(bouleCount >= bouleMax) return;

    el.classList.add("selected");
    bouleCount++;
    currentOrder.push(name);
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
      <div class='card' onclick="selectChantilly(this,'Non',0)">
        <img src='icon-chantilly-non.png'><p>Non</p>
      </div>
    </div>
  </div>`;
}

function selectChantilly(el, choix, prix){

  document.querySelectorAll("#chantillyBlock .card").forEach(c => c.classList.remove("selected"));
  el.classList.add("selected");

  // 🔥 On retire les anciennes valeurs
  currentOrder = currentOrder.filter(item =>
    item !== "Chantilly" && item !== "NoChantilly"
  );

  // 🔥 On ajoute un flag interne
  if(choix === "Oui"){
    currentOrder.push("Chantilly");
    total += 1;
  } else {
    currentOrder.push("NoChantilly"); // 👈 invisible pour l'utilisateur
  }

  updateTotal();
  updateCart();
}

/* ================= GLACE ================= */
/* (inchangé — ton code original fonctionne déjà) */

/* ================= NOUVEAUX MENUS ================= */

function buildSimple(list){
  var html = "<div class='center'>";
  list.forEach(item=>{
    html += `<div class="card" onclick="selectSimple('${item[1]}',${item[2]},this)">
    <img src="${item[0]}"><p>${item[1]}</p></div>`;
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
    ["icon-cocacola.png","Coca Cola",2],
    ["icon-cocacola-zero.png","Coca Zero",2],
    ["icon-vanta.png","Fanta",2],
    ["icon-sprite.png","Sprite",2],
    ["icon-icetea.png","Ice Tea",2],
    ["icon-eau.png","Eau",1]
  ]);
}

function showBoissonsChaudes(){
  document.getElementById("dynamic").innerHTML = buildSimple([
    ["icon-cafe.png","Café",2],
    ["icon-the.png","Thé",2],
    ["icon-chocolat-chaud.png","Chocolat chaud",2]
  ]);
}

/* GATEAU */
function showGateau(){
  document.getElementById("dynamic").innerHTML = buildSimple([
    ["icon-cookie.png","Cookie américain",2],
    ["icon-brownies.png","Brownies",2]
  ]);
}

/* SALE */
function showSale(){
  document.getElementById("dynamic").innerHTML = buildSimple([
    ["icon-panini-boeuf.png","Panini Boeuf",5],
    ["icon-panini-poulet.png","Panini Poulet",5],
    ["icon-panini-vegan.png","Panini Vegan",5]
  ]);
}

/* ================= BILAN ================= */

function renderBilan(){

  var html = "";

  dailyOrders.forEach((order, index)=>{

    html += "<div class='bilan-card'>";
    html += "<b>Commande #" + (index+1) + "</b><br>";
    html += order.date + " - " + order.time + "<br><br>";

    order.items.forEach((item,i)=>{
      html += "• " + item.join(", ");
      html += " — " + order.prices[i].toFixed(2) + "€<br>";
    });

    html += "<br><b>Total : " + order.total.toFixed(2) + "€</b>";
    html += "</div>";
  });

let stats = getStats();

html += "<div class='bilan-card'>";
html += "<h3>📊 Statistiques</h3>";

html += "Total du jour : <b>" + stats.total.toFixed(2) + "€</b><br>";
html += "Nombre de commandes : <b>" + stats.commandes + "</b><br><br>";

html += "<b>Produits vendus :</b><br>";

for(let p in stats.produits){
  html += "• " + p + " : " + stats.produits[p] + "<br>";
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

alert(window.jspdf);

  try {

    if(dailyOrders.length === 0){
      alert("Aucun bilan à exporter");
      return;
    }

    // ✅ Sécurité chargement jsPDF
    var jsPDFLib = window.jspdf && window.jspdf.jsPDF;
    if(!jsPDFLib){
      alert("Erreur : PDF non disponible");
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

        let text = "- " + visibleItems.join(", ");
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
    doc.text("TOTAL JOUR : " + totalJour.toFixed(2) + "€", 105, y, { align: "center" });

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

    /* ================= EXPORT SAFE ================= */

    // ✅ NE PAS utiliser blob / window.open (bug iPad PWA)
    doc.save("bilan.pdf");

  } catch(e) {

    console.error("Erreur export PDF :", e);
    alert("Erreur lors de la génération du PDF");

  }
}

function getStats(){

  let stats = {
    total: 0,
    commandes: dailyOrders.length,
    produits: {}
  };

  dailyOrders.forEach(order => {

    stats.total += order.total;

    order.items.forEach(item => {

      item.forEach(element => {

        // On ignore les éléments techniques
        if(element === "NoChantilly") return;

        if(!stats.produits[element]){
          stats.produits[element] = 0;
        }

        stats.produits[element]++;
      });

    });

  });

  return stats;
}

function saveBilan(){
  localStorage.setItem("dailyOrders", JSON.stringify(dailyOrders));
}