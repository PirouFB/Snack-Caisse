var total = 0;
var basePrice = 0;

var currentOrder = [];
var orders = [];
var orderPrices = [];

var bouleMax = 0;
var bouleCount = 0;

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

function removeOrder(index){
  orders.splice(index,1);
  orderPrices.splice(index,1);
  updateCart();
}

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
}