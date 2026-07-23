const BASE_URL = "https://travel-planer-backend-gmnt.onrender.com";

let allTrips = [];

// ===============================
// Load All Destinations
// ===============================
async function getdestinations() {
    try {

        allTrips = [];

        // Get all countries
        const countryRes = await fetch(`${BASE_URL}/countries`);
        const countries = await countryRes.json();

        // Get trips from each country
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

        displayTrips(allTrips);

    } catch (err) {

        console.error(err);

        document.getElementById("addtrips").innerHTML =
            "<h2>Failed to load destinations.</h2>";

    }
}

// ===============================
// Display Trips
// ===============================
function displayTrips(trips) {

    const container = document.getElementById("addtrips");

    container.innerHTML = "";

    if (trips.length === 0) {

        container.innerHTML = "<h2>No trips found.</h2>";

        return;

    }

    trips.forEach(item => {

        const trip = item.trip;
        const country = item.country;

        const card = document.createElement("div");

        card.className = "trip-card";

        card.innerHTML = `

            <img
                class="buy-image"
                src="${trip.image}"
                alt="${trip.title}"
            >

            <small class="duration">${country}</small>

            <h2 class="buy-h2">
                ${trip.title}
            </h2>

            <p class="duration">
                ${trip.duration}
            </p>

            <div class="price-box">

                <div class="price-info">

                    <span class="from">
                        FROM
                    </span>

                    <span class="price">
                        ${trip.currency}${trip.price}
                    </span>

                    <small>Per Person</small>

                </div>

            </div>

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

}

// ===============================
// Search Trips
// ===============================
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

// ===============================
// Search on Enter
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