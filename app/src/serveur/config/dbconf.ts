import mod_mysql from "mysql2";
export const mysql = mod_mysql;

export const pool = mysql.createPool({
  connectionLimit: 100,
  waitForConnections: true,
  host: "localhost",
  user: "root",
  password: "",
  database: "bdboutique",
});

pool.query("CREATE DATABASE IF NOT EXISTS bdboutique;", (err, results) => {
  if (err) {
    console.error("Erreur lors de la création de la base de données :", err);
    return;
  }

  console.log("Base de données bdboutique créée avec succès");

  // Execute the USE query first
  pool.query("USE bdboutique;", (err, results) => {
    if (err) {
      console.error("Erreur lors de la sélection de la base de données :", err);
      return;
    }

    console.log("Base de données bdboutique sélectionnée avec succès");

    createMembresTable();
  });
});

function createMembresTable() {
  pool.query(
    "CREATE TABLE IF NOT EXISTS membres (Idm INT AUTO_INCREMENT PRIMARY KEY, nom VARCHAR(255) , prenom VARCHAR(255), courriel VARCHAR(255) UNIQUE, sexe VARCHAR(255) , date_de_naissance DATE)",
    (err, results) => {
      if (err) {
        console.error("Erreur lors de la création de la table membres :", err);
        return;
      }

      console.log("Table membres créée avec succès");

      // Insert admin data into the membres table
      pool.query(
        "INSERT INTO membres (nom, prenom, courriel, sexe, date_de_naissance) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE nom=?, prenom=?, sexe=?, date_de_naissance=?",
        [
          "Sami",
          "Timur",
          "admin@gpucanada.com",
          "M",
          "2000-01-01",
          "Sami",
          "Timur",
          "M",
          "2000-01-01",
        ],
        (err, results) => {
          if (err) {
            console.error(
              "Erreur lors de l'insertion de données dans la table membres :",
              err
            );
            return;
          }

          console.log(
            "Données d'administrateur insérées dans la table membres avec succès"
          );

          createConnexionTable();
        }
      );
    }
  );
}

function createConnexionTable() {
  pool.query(
    "CREATE TABLE IF NOT EXISTS connexion (Idcm INT AUTO_INCREMENT PRIMARY KEY, courriel VARCHAR(255) UNIQUE , mot_de_passe VARCHAR(255) , role VARCHAR(255) , statut VARCHAR(255) , FOREIGN KEY (Idcm) REFERENCES membres(Idm))",
    (err, results) => {
      if (err) {
        console.error(
          "Erreur lors de la création de la table connexion :",
          err
        );
        return;
      }

      console.log("Table connexion créée avec succès");

      // Update admin data in the connexion table
      pool.query(
        "INSERT INTO connexion (courriel, mot_de_passe, role, statut, Idcm) VALUES (?, ?, ?, ?, (SELECT Idm FROM membres WHERE courriel=?)) ON DUPLICATE KEY UPDATE mot_de_passe=?, role=?, statut=?",
        [
          "admin@gpucanada.com",
          "admin",
          "A",
          "A",
          "admin@gpucanada.com",
          "admin",
          "A",
          "A",
        ],
        (err, results) => {
          if (err) {
            console.error(
              "Erreur lors de l'insertion de données dans la table connexion :",
              err
            );
            return;
          }

          console.log(
            "Données d'administrateur insérées dans la table connexion avec succès"
          );

          pool.query(
            "CREATE TABLE IF NOT EXISTS articles (id INT AUTO_INCREMENT PRIMARY KEY, nom_de_l_image VARCHAR(255) UNIQUE, categorie VARCHAR(255), nom_de_l_article VARCHAR(255), description_de_l_article TEXT, prix FLOAT, quantite_en_inventaire INT, seuil INT)",
            (err, results) => {
              if (err) {
                console.error(
                  "Erreur lors de la création de la table articles :",
                  err
                );
                return;
              }

              console.log("Table articles créée avec succès");

              // Insert data into the articles table
              pool.query(
                "INSERT IGNORE INTO articles (nom_de_l_image, categorie, nom_de_l_article, description_de_l_article, prix, quantite_en_inventaire, seuil) VALUES ?",
                [
                  [
                    [
                      "3060ti.jpg",
                      "NVIDIA",
                      "3060 TI",
                      "GIGABYTE Vision OC GeForce RTX 3060 Ti 8GB GDDR6 PCI Express 4.0 ATX Video Card GV-N306TVISION OC-8GD (rev. 2.0) (LHR)",
                      839.0,
                      10,
                      5,
                    ],
                    [
                      "3070.jpg",
                      "NVIDIA",
                      "3070",
                      "GIGABYTE Gaming OC GeForce RTX 3070 8GB GDDR6 PCI Express 4.0 ATX Video Card GV-N3070GAMING OC-8GD (rev. 2.0) (LHR)",
                      999.99,
                      10,
                      5,
                    ],
                    [
                      "4070ti.jpg",
                      "NVIDIA",
                      "4070 TI",

                      "GIGABYTE GeForce RTX 4070 Ti GAMING OC 12G Graphics Card, 3x WINDFORCE Fans, 12GB 192-bit GDDR6X, GV-N407TGAMING OC-12GD",
                      1169.99,
                      10,
                      5,
                    ],
                    [
                      "4080.jpg",
                      "NVIDIA",
                      "4080",

                      "MSI Ventus GeForce RTX 4080 16GB GDDR6X PCI Express 4.0 Video Card RTX 4080 16GB VENTUS 3X OC",
                      1799.99,
                      10,
                      5,
                    ],
                    [
                      "6600.jpg",
                      "AMD",
                      "6600",

                      "ASRock Radeon RX 6600 8GB GDDR6 PCI Express 4.0 Video Card RX6600 CLD 8G",
                      559.99,
                      10,
                      5,
                    ],
                    [
                      "6650XT.jpg",
                      "AMD",
                      "6650 XT",

                      "MSI Mech Radeon RX 6650 XT 8GB GDDR6 PCI Express 4.0 Video Card RX 6650 XT MECH 2X 8G OC",
                      349.99,
                      10,
                      5,
                    ],
                    [
                      "6950xt.jpg",
                      "AMD",
                      "6950 XT",

                      "MSI Gaming Radeon RX 6950 XT 16GB GDDR6 PCI Express 4.0 Video Card RX 6950 XT 16G",
                      1669.99,
                      10,
                      5,
                    ],
                    [
                      "7900xt.jpg",
                      "AMD",
                      "7900 XT",

                      "SAPPHIRE Radeon RX 7900 XT 20GB GDDR6 PCI Express 4.0 Video Card 21323-01-20G",
                      1399.0,
                      10,
                      5,
                    ],
                  ],
                ],

                (err, results) => {
                  if (err) {
                    console.error(
                      "Erreur lors de l'insertion de données dans la table articles :",
                      err
                    );
                    return;
                  }

                  console.log(
                    "Données d'articles insérées dans la table articles avec succès"
                  );

                  console.log("Connexion à la base de données réussie");
                }
              );
            }
          );
        }
      );
    }
  );
}

export const obtenirConnexion = async () => {
  return pool.promise();
};
