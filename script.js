var total = 0;
var currentOrder = [];

// 🛒 PANIER
var cart = [];
var cartPrices = [];

// 📦 HISTORIQUE (NOUVEAU FORMAT)
var orders = [];

var bouleMax = 0;
var bouleCount = 0;

/* ================= LOAD ================= */

window.onload = function(){

  var saved = localStorage.getItem("orders");
  if(saved) orders = JSON.parse(saved);

  updateCartDisplay();
};

/* ================= MENU ================= */

function toggleMenu(){
  var menu = document.getElementById("sideMenu");
  menu.style.left = (menu.style.left === "0px") ? "-250px" : "0px";
}

function showPage(page){

  document.getElementById("sideMenu").style.left = "-250px";

  var caisse = document.getElementById("caissePage");
  var historique = document.getElementById("historiquePage");

  if(page === "caisse"){
    caisse.style.display = "flex";
    historique.style.display = "none";
  }

  if(page === "historique"){
    caisse.style.display = "none";
    historique.style.display = "flex";
    updateHistorique();
  }
}

/* ================= TOTAL ================= */

function updateTotal(){
  document.getElementById("total").innerHTML = total.toFixed(2) + "€";
}

/* ================= PANIER ================= */

function updateCartDisplay(){

  var html = "<b>🛒 Panier</b>";

  cart.forEach((cmd,i)=>{
    html += "<div onclick='removeFromCart("+i+")' style='cursor:pointer;margin:5px;padding:6px;background:#ffe3e6;border-radius:8px;'>";
    html += "❌ #" + (i+1) + " : " + cmd.join(", ") + " — " + cartPrices[i].toFixed(2) + "€";
    html += "</div>";
  });

  document.getElementById("cart").innerHTML = html;
}

function removeFromCart(index){
  if(!confirm("Supprimer ?")) return;

  cart.splice(index,1);
  cartPrices.splice(index,1);

  updateCartDisplay();
}

/* ================= AJOUT PANIER ================= */

function addToCart(){

  if(currentOrder.length === 0) return;

  cart.push(currentOrder.slice());
  cartPrices.push(total);

  currentOrder = [];
  total = 0;

  document.getElementById("dynamic").innerHTML = "";
  document.querySelectorAll(".selected").forEach(el => el.classList.remove("selected"));

  updateTotal();
  updateCartDisplay();
}

/* ================= VALIDATION ================= */

function validerCommande(){

  if(cart.length === 0){
    alert("Panier vide !");
    return;
  }

  cart.forEach((cmd,i)=>{

    var now = new Date();

    orders.push({
      items: cmd,
      price: cartPrices[i],
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString()
    });

  });

  localStorage.setItem("orders", JSON.stringify(orders));

  cart = [];
  cartPrices = [];

  updateCartDisplay();

  alert("Commande validée ✅");
}

/* ================= HISTORIQUE ================= */

function updateHistorique(){

  var html = "";

  if(orders.length === 0){
    html = "<p>Aucune commande</p>";
  }

  orders.forEach((o,i)=>{

    html += "<div style='margin:15px;padding:15px;background:#ffe3e6;border-radius:12px'>";

    html += "<b>Commande #" + (i+1) + "</b><br>";
    html += "<small>" + o.date + " - " + o.time + "</small><br><br>";

    html += o.items.join(", ");

    html += "<br><br><b>" + o.price.toFixed(2) + "€</b>";

    html += "</div>";
  });

  var totalJour = orders.reduce((sum,o)=>sum+o.price,0);

  html += "<hr><h3>Total : " + totalJour.toFixed(2) + "€</h3>";

  document.getElementById("historiqueContent").innerHTML = html;
}

/* ================= RESET ================= */

function resetJournee(){
  if(!confirm("Remettre à zéro ?")) return;

  localStorage.clear();
  orders = [];

  updateHistorique();
}

/* ================= MAIN ================= */

function selectMain(name, price, el){

  document.querySelectorAll(".selected").forEach(e => e.classList.remove("selected"));

  el.classList.add("selected");

  total = price;
  currentOrder = [name];

  updateTotal();

  if(name === "Glace") showGlaceStep1();
  else showCrepePanini();
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

  list.forEach(item=>{
    html += `<div class='card' onclick="toggle(this,'${item[1]}')">
      <img src='${item[0]}'><p>${item[1]}</p></div>`;
  });

  return html;
}

/* ================= TOGGLE ================= */

function toggle(el,name){

  if(el.classList.contains("selected")){
    el.classList.remove("selected");
    total -= 1;
    currentOrder = currentOrder.filter(item => item !== name);
  } else {
    el.classList.add("selected");
    total += 1;
    currentOrder.push(name);
  }

  updateTotal();
}

/* ================= GLACE ================= */

function showGlaceStep1(){

  document.getElementById("dynamic").innerHTML = `
    <div class='two'>
      <div class='card' onclick="selectType(this,'Pot')"><img src='icon-pot.png'><p>Pot</p></div>
      <div class='card' onclick="selectType(this,'Cornet')"><img src='icon-cornet.png'><p>Cornet</p></div>
    </div>`;
}

function selectType(el,name){
  currentOrder.push(name);
  showGlaceStep2();
}

function showGlaceStep2(){

  document.getElementById("dynamic").innerHTML = `
    <div class='two'>
      <div class='card' onclick="chooseBoules(this,1,2.5)"><img src='icon-1-boule.png'><p>1 boule</p></div>
      <div class='card' onclick="chooseBoules(this,2,4)"><img src='icon-2-boules.png'><p>2 boules</p></div>
    </div>`;
}

function chooseBoules(el,nb,price){

  total = price;
  bouleMax = nb;
  bouleCount = 0;

  currentOrder.push(nb + " boules");

  updateTotal();
  showGlaceFinal();
}

function showGlaceFinal(){

  var html = "";
  html += "<h3>Parfums</h3><div class='row'>";

  var list = ["Chocolat","Fraise","Vanille","Menthe","Caramel","Noix de coco"];

  list.forEach(name => {
    var img = "icon-parfum-glace-" + name.toLowerCase().replace(/ /g,"-") + ".png";

    html += `<div class='card' onclick="selectParfumGlace(this,'${name}')">
      <img src='${img}'><p>${name}</p></div>`;
  });

  html += "</div>";
  html += buildChantilly();

  document.getElementById("dynamic").innerHTML = html;
}

function selectParfumGlace(el,name){

  if(el.classList.contains("selected")){
    el.classList.remove("selected");
    bouleCount--;
    currentOrder = currentOrder.filter(item => item !== name);
  } else {

    if(bouleCount >= bouleMax) return;

    el.classList.add("selected");
    bouleCount++;
    currentOrder.push(name);
  }
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

  currentOrder = currentOrder.filter(item => item !== "Chantilly");

  if(choix === "Oui"){
    currentOrder.push("Chantilly");
    total += prix;
  }

  updateTotal();
}