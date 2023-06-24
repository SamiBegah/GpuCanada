import { obtenirConnexion } from "../config/dbconf";

let message = {
  OK: true,
  msg: "",
  statut: "",
  role: "",
  email: "",
  nom: "",
  prenom: "",
  mdp: "",
};

export const Mdl_Connexion = async (donneesConnexion: any): Promise<object> => {
  try {
    const connexion = await obtenirConnexion();

    const requeteSelection =
      "SELECT m.nom, m.prenom, c.statut, c.role, c.courriel, c.mot_de_passe FROM connexion c JOIN membres m ON c.courriel = m.courriel WHERE c.courriel=? AND c.mot_de_passe=?";
    let resultat = await connexion.query(requeteSelection, [
      donneesConnexion.courrielc,
      donneesConnexion.passc,
    ]);
    let resultatJSON = await JSON.parse(JSON.stringify(resultat[0]));

    if (resultatJSON.length > 0) {
      message.OK = true;
      message.statut = resultatJSON[0].statut;
      message.role = resultatJSON[0].role;
      message.email = resultatJSON[0].courriel;
      message.nom = resultatJSON[0].nom;
      message.prenom = resultatJSON[0].prenom;
      message.mdp = resultatJSON[0].mot_de_passe;
    } else {
      message.OK = false;
      message.msg = "SVP vérifiez vos paramètres de connexion.";
    }
  } catch (erreur) {
    message.OK = false;
    message.msg = "Problème avec la connexion!";
  } finally {
    console.log(donneesConnexion.courrielc + " s'est connecté.");
    return message;
  }
};

export const Mdl_ModifierMotDePasse = async (donnees: any): Promise<object> => {
  try {
    const connexion = await obtenirConnexion();
    const requeteUpdate =
      "UPDATE connexion SET mot_de_passe=? WHERE courriel=?";
    const resultat = await connexion.query(requeteUpdate, [
      donnees.nouveauMdp,
      donnees.email,
    ]);

    if (resultat.affectedRows > 0) {
      message.OK = true;
      message.msg = "Le mot de passe a été modifié avec succès.";
    } else {
      message.OK = false;
      message.msg = "Erreur lors de la modification du mot de passe.";
    }
  } catch (erreur) {
    message.OK = false;
    message.msg = "Problème lors de la modification du mot de passe.";
  } finally {
    console.log("Mot de passe modifié pour:", donnees.email);
    return message;
  }
};
