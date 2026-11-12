// ON GERE LA MISE A JOUR DES GALERIES LORSQU'ON AJOUTE OU SUPPRIME UN TRAVAIL

// On importe les fonctions qui récupèrent les données depuis l'API.
import { recupererTravaux } from "./api.js";

// On importe les fonctions concernées par la mise à jour
import { afficherTravauxIndex } from "./gallery.js";
import { afficherTravauxModal } from "./modal.js";

// La fonction qui gère la mise à jour 
export function mettreAJourGaleries() {

    return recupererTravaux()
        .then(travaux => {

            afficherTravauxIndex(travaux);

            afficherTravauxModal(travaux);

        });
}