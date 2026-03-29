var total = 0;
var basePrice = 0;

var currentOrder = [];
var orders = [];
var orderPrices = [];

var bouleMax = 0;
var bouleCount = 0;

/* ================= TOTAL ================= */

function updateTotal(){
  document.getElementById("total").innerHTML = total.toFixed(2) + "€";
}

function getCartTotal(){
  var sum = 0;
  for(var i=0;i<orderPrices.length;i++){
    sum += orderPrices[i];
  }
  return sum;
}

/* ================= CART ================= */

function updateCart(){

  var html = "";

  for(var i=0;i<orders.length;i++){
    html += '<div onclick="removeOrder('+i+')" style="cursor:pointer;margin:5px;padding:6px;background:#ffe3e6;border-radius:8px;font-size:14px;">';
    html += '❌ #' + (i+1) + ' : ' + orders[i].join(", ");
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

  // vérification chantilly pour glace
  if(currentOrder.includes("Pot") || currentOrder.includes("Cornet")){
    var hasChantilly = currentOrder.includes("Chantilly Oui") || currentOrder.includes("Chantilly Non");
    if(!hasChantilly){
      alert("Choisissez la crème fouettée !");
      return;
    }
  }

  // ✅ on ajoute au panier
  orders.push(currentOrder.slice());
  orderPrices.push(total);

  // ✅ reset UNIQUEMENT la commande en cours
  currentOrder = [];
  total = 0;
  basePrice = 0;
  bouleMax = 0;
  bouleCount = 0;

  document.getElementById("dynamic").innerHTML = "";

  document.querySelectorAll(".selected").forEach(el => el.classList.remove("selected"));

  // ✅ IMPORTANT : on met à jour après ajout
  updateTotal();
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

  // reset visuel
  var cards = document.querySelectorAll("#extraParfum .card");
  for(var i=0;i<cards.length;i++){
    cards[i].classList.remove("selected");
  }

  el.classList.add("selected");

  // retirer anciens parfums
  var parfums = ["Chocolat","Fraise","Vanille","Menthe","Caramel","Noix de coco"];

  currentOrder = currentOrder.filter(item => !parfums.includes(item));

  // ajouter nouveau parfum
  currentOrder.push(name);

  updateCart();
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
    <div class='three'>
      <div class='card' onclick="chooseBoules(this,1,2.5)"><img src='icon-1-boule.png'><p>1 boule</p></div>
      <div class='card' onclick="chooseBoules(this,2,4)"><img src='icon-2-boules.png'><p>2 boules</p></div>
      <div class='card' onclick="chooseBoules(this,3,5)"><img src='icon-3-boules.png'><p>3 boules</p></div>
    </div>`;
}

function chooseBoules(el,nb,price){

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

  var hadOui = currentOrder.includes("Chantilly Oui");

  currentOrder = currentOrder.filter(item =>
    item !== "Chantilly Oui" && item !== "Chantilly Non"
  );

  if(hadOui) total -= 1;

  total += prix;

  currentOrder.push("Chantilly " + choix);

  updateTotal();
  updateCart();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./service-worker.js')
      .then(function(reg){
        console.log("Service Worker OK", reg);
      })
      .catch(function(err){
        console.log("Erreur Service Worker :", err);
      });
  });
}

