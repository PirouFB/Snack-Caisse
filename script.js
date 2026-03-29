var total = 0;
var currentOrder = [];
var orders = [];
var orderPrices = [];

var bouleMax = 0;
var bouleCount = 0;

/* TOTAL */

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

/* CART */

function updateCart(){

  var html = "";

  for(var i=0;i<orders.length;i++){
    html += '<div onclick="removeOrder('+i+')">❌ #' + (i+1) + ' : ' + orders[i].join(", ");
    html += ' <b>(' + orderPrices[i].toFixed(2) + '€)</b></div>';
  }

  html += '<div><b>Total : ' + getCartTotal().toFixed(2) + '€</b></div>';

  document.getElementById("cart").innerHTML = html;
}

/* RESET */

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

/* ADD */

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

/* MAIN */

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

/* CREPES */

function showCrepePanini(){

  var html = "<h3>Nappage</h3><div class='row'>" + build(nappage) + "</div>";
  html += "<h3>Topping</h3><div class='row'>" + build(topping) + "</div>";
  html += "<h3>Options</h3><div class='row'>" + build(options) + "</div>";

  document.getElementById("dynamic").innerHTML = html;
}

/* DATA */

var nappage = [["icon-nappage-nutella.png","Nutella"]];
var topping = [["icon-topping-oreo.png","Oreo"]];
var options = [["icon-options-boule-de-glace.png","Boule glace"]];

/* BUILD */

function build(list){

  var html = "";

  for(var i=0;i<list.length;i++){
    html += "<div class='card' onclick=\"toggle(this,'" + list[i][1] + "')\">";
    html += "<p>" + list[i][1] + "</p></div>";
  }

  return html;
}

/* TOGGLE */

function toggle(el,name){

  el.classList.toggle("selected");
  currentOrder.push(name);

  if(name === "Boule glace"){
    showExtraParfums();
  }
}

/* PARFUM CREPE */

function showExtraParfums(){
  document.getElementById("dynamic").innerHTML += "<h3>Parfum</h3><p>Choix parfum OK</p>";
}

/* GLACE */

function showGlaceStep1(){
  document.getElementById("dynamic").innerHTML =
    "<div class='two'>" +
    "<div class='card' onclick=\"selectType(this,'Pot')\"><p>Pot</p></div>" +
    "<div class='card' onclick=\"selectType(this,'Cornet')\"><p>Cornet</p></div>" +
    "</div>";
}

function selectType(el,name){
  currentOrder.push(name);
  showGlaceStep2();
}

function showGlaceStep2(){
  document.getElementById("dynamic").innerHTML =
    "<div class='three'>" +
    "<div class='card' onclick=\"chooseBoules(this,1,2.5)\"><p>1 boule</p></div>" +
    "<div class='card' onclick=\"chooseBoules(this,2,4)\"><p>2 boules</p></div>" +
    "<div class='card' onclick=\"chooseBoules(this,3,5)\"><p>3 boules</p></div>" +
    "</div>";
}

function chooseBoules(el,nb,price){

  total = price;
  bouleMax = nb;
  bouleCount = 0;

  updateTotal();

  setTimeout(function(){
    showParfums();
  },10);
}

/* PARFUM GLACE + CHANTILLY */

function showParfums(){

  var html = "<h3>Parfums</h3><p>Choix parfum affiché</p>";
  html += "<h3>Chantilly</h3><p>OUI / NON</p>";

  document.getElementById("dynamic").innerHTML += html;
}