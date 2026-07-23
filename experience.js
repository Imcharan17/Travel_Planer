let user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user) {
    alert("Please login first.");
    window.location.href = "signin.html";
}

loadExperiences();

async function postExperience() {

    const title = document.getElementById("title").value.trim();
    const country = document.getElementById("country").value.trim();
    const description = document.getElementById("description").value.trim();
    const image = document.getElementById("image").value.trim();

    if (title === "" || country === "" || description === "" || image === "") {
        alert("Please fill all fields.");
        return;
    }

    // Get display name
    let displayName = "";

    if (user.username) {
        displayName = user.username;
    } else if (user.name) {
        displayName = user.name;
    } else if (user.email) {
        displayName = user.email.split("@")[0];
    } else {
        displayName = "Guest";
    }

    const experience = {
        user: displayName,
        title: title,
        country: country,
        description: description,
        image: image,
        date: new Date().toLocaleDateString()
    };

    await fetch("http://localhost:3000/experiences", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(experience)

    });

    document.getElementById("title").value = "";
    document.getElementById("country").value = "";
    document.getElementById("description").value = "";
    document.getElementById("image").value = "";

    loadExperiences();
}

async function loadExperiences() {

    const res = await fetch("http://localhost:3000/experiences");
    const data = await res.json();

    const posts = document.getElementById("posts");

    posts.innerHTML = "";

    data.reverse().forEach(post => {

        const username = post.user || "Guest";
        const firstLetter = username.charAt(0).toUpperCase();

        const div = document.createElement("div");

        div.className = "experience-card";

        div.innerHTML = `

            <div class="experience-header">

                <div class="profile">

                    <div class="profile-circle">

                        ${firstLetter}

                    </div>

                    <div>

                        <h3>${username}</h3>

                        <p>📍 ${post.country}</p>

                    </div>

                </div>

                <span class="post-date">

                    📅 ${post.date}

                </span>

            </div>

            <img
                class="experience-image"
                src="${post.image}"
                alt="${post.title}"
            >

            <div class="experience-content">

                <h2>${post.title}</h2>

                <p>${post.description}</p>

            </div>

        `;

        posts.appendChild(div);

    });

}