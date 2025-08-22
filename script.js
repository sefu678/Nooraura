/* ---------- 1. DEFAULT CATALOGUE ---------- */
const DEFAULT = [
  {
    id: 1,
    name: "Royal Cotton Anarkali",
    price: 2199,
    image: "https://picsum.photos/seed/anarkali/400/500",
    description: "Elegant cotton anarkali with golden embroidery."
  },
  {
    id: 2,
    name: "Pastel Straight Set",
    price: 1699,
    image: "https://picsum.photos/seed/pastel/400/500",
    description: "Minimal pastel kurta with palazzo."
  }
];

/* ---------- 2. LOAD / SAVE ---------- */
function loadProducts() {
  const saved = JSON.parse(localStorage.getItem("products"));
  return Array.isArray(saved) ? saved : [...DEFAULT];
}
function saveProducts(list) {
  localStorage.setItem("products", JSON.stringify(list));
}

let products = loadProducts();

/* ---------- 3. ROUTER ---------- */
const root = document.getElementById("root");
function route(page) {
  if (page === "home") renderHome();
  else if (page === "products") renderProducts();
}
function renderHome() {
  root.innerHTML = `
    <div style="text-align:center;padding:40px 20px;">
      <h2>Welcome to NOOR AURA</h2>
      <p>Discover hand-picked ethnic elegance.</p>
      <button class="btn" onclick="route('products')">Shop Now</button>
    </div>
  `;
}
function renderProducts() {
  root.innerHTML = `<div class="products-grid" id="prodGrid"></div>`;
  const grid = document.getElementById("prodGrid");
  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div class="card-body">
        <div class="card-title">${p.name}</div>
        <div class="card-price">₹${p.price}</div>
        <button onclick="whatsappOrder('${p.name}', ${p.price})" class="btn" style="margin-top:6px;font-size:.75rem">Order on WhatsApp</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ---------- 4. WHATSAPP ORDER ---------- */
function whatsappOrder(name, price) {
  const msg = `Hi, I'd like to order:\n${name} – ₹${price}`;
  window.open(`https://wa.me/918780813692?text=${encodeURIComponent(msg)}`);
}

/* ---------- 5. ADMIN PANEL ---------- */
const adminPanel = document.getElementById("adminPanel");
const loginForm = document.getElementById("loginForm");
const dash = document.getElementById("adminDashboard");
const form = document.getElementById("productForm");
const list = document.getElementById("productList");

document.getElementById("adminLoginBtn").onclick = () => adminPanel.style.display = "flex";
document.querySelector(".close").onclick = () => adminPanel.style.display = "none";

loginForm.onsubmit = e => {
  e.preventDefault();
  const u = document.getElementById("user").value.trim();
  const p = document.getElementById("pass").value.trim();
  if (u === "kadusefu4" && p === "sajjadkaduu") {
    loginForm.reset();
    dash.style.display = "block";
    refreshList();
  } else alert("Wrong username or password");
};

form.onsubmit = e => {
  e.preventDefault();
  const id = Number(document.getElementById("editId").value) || Date.now();
  const name = document.getElementById("prodName").value.trim();
  const price = Number(document.getElementById("prodPrice").value);
  const image = document.getElementById("prodImage").value.trim() || "https://picsum.photos/400/500?random=" + id;
  const desc = document.getElementById("prodDesc").value.trim();

  const idx = products.findIndex(x => x.id === id);
  if (idx >= 0) products[idx] = { ...products[idx], name, price, image, description: desc };
  else products.unshift({ id, name, price, image, description: desc });

  saveProducts(products);
  refreshList();
  form.reset();
  document.getElementById("editId").value = "";
  renderProducts();
};

function refreshList() {
  list.innerHTML = "";
  products.forEach(p => {
    const row = document.createElement("div");
    row.className = "admin-product";
    row.innerHTML = `
      <span>${p.name} – ₹${p.price}</span>
      <div>
        <button onclick="editProd(${p.id})">Edit</button>
        <button onclick="delProd(${p.id})">Delete</button>
      </div>
    `;
    list.appendChild(row);
  });
}

function editProd(id) {
  const p = products.find(x => x.id === id);
  document.getElementById("editId").value = id;
  document.getElementById("prodName").value = p.name;
  document.getElementById("prodPrice").value = p.price;
  document.getElementById("prodImage").value = p.image;
  document.getElementById("prodDesc").value = p.description || "";
}

function delProd(id) {
  if (confirm("Delete this?")) {
    products = products.filter(x => x.id !== id);
    saveProducts(products);
    refreshList();
    renderProducts();
  }
}

/* ---------- 6. START ---------- */
route("home");