// GESTION DE L'AJOUT DES TRAVAUX DANS LA MODALE

// On importe les fonctions qui récupèrent les données depuis l'API.
import { recupererTravaux, recupererCategories } from "./api.js";

//console.log("modal-add-work.js est chargé !");

// 1. AJOUTER UN FICHIER DANS LE CONTAINER D'UPLOAD D'IMAGE

// Récupérer le champ de sélection de fichier
const ajouterPhoto = document.getElementById("image-upload");

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

    // Si toutes les conditions sont respectées, le fichier est valide
    console.log("Fichier valide :", fichier);

    // Affichier la prévisualisation du fichier dans le container d'upload

});

// 2. SAISIR UN TITRE

// 3.ALIMENTER LE SELECTEUR DE CATEGORIES
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

// 4. SELECTIONNER UNE CATEGORIE

// 5. RÉCUPÉRER LE FICHIER, LE TITRE ET LA CATÉGORIE

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

// 6. RECUPERER LE FORMULAIRE ET LE SOUMETTRE
const formulaireAjout = document.getElementById("form-add-work");

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


// 6. REINITIALISER APRES VALIDATION
