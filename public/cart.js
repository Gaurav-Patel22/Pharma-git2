// Get cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Get HTML elements
let cartItemsContainer = document.getElementById("cart-items");
let grandTotal = 0;

// Check if cart table exists
if (!cartItemsContainer) {
    console.error("cart-items element not found");
}

// If cart empty
if (cart.length === 0) {
    cartItemsContainer.innerHTML =
        "<tr><td colspan='4'>Your cart is empty</td></tr>";
} 
else {

    cart.forEach((item, index) => {

        let total = item.price * item.quantity;
        grandTotal += total;

        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.name}</td>
            <td>₹${item.price}</td>
            <td>${item.quantity}</td>
            <td>₹${total}</td>
        `;

        cartItemsContainer.appendChild(row);
    });
}

// Update grand total
let grandTotalElement = document.getElementById("grand-total");

if (grandTotalElement) {
    grandTotalElement.innerText = "Grand Total: ₹" + grandTotal;
}

// Update cart count in navbar
let cartCount = document.getElementById("cart-count");

if (cartCount) {
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;
}