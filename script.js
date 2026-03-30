/* ================= VARIABLES ================= */

let total = 0;
let currentOrder = [];
let currentMain = "";

let cart = [];
let cartTotal = 0;

let bouleMax = 1;
let bouleCount = 0;

/* ================= TOTAL ================= */

function updateTotal(){
  document.getElementById("total").innerText = total.toFixed(2) + "€";
}

/* ================= MAIN ================= */

function selectMain(name, price, el){

  document.querySelectorAll(".big").forEach(e=>e.classList.remove("selected"));
  el.classList.add("selected");

  currentMain = name;
  currentOrder = [name];
  total = price;

  updateTotal();

  if(name === "Glace") showGlaceStep1();
  else if(name === "Boissons") showBoissonStep1();
  else showCrepePanini();
}

/* ================= BOISSONS ================= */

function showBoissonStep1(){
  document.getElementById("dynamic").innerHTML = `
    <div class='two'>
      <div class='card' onclick="selectBoissonType(this,'Boisson froide')">
        <img src='icon-boisson-froide.png'><p>Boisson froide</p>
      </div>
      <div class='card' onclick="selectBoissonType(this,'Boisson chaude')">
        <img src='icon-boisson-chaude.png'><p>Boisson chaude</p>
      </div>
    </div>
  `;
}

function selectBoissonType(el, type){

  document.querySelectorAll(".two .card").forEach(c=>c.classList.remove("selected"));
  el.classList.add("selected");

  currentOrder = [currentMain, type];

  if(type === "Boisson froide") showBoissonsFroides();
  else showBoissonsChaudes();
}

const boissonsFroides = [
["icon-coca.png","Coca"],
["icon-ice-tea.png","Ice Tea"],
["icon-oasis.png","Oasis"],
["icon-eau.png","Eau"]
];

const boissonsChaudes = [
["icon-cafe.png","Café"],
["icon-chocolat-chaud.png","Chocolat chaud"],
["icon-the.png","Thé"]
];

function showBoissonsFroides(){
  document.getElementById("dynamic").innerHTML += `
    <h3>Boissons froides</h3>
    <div class='row'>${buildBoisson(boissonsFroides)}</div>
  `;
}

function showBoissonsChaudes(){
  document.getElementById("dynamic").innerHTML += `
    <h3>Boissons chaudes</h3>
    <div class='row'>${buildBoisson(boissonsChaudes)}</div>
  `;
}

function buildBoisson(list){
  return list.map(i=>`
    <div class='card' onclick="selectBoisson(this,'${i[1]}')">
      <img src='${i[0]}'><p>${i[1]}</p>
    </div>
  `).join("");
}

function selectBoisson(el, name){

  document.querySelectorAll(".row .card").forEach(c=>c.classList.remove("selected"));
  el.classList.add("selected");

  currentOrder = [currentMain, currentOrder[1], name];

  total = 2;
  updateTotal();
}

/* ================= CREPES / PANINI ================= */

function showCrepePanini(){

  let html = "";
  html += "<h3>Nappage</h3><div class='row'>" + build(nappage) + "</div>";
  html += "<h3>Topping</h3><div class='row'>" + build(topping) + "</div>";
  html += "<h3>Options</h3><div class='row'>" + build(options) + "</div>";

  document.getElementById("dynamic").innerHTML = html;
}

/* ================= DATA ================= */

const nappage = [
["icon-nappage-nutella.png","Nutella"],
["icon-nappage-sucre.png","Sucre"],
["icon-nappage-chocolat.png","Chocolat"],
["icon-nappage-creme-de-marron.png","Crème de Marrons"],
["icon-nappage-fraise.png","Fraise"],
["icon-nappage-caramel.png","Caramel"]
];

const topping = [
["icon-topping-kinder-bueno.png","Kinder Bueno"],
["icon-topping-oreo.png","Oreo"],
["icon-topping-sprinkles.png","Sprinkles"],
["icon-topping-chantilly.png","Chantilly"],
["icon-topping-coco-rape.png","Coco Rapée"],
["icon-topping-speculos.png","Speculos"]
];

const options = [
["icon-options-boule-de-glace.png","Boule glace"],
["icon-options-banane.png","Banane"],
["icon-options-fraise.png","Fraise"],
["icon-options-myrtille.png","Myrtille"],
["icon-options-framboise.png","Framboise"],
["icon-options-pistache-concassees.png","Pistache Concassées"]
];

/* ================= BUILD ================= */

function build(list){
  return list.map(i=>`
    <div class='card' onclick="toggle(this,'${i[1]}')">
      <img src='${i[0]}'><p>${i[1]}</p>
    </div>
  `).join("");
}

/* ================= TOGGLE ================= */

