// ================= CART STATE =================
// Single declaration at the top — shared by addToCart, logout, and onload.
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ================= CART COUNT =================
function updateCartCount() {
    const freshCart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = freshCart.reduce((sum, item) => sum + item.quantity, 0);

    const countEl = document.getElementById("cart-count");
    const countElUser = document.getElementById("cart-count-user");

    if (countEl) countEl.innerText = totalItems;
    if (countElUser) countElUser.innerText = totalItems;
}

// ================= CART =================
function addToCart(name, price) {
    const user = localStorage.getItem("user");

    if (!user) {
        const wantsToLogin = confirm("Please login first to add items to your cart. Do you want to login now?");
        if (wantsToLogin) window.location.href = "login.html";
        return;
    }

    // ✅ FIX: cart is now properly initialized at the top, so .find() works
    let item = cart.find(i => i.name === name);
    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    console.log(`${name} added to cart`);
}

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("user");
        localStorage.removeItem("cart");
        cart = [];
        window.location.reload();
    }
}

// ================= AUTH =================
async function signup() {
    const nameEl = document.getElementById("name");
    const emailEl = document.getElementById("email");
    const passEl = document.getElementById("password");
    if (!nameEl || !emailEl || !passEl) return alert("Signup form incomplete");

    try {
        const res = await fetch('http://34.236.189.241:3000/api/signup', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: nameEl.value, email: emailEl.value, password: passEl.value })
        });
        const data = await res.json();
        alert(data.message);
        if (data.success) window.location.href = "login.html";
    } catch (err) {
        console.error(err);
        alert("Signup failed");
    }
}

async function login() {
    const emailEl = document.getElementById("email");
    const passEl = document.getElementById("password");
    if (!emailEl || !passEl) return alert("Login form incomplete");

    try {
        const res = await fetch('http://34.236.189.241:3000/api/login', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailEl.value, password: passEl.value })
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem("user", JSON.stringify(data.user));
            // ✅ FIX: Just save and redirect. window.onload on index.html
            // reads localStorage and updates the UI correctly on arrival.
            window.location.href = "index.html";
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
        alert("Login failed");
    }
}

// ================= AUTH STATE ON LOAD =================
window.onload = function () {
    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch {
        localStorage.removeItem("user");
    }

    // ✅ FIX: Re-sync the in-memory cart array on every page load
    cart = JSON.parse(localStorage.getItem("cart")) || [];

    const authButtons = document.getElementById("auth-buttons");
    const userInfo = document.getElementById("user-info");
    const username = document.getElementById("username");
    // ✅ FIX: Target hero button to hide it when user is logged in
    const heroBtn = document.querySelector(".hero .login-btn");

    if (user) {
        if (authButtons) authButtons.style.display = "none";
        if (userInfo) userInfo.style.display = "flex";
        if (username) username.innerText = "Hi, " + user.name;
        if (heroBtn) heroBtn.style.display = "none";
    } else {
        if (authButtons) authButtons.style.display = "flex";
        if (userInfo) userInfo.style.display = "none";
        if (heroBtn) heroBtn.style.display = "inline-block";
    }

    updateCartCount();
};