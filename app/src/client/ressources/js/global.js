const formaterDonneesFormData = (formData) => {
  const conteneur = new URLSearchParams();
  for (const paire of formData) {
    conteneur.append(paire[0], paire[1]);
  }
  return conteneur;
};

const afficherMessage = (id, msg) => {
  document.getElementById(id).innerHTML = msg;
  let st = setInterval(() => {
    document.getElementById(id).innerHTML = "";
    if (id == "msgE") {
      document.getElementById("formEnreg").reset();
    } else if (id == "msgC") {
      document.getElementById("formConnexion").reset();
    }
  }, 4000);
  clearInterval(st);
};
