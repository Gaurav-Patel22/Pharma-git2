function signup() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://34.236.189.241:3000//signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Signup successful ✅");
            window.location.href = "login.html";
        } else {
            alert(data.message);
        }
    })
    .catch(err => {
        console.log(err);
        alert("Error connecting to server");
    });
}