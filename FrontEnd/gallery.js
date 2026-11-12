
// AFFICHER LES TRAVAUX DANS LA PAGE PRINCIPALE

// On importe les fonctions qui récupèrent les données depuis l'API.
import { recupererTravaux, recupererCategories } from "./api.js";
let dataTravaux = []; // On conserve les travaux récupérés dans une variable, elle sera utilisée pour afficher et filtrer les travaux.

// On récupère nos éléments HTML
const sectionFilters = document.querySelector(".filters"); // La section qui contiendra les boutons de filtres.
const sectionGallery = document.querySelector(".gallery-portfolio"); // La section qui va contenir la galerie


// 1. CONSTRUCTION DE L'AFFICHAGE DES TRAVAUX DANS LA GALERIE DE L'INDEX
// Cette fonction reçoit une liste de travaux à afficher.
export function afficherTravauxIndex(travauxAafficher) { // "travauxAafficher" -> paramètre de la variable (gestion des filtres)

    // On vide la galerie avant d'afficher les nouveaux travaux.
    sectionGallery.innerHTML = "";

    // Pour chaque travail de la liste, on crée les éléments HTML.
    travauxAafficher.forEach(travail => {

        // On crée une figure qui contiendra l'image et son titre.
        const figureGallery = document.createElement("figure");

        // On crée l'image et on lui donne l'URL fournie par l'API.
        const imageTravail = document.createElement("img");
        imageTravail.src = travail.imageUrl;

        // On crée la légende contenant le titre du travail.
        const titreTravail = document.createElement("figcaption");
        titreTravail.innerText = travail.title;

        // On ajoute la figure à la galerie.
        sectionGallery.appendChild(figureGallery);

            // On ajoute l'image et la légende à la figure.
            figureGallery.appendChild(imageTravail);
            figureGallery.appendChild(titreTravail);
    });
}

// 2. ACTIVER UN BOUTON FILTRE -> application de la classe active
function activerFiltre(boutonActif) {

    const tousLesBoutons = sectionFilters.querySelectorAll("button");

    tousLesBoutons.forEach(bouton => {
        bouton.classList.remove("active");
    });

    boutonActif.classList.add("active");
}

// 3. CREATION DES BOUTONS DE FILTRE PAR CATEGORIE ET L'ACTIVER AU CLIC
function afficherFiltres(categories) { // On récupère les catégories et on créé des boutons associés
    
    // CRÉER LE BOUTON "TOUS" -> pour afficher tous les travaux
    const buttonTous = document.createElement("button");
    buttonTous.type = "button";
    buttonTous.textContent = "Tous";

    // On ajoute le bouton dans la section des filtres.
    sectionFilters.appendChild(buttonTous);

    // On lui ajoute une eventlistener
    buttonTous.addEventListener("click", () => {
        // On active le bouton filtre
        activerFiltre(buttonTous)

        // On réaffiche l'ensemble des travaux.
        afficherTravauxIndex(dataTravaux);
    });

    // CRÉER UN BOUTON POUR CHAQUE CATEGORIE
    // Pour chaque catégorie reçue depuis l'API, on crée un bouton.
    categories.forEach(categorie => {

        // On crée un bouton portant le nom de la catégorie.
        const buttonFilters = document.createElement("button");
        buttonFilters.type = "button";
        buttonFilters.textContent = categorie.name;

        // On ajoute le bouton à la section des filtres.
        sectionFilters.appendChild(buttonFilters);

        // On définit ce qui se passe lorsque l'utilisateur clique sur un bouton
        buttonFilters.addEventListener("click", () => {

            activerFiltre(buttonFilters);

            // On conserve uniquement les travaux appartenant à la catégorie sélectionnée.
            const travauxFiltres = dataTravaux.filter(function (travail) {
                return travail.category.id === categorie.id;
            });

            // On affiche uniquement les travaux filtrés.
                afficherTravauxIndex(travauxFiltres);
        });
    });    
}

// 4. ON RECUPERE CE QUI NOURRIT LES FONCTIONS POUR QU'ELLES PUISSENT OPERER

recupererTravaux()
    .then(travaux => {
        dataTravaux = travaux;
        // Au chargement de la page, on affiche tous les travaux.
        afficherTravauxIndex(dataTravaux);
    })

    .catch(error => {
        // On affiche une erreur si la récupération des travaux échoue.
        console.error("Impossible de récupérer les travaux :", error);
    });

recupererCategories()
    .then(categories => {
        afficherFiltres(categories);
    })
    .catch(error => {
        console.error("Impossible de récupérer les catégories :", error);
    });
