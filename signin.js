function signin() {
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;

    login(email, password);
}

async function login(email, password) {

    let res = await fetch("https://travel-planer-backend-gmnt.onrender.com/users");
    let users = await res.json();

    const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
        alert("User not found!");

        document.getElementById("email").value = "";
        document.getElementById("password").value = "";

        return;
    }

    if (user.password !== password) {
        alert("Incorrect Password!");

        document.getElementById("password").value = "";
        return;
    }

    // Save login
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    alert("Login Successful!");

    window.location.href = "index.html";
}