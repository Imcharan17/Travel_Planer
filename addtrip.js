const BASE_URL = "https://travel-planer-backend-gmnt.onrender.com";

let allTrips = [];
let filteredTrips = [];
let user = JSON.parse(localStorage.getItem("loggedInUser"));

const ITEMS_PER_LOAD = 15;
let currentIndex = 0;

// Load all destinations
async function getdestinations() {

    try {

        allTrips = [];

        // Fetch all countries
        const countryRes = await fetch(`${BASE_URL}/countries`);
        const countries = await countryRes.json();

        // Fetch trips for every country
        for (const country of countries) {

            const countryName = country.name;

            const tripRes = await fetch(
                `${BASE_URL}/${encodeURIComponent(countryName)}`
            );

            const trips = await tripRes.json();

            if (Array.isArray(trips)) {

                trips.forEach(trip => {

                    allTrips.push({
                        country: countryName,
                        trip: trip
                    });

                });

            }

        }

        filteredTrips = [...allTrips];

        currentIndex = 0;

        renderTrips();

    }

    catch (err) {

        console.error(err);

        document.getElementById("addtrips").innerHTML =
            "<h2>Failed to load destinations.</h2>";

    }

}

// Render Cards (Lazy Loading)
function renderTrips() {

    const container = document.getElementById("addtrips");

    if (currentIndex === 0) {

        container.innerHTML = "";

    }

    const trips = filteredTrips.slice(
        currentIndex,
        currentIndex + ITEMS_PER_LOAD
    );

    trips.forEach(item => {

        const trip = item.trip;
        const country = item.country;

        const card = document.createElement("div");

        card.className = "trip-card";

        card.innerHTML = `

            <img src="${trip.image}" alt="${trip.title}">

            <small>${country}</small>

            <h3>${trip.title}</h3>

            <p>📅 ${trip.duration}</p>

            <h2>${trip.currency}${trip.price}</h2>

            <label for="travelDate${trip.id}">
                📅 Select Travel Date
            </label>

            <input
                type="date"
                id="travelDate${trip.id}"
                class="travelDate"
            >

            <button
                class="btn-view"
                onclick="addtrip('${trip.id}','${country}','travelDate${trip.id}')">

                Add To My Trips

            </button>

        `;

        container.appendChild(card);

        document.getElementById(`travelDate${trip.id}`).min =
            new Date().toISOString().split("T")[0];

    });

    currentIndex += ITEMS_PER_LOAD;

    let btn = document.getElementById("showMoreBtn");

    if (!btn) {

        btn = document.createElement("button");

        btn.id = "showMoreBtn";

        btn.innerText = "Show More";

        btn.className = "btn-view";

        btn.style.display = "block";

        btn.style.margin = "40px auto";

        btn.onclick = renderTrips;

        container.parentElement.appendChild(btn);

    }

    if (currentIndex >= filteredTrips.length) {

        btn.style.display = "none";

    }

    else {

        btn.style.display = "block";

    }

}

function searchTrips() {

    const keyword = document
        .getElementById("search")
        .value
        .trim()
        .toLowerCase();

    if (keyword === "") {

        filteredTrips = [...allTrips];

    } else {

        filteredTrips = allTrips.filter(item => {

            return (

                item.country.toLowerCase().includes(keyword) ||

                item.trip.title.toLowerCase().includes(keyword) ||

                item.trip.duration.toLowerCase().includes(keyword) ||

                item.trip.price.toString().includes(keyword)

            );

        });

    }

    currentIndex = 0;

    renderTrips();

}


// ===============================
// Page Load
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const search = document.getElementById("search");

    if (search) {

        search.addEventListener("keyup", function (event) {

            if (event.key === "Enter") {

                searchTrips();

            }

        });

    }

    getdestinations();

});


// ===============================
// Add Trip
// ===============================

async function addtrip(id, countryName, dateInputId) {

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

        const res = await fetch(

            `${BASE_URL}/${encodeURIComponent(countryName)}/${id}`

        );

        if (!res.ok) {

            throw new Error("Trip not found");

        }

        const trip = await res.json();

        const userRes = await fetch(

            `${BASE_URL}/users/${user.id}`

        );

        if (!userRes.ok) {

            throw new Error("User not found");

        }

        const userData = await userRes.json();

        if (!userData.trips) {

            userData.trips = [];

        }

        const alreadyAdded = userData.trips.some(

            t =>

                t.id == trip.id &&

                t.countryName === countryName

        );

        if (alreadyAdded) {

            alert("Trip already added!");

            return;

        }

        trip.countryName = countryName;

        trip.plannedDate = plannedDate;
                userData.trips.push(trip);

        const updateRes = await fetch(

            `${BASE_URL}/users/${user.id}`,

            {
                method: "PATCH",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    trips: userData.trips
                })

            }

        );

        if (!updateRes.ok) {

            throw new Error("Failed to update user.");

        }

        const updatedUser = await updateRes.json();

        // Update Local Storage

        localStorage.setItem(

            "loggedInUser",

            JSON.stringify(updatedUser)

        );

        user = updatedUser;

        alert("Trip added successfully!");

    }

    catch (err) {

        console.error(err);

        alert("Something went wrong. Please try again.");

    }

}