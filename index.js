const links = document.querySelectorAll(".country");

links.forEach(link => {

    link.addEventListener("click", function(e){

        e.preventDefault();

        const country = this.textContent.trim();
                window.location.href =
        `details.html?country=${encodeURIComponent(country)}`;

    });

});