// ================= VARIABLES =================
var total = 0;
var currentOrder = [];
var orders = [];
var orderPrices = [];
var dailyOrders = [];

var bouleMax = 0;
var bouleCount = 0;

// ================= TOTAL =================
function updateTotal(){
  document.getElementById("total").innerHTML = total.toFixed(2) + "€";
}

function getCartTotal(){
  return orderPrices.reduce((a,b)=>a+b,0);
}

// ================= MENU =================
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

// ================= CART =================
function updateCart(){
  var html = "";

  orders.forEach((o,i)=>{
    html += `❌ #${i+1} : ${o.join(", ")} — <b>${orderPrices[i]}€</b><br>`;
  });

  html += `<b>Total panier : ${getCartTotal()}€</b>`;
  document.getElementById("cart").innerHTML = html;
}

// ================= RESET =================
function resetAll(){
  total = 0;
  currentOrder = [];
  orders = [];
  orderPrices = [];
  document.getElementById("dynamic").innerHTML = "";
  updateTotal();
  updateCart();
}

// ================= ADD =================
function addToCart(){
  if(currentOrder.length === 0) return;
  orders.push([...currentOrder]);
  orderPrices.push(total);
  currentOrder = [];
  total = 0;
  updateTotal();
  updateCart();
}

// ================= VALIDER =================
function validateCart(){
  if(orders.length === 0) return;

  dailyOrders.push({
    date:new Date().toLocaleString(),
    items:[...orders],
    prices:[...orderPrices],
    total:getCartTotal()
  });

  orders = [];
  orderPrices = [];
  updateCart();
}

// ================= MAIN =================
function selectMain(name, price){
  total = price;
  currentOrder = [name];
  updateTotal();

  if(name==="Boissons") showBoissons();
  else if(name==="Gateau") showGateau();
  else if(name==="Sale") showSale();
}

// ================= SIMPLE =================
function buildSimple(list){
  var html = "<div class='row'>";
  list.forEach(i=>{
    html+=`<div class="card" onclick="selectSimple('${i[1]}',${i[2]})">
    <img src="${i[0]}"><p>${i[1]}<br>${i[2]}€</p></div>`;
  });
  html+="</div>";
  return html;
}

function selectSimple(name,price){
  total = price;
  currentOrder=[name];
  updateTotal();
}

// ================= BOISSONS =================
function showBoissons(){
  document.getElementById("dynamic").innerHTML=`
  <div class="two">
    <div class="card" onclick="showBoissonsFroides()">Froides</div>
    <div class="card" onclick="showBoissonsChaudes()">Chaudes</div>
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

// ================= GATEAU =================
function showGateau(){
  document.getElementById("dynamic").innerHTML = buildSimple([
    ["icon-cookie.png","Cookie américain",2],
    ["icon-brownies.png","Brownies",2]
  ]);
}

// ================= SALE =================
function showSale(){
  document.getElementById("dynamic").innerHTML = buildSimple([
    ["icon-panini-boeuf.png","Panini Boeuf",5],
    ["icon-panini-poulet.png","Panini Poulet",5],
    ["icon-panini-vegan.png","Panini Vegan",5]
  ]);
}

// ================= BILAN =================
function renderBilan(){
  var html="";
  dailyOrders.forEach((o,i)=>{
    html+=`<div class="bilan-card">
    <b>Commande ${i+1}</b><br>${o.date}<br>`;
    o.items.forEach((it,j)=>{
      html+=`• ${it.join(", ")} — ${o.prices[j]}€<br>`;
    });
    html+=`<b>Total ${o.total}€</b></div>`;
  });
  document.getElementById("bilan").innerHTML=html;
}

// ================= FIN =================
function endDay(){
  if(!confirm("Effacer ?")) return;
  dailyOrders=[];
  renderBilan();
}