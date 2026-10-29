
/*
FICHIER : api-travaux.js

RÔLE :
Récupérer les travaux depuis l'API pour que les autres
fichiers JavaScript puissent réutiliser ces données.

Cette fonction ne s'occupe PAS de l'affichage des travaux.
L'affichage sera géré par gallery.js et modal.js.
*/

// On exporte cette fonction pour pouvoir l'importer
// dans les autres fichiers JavaScript du site.
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
