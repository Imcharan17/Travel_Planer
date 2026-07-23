function signup(){
let email=document.getElementById("email").value.trim();
let password=document.getElementById("password").value;
create(email,password)
}
async function create(email,password) {
    // Get all users
    const response = await fetch("https://travel-planer-backend-gmnt.onrender.com/users");
    const users = await response.json();

    // Check if email already exists
    const userExists = users.some(user => user.email === email);

    if (userExists) {
        alert("Email already registered!");
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        return;
    }
    else{
    await fetch("https://travel-planer-backend-gmnt.onrender.com/users",{"method":"POST",
        "headers":{
            "content-Type":"application/json"
        },
        "body":JSON.stringify({
            "email":email,
            "password":password,
        trips:[]})
    })
    alert("Account Created Sucessfully");
}
}