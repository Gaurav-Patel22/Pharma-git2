// Wrap everything in a reusable function so we can re-render when quantity changes
function renderCart() {
    // Always fetch latest cart state
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItemsContainer = document.getElementById("cart-items");
    let grandTotal = 0;

    if (!cartItemsContainer) return;

    // Clear existing table rows before redrawing
    cartItemsContainer.innerHTML = "";

    // Handle Empty Cart
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<tr><td colspan='5' style='text-align: center; padding: 20px;'>Your cart is empty</td></tr>";
        updateTotals(0, 0);
        return;
    }

    // Generate Rows
    cart.forEach((item, index) => {
        let total = item.price * item.quantity;
        grandTotal += total;

        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.name}</td>
            <td>₹${item.price}</td>
            <td>
                <button class="qty-btn" onclick="changeQuantity(${index}, -1)" style="padding: 2px 8px; cursor: pointer;">-</button>
                <span style="margin: 0 10px; font-weight: bold;">${item.quantity}</span>
                <button class="qty-btn" onclick="changeQuantity(${index}, 1)" style="padding: 2px 8px; cursor: pointer;">+</button>
            </td>
            <td style="font-weight: bold;">₹${total}</td>
            <td>
                <button class="remove-btn" onclick="removeItem(${index})" style="background: #ff4d4d; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Remove</button>
            </td>
        `;

        cartItemsContainer.appendChild(row);
    });

    // Update Totals
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    updateTotals(grandTotal, totalItems);
}

// Helper: Update Grand Total & Navbar Counters
function updateTotals(grandTotal, totalItems) {
    let grandTotalElement = document.getElementById("grand-total");
    if (grandTotalElement) {
        grandTotalElement.innerText = "Grand Total: ₹" + grandTotal;
    }

    // Also update navbar counters if script.js is loaded
    if (typeof updateCartCount === "function") {
        updateCartCount();
    }
}

// Action: Change Quantity (+ / -)
window.changeQuantity = function(index, changeAmount) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (cart[index]) {
        cart[index].quantity += changeAmount;
        
        // Prevent quantity from dropping below 1
        if (cart[index].quantity < 1) {
            cart[index].quantity = 1;
            return; // Exit early if no change is made
        }
        
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart(); // Instantly update UI
    }
};

// Action: Remove Item
window.removeItem = function(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (confirm("Are you sure you want to remove this medicine from your cart?")) {
        cart.splice(index, 1); // Remove 1 item at the specific index
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart(); // Instantly update UI
    }
};

// Run rendering on initial page load
document.addEventListener("DOMContentLoaded", renderCart);