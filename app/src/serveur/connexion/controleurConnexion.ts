import express from "express";
import { Mdl_Connexion, Mdl_ModifierMotDePasse } from "./modelConnexion";

export const Ctl_Connexion_gestionActions = async (
  req: express.Request
): Promise<object> => {
  let action: string = req.body.action;
  switch (action) {
    case "connexion":
      const result = await Mdl_Connexion(req.body);
      return result;
    case "modifier-mdp":
      const resultModifierMdp = await Mdl_ModifierMotDePasse(req.body);
      return resultModifierMdp;
    default:
      return {};
  }
};
