const token = localStorage.getItem("token");
const loginLink = document.getElementById("login-link");
const bandeauEdition = document.getElementById("bandeau-edition");
const tousLesBoutons = document.querySelector(".filters");
const mesProjets = document.querySelector(".portfolio-title");
const modifier = document.getElementById("modify");

if (token) { //Connecté = Affichage administrateur
    loginLink.innerText = "logout";
    bandeauEdition.style.display = "block";
    tousLesBoutons.style.display = "none";
    mesProjets.style.marginBottom = "5em";
    modifier.style.display = "inline";

    loginLink.addEventListener("click", function(event) {
        event.preventDefault();
        console.log("Clic sur logout détecté");
        localStorage.removeItem("token");
        window.location.href = "index.html";
    });
} else { //Déconnecté = Affichage visiteur
    loginLink.innerText = "login";
    bandeauEdition.style.display = "none";
    tousLesBoutons.style.display = "flex";
    modifier.style.display = "none";
}