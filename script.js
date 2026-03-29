var total = 0;
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
    html += '<div onclick="removeOrder('+i+')">❌ #' + (i+1) + ' : ' + orders[i].join(", ");
    html += ' <b>(' + orderPrices[i].toFixed(2) + '€)</b></div>';
  }

  html += '<div><b>Total : ' + getCartTotal().toFixed(2) + '€</b></div>';

  document.getElementById("cart").innerHTML = html;
}

/* ================= RESET ================= */

function resetAll(){
  total = 0;
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

/* ================= ADD ================= */

function addToCart(){

  if(currentOrder.length === 0) return;

  orders.push(currentOrder.slice());
  orderPrices.push(total);

  currentOrder = [];
  total = 0;

  document.getElementById("dynamic").innerHTML = "";

  updateTotal();
  updateCart();
}

/* ================= MAIN ================= */

function selectMain(name, price, el){

  var selected = document.querySelectorAll(".selected");
  for(var i=0;i<selected.length;i++){
    selected[i].classList.remove("selected");
  }

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
  html += "<h3>Options</h3>";
  html += "<div class='row'>";
  html += "<div class='card' onclick=\"toggle(this,'Boule glace')\"><p>Boule glace</p></div>";
  html += "</div>";

  document.getElementById("dynamic").innerHTML = html;
}

function toggle(el,name){

  el.classList.toggle("selected");

  if(name === "Boule glace"){
    showExtraParfums();
  }
}

function showExtraParfums(){
  var html = "<h3>Parfum</h3>";
  html += "<p>Choix parfum OK</p>";

  document.getElementById("dynamic").innerHTML += html;
}

/* ================= GLACE ================= */

function showGlaceStep1(){

  var html = "";
  html += "<div class='two'>";
  html += "<div class='card' onclick=\"selectType(this,'Pot')\"><p>Pot</p></div>";
  html += "<div class='card' onclick=\"selectType(this,'Cornet')\"><p>Cornet</p></div>";
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
  html += "<div class='card' onclick=\"chooseBoules(this,1,2.5)\"><p>1 boule</p></div>";
  html += "<div class='card' onclick=\"chooseBoules(this,2,4)\"><p>2 boules</p></div>";
  html += "<div class='card' onclick=\"chooseBoules(this,3,5)\"><p>3 boules</p></div>";
  html += "</div>";

  document.getElementById("dynamic").innerHTML = html;
}

/* ================= FIX FINAL ================= */

function chooseBoules(el,nb,price){

  total = price;
  bouleMax = nb;
  bouleCount = 0;

  currentOrder.push(nb + " boules");

  updateTotal();
  updateCart();

  showGlaceFinal(); // 🔥 IMPORTANT
}

/* ================= AFFICHAGE FINAL ================= */

function showGlaceFinal(){

  var html = "";

  // PARFUMS
  html += "<h3>Parfums</h3><div class='row'>";

  var list = ["Chocolat","Fraise","Vanille","Menthe","Caramel","Noix de coco"];

  for(var i=0;i<list.length;i++){
    var name = list[i];
    var img = "icon-parfum-glace-" + name.toLowerCase().replace(/ /g,"-") + ".png";

    html += "<div class='card' onclick=\"selectParfumGlace(this,'" + name + "')\">";
    html += "<img src='" + img + "'>";
    html += "<p>" + name + "</p></div>";
  }

  html += "</div>";

  // CHANTILLY
  html += "<h3>Chantilly</h3>";
  html += "<div class='two'>";
  html += "<div class='card' onclick=\"selectChantilly(this,'OUI')\"><p>OUI</p></div>";
  html += "<div class='card' onclick=\"selectChantilly(this,'NON')\"><p>NON</p></div>";
  html += "</div>";

  document.getElementById("dynamic").innerHTML = html;
}

/* ================= ACTIONS ================= */

function selectParfumGlace(el,name){

  if(el.classList.contains("selected")){
    el.classList.remove("selected");
    bouleCount--;
  } else {
    if(bouleCount >= bouleMax) return;
    el.classList.add("selected");
    bouleCount++;
  }

  updateCart();
}

function selectChantilly(el,choice){

  var cards = document.querySelectorAll(".two .card");
  for(var i=0;i<cards.length;i++){
    cards[i].classList.remove("selected");
  }

  el.classList.add("selected");

  if(choice === "OUI"){
    total += 1;
  }

  updateTotal();
}