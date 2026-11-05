
// ICI SE TROUVENT LES FONCTIONS QUI INTERRAGISSENT AVEC LES APIS
// ON EXPORTE LES FONCTIONS SUR LES DIFFERENTS FICHIER.JS DU SITE

// 1. RÉCUPÉRER LES TRAVAUX DEPUIS L'API
export function recupererTravaux() {

    // On envoie une requête à l'API pour récupérer les travaux.
    return fetch("http://localhost:5678/api/works")

        // On vérifie si la requête a fonctionné,
        // puis on convertit la réponse au format JSON.
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des travaux.");
            }

            return response.json();
        })

        // On récupère les données converties en JSON.
        .then(data => {

            // On retourne les travaux pour qu'ils puissent
            // être utilisés dans le fichier qui appelle la fonction.
            return data;
        });
}


// 2. RÉCUPÉRER LES CATÉGORIES DEPUIS L'API
export function recupererCategories() {

    // On envoie une requête à l'API pour récupérer les catégories.
    return fetch("http://localhost:5678/api/categories")

        // On vérifie si la requête a fonctionné,
        // puis on convertit la réponse au format JSON.
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des catégories.");
            }

            return response.json();
        });
}