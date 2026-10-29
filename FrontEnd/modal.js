
/*
FICHIER : modal.js

RÔLE :
Afficher les travaux dans la galerie de la modale.

Les travaux sont récupérés grâce à la fonction commune
recupererTravaux() définie dans api-travaux.js.

Ce fichier ne récupère donc pas directement les travaux avec fetch().
*/

// On importe la fonction qui récupère les travaux depuis l'API.
import { recupererTravaux } from "./api-travaux.js";


// 1. RÉCUPÉRER LES TRAVAUX

recupererTravaux()
    .then(travaux => {

        // On récupère le conteneur de la galerie dans la modale.
        const containerGalleryModal = document.getElementById("container-gallery-modal");

        // On vide le conteneur avant d'afficher les travaux.
        containerGalleryModal.innerHTML = "";


        // 2. AFFICHER LES TRAVAUX DANS LA MODALE

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
