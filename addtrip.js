let user = JSON.parse(localStorage.getItem("loggedInUser"));

async function addtrip(id, countryName, dateInputId) {

    // Check if user is logged in
    if (!user) {
        alert("Please login first.");
        window.location.href = "signin.html";
        return;
    }

    // Get selected travel date
    const plannedDate = document.getElementById(dateInputId).value;

    if (!plannedDate) {
        alert("Please select a travel date.");
        return;
    }

    try {

        // Fetch selected trip
        const res = await fetch(`http://localhost:3000/${countryName}/${id}`);

        if (!res.ok) {
            throw new Error("Trip not found");
        }

        const trip = await res.json();

        // Fetch latest user data
        const userRes = await fetch(`http://localhost:3000/users/${user.id}`);

        if (!userRes.ok) {
            throw new Error("User not found");
        }

        const userData = await userRes.json();

        // Create trips array if it doesn't exist
        if (!userData.trips) {
            userData.trips = [];
        }

        // Prevent duplicate trips
        const alreadyAdded = userData.trips.some(
            t => t.id === trip.id && t.countryName === countryName
        );

        if (alreadyAdded) {
            alert("Trip already added!");
            return;
        }

        // Save additional information
        trip.countryName = countryName;
        trip.plannedDate = plannedDate;

        // Add trip
        userData.trips.push(trip);

        // Update user in JSON Server
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
            throw new Error("Failed to update user.");
        }

        const updatedUser = await updateRes.json();

        // Update localStorage
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

        // Update current user variable
        user = updatedUser;

        alert("Trip added successfully!");

    } catch (err) {
        console.error(err);
        alert("Something went wrong. Please try again.");
    }
}