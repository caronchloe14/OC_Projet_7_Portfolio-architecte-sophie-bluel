// GESTION DE LA SUPPRESSION DES TRAVAUX DANS LA MODAL

// Fonction de mise à jour des galeries
import { mettreAJourGaleries } from "./update-galleries.js";

export function supprimerTravaux(boutonSupprimer, idTravail) {
    //const boutonSupprimer = document.querySelector("button-supprimer");
    boutonSupprimer.addEventListener("click", function(event) {
        
        // On récupère le token d'authentification
        const token = localStorage.getItem("token");

        // On vérifie qu'on récupère le bon ID.
        console.log(idTravail);

        // La requête à l'API au clic
        fetch (`http://localhost:5678/api/works/${idTravail}`,{ // On appelle l'API avec l'ID travail du bouton sur lequel on a cliqué dans on URL
        method : "DELETE",
        headers: {Authorization: `Bearer ${token}`}
        })

        .then(response => {
            // On vérifie que la suppression a bien fonctionné.
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            console.log("Travail supprimé avec succès :", idTravail);

            // On actualise les deux galeries.
            return mettreAJourGaleries();
        })

        .catch(error => {
            console.error("Impossible de supprimer le travail :", error);
        });

    });
}