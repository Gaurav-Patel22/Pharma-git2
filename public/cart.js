let cart = JSON.parse(localStorage.getItem("cart")) || [];
let cartItemsContainer = document.getElementById("cart-items");
let grandTotal = 0;

if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<tr><td colspan='4'>Your cart is empty</td></tr>";
} else {
    cart.forEach(item => {
        let total = item.price * item.quantity;
        grandTotal += total;

        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td>${item.quantity}</td>
            <td>${total}</td>
        `;
        cartItemsContainer.appendChild(row);
    });
}

document.getElementById("grand-total").innerText =
    "Grand Total: ₹" + grandTotal;
