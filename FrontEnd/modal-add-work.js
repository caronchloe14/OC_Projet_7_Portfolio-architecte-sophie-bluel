// GESTION DE L'AJOUT DES TRAVAUX DANS LA MODALE

// On importe les fonctions qui récupèrent les données depuis l'API.
import { recupererTravaux, recupererCategories } from "./api.js";

// On récupère nos éléments
const ajouterPhoto = document.getElementById("image-upload");
const apercuImage = document.getElementById("image-preview");
const containerUploadImg = document.getElementById("container-upload-img");
const formulaireAjout = document.getElementById("form-add-work");

let urlApercu = null;

// 1. AJOUTER UN FICHIER DANS LE CONTAINER D'UPLOAD D'IMAGE

// Détecter la sélection d'une image
ajouterPhoto.addEventListener("change", function(event) {

    // Récupérer le fichier sélectionné
    const fichier = event.target.files[0];

    // Vérifier qu'un fichier a bien été sélectionné
    if (!fichier) {
        return;
    }

    // Vérifier que le fichier est au format JPG ou PNG
    if (fichier.type !== "image/jpeg" && fichier.type !== "image/png") {
        alert("Le fichier doit être au format JPG ou PNG.");

        // Réinitialiser le champ pour permettre une nouvelle sélection
        ajouterPhoto.value = "";
        return;
    }

    // Vérifier que le fichier ne dépasse pas 4 Mo
    if (fichier.size > 4 * 1024 * 1024) {
        alert("Le fichier ne doit pas dépasser 4 Mo.");

        // Réinitialiser le champ pour permettre une nouvelle sélection
        ajouterPhoto.value = "";
        return;
    }

    // Si toutes les conditions sont respectées, le fichier est valide et on affiche l'aperçu
    console.log("Fichier valide :", fichier);

    // On libère l'ancienne URL si une image avait déjà été sélectionnée.
    if (urlApercu) {
       URL.revokeObjectURL(urlApercu);
    }

    // On crée une nouvelle URL temporaire.
    urlApercu = URL.createObjectURL(fichier);

    // On affiche l'aperçu.
    apercuImage.src = urlApercu;
    apercuImage.hidden = false;

    // On indique qu'une image a été sélectionnée.
    containerUploadImg.classList.add("image-selectionnee");
    });

// 3. SAISIR UN TITRE

// 4.ALIMENTER LE SELECTEUR DE CATEGORIES
const selectCategory = document.getElementById("select-category");

recupererCategories()
    .then(categories => {
        console.log("Catégories récupérées :", categories);
        categories.forEach(categorie => {
            const valueCategory = document.createElement("option");
            valueCategory.value = categorie.id;
            valueCategory.textContent = categorie.name;
            selectCategory.appendChild(valueCategory);
        })
    })
    .catch(error => {
    console.error("Impossible de récupérer les catégories :", error);
    });

// 5. SELECTIONNER UNE CATEGORIE

// 6. RÉCUPÉRER LE FICHIER, LE TITRE ET LA CATÉGORIE

function recupererFichierTitreCategorie() {

    const titreTravail = document.getElementById("title");
    const categorieSelectionnee = document.getElementById("select-category");
    const ajouterPhoto = document.getElementById("image-upload");

    // On retourne les trois informations
    return {
        titre: titreTravail.value,
        categorie: categorieSelectionnee.value,
        fichier: ajouterPhoto.files[0]
    };
}

// 7. RECUPERER LE FORMULAIRE ET LE SOUMETTRE

// Écouter sa soumission
formulaireAjout.addEventListener("submit", function(event) {

    event.preventDefault();

    // On récupère les informations du formulaire
    const informationsTravail = recupererFichierTitreCategorie();

    console.log(informationsTravail);

    const formData = new FormData(); // On créé la data mise en forme pour ce qu'attend l'API

    // { "id": 0, "title": "string", "imageUrl": "string", "categoryId": "string", "userId": 0}

    formData.append("image", informationsTravail.fichier); // Le serveur créera l'URL du fichier une fois réceptionné
    formData.append("title", informationsTravail.titre); // Récupère la chaine de caractère pour la valeur "title"
    formData.append("category", informationsTravail.categorie); // Récupère la categorie pour la valeur "id"

    console.log([...formData.entries()]);

    // On récupère le token d'authentification
    const token = localStorage.getItem("token");

    // On lance requête à l'API au clic et on gère la réponse de l'API
    fetch ("http://localhost:5678/api/works",{
        method : "POST",
        headers: {Authorization: `Bearer ${token}`},
        body: formData,
        })
        .then(response => { // Vérifie la réponse de l'API

        // On vérifie si la requête a fonctionné.
        if (!response.ok) {
           throw new Error(`Erreur HTTP : ${response.status}`);
        }

        // On récupère la réponse au format JSON.
        return response.json();
    })

    .then(travailAjoute => { // On récupère le travail ajouté
       console.log("Travail ajouté avec succès :", travailAjoute);
    })

    .catch(error => {
        console.error("Impossible d'ajouter le travail :", error);
    });

});

// 7. RÉINITIALISER LE FORMULAIRE D'AJOUT

export function reinitialiserFormulaireAjout() {

    // On vide les champs du formulaire.
    formulaireAjout.reset();

    // On libère l'URL temporaire de l'image.
    if (urlApercu) {
        URL.revokeObjectURL(urlApercu);
        urlApercu = null;
    }

    // On masque et vide l'aperçu.
    apercuImage.removeAttribute("src");
    apercuImage.hidden = true;

    // On réinitialise le container d'upload.
    containerUploadImg.classList.remove("image-selectionnee");
}
