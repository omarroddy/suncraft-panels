<script>
  // --- Product Data ---
  const products = [
    { name: "AI Solar Max 400W", price: 2800, img: "https://images.unsplash.com/photo-1584270354949-1b8a7a212d5d?auto=format&fit=crop&w=800&q=80" },
    { name: "SmartPanel Ultra 600W", price: 4500, img: "https://images.unsplash.com/photo-1592813630411-68cf16ff49fc?auto=format&fit=crop&w=800&q=80" },
    { name: "EcoLite 300W", price: 1950, img: "https://images.unsplash.com/photo-1603791452906-c4c7b1de1b37?auto=format&fit=crop&w=800&q=80" },
    { name: "SunPro AI Hybrid 800W", price: 6500, img: "https://images.unsplash.com/photo-1608330903957-8a09a0d6d3b2?auto=format&fit=crop&w=800&q=80" },
    { name: "Solar Power Lantern", price: 350, img: "https://images.unsplash.com/photo-1602524817949-321f49f7c51d?auto=format&fit=crop&w=800&q=80" },
    { name: "Solar Home Kit", price: 2200, img: "https://images.unsplash.com/photo-1622641682048-19c8700b1e24?auto=format&fit=crop&w=800&q=80" },
    { name: "Solar Street Light", price: 3100, img: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=800&q=80" }
  ];

  // --- Display Products ---
  const productList = document.getElementById("productList");
  products.forEach((p, i) => {
    productList.innerHTML += `
      <div class="product-card">
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p class="price">₵ ${p.price}</p>
        <button class="btn" onclick="addToCart(${i})">Add to Cart</button>
      </div>`;
  });

  // --- Cart Functionality ---
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartBtn = document.getElementById("cartBtn");
  const cartPanel = document.getElementById("cart");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const checkoutModal = document.getElementById("checkoutModal");
  const closeCheckout = document.getElementById("closeCheckout");

  function addToCart(index) {
    cart.push(products[index]);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
  }

  function removeFromCart(i) {
    cart.splice(i, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
  }

  function clearCart() {
    cart = [];
    localStorage.removeItem("cart");
    updateCart();
  }

  function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;
    cart.forEach((item, i) => {
      total += item.price;
      cartItems.innerHTML += `
        <div class="cart-item">
          <span>${item.name}</span>
          <span>₵${item.price}</span>
          <button class="btn" style="padding:5px 10px;font-size:12px;background:red" onclick="removeFromCart(${i})">Remove</button>
        </div>`;
    });
    cartItems.innerHTML += `<button class="btn" style="background:#444;width:100%" onclick="clearCart()">Clear Cart</button>`;
    cartTotal.textContent = `₵ ${total}`;
  }
  updateCart();

  cartBtn.onclick = () => {
    cartPanel.style.display = cartPanel.style.display === "block" ? "none" : "block";
  };
  checkoutBtn.onclick = () => checkoutModal.style.display = "flex";
  closeCheckout.onclick = () => checkoutModal.style.display = "none";

  // --- Login/Signup ---
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const loginModal = document.getElementById("loginModal");
  const signupModal = document.getElementById("signupModal");
  const closeLogin = document.getElementById("closeLogin");
  const closeSignup = document.getElementById("closeSignup");

  // --- Modal Controls ---
  loginBtn.onclick = () => loginModal.style.display = "flex";
  signupBtn.onclick = () => signupModal.style.display = "flex";
  closeLogin.onclick = () => loginModal.style.display = "none";
  closeSignup.onclick = () => signupModal.style.display = "none";

  // --- Save Signup Data ---
  document.querySelector("#signupModal .btn").addEventListener("click", function() {
    const name = signupModal.querySelector('input[placeholder="Full Name"]').value.trim();
    const email = signupModal.querySelector('input[placeholder="Email"]').value.trim();
    const password = signupModal.querySelector('input[placeholder="Password"]').value.trim();

    if (!name || !email || !password) {
      alert("Please fill all fields!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.find(u => u.email === email);
    if (exists) {
      alert("User already exists! Please log in.");
      signupModal.style.display = "none";
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful! You can now log in.");
    signupModal.style.display = "none";
  });

  // --- Login Function ---
  document.querySelector("#loginModal .btn").addEventListener("click", function() {
    const email = loginModal.querySelector('input[placeholder="Username"]').value.trim();
    const password = loginModal.querySelector('input[placeholder="Password"]').value.trim();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => (u.email === email || u.name === email) && u.password === password);

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      alert(`Welcome, ${user.name}!`);
      loginModal.style.display = "none";
      showUserGreeting(user.name);
    } else {
      alert("Invalid credentials! Try again.");
    }
  });

  // --- Show Greeting ---
  function showUserGreeting(name) {
    const navLinks = document.getElementById("nav-links");
    const userHTML = `
      <li><a href="#">👋 ${name}</a></li>
      <li><a href="#" id="logoutBtn">Logout</a></li>
    `;
    navLinks.innerHTML = `
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#products">Products</a></li>
      <li><a href="#contact">Contact</a></li>
      <li><a href="#" id="cartBtn">🛒 Cart</a></li>
      ${userHTML}
    `;
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      alert("Logged out successfully.");
      location.reload();
    });
  }

  // --- Auto-login if user already logged in ---
  const loggedUser = JSON.parse(localStorage.getItem("currentUser"));
  if (loggedUser) showUserGreeting(loggedUser.name);

  // --- Close Modals when tapping outside ---
  window.onclick = (e) => {
    [loginModal, signupModal, checkoutModal].forEach(modal => {
      if (e.target === modal) modal.style.display = "none";
    });
  };
</script>
