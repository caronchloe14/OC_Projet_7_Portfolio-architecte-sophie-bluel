
// GESTION COMPLETE DE L'AJOUT DE PROJET

// On importe la fonction qui récupère les catégories depuis l'API.
import { recupererCategories } from "./api.js";
import { mettreAJourGaleries } from "./update-galleries.js";


// 1. RÉCUPÉRER LES ÉLÉMENTS HTML

const ajouterPhoto = document.getElementById("image-upload");
const apercuImage = document.getElementById("image-preview");
const containerUploadImg = document.getElementById("container-upload-img");
const formulaireAjout = document.getElementById("form-add-work");
const titreTravail = document.getElementById("title");
const selectCategory = document.getElementById("select-category");
const messageAjout = document.getElementById("message-ajout");
const boutonValider = document.getElementById("valider-ajout-photo");

// On conserve l'URL temporaire de l'image (vide par défaut, elle se remplit à l'ajout d'image)
let urlApercu = null;

// On désactive le bouton "Valider"
actualiserEtatBouton();


// 2. GÉRER L'AFFICHAGE DES MESSAGES D'ERREUR ET SUCCES

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


// 3. AJOUTER UN FICHIER VALIDE DANS LE CONTAINER D'UPLOAD

// Détecter la sélection d'une image.
ajouterPhoto.addEventListener("change", function(event) {

    // Récupérer le fichier sélectionné.
    const fichier = event.target.files[0];

    // Vérifier qu'un fichier a bien été sélectionné.
    if (!fichier) {
        return; // Si le résulat n'est pas ce qu'on attend : on arrête là.
    }

    // Vérifier que le fichier est au format JPG ou PNG.
    if (fichier.type !== "image/jpeg" && fichier.type !== "image/png") {
        alert("Le fichier doit être au format JPG ou PNG.");
        ajouterPhoto.value = "";
        return; // Si le résulat n'est pas ce qu'on attend : on arrête là.
    }

    // Vérifier que le fichier ne dépasse pas 4 Mo.
    if (fichier.size > 4 * 1024 * 1024) {
        alert("Le fichier ne doit pas dépasser 4 Mo.");
        ajouterPhoto.value = "";
        return; // Si le résulat n'est pas ce qu'on attend : on arrête là.
    }

    // Libérer l'ancienne URL des ajout précédents
    if (urlApercu) {
        URL.revokeObjectURL(urlApercu);
    }

    // Créer une nouvelle URL temporaire avec le fichier téléchargé
    urlApercu = URL.createObjectURL(fichier);

    // Afficher l'aperçu.
    apercuImage.src = urlApercu;
    apercuImage.hidden = false;

    // Indiquer qu'une image a été sélectionnée au DOM
    containerUploadImg.classList.add("image-selectionnee");
});


// 4. RÉCUPÉRER LES CATÉGORIES DEPUIS L'API POUR LE DROPDOWN

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

function recupererFichierTitreCategorie() { // On prépare (= un objet JS) et on retourne les données liées au nouveau projet

    return { // Return envoie le resultat là où la fonction est appelée
        titre: titreTravail.value.trim(), // On récupère la valeur saisie par l'utilisateur dans le champ HTML lié à titreTravail et on supprime les espaces inutiles avec trim
        categorie: selectCategory.value, // On récupère l'ID de la catégorie sélectionnée
        fichier: ajouterPhoto.files[0] // On récupère le fichier téléchargé valide
    };
}

// 6. ACTIVER LE BOUTON "VALIDER" POUR SOUMETTRE LE FORMULAIRE
function actualiserEtatBouton() {

    const formulaireComplet =
        titreTravail.value.trim() !== "" && // Titre n'est pas vide et les espaces ne comptent pas
        selectCategory.value !== "" && // Une catégorie sélectionnée
        ajouterPhoto.files.length > 0; // Un fichier valide est uploadé

    boutonValider.disabled = !formulaireComplet; // Si résultat différent de "formulaireComplet" on reste disabled
}

formulaireAjout.addEventListener("input", actualiserEtatBouton);
formulaireAjout.addEventListener("change", actualiserEtatBouton);

actualiserEtatBouton();

// 7. SOUMETTRE LE FORMULAIRE S'IL EST VALIDE
formulaireAjout.addEventListener("submit", function(event) {

    event.preventDefault();

    // On efface un éventuel ancien message d'un ajout précédent.
    effacerMessageAjout();

    // Récupérer les informations du formulaire dans une variable
    const informationsTravail = recupererFichierTitreCategorie();

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

    // Vérifier la réponse de l'API + retourner la réponse en JSON
    .then(response => {

        if (!response.ok) { // Si != OK alors on retourne le statut de l'erreur 
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        return response.json(); // Si OK -> on retourne la réponse au format JSON
    })

    // Quand la réponse (promise) est OK, on l'exploite -> on lance l'opération dédiée
    // Ici on indique que le travail a été ajouté, on clean le formulaire, on prévient l'utilsateur, on update les galeries...
    .then(travailAjoute => {

        console.log("Travail ajouté avec succès :", travailAjoute);

        // Réinitialiser le formulaire.
        reinitialiserFormulaireAjout();

        // Afficher le message de succès.
        afficherMessageAjout("Travail ajouté avec succès", "succes");

        // On gère la mise à jour des galeries 
        mettreAJourGaleries();
    })

    // Si la réponse (promise) n'est pas OK -> on gère l'erreur
    .catch(error => {

        console.error("Impossible d'ajouter le travail :", error);

        // On informe l'utilisateur sans vider ses champs.
        afficherMessageAjout(
            "Une erreur est survenue. Votre formulaire a été conservé.",
            "erreur"
        );
    });
});


// 8. RÉINITIALISER LE FORMULAIRE D'AJOUT

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

    // On remet le bouton "Valider" en disabled
    actualiserEtatBouton();
}
