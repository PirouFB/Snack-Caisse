let total = 0;
let basePrice = 0;

let currentOrder = [];
let orders = [];
let orderPrices = []; // 🔥 IMPORTANT

let bouleMax = 0;
let bouleCount = 0;

/* ================= TOTAL ================= */

function updateTotal(){
  document.getElementById("total").innerText = total.toFixed(2) + "€";
}

function getCartTotal(){
  return orderPrices.reduce((a,b)=>a+b,0);
}

/* ================= CART ================= */

function updateCart(){

  document.getElementById("cart").innerHTML =
    orders.map((o,i)=>`
      <div onclick="removeOrder(${i})" style="
        cursor:pointer;
        margin:5px;
        padding:6px;
        background:#ffe3e6;
        border-radius:8px;
        font-size:14px;
      ">
        ❌ #${i+1} : ${o.join(", ")}
        <b> — ${orderPrices[i].toFixed(2)}€</b>
      </div>
    `).join("")
    +
    `
    <div style="
      margin-top:10px;
      font-weight:bold;
      font-size:16px;
    ">
      Total panier : ${getCartTotal().toFixed(2)}€
    </div>
    `;
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
  document.querySelectorAll(".selected").forEach(e=>e.classList.remove("selected"));

  updateTotal();
  updateCart();
}

/* ================= ADD CART ================= */

function addToCart(){

  if(currentOrder.length === 0) return;

  orders.push([...currentOrder]);
  orderPrices.push(total); // 🔥 sauvegarde prix

  currentOrder = [];
  total = 0;
  basePrice = 0;

  bouleMax = 0;
  bouleCount = 0;

  document.getElementById("dynamic").innerHTML = "";
  document.querySelectorAll(".selected").forEach(e=>e.classList.remove("selected"));

  updateTotal();
  updateCart();
}

/* ================= REMOVE ================= */

function removeOrder(index){

  orders.splice(index, 1);
  orderPrices.splice(index, 1);

  updateCart();
}

/* ================= MAIN ================= */

function selectMain(name, price, el){

  document.querySelectorAll(".selected").forEach(e=>e.classList.remove("selected"));
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

  document.getElementById("dynamic").innerHTML = `
    <h3>Nappage</h3>
    <div class="row">${build(nappage)}</div>

    <h3>Topping</h3>
    <div class="row">${build(topping)}</div>

    <h3>Options</h3>
    <div class="row">${build(options)}</div>
  `;
}

/* ================= DATA ================= */

const nappage = [
["icon-nappage-nutella.png","Nutella"],
["icon-nappage-sucre.png","Sucre"],
["icon-nappage-chocolat.png","Chocolat"],
["icon-nappage-creme-de-marron.png","Crème"],
["icon-nappage-fraise.png","Fraise"],
["icon-nappage-caramel.png","Caramel"]
];

const topping = [
["icon-topping-kinder-bueno.png","Kinder"],
["icon-topping-oreo.png","Oreo"],
["icon-topping-sprinkles.png","Sprinkles"],
["icon-topping-chantilly.png","Chantilly"],
["icon-topping-coco-rape.png","Coco"],
["icon-topping-speculos.png","Speculos"]
];

const options = [
["icon-options-boule-de-glace.png","Boule glace"],
["icon-options-banane.png","Banane"],
["icon-options-fraise.png","Fraise"],
["icon-options-myrtille.png","Myrtille"],
["icon-options-framboise.png","Framboise"],
["icon-options-pistache-concassees.png","Pistache"]
];

/* ================= BUILD ================= */

function build(list){
  return list.map(([img,name])=>`
    <div class="card" onclick="toggle(this,'${name}')">
      <img src="${img}">
      <p>${name}</p>
    </div>
  `).join("");
}

/* ================= TOGGLE ================= */

