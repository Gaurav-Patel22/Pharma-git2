// ================= REDIRECTION =================
function openSignup() { window.location.href = "signup.html"; }
function openLogin() { window.location.href = "login.html"; }
function openCartPage() { window.location.href = "cart.html"; }

function logout() {
    localStorage.removeItem("user");
    window.location.reload();
}

// ================= CART =================/
let cart = [];
try {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
} catch {
    cart = [];
}
updateCartCount();

function addToCart(name, price) {
    let item = cart.find(i => i.name === name);
    if (item) item.quantity += 1;
    else cart.push({ name, price, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(name + " added to cart 🛒");
}

function updateCartCount() {
    const count = cart.reduce((sum, i) => sum + i.quantity, 0);
    const c1 = document.getElementById("cart-count");
    const c2 = document.getElementById("cart-count-user");
    if (c1) c1.innerText = count;
    if (c2) c2.innerText = count;
}

// ================= AUTH =================
async function signup(event) {
    event.preventDefault();
    const nameEl = document.getElementById("name");
    const emailEl = document.getElementById("email");
    const passEl = document.getElementById("password");
    if (!nameEl || !emailEl || !passEl) return alert("Signup form incomplete");

    try {
        const res = await fetch(`/api/signup`{
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({ name: nameEl.value, email: emailEl.value, password: passEl.value })
        });
        const data = await res.json();
        alert(data.message);
        if (data.success) window.location.href = "login.html";
    } catch (err) { console.error(err); alert("Signup failed"); }
}

async function login(event) {
    event.preventDefault();
    const emailEl = document.getElementById("email");
    const passEl = document.getElementById("password");
    if (!emailEl || !passEl) return alert("Login form incomplete");

    try {
        const res = await fetch(`/api/login`, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({ email: emailEl.value, password: passEl.value })
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem("user", JSON.stringify(data.user));
            const authButtons = document.getElementById("auth-buttons");
            const userInfo = document.getElementById("user-info");
            const username = document.getElementById("username");
            if (authButtons) authButtons.style.display = "none";
            if (userInfo) userInfo.style.display = "flex";
            if (username) username.innerText = "Hi, " + data.user.name;
            window.location.href = "index.html";
        } else alert(data.message);
    } catch (err) { console.error(err); alert("Login failed"); }
}

// ================= AUTH STATE ON LOAD =================
window.onload = function() {
    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch {
        localStorage.removeItem("user");
    }

    const authButtons = document.getElementById("auth-buttons");
    const userInfo = document.getElementById("user-info");
    const username = document.getElementById("username");

    if (user) {
        if (authButtons) authButtons.style.display = "none";
        if (userInfo) userInfo.style.display = "flex";
        if (username) username.innerText = "Hi, " + user.name;
    } else {
        if (authButtons) authButtons.style.display = "flex";
        if (userInfo) userInfo.style.display = "none";
    }

    updateCartCount();
};