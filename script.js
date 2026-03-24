let currentOrder = [];
let grandTotal = 0;
let maxFlavors = 0;

function addClickTouchListener(btn, fn){
    btn.addEventListener('click', fn);
    btn.addEventListener('touchend', fn);
}

function calculateTotal() {
    let total = 0;
    document.querySelectorAll('.product.selected, .option.selected').forEach(btn => total += parseFloat(btn.dataset.price||0));
    document.getElementById('total').innerText = total.toFixed(2);
    return total;
}

function toggleSelection(btn){ btn.classList.toggle('selected'); updateCurrentOrder(); }
function toggleFlavor(btn){
    if(btn.classList.contains('selected')) btn.classList.remove('selected');
    else if(document.querySelectorAll('#flavorChoice .option.selected').length < maxFlavors) btn.classList.add('selected');
    else alert('Nombre de parfums max atteint');
    updateCurrentOrder();
}
function toggleMiniGlace(btn){
    btn.classList.toggle('selected');
    if(btn.classList.contains('selected')) showSection('miniFlavor');
    else { hideSection('miniFlavor'); document.querySelectorAll('#miniFlavor .option.selected').forEach(b=>b.classList.remove('selected')); }
    updateCurrentOrder();
}
function toggleMiniFlavor(btn){
    if(btn.classList.contains('selected')) btn.classList.remove('selected');
    else if(document.querySelectorAll('#miniFlavor .option.selected').length < 1) btn.classList.add('selected');
    else alert('Un seul parfum mini glace');
    updateCurrentOrder();
}

function selectProduct(btn){
    document.querySelectorAll('.product').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    if(btn.innerText==='Glace'){ hideSection('nappageSection'); hideSection('toppingSection'); hideSection('optionsSection'); showSection('iceChoice'); hideSection('scoopChoice'); hideSection('flavorChoice'); hideSection('miniFlavor'); }
    else hideAllGlaceSections();
    updateCurrentOrder();
}

function selectSingle(btn, type){
    document.querySelectorAll(`.option[data-type="${type}"]`).forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    if(type==='iceType') showSection('scoopChoice');
    if(type==='scoop'){ maxFlavors=parseInt(btn.innerText); showSection('flavorChoice'); }
    updateCurrentOrder();
}

function updateCurrentOrder(){
    currentOrder=[];
    document.querySelectorAll('.product.selected').forEach(b=>currentOrder.push(b.innerText));
    document.querySelectorAll('#iceChoice .option.selected').forEach(b=>currentOrder.push(b.innerText));
    document.querySelectorAll('#scoopChoice .option.selected').forEach(b=>currentOrder.push(b.innerText));
    document.querySelectorAll('#flavorChoice .option.selected').forEach(b=>currentOrder.push('Glace: '+b.innerText));
    document.querySelectorAll('#nappageSection .option.selected').forEach(b=>currentOrder.push(b.innerText));
    document.querySelectorAll('#toppingSection .option.selected').forEach(b=>currentOrder.push(b.innerText));
    document.querySelectorAll('#optionsSection .option.selected').forEach(b=>currentOrder.push(b.innerText));
    document.querySelectorAll('#miniFlavor .option.selected').forEach(b=>currentOrder.push('Mini: '+b.innerText));
    calculateTotal();
}

function addOrder(){
    if(document.querySelectorAll('.product.selected').length === 0){ alert('Sélectionnez un produit principal'); return; }
    const selectedProduct = document.querySelector('.product.selected').innerText;
    if(selectedProduct==='Glace' && (document.querySelectorAll('#iceChoice .option.selected').length===0 || document.querySelectorAll('#scoopChoice .option.selected').length===0)){ alert('Choisir Pot/Cornet et nombre de boules'); return; }
    if((selectedProduct==='Crêpe'||selectedProduct==='Panini Gelato') && document.querySelector('#optionsSection .option[data-type="mini-glace"].selected') && document.querySelectorAll('#miniFlavor .option.selected').length===0){ alert('Choisir un parfum pour mini glace'); return; }

    let orderTotal = calculateTotal();
    grandTotal += orderTotal;

    let li=document.createElement('li'); li.style.display='flex'; li.style.alignItems='center';
    let span=document.createElement('span'); span.innerText=currentOrder.join(' + ')+' = '+orderTotal.toFixed(2)+'€';
    li.appendChild(span);

    let delBtn=document.createElement('button'); delBtn.innerText='Supprimer'; delBtn.style.marginLeft='10px';
    delBtn.style.background='#c0392b'; delBtn.style.color='white'; delBtn.style.border='none'; delBtn.style.borderRadius='5px';
    delBtn.style.padding='3px 6px';
    addClickTouchListener(delBtn, ()=>{ grandTotal-=orderTotal; document.getElementById('grandTotal').innerText=grandTotal.toFixed(2); li.remove(); });
    li.appendChild(delBtn);

    document.getElementById('orderList').appendChild(li);
    document.getElementById('grandTotal').innerText = grandTotal.toFixed(2);
    resetCurrentOrder();
}

function resetTotal(){ document.querySelectorAll('button.selected').forEach(b=>b.classList.remove('selected')); currentOrder=[]; grandTotal=0; document.getElementById('grandTotal').innerText='0.00'; document.getElementById('orderList').innerHTML=''; calculateTotal(); hideAllGlaceSections(); hideSection('miniFlavor'); }
function resetCurrentOrder(){ document.querySelectorAll('button.selected').forEach(b=>b.classList.remove('selected')); currentOrder=[]; calculateTotal(); hideAllGlaceSections(); hideSection('miniFlavor'); }

function hideSection(id){ document.getElementById(id).className='hidden'; }
function showSection(id){ document.getElementById(id).className='section'; }
function hideAllGlaceSections(){ hideSection('iceChoice'); hideSection('scoopChoice'); hideSection('flavorChoice'); showSection('nappageSection'); showSection('toppingSection'); showSection('optionsSection'); }

// Initialisation boutons
document.querySelectorAll('.product').forEach(btn=>addClickTouchListener(btn, ()=>selectProduct(btn)));
document.querySelectorAll('.option').forEach(btn=>{
    if(btn.dataset.type==='iceType'||btn.dataset.type==='scoop') addClickTouchListener(btn, ()=>selectSingle(btn, btn.dataset.type));
    else if(btn.parentElement.id==='flavorChoice') addClickTouchListener(btn, ()=>toggleFlavor(btn));
    else if(btn.parentElement.id==='miniFlavor') addClickTouchListener(btn, ()=>toggleMiniFlavor(btn));
    else if(btn.dataset.type==='mini-glace') addClickTouchListener(btn, ()=>toggleMiniGlace(btn));
    else addClickTouchListener(btn, ()=>toggleSelection(btn));
});
addClickTouchListener(document.querySelector('.add-order'), addOrder);
addClickTouchListener(document.querySelector('.reset'), resetTotal);