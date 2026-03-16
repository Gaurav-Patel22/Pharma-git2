// ================= REDIRECTION =================
function openSignup() {
    window.location.href = "signup.html";
}

function openLogin() {
    window.location.href = "login.html";
}

function openCartPage() {
    window.location.href = "cart.html";
}

function logout() {
    localStorage.removeItem("user");
    window.location.reload();
}


// ================= CART LOGIC =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

updateCartCount();

function addToCart(name, price) {
    let existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    alert(name + " added to cart 🛒");
}

function updateCartCount() {
    let count = cart.reduce((sum, item) => sum + item.quantity, 0);

    let cartCount = document.getElementById("cart-count");
    let cartCountUser = document.getElementById("cart-count-user");

    if (cartCount) cartCount.innerText = count;
    if (cartCountUser) cartCountUser.innerText = count;
}

// ================= AUTH STATE =================
window.onload = function () {

    const user = JSON.parse(localStorage.getItem("user"));

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
};
