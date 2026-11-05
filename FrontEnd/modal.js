const modifier = document.getElementById("modify"); // Bouton "modifier"
const globalModal = document.getElementById("js-global-modal") // Toute la modale : background + fenêtre
const modal = document.getElementById("js-modal"); // Fenêtre blanche
const galleryModal = document.getElementById("gallery-modal"); // Modale sur "Galerie"
const addPictureModal = document.getElementById("add-picture-modal"); // Modale sur "Ajout de photo"

// 1. OUVRIR LA MODALE
modifier.addEventListener("click", function(event) {
    globalModal.style.display="flex";
})

// 2. RÉCUPÉRER LES TRAVAUX

// On importe la fonction qui récupère les travaux depuis l'API.
import { recupererTravaux } from "./api-travaux.js";

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

            // On ajoute la figure au conteneur de la modale.
            containerGalleryModal.appendChild(figureGalleryModal);

            // On ajoute l'image à la figure.
            figureGalleryModal.appendChild(imageTravail);
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
    galleryModal.style.display="none";
    addPictureModal.style.display="flex";
    returnGalleryModal.style.display="block";
});

// Retouner à la galerie
returnGalleryModal.addEventListener("click", function(event){
    galleryModal.style.display="flex";
    addPictureModal.style.display="none";
    returnGalleryModal.style.display="none";
});
    
// 4. FERMER LA MODALE

const closeModale = document.getElementById("close-modal")
// Par le bouton "X"
closeModale.addEventListener("click", function(event){
    globalModal.style.display="none";
})
// En cliquant en dehors de la fenêtre uniquement 
globalModal.addEventListener("click", function(event) {
    if (!modal.contains(event.target)) {
        globalModal.style.display = "none";
    }
});
// En pressant la touche "Esc"
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" || event.key === "Esc") {
        globalModal.style.display = "none";
    }
});