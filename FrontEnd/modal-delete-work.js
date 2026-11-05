// GESTION DE LA SUPPRESSION DES TRAVAUX DANS LA MODAL

export function supprimerTravaux(boutonSupprimer, idTravail) {
    //const boutonSupprimer = document.querySelector("button-supprimer");
    boutonSupprimer.addEventListener("click", function(event) {
        
        // On récupère le token d'authentification
        const token = localStorage.getItem("token");

        // On vérifie qu'on récupère le bon ID.
        console.log(idTravail);

        // La requête à l'API au clic
        fetch ("http://localhost:5678/api/works/${idTravail}",{ // On appelle l'API avec l'ID travail du bouton sur lequel on a cliqué dans on URL
        method : "DELETE",
        headers: {Authorization: `Bearer ${token}`}
        })

    });
}