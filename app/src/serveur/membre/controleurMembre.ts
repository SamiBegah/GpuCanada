import express from "express";
import { Mdl_Membre_enregistrer } from "./modelMembre";
import { Mdl_Connexion } from "../connexion/modelConnexion";
import { obtenirConnexion } from "../config/dbconf";

export const Ctl_Membre_gestionActions = async (
  req: express.Request
): Promise<object> => {
  let action: string = req.body.action;
  switch (action) {
    case "enregistrer":
      await Mdl_Connexion(req.body);
      return await Mdl_Membre_enregistrer(req.body);
    case "modifier_statut":
      return await modifierStatutMembre(req.body.id, req.body.statut);
    default:
      return {};
  }
};

export const obtenirMembres = async () => {
  try {
    const conn = await obtenirConnexion();
    const sql = `SELECT membres.*, connexion.statut
                 FROM membres
                 LEFT JOIN connexion ON membres.Idm = connexion.Idcm`;
    const [rows] = await conn.query(sql);
    return { membres: rows };
  } catch (err) {
    console.error("Erreur lors de la récupération des membres :", err);
    return { error: "Erreur lors de la récupération des membres." };
  }
};

export const modifierStatutMembre = async (id: number, statut: string) => {
  try {
    const conn = await obtenirConnexion();
    await conn.query("UPDATE connexion SET statut = ? WHERE Idcm = ?", [
      statut,
      id,
    ]);
    return { success: true };
  } catch (err) {
    console.error("Erreur lors de la modification du statut du membre:", err);
    return { error: "Erreur lors de la modification du statut du membre." };
  }
};
