// Main client-side JS for SunCraft Panels (responsive + localStorage auth + cart)
(() => {
  // Product catalog (categories included)
  const products = [
    { id:1, name:"AI Solar Max 400W Panel", price:2800, category:"panels", img:"https://images.unsplash.com/photo-1581092334531-8f1eacfbb93b?auto=format&fit=crop&w=900&q=80" },
    { id:2, name:"SmartPanel Ultra 600W", price:4500, category:"panels", img:"https://images.unsplash.com/photo-1617196034796-2c8e6e3f6932?auto=format&fit=crop&w=900&q=80" },
    { id:3, name:"EcoLite 300W Compact", price:1950, category:"panels", img:"https://images.unsplash.com/photo-1616442487577-6618d7f9e5a2?auto=format&fit=crop&w=900&q=80" },
    { id:4, name:"Solar Lantern 50W", price:320, category:"lamps", img:"https://images.unsplash.com/photo-1603565816060-eedb4e3f49db?auto=format&fit=crop&w=900&q=80" },
    { id:5, name:"Solar Flood Light 200W", price:780, category:"lamps", img:"https://images.unsplash.com/photo-1620787061748-70a88af2e75d?auto=format&fit=crop&w=900&q=80" },
    { id:6, name:"Deep Cycle Battery 12V/200Ah", price:1500, category:"batteries", img:"https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=900&q=80" },
    { id:7, name:"Solar Charge Controller 60A", price:620, category:"accessories", img:"https://images.unsplash.com/photo-1615540492593-4d5ef0d93a30?auto=format&fit=crop&w=900&q=80" },
    { id:8, name:"Inverter Pro 2.5kVA", price:2500, category:"accessories", img:"https://images.unsplash.com/photo-1603533813363-dbd5d3e8ad1a?auto=format&fit=crop&w=900&q=80" },
    { id:9, name:"Complete Solar Home Kit", price:8900, category:"panels", img:"https://images.unsplash.com/photo-1603988363607-17798d56e7b4?auto=format&fit=crop&w=900&q=80" }
  ];

  // DOM refs
  const productList = document.getElementById('productList');
  const searchInput = document.getElementById('searchInput');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cartBtn = document.getElementById('cartBtn');
  const cartCount = document.getElementById('cartCount');
  const cartPanel = document.getElementById('cart');
  const cartItems = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const clearCartBtn = document.getElementById('clearCartBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutModal = document.getElementById('checkoutModal');
  const closeCheckout = document.getElementById('closeCheckout');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('nav-links');

  let activeCategory = 'all';
  let cart = JSON.parse(localStorage.getItem('cart')||'[]');

  // Utility: format currency
  function fmt(v){ return '₵ ' + v.toString(); }

  // Render products
  function renderProducts(list){
    productList.innerHTML = '';
    list.forEach((p)=>{
      const card = document.createElement('div');
      card.className = 'product-card';
      const inner = `
        <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/900x600?text=Image+not+available'">
        <div class="card-body">
          <div>
            <h4>${p.name}</h4>
            <div class="price">${fmt(p.price)}</div>
          </div>
          <div>
            <button class="btn" data-add="${p.id}">Add to Cart</button>
          </div>
        </div>`;
      card.innerHTML = inner;
      productList.appendChild(card);
    });
  }

  function filterProducts(cat){
    activeCategory = cat;
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    const activeBtn = Array.from(filterBtns).find(b=>b.dataset.cat===cat) || document.querySelector('.filter-btn[data-cat="all"]');
    if(activeBtn) activeBtn.classList.add('active');
    const filtered = cat==='all'? products : products.filter(p=>p.category===cat);
    renderProducts(filtered);
  }

  // Search + filter combined
  function searchAndFilter(){
    const q = (searchInput.value||'').trim().toLowerCase();
    let list = products.filter(p => (activeCategory==='all' || p.category===activeCategory));
    if(q) list = list.filter(p => p.name.toLowerCase().includes(q));
    renderProducts(list);
  }

  // Cart functions
  function saveCart(){ localStorage.setItem('cart', JSON.stringify(cart)); updateCartUI(); }
  function updateCartUI(){
    cartItems.innerHTML='';
    let total = 0;
    cart.forEach((it,idx)=>{
      total += it.price;
      const div = document.createElement('div'); div.className='cart-item';
      div.innerHTML = `<span>${it.name}</span><span>₵${it.price}</span><button class="btn btn-danger" data-remove="${idx}">Remove</button>`;
      cartItems.appendChild(div);
    });
    cartTotalEl.textContent = fmt(total);
    const cnt = cart.length;
    if(cnt>0){ cartCount.hidden = false; cartCount.textContent = cnt; } else { cartCount.hidden = true; }
  }
  function addToCartById(id){
    const p = products.find(x=>x.id===id);
    if(p){ cart.push(p); saveCart(); alert(p.name + ' added to cart'); }
  }
  function removeFromCart(index){ cart.splice(index,1); saveCart(); }

  // Init rendering
  renderProducts(products);
  updateCartUI();

  // Event delegation for product add buttons
  productList.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-add]');
    if(!btn) return;
    const id = Number(btn.dataset.add);
    addToCartById(id);
  });

  // Remove from cart
  cartItems.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-remove]');
    if(!btn) return;
    const idx = Number(btn.dataset.remove);
    removeFromCart(idx);
  });

  // Filters
  filterBtns.forEach(b=>{
    b.addEventListener('click', ()=> filterProducts(b.dataset.cat));
  });

  // Search input
  searchInput.addEventListener('input', searchAndFilter);

  // Cart toggle (touch/click friendly)
  cartBtn.addEventListener('click', ()=>{
    if(cartPanel.style.display === 'block'){ cartPanel.style.display = 'none'; cartPanel.setAttribute('aria-hidden','true'); }
    else { cartPanel.style.display = 'block'; cartPanel.setAttribute('aria-hidden','false'); }
  });

  // clear cart
  clearCartBtn.addEventListener('click', ()=>{
    if(!cart.length) return alert('Cart is already empty');
    if(confirm('Clear all items from cart?')){ cart = []; saveCart(); }
  });

  // Checkout
  checkoutBtn.addEventListener('click', ()=>{ checkoutModal.style.display='flex'; checkoutModal.setAttribute('aria-hidden','false'); });
  closeCheckout.addEventListener('click', ()=>{ checkoutModal.style.display='none'; checkoutModal.setAttribute('aria-hidden','true'); });
  document.getElementById('confirmPay').addEventListener('click', ()=>{
    const momo = document.getElementById('momo').value.trim();
    if(!momo){ alert('Enter MoMo number'); return; }
    alert('Payment simulated. Thank you!');
    cart = []; saveCart(); checkoutModal.style.display='none';
  });

  // Menu toggle for smaller screens
  menuToggle.addEventListener('click', ()=>{
    navLinks.classList.toggle('open');
  });

  // Mobile-friendly nav close on link click
  navLinks.addEventListener('click', (e)=>{
    if(e.target.tagName === 'A') navLinks.classList.remove('open');
  });

  // Contact form submission (simple local behavior)
  const contactForm = document.getElementById('contactForm');
  contactForm && contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    alert('Thanks! Message received.');
    contactForm.reset();
  });

  // Authentication UI in header
  function refreshAuthUI(){
    const currentUser = JSON.parse(localStorage.getItem('currentUser')||'null');
    const loginLink = document.getElementById('loginLink');
    const signupLink = document.getElementById('signupLink');
    if(currentUser){
      if(loginLink) loginLink.textContent = currentUser.name;
      if(signupLink) signupLink.remove();
      // clicking name goes to account.html
      if(loginLink) loginLink.setAttribute('href','account.html');
    } else {
      if(loginLink) loginLink.textContent = 'Login';
      if(signupLink && signupLink.tagName!=='A'){} // keep existing
    }
  }
  refreshAuthUI();

  // Auto-restore cart from storage on load (already applied above)
  // ensure UI updates
  updateCartUI();

})();