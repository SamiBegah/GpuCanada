let connexion = () => {
  let formConnexion = new FormData(document.getElementById("formConnexion"));
  formConnexion.append("action", "connexion");
  let donneesConnexion = formaterDonneesFormData(formConnexion); // Dans global.js
  fetch("/connexion", {
    method: "POST",
    body: donneesConnexion,
  })
    .then((reponse) => reponse.json())
    .then((reponseJSON) => {
      if (reponseJSON.OK) {
        if (reponseJSON.statut == "A") {
          localStorage.setItem("email", reponseJSON.email);
          localStorage.setItem("nom", reponseJSON.nom);
          localStorage.setItem("prenom", reponseJSON.prenom);
          localStorage.setItem("mdp", reponseJSON.mdp);

          switch (reponseJSON.role) {
            case "A":
              window.location.href = "../../admin.html";
              break;
            case "M":
              window.location.href = "../client/membre/membre.html";
              break;
            default:
              window.location.href = "../../index.html";
          }
        } else {
          afficherMessage("msgC", "Contactez l'administrateur!");
        }
      } else {
        afficherMessage("msgC", reponseJSON.msg);
      }
    })
    .catch((error) => {
      afficherMessage(
        "msgC",
        "Problème pour se connecter, essayez plus tard. Merci."
      );
    });
};
