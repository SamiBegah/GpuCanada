import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import http from "http";
import path from "path";
import productRouter from "./app/src/serveur/articles/products";
import { Ctl_Membre_gestionActions } from "./app/src/serveur/membre/controleurMembre";
import { Ctl_Connexion_gestionActions } from "./app/src/serveur/connexion/controleurConnexion";

const app = express();
const server = http.createServer(app);
const port = 8181;
server.listen(port);
console.log(`\nServeur démarré sur le port ${port}`);

app.use(express.static(__dirname + "/app/src"));
app.use(express.static(__dirname + "/app/src/serveur/articles"));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(express.urlencoded({ extended: true }));
app.use("/products", productRouter);

app.get("/", async (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + "/app/src/index.html"));
});

app.all("/membre", async (req: Request, res: Response) => {
  let response = await Ctl_Membre_gestionActions(req);
  res.send(response);
});

app.all("/connexion", async (req: Request, res: Response) => {
  let response = await Ctl_Connexion_gestionActions(req);
  res.send(response);
});

export default app;
