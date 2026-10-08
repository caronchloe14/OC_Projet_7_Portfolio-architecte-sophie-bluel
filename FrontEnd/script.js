// Variable globale qui contiendra les travaux récupérés depuis l'API
let dataTravaux;

// 1. RÉCUPÉRER LES TRAVAUX DEPUIS L'API
fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(data => {

        // On met les données reçues dans notre variable globale
        dataTravaux = data;

        // 2. AFFICHER LES TRAVAUX DANS LA GALERIE
        // On crée une fonction "afficherTravaux" qui reçoit une liste de travaux
        function afficherTravaux(travaux){

            // On récupère la galerie dans le HTML
            const sectionGallery = document.querySelector(".gallery");

            // On vide la galerie
            sectionGallery.innerHTML = "";

            // Pour chaque objet de "travaux", on crée une variable "travail"
            // et on exécute le code suivant
            travaux.forEach(travail => {

                // On crée une figure
                const figureGallery = document.createElement("figure");

                // On crée une image
                const imageTravail = document.createElement("img");
                imageTravail.src = travail.imageUrl;

                // On crée le titre
                const titreTravail = document.createElement("figcaption");
                titreTravail.innerText = travail.title;

                // On ajoute les éléments dans le HTML
                sectionGallery.appendChild(figureGallery);
                figureGallery.appendChild(imageTravail);
                figureGallery.appendChild(titreTravail);
            });
        }

        // Au chargement de la page, on affiche tous les travaux
        // en appelant la fonction "afficherTravaux" avec "dataTravaux"
        afficherTravaux(dataTravaux);

        // 3. RÉCUPÉRER LES CATÉGORIES DEPUIS L'API
        fetch("http://localhost:5678/api/categories")
            .then(response => response.json())
            .then(categories => {

                // On récupère la section des filtres dans le HTML
                const sectionFilters = document.querySelector(".filters");

                // 4. CRÉER LE BOUTON "TOUS"

                // On crée le bouton
                const buttonTous = document.createElement("button");
                buttonTous.type = "button";
                buttonTous.textContent = "Tous";

                // On ajoute le bouton à la section des filtres
                sectionFilters.appendChild(buttonTous);

                // On ajoute un événement au clic
                buttonTous.addEventListener("click", () => {

                    // On récupère tous les boutons de filtres
                    const tousLesBoutons = document.querySelectorAll(".filters button");

                    // On retire la classe "active" de tous les boutons
                    tousLesBoutons.forEach(bouton => {
                        bouton.classList.remove("active");
                    });

                    // On ajoute la classe "active" au bouton "Tous"
                    buttonTous.classList.add("active");

                    // On affiche tous les travaux
                    afficherTravaux(dataTravaux);
                });

                // 5. CRÉER LES BOUTONS DES CATÉGORIES

                // Pour chaque catégorie de "categories",
                // on crée une variable "categorie"
                // et on exécute le code suivant
                categories.forEach(categorie => {

                    // On crée un bouton
                    const buttonFilters = document.createElement("button");
                    buttonFilters.type = "button";
                    buttonFilters.textContent = categorie.name;

                    // On ajoute le bouton dans le HTML
                    sectionFilters.appendChild(buttonFilters);

                    // On ajoute un événement au clic
                    buttonFilters.addEventListener("click", () => {

                        // On récupère tous les boutons de filtres
                        const tousLesBoutons = document.querySelectorAll(".filters button");

                        // On retire la classe "active" de tous les boutons
                        tousLesBoutons.forEach(bouton => {
                            bouton.classList.remove("active");
                        });

                        // On ajoute la classe "active" au bouton sélectionné
                        buttonFilters.classList.add("active");

                        // On filtre les travaux selon l'id de la catégorie sélectionnée
                        const travauxFiltres = dataTravaux.filter(function (travail) {
                            return travail.category.id === categorie.id;
                        });

                        // On affiche uniquement les travaux filtrés
                        afficherTravaux(travauxFiltres);
                    });
                });
            });
    });