
/*
FICHIER : gallery.js

RÔLE :
Afficher les travaux dans la galerie de la page d'accueil
et créer les boutons permettant de filtrer les travaux par catégorie.

Les travaux sont récupérés grâce à la fonction
recupererTravaux() importée depuis api-travaux.js.
*/

// On importe la fonction qui récupère les travaux depuis l'API.
import { recupererTravaux } from "./api-travaux.js";


// 1. RÉCUPÉRER LES TRAVAUX DEPUIS L'API COMMUNE

recupererTravaux()
    .then(travaux => {

        // On conserve les travaux récupérés dans une variable.
        // Elle sera utilisée pour afficher et filtrer les travaux.
        const dataTravaux = travaux;


        // 2. AFFICHER LES TRAVAUX DANS LA GALERIE

        // Cette fonction reçoit une liste de travaux à afficher.
        function afficherTravaux(travauxAafficher) {

            // On récupère la galerie dans le HTML.
            const sectionGallery = document.querySelector(".gallery-portfolio");

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


        // Au chargement de la page, on affiche tous les travaux.
        afficherTravaux(dataTravaux);


        // 3. RÉCUPÉRER LES CATÉGORIES DEPUIS L'API

        fetch("http://localhost:5678/api/categories")
            .then(response => response.json())
            .then(categories => {

                // On récupère la section qui contiendra les boutons de filtres.
                const sectionFilters = document.querySelector(".filters");


                // 4. CRÉER LE BOUTON "TOUS"

                // On crée le bouton qui permet d'afficher tous les travaux.
                const buttonTous = document.createElement("button");
                buttonTous.type = "button";
                buttonTous.textContent = "Tous";

                // On ajoute le bouton dans la section des filtres.
                sectionFilters.appendChild(buttonTous);

                // On définit ce qui se passe lorsque l'utilisateur clique dessus.
                buttonTous.addEventListener("click", () => {

                    // On récupère tous les boutons de filtres.
                    const tousLesBoutons = document.querySelectorAll(".filters button");

                    // On retire la classe "active" de tous les boutons.
                    tousLesBoutons.forEach(bouton => {
                        bouton.classList.remove("active");
                    });

                    // On ajoute la classe "active" au bouton "Tous".
                    buttonTous.classList.add("active");

                    // On réaffiche l'ensemble des travaux.
                    afficherTravaux(dataTravaux);
                });


                // 5. CRÉER LES BOUTONS DES CATÉGORIES

                // Pour chaque catégorie reçue depuis l'API, on crée un bouton.
                categories.forEach(categorie => {

                    // On crée un bouton portant le nom de la catégorie.
                    const buttonFilters = document.createElement("button");
                    buttonFilters.type = "button";
                    buttonFilters.textContent = categorie.name;

                    // On ajoute le bouton à la section des filtres.
                    sectionFilters.appendChild(buttonFilters);

                    // On définit ce qui se passe lorsque l'utilisateur clique dessus.
                    buttonFilters.addEventListener("click", () => {

                        // On récupère tous les boutons de filtres.
                        const tousLesBoutons = document.querySelectorAll(".filters button");

                        // On retire la classe "active" de tous les boutons.
                        tousLesBoutons.forEach(bouton => {
                            bouton.classList.remove("active");
                        });

                        // On active le bouton de la catégorie sélectionnée.
                        buttonFilters.classList.add("active");

                        // On conserve uniquement les travaux appartenant
                        // à la catégorie sélectionnée.
                        const travauxFiltres = dataTravaux.filter(function (travail) {
                            return travail.category.id === categorie.id;
                        });

                        // On affiche uniquement les travaux filtrés.
                        afficherTravaux(travauxFiltres);
                    });
                });
            });
    })
    .catch(error => {
        // On affiche une erreur dans la console si la récupération des
        // travaux échoue.
        console.error("Impossible de récupérer les travaux :", error);
    });
