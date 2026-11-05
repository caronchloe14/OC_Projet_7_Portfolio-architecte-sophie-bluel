// GESTION DE L'AJOUT DES TRAVAUX DANS LA MODAL

export function ajouterTravaux() {
    const boutonAjouter = document.getElementById("ajouter-photo");
    boutonAjouter.addEventListener("click", function(event) {
        
        // On récupère le token d'authentification
        const token = localStorage.getItem("token");

        // La requête à l'API au clic
        fetch ("http://localhost:5678/api/works",{
        method : "POST",
        headers: {Authorization: `Bearer ${token}`}
        })

    });
}