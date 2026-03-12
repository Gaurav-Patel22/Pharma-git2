function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://34.236.189.241:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Login successful ✅");
            // FIX: Store the user session data 
            localStorage.setItem("user", JSON.stringify(data.user));
            // FIX: Redirect to dashboard
            window.location.href = "index.html";
        } else {
            alert(data.message || "Invalid credentials ❌");
        }
    })
    .catch(err => {
        console.log(err);
        alert("Server error");
    });
}