function toggle(el, name){

  if(el.classList.contains("selected")){
    el.classList.remove("selected");
    total -= 1;
    currentOrder = currentOrder.filter(i=>i!==name);
  } else {
    el.classList.add("selected");
    total += 1;
    currentOrder.push(name);

    if(name === "Boule glace"){
      bouleMax = 1;
      bouleCount = 0;
      showParfums(false);
    }
  }

  updateTotal();
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
    </div>
  `;
}

function selectType(el, name){
  document.querySelectorAll(".two .card").forEach(c=>c.classList.remove("selected"));
  el.classList.add("selected");

  currentOrder.push(name);
  showGlaceStep2();
}

function showGlaceStep2(){
  document.getElementById("dynamic").innerHTML = `
    <div id="bouleBlock" class='two'>
      <div class='card' onclick="selectBoules(this,1,2.5)">
        <img src='icon-1-boule.png'><p>1 boule</p>
      </div>
      <div class='card' onclick="selectBoules(this,2,4)">
        <img src='icon-2-boules.png'><p>2 boules</p>
      </div>
    </div>
  `;
}

function selectBoules(el, nb, price){

  document.querySelectorAll("#bouleBlock .card").forEach(c=>c.classList.remove("selected"));
  el.classList.add("selected");

  bouleMax = nb;
  bouleCount = 0;

  total = price;
  currentOrder = [currentMain, nb + " boule" + (nb > 1 ? "s" : "")];

  updateTotal();

  showParfums(true);
}

/* ================= PARFUMS ================= */

const parfums = ["Chocolat","Fraise","Vanille","Menthe","Caramel","Noix de coco"];

function showParfums(isGlace){

  let html = "<div id='parfumBlock'><h3>Parfums ("+bouleCount+"/"+bouleMax+")</h3><div class='row'>";

  parfums.forEach(name=>{
    let img = "icon-parfum-glace-"+name.toLowerCase().replace(/ /g,"-")+".png";

    html += `
      <div class='card' onclick="selectParfum(this,'${name}')">
        <img src='${img}'><p>${name}</p>
      </div>
    `;
  });

  html += "</div>";

  if(isGlace){
    html += `
      <h3>Chantilly</h3>
      <div class='two'>
        <div class='card' onclick="selectChantilly(this,true)">
          <img src='icon-chantilly-oui.png'><p>Oui</p>
        </div>
        <div class='card' onclick="selectChantilly(this,false)">
          <img src='icon-chantilly-non.png'><p>Non</p>
        </div>
      </div>
    `;
  }

  html += "</div>";

  document.getElementById("dynamic").insertAdjacentHTML("beforeend", html);
}

function selectParfum(el, name){

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

  document.querySelector("#parfumBlock h3").innerText =
    "Parfums ("+bouleCount+"/"+bouleMax+")";
}

function selectChantilly(el, value){

  document.querySelectorAll(".two .card").forEach(c=>c.classList.remove("selected"));
  el.classList.add("selected");

  currentOrder = currentOrder.filter(i=>i !== "Chantilly");

  if(value){
    currentOrder.push("Chantilly");
  }
}

/* ================= PANIER ================= */

function addToCart(){

  if(currentOrder.length <= 1){
    alert("⚠️ Sélection incomplète !");
    return;
  }

  cart.push({
    items: [...currentOrder],
    price: total
  });

  cartTotal += total;

  renderCart();
  resetAll();
}

function renderCart(){

  let html = "";

  cart.forEach((order,index)=>{
    html += `
      <div>
        ${order.items.join(" + ")} = ${order.price.toFixed(2)}€
        <button onclick="removeFromCart(${index})">❌</button>
      </div>
    `;
  });

  document.getElementById("cart").innerHTML = html;
  document.getElementById("cartTotal").innerText =
    "💰 Total panier : " + cartTotal.toFixed(2) + "€";
}

function removeFromCart(index){
  cartTotal -= cart[index].price;
  cart.splice(index,1);
  renderCart();
}

/* ================= RESET ================= */

function resetAll(){
  total = 0;
  currentOrder = [];
  currentMain = "";
  bouleCount = 0;
  bouleMax = 1;

  document.getElementById("dynamic").innerHTML = "";
  document.querySelectorAll(".selected").forEach(e=>e.classList.remove("selected"));

  updateTotal();
}

/* ================= VALIDATION ================= */

function validerCommande(){

  if(cart.length === 0){
    alert("Panier vide !");
    return;
  }

  const saved = JSON.parse(localStorage.getItem("orders") || "[]");

  saved.push({
    date: new Date().toLocaleString(),
    items: cart,
    total: cartTotal
  });

  localStorage.setItem("orders", JSON.stringify(saved));

  alert("✅ Commande validée !");

  cart = [];
  cartTotal = 0;

  renderCart();
}

/* ================= BILAN ================= */

function renderBilan(){

  const container = document.getElementById("bilanContent");
  const data = JSON.parse(localStorage.getItem("orders") || "[]");

  if(data.length === 0){
    container.innerHTML = "<p>Aucune commande</p>";
    return;
  }

  let totalJournee = 0;

  container.innerHTML = data.map((order, index) => {

    totalJournee += order.total;

    return `
      <div style="background:#ffe3e6;padding:15px;margin:10px;border-radius:10px;">
        
        <strong>🧾 Commande #${index + 1}</strong><br>
        🕒 ${order.date}<br><br>

        ${order.items.map(p => `
          • ${p.items.join(" + ")} = ${p.price.toFixed(2)}€
        `).join("<br>")}

        <br><br>
        <strong>Total : ${order.total.toFixed(2)}€</strong>

      </div>
    `;
  }).join("") + `
    <div style="font-size:20px;margin-top:20px;">
      💰 TOTAL JOURNÉE : ${totalJournee.toFixed(2)}€
    </div>
  `;
}

function resetJournee(){
  if(!confirm("Supprimer le bilan ?")) return;
  localStorage.removeItem("orders");
  renderBilan();
}

/* ================= MENU ================= */

function showPage(page){

  document.getElementById("caissePage").style.display = "none";
  document.getElementById("bilanPage").style.display = "none";

  if(page === "caisse"){
    document.getElementById("caissePage").style.display = "flex";
  }

  if(page === "bilan"){
    document.getElementById("bilanPage").style.display = "block";
    renderBilan();
  }

  document.getElementById("sideMenu").style.left = "-220px";
}

function toggleMenu(){
  let menu = document.getElementById("sideMenu");
  menu.style.left = (menu.style.left === "0px") ? "-220px" : "0px";
}