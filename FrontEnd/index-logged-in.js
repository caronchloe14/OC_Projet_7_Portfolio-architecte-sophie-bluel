const token = localStorage.getItem("token");
const loginLink = document.getElementById("login-link");
const bandeauEdition = document.getElementById("bandeau-edition");

if (token) {
    loginLink.innerText = "logout";
    bandeauEdition.style.display = "block";

    loginLink.addEventListener("click", function(event) {
        event.preventDefault();
        console.log("Clic sur logout détecté");
        localStorage.removeItem("token");
        window.location.href = "index.html";
    });
} else {
    loginLink.innerText = "login";
    bandeauEdition.style.display = "none";
}