let user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user) {
    alert("Please login to view your trips.");
    window.location.href = "signin.html";
    throw new Error("User not logged in");
}

getdata();

async function getdata() {

    let userres = await fetch(`https://travel-planer-backend-gmnt.onrender.com/users/${user.id}`);
    let currentuser = await userres.json();

    let buynow = document.getElementById("addtrips");
    buynow.innerHTML = "";

    if (!currentuser.trips || currentuser.trips.length === 0) {
        buynow.innerHTML = "<h2>No trips added yet.</h2>";
        return;
    }

    currentuser.trips.forEach(element => {

        let div = document.createElement("div");
        div.className = "trip-card";

        div.innerHTML = `
            <img class="buy-image" src="${element.image}" alt="">

            <p class="duration">${element.duration}</p>

            <h2 class="buy-h2">${element.title}</h2>

            <div class="price-box">
                <div class="price-info">
               <div class="date">
    📅 Planned Date<br>
    <strong>${element.plannedDate}</strong>
</div>
                    <span class="from">FROM</span>
                    <span class="price">${element.currency}${element.price.toLocaleString()}</span>
                    <small>per person</small>
                </div>
                <button class="delete-btn" onclick="deletedata('${element.id}')">
                    🗑 Delete
                </button>
            </div>
        `;

        buynow.appendChild(div);
    });
}

async function deletedata(id) {

    let userres = await fetch(`https://travel-planer-backend-gmnt.onrender.com/users/${user.id}`);
    let currentuser = await userres.json();

    for (let i = 0; i < currentuser.trips.length; i++) {
        if (currentuser.trips[i].id == id) {
            currentuser.trips.splice(i, 1);
            break;
        }
    }

    await fetch(`https://travel-planer-backend-gmnt.onrender.com/users/${user.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            trips: currentuser.trips
        })
    });

    getdata();
}