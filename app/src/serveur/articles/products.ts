import express, { Request, Response } from "express";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "bdboutique",
};

const productRouter = express();

productRouter.use(express.json());

productRouter.get("/", async (req: Request, res: Response) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows, fields] = await connection.execute("SELECT * FROM articles");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Modification d'un produit //
productRouter.post("/:id", async (req: Request, res: Response) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    console.log("Connected to database");

    const product = JSON.parse(req.body.product);

    const id = req.params.id;
    const nom_de_l_article = product.nom_de_l_article;
    const description_de_l_article = product.description_de_l_article;
    const prix = product.prix;
    const categorie = product.categorie;
    const quantite_en_inventaire = product.quantite_en_inventaire;
    const seuil = product.seuil;

    console.log("id: ", id);
    console.log("nom_de_l_article: ", nom_de_l_article);
    console.log("description_de_l_article: ", description_de_l_article);
    console.log("prix: ", prix);
    console.log("categorie: ", categorie);
    console.log("quantite_en_inventaire: ", quantite_en_inventaire);
    console.log("seuil: ", seuil);

    const sql = `UPDATE articles SET nom_de_l_article=?, description_de_l_article=?, prix=?, categorie=?, quantite_en_inventaire=?, seuil=? 
             WHERE id=?`;
    const values = [
      nom_de_l_article,
      description_de_l_article,
      prix,
      categorie,
      quantite_en_inventaire,
      seuil,
      id,
    ];

    const [result] = await conn.query(sql, values);
    console.log("Product updated successfully");
    res.status(200).send("Product updated successfully");
  } catch (err) {
    console.error("Error connecting to database: ", err);
    res.status(500).send("Error connecting to database");
  }
});

// Ajout d'un produit //
productRouter.post("/", async (req: Request, res: Response) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    console.log("Connected to database");

    const product = req.body;

    const nom_de_l_article = product.nom_de_l_article;
    const description_de_l_article = product.description_de_l_article;
    const prix = product.prix;
    const categorie = product.categorie;
    const quantite_en_inventaire = product.quantite_en_inventaire;
    const seuil = product.seuil;

    const sql = `INSERT INTO articles (nom_de_l_article, description_de_l_article, prix, categorie, quantite_en_inventaire, seuil) 
             VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [
      nom_de_l_article,
      description_de_l_article,
      prix,
      categorie,
      quantite_en_inventaire,
      seuil,
    ];

    const [result] = await conn.query(sql, values);
    console.log("Product created successfully");
    res.status(200).send("Product created successfully");
  } catch (err) {
    console.error("Error connecting to database: ", err);
    res.status(500).send("Error connecting to database");
  }
});

// Suppression d'un produit //
productRouter.delete("/delete/:id", async (req: Request, res: Response) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    console.log("Connected to database");

    const id = req.params.id;

    const sql = `DELETE FROM articles WHERE id=?`;
    const values = [id];
    console.log(values);

    const [result] = await conn.query(sql, values);
    console.log("Product deleted successfully");
    res.status(200).send("Product deleted successfully");
  } catch (err) {
    console.error("Error connecting to database: ", err);
    res.status(500).send("Error connecting to database");
  }
});

// Recherche d'un produit //
productRouter.get("/search", async (req: Request, res: Response) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const search = req.query.search || "";
    const [rows, fields] = await connection.execute(
      `SELECT * FROM articles WHERE nom_de_l_article LIKE ?`,
      [`%${search}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur du serveur");
  }
});

export default productRouter;
