// ---------------- GET COUNTRY FROM URL ----------------

const params = new URLSearchParams(window.location.search);
const countryName = params.get("country");

// ---------------- COUNTRY DETAILS ----------------

fetch("http://localhost:3000/countries")
    .then(res => res.json())
    .then(countries => {

        const country = countries.find(c => c.name === countryName);

        if (!country) {
            document.getElementById("destination-name").textContent = "Destination Not Found";
            return;
        }

        document.getElementById("destination-name").textContent = country.name;
        document.getElementById("rating").textContent = "⭐ Rating : " + country.rating;
        document.getElementById("continent").textContent = "🌍 Continent : " + country.continent;
        document.getElementById("Best-season").textContent = "🌤️ Best Season : " + country.bestSeason;
        document.getElementById("currency").textContent = "💰 Currency : " + country.currency;
        document.getElementById("language").textContent = "🗣️ Language : " + country.language;

        // Hero Section
        document.getElementById("details-name").textContent = country.name;
        document.getElementById("details-image").src = country.image;
        document.getElementById("details-image").alt = country.name;

        if (country.quote) {
            document.getElementById("details-quote").textContent = country.quote;
        }

    })
    .catch(err => console.error(err));


// ---------------- TRIP PACKAGES ----------------

const buynow = document.getElementById("buyit");

fetch(`https://travel-planer-backend-gmnt.onrender.com/${countryName}`)
    .then(res => res.json())
    .then(data => {

        data.forEach(element => {

            let div = document.createElement("div");
            div.className = "trip-card";

            div.innerHTML = `
                <img class="buy-image" src="${element.image}" alt="${element.title}">

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
                        onclick="addtrip(${element.id}, '${countryName}','travelDate${element.id}')">

                        Add To My Trips

                    </button>

                    <div class="price-box">

                        <span class="from">FROM</span>

                        <span class="price">
                            ${element.currency}${element.price.toLocaleString()}
                        </span>

                        <small>per person</small>

                    </div>

                </div>
            `;

            buynow.appendChild(div);

            // Allow only today and future datess
            const today = new Date().toISOString().split("T")[0];

            document.getElementById(`travelDate${element.id}`).min = today;

        });

    })
    .catch(err => console.error(err));