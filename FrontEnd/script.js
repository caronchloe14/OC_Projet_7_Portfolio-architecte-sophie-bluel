// Variable globale qui contiendra les travaux récupérés depuis l'API
let dataTravaux;

// Récupérer (GET) les données de l'API /works
fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(data => {

        // On met les données reçues dans notre variable globale
        dataTravaux = data;

        // Pour chaque objet de dataTravaux on créé une variable "travail" et on éxécute le code suivant
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
    });