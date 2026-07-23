let buynow = document.getElementById("buynow");
let user = JSON.parse(localStorage.getItem("loggedInUser"));

// Load all trips
fetch("http://localhost:3000/trips")
    .then(res => res.json())
    .then(data => {

        data.forEach(element => {

            let div = document.createElement("div");
            div.className = "trip-card";

            div.innerHTML = `
                <img class="buy-image" src="${element.image}" alt="">

                <p class="duration">${element.duration}</p>

                <h2 class="buy-h2">${element.title}</h2>

                <label for="travelDate${element.id}">
                    📅 Select Travel Date
                </label>

                <input
                    type="date"
                    id="travelDate${element.id}"
                    class="travelDate"
                >

                <div class="bottom">

                    <button
                        class="btn-view"
                        onclick="addTrip('${element.id}','travelDate${element.id}')">

                        Add To My Trips

                    </button>

                    <div class="price-box">

                        <span class="from">FROM</span>

                        <span class="price">
                            ${element.currency}${Number(element.price).toLocaleString()}
                        </span>

                        <small>per person</small>

                    </div>

                </div>
            `;

            buynow.appendChild(div);

            // Prevent past dates
            document.getElementById(`travelDate${element.id}`).min =
                new Date().toISOString().split("T")[0];

        });

    });


// Add Trip
async function addTrip(id, dateInputId) {

    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!user) {
        alert("Please login first.");
        window.location.href = "signin.html";
        return;
    }

    const plannedDate = document.getElementById(dateInputId).value;

    if (!plannedDate) {
        alert("Please select a travel date.");
        return;
    }

    try {

        // Get selected trip
        const tripRes = await fetch(`http://localhost:3000/trips/${id}`);

        if (!tripRes.ok) {
            throw new Error("Trip not found");
        }

        const trip = await tripRes.json();

        // Get latest user
        const userRes = await fetch(`http://localhost:3000/users/${user.id}`);

        if (!userRes.ok) {
            throw new Error("User not found");
        }

        const userData = await userRes.json();

        if (!userData.trips) {
            userData.trips = [];
        }

        // Prevent duplicates
        const exists = userData.trips.some(
            t => t.id == trip.id
        );

        if (exists) {
            alert("Trip already added!");
            return;
        }

        // Save travel date
        trip.plannedDate = plannedDate;

        userData.trips.push(trip);

        const updateRes = await fetch(`http://localhost:3000/users/${user.id}`, {

            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                trips: userData.trips
            })

        });

        if (!updateRes.ok) {
            throw new Error("Failed to update user");
        }

        const updatedUser = await updateRes.json();

        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(updatedUser)
        );

        alert("Trip added successfully!");

    } catch (err) {

        console.error(err);

        alert("Something went wrong.");

    }
}