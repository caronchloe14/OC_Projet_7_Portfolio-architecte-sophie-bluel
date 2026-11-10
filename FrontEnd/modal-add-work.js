
/*
FICHIER : modal-add-work.js

RÔLE :
Gérer l'ajout d'un travail dans la modale :
sélection de l'image, aperçu, récupération des données,
envoi à l'API et réinitialisation du formulaire.
*/

// On importe la fonction qui récupère les catégories depuis l'API.
import { recupererCategories } from "./api.js";


// 1. RÉCUPÉRER LES ÉLÉMENTS HTML

const ajouterPhoto = document.getElementById("image-upload");
const apercuImage = document.getElementById("image-preview");
const containerUploadImg = document.getElementById("container-upload-img");
const formulaireAjout = document.getElementById("form-add-work");
const titreTravail = document.getElementById("title");
const selectCategory = document.getElementById("select-category");
const messageAjout = document.getElementById("message-ajout");

// On conserve l'URL temporaire de l'image.
let urlApercu = null;


// 2. GÉRER L'AFFICHAGE DES MESSAGES

function afficherMessageAjout(message, type) {
    messageAjout.textContent = message;
    messageAjout.className = `message-${type}`;
    messageAjout.hidden = false;
}

function effacerMessageAjout() {
    messageAjout.textContent = "";
    messageAjout.className = "";
    messageAjout.hidden = true;
}


// 3. AJOUTER UN FICHIER DANS LE CONTAINER D'UPLOAD

// Détecter la sélection d'une image.
ajouterPhoto.addEventListener("change", function(event) {

    // Récupérer le fichier sélectionné.
    const fichier = event.target.files[0];

    // Vérifier qu'un fichier a bien été sélectionné.
    if (!fichier) {
        return;
    }

    // Vérifier que le fichier est au format JPG ou PNG.
    if (fichier.type !== "image/jpeg" && fichier.type !== "image/png") {
        alert("Le fichier doit être au format JPG ou PNG.");
        ajouterPhoto.value = "";
        return;
    }

    // Vérifier que le fichier ne dépasse pas 4 Mo.
    if (fichier.size > 4 * 1024 * 1024) {
        alert("Le fichier ne doit pas dépasser 4 Mo.");
        ajouterPhoto.value = "";
        return;
    }

    // Libérer l'ancienne URL si une image avait déjà été sélectionnée.
    if (urlApercu) {
        URL.revokeObjectURL(urlApercu);
    }

    // Créer une nouvelle URL temporaire.
    urlApercu = URL.createObjectURL(fichier);

    // Afficher l'aperçu.
    apercuImage.src = urlApercu;
    apercuImage.hidden = false;

    // Indiquer qu'une image a été sélectionnée.
    containerUploadImg.classList.add("image-selectionnee");
});


// 4. RÉCUPÉRER LES CATÉGORIES DEPUIS L'API

recupererCategories()
    .then(categories => {

        categories.forEach(categorie => {

            const valueCategory = document.createElement("option");
            valueCategory.value = categorie.id;
            valueCategory.textContent = categorie.name;

            selectCategory.appendChild(valueCategory);
        });
    })
    .catch(error => {
        console.error("Impossible de récupérer les catégories :", error);
    });


// 5. RÉCUPÉRER LE FICHIER, LE TITRE ET LA CATÉGORIE

function recupererFichierTitreCategorie() {

    return {
        titre: titreTravail.value.trim(),
        categorie: selectCategory.value,
        fichier: ajouterPhoto.files[0]
    };
}


// 6. SOUMETTRE LE FORMULAIRE

formulaireAjout.addEventListener("submit", function(event) {

    event.preventDefault();

    // On efface un éventuel ancien message.
    effacerMessageAjout();

    // Récupérer les informations du formulaire.
    const informationsTravail = recupererFichierTitreCategorie();

    // Vérifier qu'une image a bien été sélectionnée.
    if (!informationsTravail.fichier) {
        afficherMessageAjout("Veuillez sélectionner une image.", "erreur");
        return;
    }

    // Construire le FormData attendu par l'API.
    const formData = new FormData();

    formData.append("image", informationsTravail.fichier);
    formData.append("title", informationsTravail.titre);
    formData.append("category", informationsTravail.categorie);

    // Récupérer le token d'authentification.
    const token = localStorage.getItem("token");

    // Envoyer les données à l'API.
    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    })

    // Vérifier la réponse de l'API.
    .then(response => {

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        return response.json();
    })

    // Si le travail a bien été ajouté.
    .then(travailAjoute => {

        console.log("Travail ajouté avec succès :", travailAjoute);

        // Réinitialiser le formulaire.
        reinitialiserFormulaireAjout();

        // Afficher le message de succès.
        afficherMessageAjout("Travail ajouté avec succès", "succes");
    })

    // En cas d'erreur.
    .catch(error => {

        console.error("Impossible d'ajouter le travail :", error);

        // On informe l'utilisateur sans vider ses champs.
        afficherMessageAjout(
            "Une erreur est survenue. Votre formulaire a été conservé.",
            "erreur"
        );
    });
});


// 7. RÉINITIALISER LE FORMULAIRE D'AJOUT

export function reinitialiserFormulaireAjout() {

    // Vider les champs du formulaire.
    formulaireAjout.reset();

    // Libérer l'URL temporaire de l'image.
    if (urlApercu) {
        URL.revokeObjectURL(urlApercu);
        urlApercu = null;
    }

    // Masquer et vider l'aperçu.
    apercuImage.removeAttribute("src");
    apercuImage.hidden = true;

    // Réinitialiser le container d'upload.
    containerUploadImg.classList.remove("image-selectionnee");

    // Effacer les anciens messages.
    effacerMessageAjout();
}
