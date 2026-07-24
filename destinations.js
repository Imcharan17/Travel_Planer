const BASE_URL = "https://travel-planer-backend-gmnt.onrender.com";

let allTrips = [];

async function getdestinations() {

    try {

        allTrips = [];

        const countryRes = await fetch(`${BASE_URL}/countries`);
        const countries = await countryRes.json();

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

        document.getElementById("destination-container").innerHTML =
            "<h2>Failed to load destinations.</h2>";

    }

}

function displayTrips(trips) {

    const container = document.getElementById("destination-container");

    container.innerHTML = "";

    if (trips.length === 0) {

        container.innerHTML = "<h2>No trips found.</h2>";

        return;

    }

    trips.forEach(item => {

        const trip = item.trip;
        const country = item.country;

        const card = document.createElement("div");

        card.className = "destination-card";

        card.innerHTML = `

            <img
                src="${trip.image}"
                alt="${trip.title}"
            >

            <small>${country}</small>

            <h2>${trip.title}</h2>

            <p>${trip.duration}</p>

            <div class="price-box">

                <span class="from">FROM</span>

                <span class="price">
                    ${trip.currency}${trip.price}
                </span>

                <small>Per Person</small>

            </div>

            <label>
                📅 Select Travel Date
            </label>

            <input
                type="date"
                id="travelDate${trip.id}"
            >

            <button
                onclick="addtrip('${trip.id}','${country}','travelDate${trip.id}')">

                Add To My Trips

            </button>

        `;

        container.appendChild(card);

        document.getElementById(`travelDate${trip.id}`).min =
            new Date().toISOString().split("T")[0];

    });

}

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

    const filtered = allTrips.filter(item =>

        item.country.toLowerCase().includes(keyword) ||

        item.trip.title.toLowerCase().includes(keyword) ||

        item.trip.duration.toLowerCase().includes(keyword) ||

        item.trip.price.toString().includes(keyword)

    );

    displayTrips(filtered);

}

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("search").addEventListener("keyup", e => {

        if (e.key === "Enter") {

            searchTrips();

        }

    });

    getdestinations();

});