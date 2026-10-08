// Variable globale qui contiendra les travaux récupérés depuis l'API
let dataTravaux;

// Récupérer (GET) les données de l'API /works
fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(data => {

        // On met les données reçues dans notre variable globale
        dataTravaux = data;

        // Pour chaque objet de dataTravaux on créé une variable "travail" et on exécute le code suivant
        dataTravaux.forEach(travail => {
            console.log(travail);

            // On récupère la galerie dans le HTML
            const sectionGallery = document.querySelector(".gallery");

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

        // On crée un tableau vide qu'on nomme "categories"
        const categories = [];
        console.log(categories);

        // On parcourt "dataTravaux" pour alimenter le tableau avec chaque "category"
        dataTravaux.forEach(travail => {

            if (!categories.some(categorie => categorie.id === travail.category.id)) {
                categories.push(travail.category);
            }

        });

        // Pour chaque catégorie du tableau "categories", on crée une variable "categorie"
        // et on exécute le code suivant
        const sectionFilters = document.querySelector(".filters");

        // On crée le bouton Tous et on l'ajoute au HTML
        const buttonTous = document.createElement("button");
        buttonTous.type = "button";
        buttonTous.textContent = "Tous";
        sectionFilters.appendChild(buttonTous);

        categories.forEach(categorie => {
            console.log(categorie);

            // On crée un bouton
            const buttonFilters = document.createElement("button");
            buttonFilters.type = "button";
            buttonFilters.textContent = categorie.name;

            // On ajoute le bouton dans le HTML
            sectionFilters.appendChild(buttonFilters);
        });

    });