const WHATSAPP_NUMBER = '916205273508'; // Replace with the store's WhatsApp number. Country code, no + or spaces.

const products = [
  {id:1,name:'Tomato',category:'vegetables',emoji:'🍅',price:40,oldPrice:null,unit:'per kg',deal:false,popular:98,stock:true},
  {id:2,name:'Potato',category:'vegetables',emoji:'🥔',price:35,oldPrice:null,unit:'per kg',deal:false,popular:92,stock:true},
  {id:3,name:'Onion',category:'vegetables',emoji:'🧅',price:45,oldPrice:null,unit:'per kg',deal:false,popular:91,stock:true},
  {id:4,name:'Carrot',category:'vegetables',emoji:'🥕',price:60,oldPrice:70,unit:'per kg',deal:true,popular:84,stock:true},
  {id:5,name:'Aashirvaad Atta 5kg',category:'grocery',emoji:'🌾',price:285,oldPrice:320,unit:'5 kg pack',deal:true,popular:97,stock:true},
  {id:6,name:'Basmati Rice 5kg',category:'grocery',emoji:'🍚',price:420,oldPrice:470,unit:'5 kg pack',deal:true,popular:96,stock:true},
  {id:7,name:'Fortune Sunflower Oil',category:'grocery',emoji:'🫗',price:145,oldPrice:160,unit:'1 L',deal:true,popular:90,stock:true},
  {id:8,name:'Tata Salt',category:'grocery',emoji:'🧂',price:28,oldPrice:null,unit:'1 kg',deal:false,popular:82,stock:true},
  {id:9,name:'Dove Cream Beauty Bathing Bar',category:'cosmetics',emoji:'🧼',price:55,oldPrice:62,unit:'100 g',deal:true,popular:95,stock:true},
  {id:10,name:'Maybelline Face Wash',category:'cosmetics',emoji:'🧴',price:199,oldPrice:null,unit:'100 ml',deal:false,popular:77,stock:true},
  {id:11,name:'Clinic Plus Shampoo',category:'personal-care',emoji:'🧴',price:180,oldPrice:210,unit:'340 ml',deal:true,popular:89,stock:true},
  {id:12,name:'Colgate Toothpaste',category:'personal-care',emoji:'🪥',price:110,oldPrice:null,unit:'200 g',deal:false,popular:88,stock:true},
  {id:13,name:'Vim Dishwash Liquid',category:'household',emoji:'🫧',price:95,oldPrice:105,unit:'500 ml',deal:true,popular:74,stock:true},
  {id:14,name:'Harpic Toilet Cleaner',category:'household',emoji:'🧽',price:102,oldPrice:null,unit:'500 ml',deal:false,popular:70,stock:true},
  {id:15,name:'Coca-Cola',category:'beverages',emoji:'🥤',price:45,oldPrice:null,unit:'750 ml',deal:false,popular:76,stock:true},
  {id:16,name:'Tropicana Orange Juice',category:'beverages',emoji:'🧃',price:115,oldPrice:130,unit:'1 L',deal:true,popular:68,stock:false}
];

const categoryNames = {all:'Popular Products',vegetables:'Fresh Vegetables',grocery:'Grocery Essentials',cosmetics:'Cosmetics', 'personal-care':'Personal Care',household:'Household Essentials',beverages:'Beverages'};
let selectedCategory = 'all';
let searchTerm = '';
let sortMode = 'popular';
let cart = JSON.parse(localStorage.getItem('DanishMart-cart') || '[]');

const $ = (id) => document.getElementById(id);
const money = (n) => `₹${n.toLocaleString('en-IN')}`;

function saveCart(){localStorage.setItem('DanishMart-cart',JSON.stringify(cart));}
function getProduct(id){return products.find(p => p.id === Number(id));}
function cartQty(id){return cart.find(i=>i.id===Number(id))?.qty || 0;}
function cartCount(){return cart.reduce((sum,i)=>sum+i.qty,0);}
function cartTotal(){return cart.reduce((sum,i)=>{const p=getProduct(i.id);return sum+p.price*i.qty},0);}
function showToast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),2200)}

