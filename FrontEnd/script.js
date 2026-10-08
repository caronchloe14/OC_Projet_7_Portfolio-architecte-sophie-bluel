// Variable globale qui contiendra les travaux récupérés depuis l'API
let dataTravaux;

// 1.RECUPERER LES TRAVAUX DEPUIS L'API
fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(data => {

        // On met les données reçues dans notre variable globale
        dataTravaux = data;

        // 2.AFFICHER LES TRAVAUX DANS LA GALERIE
        //On créé une fonction "afficherTravaux" qui recoit une liste de travaux 
        function afficherTravaux(travaux){

            // On récupère la galerie dans le HTML
            const sectionGallery = document.querySelector(".gallery");
            
            //On vide la galerie
            sectionGallery.innerHTML = "";

            // Pour chaque objet de "travaux" on créé une variable "travail" et on exécute le code suivant
            travaux.forEach(travail => {
                //console.log(travail);

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

        //Au chargement de la page, on affiche tous les travaux en appelant la fonction "afficherTravaux" avec le paramètre "dataTravaux"
        //console.log(dataTravaux);
        afficherTravaux(dataTravaux);

        // 3. RECUPERER LES CATEGORIES

        // On crée un tableau vide qu'on nomme "categories"
        const categories = [];

        // On parcourt "dataTravaux" pour alimenter le tableau avec chaque "category"
        dataTravaux.forEach(travail => {

            if (!categories.some(categorie => categorie.id === travail.category.id)) {
                categories.push(travail.category);
            }

        });

        //console.log(categories);

        // 4. CREER LE BOUTON "TOUS"

        // Pour chaque catégorie du tableau "categories", on crée une variable "categorie"
        // et on exécute le code suivant
        const sectionFilters = document.querySelector(".filters");

        //On crée le bouton, on lui ajoute des un type, un texte et on l'ajoute à ".filters"
        const buttonTous = document.createElement("button");
        buttonTous.type = "button";
        buttonTous.textContent = "Tous";
        sectionFilters.appendChild(buttonTous);

        //On ajoute un évênement au clic
        buttonTous.addEventListener("click",() => {
            const tousLesBoutons = document.querySelectorAll(".filters button");
            tousLesBoutons.forEach(bouton => {
                    bouton.classList.remove("active");
                });
            buttonTous.classList.add("active");
            afficherTravaux(dataTravaux)
        });

        // 5. CREER LES BOUTONS DES CATEGORIES + TRI/ACTIVATION AU CLIC

        categories.forEach(categorie => {
            //console.log(categorie);

            // On crée un bouton
            const buttonFilters = document.createElement("button");
            buttonFilters.type = "button";
            buttonFilters.textContent = categorie.name;

            // On ajoute le bouton dans le HTML
            sectionFilters.appendChild(buttonFilters);

            //On ajoute un évènement au clic
            buttonFilters.addEventListener("click",() => {
                const tousLesBoutons = document.querySelectorAll(".filters button");
                tousLesBoutons.forEach(bouton => {
                    bouton.classList.remove("active");
                });

                buttonFilters.classList.add("active");
                const travauxFiltres = dataTravaux.filter(function (travail){
                    return travail.category.id === categorie.id;
                });
                afficherTravaux(travauxFiltres);
                //console.log(travauxFiltres);
            })
        });

    });