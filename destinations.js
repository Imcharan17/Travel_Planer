let allTrips = [];

// Load all destinations
async function getdestinations() {

    const res = await fetch("trips.json");
    const data = await res.json();

    allTrips = [];

    for (let country in data) {

        // Skip non-destination collections
        if (
            country === "trips" ||
            country === "users" ||
            country === "countries" ||
            country==="experiences"||
            country === "$schema"
        ) {
            continue;
        }

        let trips = data[country];

        if (!Array.isArray(trips)) {
            continue;
        }

        trips.forEach(trip => {
            allTrips.push({
                country: country,
                trip: trip
            });
        });
    }

    displayTrips(allTrips);
}

// Display trips
function displayTrips(trips) {

    const container = document.getElementById("addtrips");
    container.innerHTML = "";

    if (trips.length === 0) {
        container.innerHTML = "<h2>No trips found.</h2>";
        return;
    }

    trips.forEach(item => {

        let trip = item.trip;
        let country = item.country;

        let card = document.createElement("div");
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
                onclick="addtrip(${trip.id}, '${country}', 'travelDate${trip.id}')">

                Add To My Trips

            </button>
        `;

        container.appendChild(card);

        // Prevent selecting past dates
        document.getElementById(`travelDate${trip.id}`).min =
            new Date().toISOString().split("T")[0];
    });
}

// Search Function
function searchTrips() {

    const keyword = document
        .getElementById("search")
        .value
        .trim()
        .toLowerCase();

    if (keyword === "") {
        displayTrips(allTrips);
        return;
    }

    const filteredTrips = allTrips.filter(item => {

        return (
            item.country.toLowerCase().includes(keyword) ||
            item.trip.title.toLowerCase().includes(keyword) ||
            item.trip.duration.toLowerCase().includes(keyword) ||
            item.trip.price.toString().includes(keyword)
        );

    });

    displayTrips(filteredTrips);
}

// Press Enter to Search
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