function renderProductCard(p){
  const qty=cartQty(p.id);
  return `<article class="product-card">
    <div class="product-image"><span>${p.emoji}</span>${p.deal?'<span class="deal-badge">DEAL</span>':''}${!p.stock?'<span class="out-badge">OUT OF STOCK</span>':''}</div>
    <div class="product-info">
      <div class="product-category">${p.category.replace('-', ' ')}</div>
      <h3>${p.name}</h3>
      <div class="price-row"><span class="price">${money(p.price)}</span>${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:''}<span class="unit">${p.unit}</span></div>
      <div class="stock ${p.stock?'':'out'}">${p.stock?'✓ In stock':'Currently unavailable'}</div>
      <div class="add-row">
        ${qty>0?`<button class="qty-btn" data-qty="minus" data-id="${p.id}">−</button><button class="qty-btn" disabled>${qty}</button>`:''}
        <button class="add-btn" data-add="${p.id}" ${p.stock?'':'disabled'}>${qty>0?'Add more':'＋ Add to cart'}</button>
        ${qty>0?`<button class="qty-btn" data-qty="plus" data-id="${p.id}">+</button>`:''}
      </div>
    </div>
  </article>`;
}

function sorted(list){
  const copy=[...list];
  if(sortMode==='low') return copy.sort((a,b)=>a.price-b.price);
  if(sortMode==='high') return copy.sort((a,b)=>b.price-a.price);
  if(sortMode==='name') return copy.sort((a,b)=>a.name.localeCompare(b.name));
  return copy.sort((a,b)=>b.popular-a.popular);
}

function filteredProducts(){
  let list=products;
  if(selectedCategory!=='all') list=list.filter(p=>p.category===selectedCategory);
  if(searchTerm.trim()){
    const q=searchTerm.toLowerCase().trim();
    list=list.filter(p=>(p.name+' '+p.category+' '+p.unit).toLowerCase().includes(q));
  }
  return sorted(list);
}

function renderProducts(){
  const list=filteredProducts();
  $('productGrid').innerHTML=list.map(renderProductCard).join('');
  $('emptyState').classList.toggle('hidden',list.length!==0);
  $('productGrid').classList.toggle('hidden',list.length===0);
  $('productsTitle').textContent=searchTerm?`Search results for “${searchTerm}”`:categoryNames[selectedCategory];
  $('resultInfo').textContent=searchTerm?`${list.length} product${list.length===1?'':'s'} found`: `Showing ${list.length} products`;
}

function renderDeals(){
  $('dealProducts').innerHTML=products.filter(p=>p.deal && p.stock).slice(0,4).map(renderProductCard).join('');
}

function renderCart(){
  $('cartCount').textContent=cartCount();
  $('cartItems').innerHTML=cart.map(item=>{const p=getProduct(item.id); return `<div class="cart-line">
    <div class="cart-line-image">${p.emoji}</div>
    <div><h4>${p.name}</h4><small>${money(p.price)} · ${p.unit}</small><div class="line-controls"><button data-cart="minus" data-id="${p.id}">−</button><strong>${item.qty}</strong><button data-cart="plus" data-id="${p.id}">+</button><button data-cart="remove" data-id="${p.id}" title="Remove">×</button></div></div>
    <div class="line-price">${money(p.price*item.qty)}</div>
  </div>`}).join('');
  $('cartEmpty').classList.toggle('hidden',cart.length>0);$('cartFooter').classList.toggle('hidden',cart.length===0);$('cartTotal').textContent=money(cartTotal());
}

function addToCart(id, quantity=1){
  const p=getProduct(id);if(!p||!p.stock)return;
  const existing=cart.find(i=>i.id===p.id);
  if(existing) existing.qty+=quantity; else cart.push({id:p.id,qty:quantity});
  saveCart();renderCart();renderProducts();renderDeals();showToast(`${p.name} added to cart`);
}
function updateCart(id,delta){const item=cart.find(i=>i.id===Number(id));if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(i=>i.id!==Number(id));saveCart();renderCart();renderProducts();renderDeals();}

