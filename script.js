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

  var selected = document.querySelectorAll(".selected");
  for(var i=0;i<selected.length;i++){
    selected[i].classList.remove("selected");
  }

  updateTotal();
  updateCart();
}

/* ================= ADD CART ================= */

function addToCart(){

  if(currentOrder.length === 0) return;

  orders.push(currentOrder.slice());
  orderPrices.push(total);

  currentOrder = [];
  total = 0;
  basePrice = 0;

  bouleMax = 0;
  bouleCount = 0;

  document.getElementById("dynamic").innerHTML = "";

  var selected = document.querySelectorAll(".selected");
  for(var i=0;i<selected.length;i++){
    selected[i].classList.remove("selected");
  }

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

  var selected = document.querySelectorAll(".selected");
  for(var i=0;i<selected.length;i++){
    selected[i].classList.remove("selected");
  }

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

    var newOrder = [];
    for(var i=0;i<currentOrder.length;i++){
      if(currentOrder[i] !== name){
        newOrder.push(currentOrder[i]);
      }
    }
    currentOrder = newOrder;

  } else {

    el.classList.add("selected");
    total += 1;

    currentOrder.push(name);

    if(name === "Boule glace"){
      showExtraParfums();
    }
  }

  updateTotal();
  updateCart();
}

/* ================= PARFUM CREPE ================= */

function showExtraParfums(){

  var old = document.getElementById("extraParfum");
  if(old) old.parentNode.removeChild(old);

  var list = ["Chocolat","Fraise","Vanille","Menthe","Caramel","Noix de coco"];
  var html = "<div id='extraParfum'><h3>Parfum</h3><div class='row'>";

  for(var i=0;i<list.length;i++){
    var name = list[i];
    var img = "icon-parfum-glace-" + name.toLowerCase().replace(/ /g,"-") + ".png";

    html += "<div class='card' onclick=\"selectParfumCrepe(this,'" + name + "')\">";
    html += "<img src='" + img + "'>";
    html += "<p>" + name + "</p></div>";
  }

  html += "</div></div>";

  document.getElementById("dynamic").innerHTML += html;
}

function selectParfumCrepe(el,name){

  var cards = document.querySelectorAll("#extraParfum .card");
  for(var i=0;i<cards.length;i++){
    cards[i].classList.remove("selected");
  }

  el.classList.add("selected");

  var parfums = ["Chocolat","Fraise","Vanille","Menthe","Caramel","Noix de coco"];

  var newOrder = [];
  for(var i=0;i<currentOrder.length;i++){
    if(parfums.indexOf(currentOrder[i]) === -1){
      newOrder.push(currentOrder[i]);
    }
  }

  currentOrder = newOrder;
  currentOrder.push(name);

  updateCart();
}

/* ================= GLACE ================= */

function showGlaceStep1(){

  var html = "";
  html += "<div class='two'>";
  html += "<div class='card' onclick=\"selectType(this,'Pot')\"><img src='icon-pot.png'><p>Pot</p></div>";
  html += "<div class='card' onclick=\"selectType(this,'Cornet')\"><img src='icon-cornet.png'><p>Cornet</p></div>";
  html += "</div>";

  document.getElementById("dynamic").innerHTML = html;
}

function selectType(el,name){
  currentOrder.push(name);
  showGlaceStep2();
}

function showGlaceStep2(){

  var html = "";
  html += "<div class='three'>";
  html += "<div class='card' onclick=\"chooseBoules(this,1,2.5)\"><img src='icon-1-boule.png'><p>1 boule</p></div>";
  html += "<div class='card' onclick=\"chooseBoules(this,2,4)\"><img src='icon-2-boules.png'><p>2 boules</p></div>";
  html += "<div class='card' onclick=\"chooseBoules(this,3,5)\"><img src='icon-3-boules.png'><p>3 boules</p></div>";
  html += "</div>";

  document.getElementById("dynamic").innerHTML = html;
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

  document.getElementById("dynamic").innerHTML = html;
}

/* ================= PARFUM GLACE ================= */

function buildParfums(){

  var list = ["Chocolat","Fraise","Vanille","Menthe","Caramel","Noix de coco"];
  var html = "";

  for(var i=0;i<list.length;i++){
    var name = list[i];
    var img = "icon-parfum-glace-" + name.toLowerCase().replace(/ /g,"-") + ".png";

    html += "<div class='card' onclick=\"selectParfumGlace(this,'" + name + "')\">";
    html += "<img src='" + img + "'>";
    html += "<p>" + name + "</p></div>";
  }

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