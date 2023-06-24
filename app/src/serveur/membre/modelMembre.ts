import { obtenirConnexion, mysql } from "../config/dbconf";

let message = { msg: "" };

export const Mdl_Membre_enregistrer = async (membre: any): Promise<object> => {
  try {
    const connexion = await obtenirConnexion();
    const requeteMembre = "INSERT INTO membres VALUES(0,?,?,?,?,?)";
    let reponse = await connexion.query(requeteMembre, [
      membre.prenom,
      membre.nom,
      membre.courriel,
      membre.sexe,
      membre.datenaissance,
    ]);

    console.log("Membre enregistré dans la table membres", reponse);

    // Retrieve the new Idm value from the membres table
    const newIdm = reponse[0].insertId;

    // Check if newIdm is a valid value
    const [rows] = await connexion.query("SELECT * FROM membres WHERE Idm=?", [
      newIdm,
    ]);
    if (rows.length === 0) {
      throw new Error("Invalid value of newIdm: " + newIdm);
    }

    const requeteConnexion =
      "INSERT INTO connexion (Idcm, courriel, mot_de_passe, role, statut) VALUES (?, ?, ?, ?, ?)";
    await connexion.query(requeteConnexion, [
      newIdm,
      membre.courriel,
      membre.pass,
      "M",
      "A",
    ]);
    console.log("Membre enregistré dans la table connexion");
    message.msg = "Membre bien enregistré";
  } catch (e: any) {
    console.log("Erreur lors de l'enregistrement du membre:", e);
    message.msg = "Problème avec l'enregistrement du membre!";
  } finally {
    return message;
  }
};
