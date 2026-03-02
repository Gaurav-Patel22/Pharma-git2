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
    const heroBtn = document.getElementById("hero-auth-btn");

    if (user) {
        authButtons.style.display = "none";
        userInfo.style.display = "flex";
        document.getElementById("username").innerText = "Hi, " + user.name;

        heroBtn.innerText = "Browse Medicines";
        heroBtn.onclick = () => {
            document.getElementById("medicines").scrollIntoView({
                behavior: "smooth"
            });
        };
    } else {
        authButtons.style.display = "flex";
        userInfo.style.display = "none";

        heroBtn.innerText = "Get Started";
        heroBtn.onclick = openSignup;
    }
};