function setCategory(cat){selectedCategory=cat;searchTerm='';$('mainSearch').value='';$('headerSearch').value='';document.querySelectorAll('[data-category]').forEach(el=>el.classList.toggle('active',el.dataset.category===cat && el.classList.contains('nav-category')));renderProducts();document.querySelector('#products').scrollIntoView({behavior:'smooth',block:'start'});}
function runSearch(value){searchTerm=value;selectedCategory='all';$('mainSearch').value=value;$('headerSearch').value=value;document.querySelectorAll('.nav-category').forEach(el=>el.classList.toggle('active',el.dataset.category==='all'));renderProducts();document.querySelector('#products').scrollIntoView({behavior:'smooth',block:'start'});}

function whatsappLink(message){return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;}
function buildCartMessage(){
  let lines=['Hi DanishMart 👋','', 'I would like to place an order:',''];
  cart.forEach(item=>{const p=getProduct(item.id);lines.push(`• ${p.name} — ${item.qty} x ${money(p.price)} = ${money(p.price*item.qty)}`)});
  lines.push('',`Estimated product total: ${money(cartTotal())}`,'','Please confirm availability, delivery charges and final total.');
  return lines.join('\n');
}
function updateWhatsAppLinks(){
  $('cartWhatsapp').onclick=()=>{if(!cart.length)return;window.open(whatsappLink(buildCartMessage()),'_blank','noopener');};
  const direct='Hi DanishMart 👋\n\nI would like to order.\n\nMy shopping list:\n• ';
  const href=whatsappLink(direct);
  $('directWhatsapp').href=href;$('floatingWhatsapp').href=href;
}

function openCart(){ $('cartDrawer').classList.add('open'); $('cartDrawer').setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
function closeCart(){ $('cartDrawer').classList.remove('open'); $('cartDrawer').setAttribute('aria-hidden','true'); document.body.style.overflow=''; }

$('headerSearchForm').addEventListener('submit',e=>{e.preventDefault();runSearch($('headerSearch').value)});
$('mainSearch').addEventListener('input',e=>{searchTerm=e.target.value;selectedCategory='all';document.querySelectorAll('.nav-category').forEach(el=>el.classList.toggle('active',el.dataset.category==='all'));renderProducts();});
$('headerSearch').addEventListener('input',e=>{searchTerm=e.target.value; $('mainSearch').value=e.target.value; renderProducts();});
$('sortSelect').addEventListener('change',e=>{sortMode=e.target.value;renderProducts()});
$('clearSearch').addEventListener('click',()=>runSearch(''));
$('openCart').addEventListener('click',openCart);$('closeCart').addEventListener('click',closeCart);$('closeCartBtn').addEventListener('click',closeCart);
$('clearCart').addEventListener('click',()=>{cart=[];saveCart();renderCart();renderProducts();renderDeals();showToast('Cart cleared')});
$('mobileMenuBtn').addEventListener('click',()=>$('categoryNav').classList.toggle('mobile-open'));

document.addEventListener('click',e=>{
  const category=e.target.closest('[data-category]');if(category){e.preventDefault();setCategory(category.dataset.category);$('categoryNav').classList.remove('mobile-open');return;}
  const search=e.target.closest('[data-search]');if(search){runSearch(search.dataset.search);return;}
  const add=e.target.closest('[data-add]');if(add){addToCart(add.dataset.add);return;}
  const qty=e.target.closest('[data-qty]');if(qty){updateCart(qty.dataset.id,qty.dataset.qty==='plus'?1:-1);return;}
  const cartAction=e.target.closest('[data-cart]');if(cartAction){const a=cartAction.dataset.cart,id=cartAction.dataset.id;if(a==='plus')updateCart(id,1);if(a==='minus')updateCart(id,-1);if(a==='remove'){cart=cart.filter(i=>i.id!==Number(id));saveCart();renderCart();renderProducts();renderDeals();showToast('Item removed')}return;}
});

renderProducts();renderDeals();renderCart();updateWhatsAppLinks();
