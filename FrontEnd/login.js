const formLogin = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

formLogin.addEventListener("submit", function(event) {
    //console.log("Le formulaire a été soumis !");
    event.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    const identifiants = {
        email : email, 
        password : password
    };
    //console.log(identifiants);

    fetch ("http://localhost:5678/api/users/login",{
        method : "POST" ,
        headers : {"Content-Type": "application/json"},
        body : JSON.stringify(identifiants)
        })
        .then(response => {
        // On vérifie si la connexion a réussi
        console.log("Réponse reçue :", response.status);
        console.log("La réponse est OK :", response.ok);
        
        if (!response.ok) {
        throw new Error("Adresse e-mail ou mot de passe incorrect.");
        }

        // On récupère les données JSON renvoyées par l'API
        return response.json();
        })

        .then(data => {
        // On enregistre le token pour le retrouver sur les autres pages
        localStorage.setItem("token", data.token);

        // On redirige l'utilisateur vers la page d'accueil
        window.location.href = "index.html";
        })

        .catch(error => {
        // On affiche la petite fenêtre avec le message d'erreur
        alert(error.message);
        });
    
});