function toggle(el,name){

  if(el.classList.contains("selected")){
    el.classList.remove("selected");
    currentOrder = currentOrder.filter(i=>i!==name);
    total -= 1;
  } else {
    el.classList.add("selected");
    currentOrder.push(name);
    total += 1;

    if(name === "Boule glace"){
      showExtraParfums();
    }
  }

  updateTotal();
  updateCart();
}

/* ================= GLACE FLOW ================= */

function showGlaceStep1(){

  document.getElementById("dynamic").innerHTML = `
    <div class="two">
      <div class="card" onclick="selectType(this,'Pot')">
        <img src="icon-pot.png">
        <p>Pot</p>
      </div>
      <div class="card" onclick="selectType(this,'Cornet')">
        <img src="icon-cornet.png">
        <p>Cornet</p>
      </div>
    </div>
  `;
}

function selectType(el,name){

  document.querySelectorAll(".selected").forEach(e=>e.classList.remove("selected"));
  el.classList.add("selected");

  currentOrder.push(name);

  updateCart();
  showGlaceStep2();
}

function showGlaceStep2(){

  document.getElementById("dynamic").innerHTML = `
    <div class="three">
      <div class="card" onclick="chooseBoules(this,1,2.5)">
        <img src="icon-1-boule.png">
        <p>1 boule</p>
      </div>
      <div class="card" onclick="chooseBoules(this,2,4)">
        <img src="icon-2-boules.png">
        <p>2 boules</p>
      </div>
      <div class="card" onclick="chooseBoules(this,3,5)">
        <img src="icon-3-boules.png">
        <p>3 boules</p>
      </div>
    </div>
  `;
}

function chooseBoules(el,nb,price){

  document.querySelectorAll(".selected").forEach(e=>e.classList.remove("selected"));
  el.classList.add("selected");

  bouleMax = nb;
  bouleCount = 0;

  total = price;

  currentOrder = currentOrder.filter(i => !i.includes("boule"));
  currentOrder.push(nb + " boules");

  updateTotal();
  updateCart();

  showParfums();
}

/* ================= PARFUMS ================= */

function showParfums(){

  let old = document.getElementById("parfumsBlock");
  if(old) old.remove();

  const div = document.createElement("div");
  div.id = "parfumsBlock";

  div.innerHTML = `
    <h3>Parfums</h3>
    <div class="row">${buildParfums(true)}</div>
  `;

  document.getElementById("dynamic").appendChild(div);
}

function showExtraParfums(){

  let old = document.getElementById("extraParfum");
  if(old) old.remove();

  const div = document.createElement("div");
  div.id = "extraParfum";

  div.innerHTML = `
    <h3>Parfum (option)</h3>
    <div class="row">${buildParfums(false)}</div>
  `;

  document.getElementById("dynamic").appendChild(div);
}

function buildParfums(limit){

  const list = ["Chocolat","Fraise","Vanille","Menthe","Caramel","Noix de coco"];

  return list.map(name=>`
    <div class="card" onclick="selectParfum(this,'${name}',${limit})">
      <img src="icon-parfum-glace-${name.toLowerCase().replace(/ /g,'-')}.png">
      <p>${name}</p>
    </div>
  `).join("");
}

/* ================= PARFUM FIX ================= */

function selectParfum(el,name,limit){

  if(limit){
    if(el.classList.contains("selected")){
      el.classList.remove("selected");
      bouleCount--;
      currentOrder = currentOrder.filter(i=>i!==name);
    } else {
      if(bouleCount >= bouleMax) return;
      el.classList.add("selected");
      bouleCount++;
      currentOrder.push(name);
    }
  } else {

    const parfums = ["Chocolat","Fraise","Vanille","Menthe","Caramel","Noix de coco"];

    currentOrder = currentOrder.filter(i => !parfums.includes(i));

    document.querySelectorAll("#extraParfum .card").forEach(e=>e.classList.remove("selected"));

    el.classList.add("selected");
    currentOrder.push(name);
  }

  updateCart();
}