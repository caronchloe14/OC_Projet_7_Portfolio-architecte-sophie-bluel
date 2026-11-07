// GESTION D'OUVERTURE / NAVIGATION / FERMETURE DE LA MODALE

// On importe la fonction qui récupère les travaux depuis l'API.
import { recupererTravaux } from "./api.js";
import { supprimerTravaux } from "./modal-delete-work.js"; // Celle ci pour la fonction de suppression de travaux

const modifier = document.getElementById("modify"); // Bouton "modifier"
const globalModal = document.getElementById("js-global-modal") // Toute la modale : background + fenêtre
const modal = document.getElementById("js-modal"); // Fenêtre blanche
const galleryModal = document.getElementById("gallery-modal"); // Modale sur "Galerie"
const addPictureModal = document.getElementById("add-picture-modal"); // Modale sur "Ajout de photo"

// 1. OUVRIR LA MODALE
modifier.addEventListener("click", function(event) {
    globalModal.style.display="flex";
    globalModal.setAttribute("aria-hidden", "false");
})

// 2. RÉCUPÉRER ET AFFICHER LES TRAVAUX

recupererTravaux()
    .then(travaux => {

        // On récupère le conteneur de la galerie dans la modale.
        const containerGalleryModal = document.getElementById("container-gallery-modal");

        // On vide le conteneur avant d'afficher les travaux.
        containerGalleryModal.innerHTML = "";


        // AFFICHER LES TRAVAUX DANS LA MODALE

        // Pour chaque travail récupéré depuis l'API,
        // on crée les éléments HTML nécessaires.
        travaux.forEach(travail => {

            // On crée une figure pour contenir la photo.
            const figureGalleryModal = document.createElement("figure");

            // On crée l'image correspondant au travail.
            const imageTravail = document.createElement("img");
            imageTravail.src = travail.imageUrl;
            imageTravail.alt = travail.title;

            // On crée un bouton "Supprimer" sur chaque figure
            const boutonSupprimer = document.createElement("button");
            boutonSupprimer.type = "button";
            boutonSupprimer.classList.add("bouton-supprimer");
            const iconePoubelle = document.createElement("i");
            iconePoubelle.classList.add("fa-solid", "fa-trash-can");
            boutonSupprimer.appendChild(iconePoubelle);

            // On appelle la fonction importée
            supprimerTravaux(boutonSupprimer, travail.id);

            // On verifie que le bouton correspond à son travail 
            boutonSupprimer.addEventListener("click", function(event){
                console.log("Bouton associé au travail :", travail.id, travail.title, boutonSupprimer);
            })
            
            // On ajoute la figure au conteneur de la modale.
            containerGalleryModal.appendChild(figureGalleryModal);

            // On ajoute l'image et le bouton à la figure.
            figureGalleryModal.appendChild(imageTravail);
            figureGalleryModal.appendChild(boutonSupprimer);
        });
    })
    .catch(error => {

        // On affiche une erreur dans la console si la récupération échoue.
        console.error("Impossible d'afficher les travaux dans la modale :", error);
    });

// 3. NAVIGUER DANS LA MODALE

const goAddPictureModal = document.getElementById("go-add-picture-modal") // Bouton "Ajouter une photo"
const returnGalleryModal = document.getElementById("return-modal") // Flèche de retour

// Accéder à la modale d'ajout de photo
goAddPictureModal.addEventListener("click", function(event){
    modal.classList.add("vue-ajout"); //cf. Transition CSS
    returnGalleryModal.style.display="block";
});

// Retouner à la galerie
returnGalleryModal.addEventListener("click", function(event){
    modal.classList.remove("vue-ajout"); //cf. Transition CSS
    returnGalleryModal.style.display="none";
});
    
// 4. FERMER LA MODALE

const closeModale = document.getElementById("close-modal");

// Fonction commune de fermeture de la modale
function fermerModal() {

    // On réinitialise la vue sur la galerie.
    modal.classList.remove("vue-ajout");

    // On masque la flèche retour.
    returnGalleryModal.style.display = "none";

    // On rend le focus au bouton qui ouvre la modale (liseuse).
    modifier.focus();

    // On ferme la modale.
    globalModal.style.display = "none";
    globalModal.setAttribute("aria-hidden", "true");
}

// Fermeture avec le bouton "X"
closeModale.addEventListener("click", function() {
    fermerModal();
});

// Fermeture en cliquant à l'extérieur de la fenêtre
globalModal.addEventListener("click", function(event) {
    if (!modal.contains(event.target)) { // S'assurer d'être à l'exterieur de modal et dans globalModal
        fermerModal();
    }
});

// Fermeture avec la touche Échap
document.addEventListener("keydown", function(event) {
    if (
        (event.key === "Escape" || event.key === "Esc") &&
        globalModal.style.display !== "none"
    ) {
        fermerModal();
    }
});