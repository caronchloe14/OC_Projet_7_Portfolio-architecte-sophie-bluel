// Récuperer (GET) les données de l'API /works
// dataTravaux est le nom de la variable qui est le resultat de response.json()
fetch("http://localhost:5678/api/works")
.then(response => response.json()) //Quand fetch reçoit la réponse, appelle-la response, puis transforme son contenu JSON en données JavaScript
.then(dataTravaux => console.log(dataTravaux)) //Quand tu as les données affiches les moi

//Transformer les informations renvoyées par l'API en données JavaScript utilisables
//response → l'objet qui contient la réponse du serveur
//.json() → la méthode qui permet de lire le contenu JSON