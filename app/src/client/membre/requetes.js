let enregistrer = () => {
  let formMembres = new FormData(document.getElementById("formEnreg"));
  formMembres.append("action", "enregistrer");
  let donneesMembre = formaterDonneesFormData(formMembres); // Dans global.js
  fetch("/membre", {
    method: "POST",
    body: donneesMembre,
  })
    .then((reponse) => reponse.json())
    .then((reponseJSON) => {
      afficherMessage("msgE", reponseJSON.msg); // Définie dans js/global.js. Le id où afficher et le message
    })
    .catch((error) => {
      afficherMessage(
        "msgE",
        "Problème pour enregistrer membre, essayez plus tard. Merci."
      );
    });
};

function fetchMembreInfo() {
  const email = localStorage.getItem("email");
  const nom = localStorage.getItem("nom");
  const prenom = localStorage.getItem("prenom");
  const mdp = localStorage.getItem("mdp");

  if (email && nom && prenom) {
    document.getElementById("nom-utilisateur").textContent = `Nom: ${nom}`;
    document.getElementById(
      "prenom-utilisateur"
    ).textContent = `Prénom: ${prenom}`;
    document.getElementById(
      "email-utilisateur"
    ).textContent = `Courriel: ${email}`;
    document.getElementById(
      "mdp-utilisateur"
    ).textContent = `Mot de passe: ${mdp}`;
  }
}

// Fonction pour modifier le mot de passe //

async function modifierMotDePasse() {
  const confirmation = confirm(
    "Vous serez déconnecté et devrez vous reconnecter si vous changez votre mot de passe. Voulez-vous continuer?"
  );

  if (confirmation) {
    const nouveauMdp = prompt("Veuillez entrer votre nouveau mot de passe:");

    if (nouveauMdp) {
      const email = localStorage.getItem("email");

      let formMembres = new FormData();
      formMembres.append("action", "modifier-mdp");
      formMembres.append("email", email);
      formMembres.append("nouveauMdp", nouveauMdp);
      let donneesMembre = formaterDonneesFormData(formMembres);

      try {
        const response = await fetch("/connexion", {
          method: "POST",
          body: donneesMembre,
        });
        const responseJSON = await response.json();

        if (responseJSON) {
          deconnexion();
        }
      } catch (error) {
        alert(
          "Problème pour modifier le mot de passe, essayez plus tard. Merci."
        );
      }
    }
  }
}

// Enlever tout du localStorage lors de la deconnexion du membre //
function deconnexion() {
  localStorage.removeItem("email");
  localStorage.removeItem("nom");
  localStorage.removeItem("prenom");
  localStorage.removeItem("panier");
  window.location.href = "../../index.html";
}

fetchMembreInfo();

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("deconnexion").addEventListener("click", deconnexion);
});

// Recuperer et afficher les articles //

async function recupererArticles() {
  const response = await fetch("/products");
  const articles = await response.json();
  return articles;
}

async function afficherArticles() {
  const articles = await recupererArticles();
  const articlesContainer = document.getElementById("articles-container");

  articles.forEach((article) => {
    const articleElement = creerElementArticle(article);
    articlesContainer.appendChild(articleElement);
  });
}

function creerElementArticle(article) {
  const element = document.createElement("div");
  element.classList.add("col-md-4", "mb-3");

  element.innerHTML = `
      <div class="card">
        <img src="../ressources/images/${article.categorie}/${
    article.nom_de_l_image
  }" class="card-img-top" alt="${article.nom_de_l_article}">
        <div class="card-body">
          <h5 class="card-title">${article.nom_de_l_article}</h5>
          <p class="card-text">${article.description_de_l_article}</p>
          <p class="card-text">Prix: ${article.prix.toFixed(2)} $</p>
          <button class="btn btn-primary" data-id="${
            article.id
          }">Ajouter au panier</button>
        </div>
      </div>
    `;

  const ajouterAuPanierBtn = element.querySelector(".btn.btn-primary");
  ajouterAuPanierBtn.addEventListener("click", () => {
    ajouterAuPanier(article.id);
    alert("Article ajouté au panier!");
  });

  return element;
}

// Gestion du panier //

function ajouterAuPanier(articleId) {
  const panier = JSON.parse(localStorage.getItem("panier")) || {};
  panier[articleId] = (panier[articleId] || 0) + 1;
  localStorage.setItem("panier", JSON.stringify(panier));
  mettreAJourNombreArticlesPanier();
  const nombreArticles = Object.values(panier).reduce(
    (total, quantite) => total + quantite,
    0
  );
  localStorage.setItem("nombreArticlesPanier", nombreArticles.toString());
}

function enleverDuPanier(articleId) {
  const panier = JSON.parse(localStorage.getItem("panier")) || {};
  if (panier[articleId] > 1) {
    panier[articleId] -= 1;
  } else {
    delete panier[articleId];
  }
  localStorage.setItem("panier", JSON.stringify(panier));
  afficherArticlesPanier();
  const nombreArticles = Object.values(panier).reduce(
    (total, quantite) => total + quantite,
    0
  );
  localStorage.setItem("nombreArticlesPanier", nombreArticles.toString());
  mettreAJourNombreArticlesPanier();
}

function creerElementArticlePanier(article, quantite) {
  const element = document.createElement("div");
  element.classList.add("col-md-12", "mb-3");

  element.innerHTML = `
      <div class="card">
        <div class="card-body d-flex justify-content-between align-items-center">
          <h5 class="card-title">${article.nom_de_l_article} x${quantite}</h5>
          <div>
            <p class="card-text">Prix: ${(article.prix * quantite).toFixed(
              2
            )} $</p>
            <button class="btn btn-outline-danger btn-sm" data-id="${
              article.id
            }">Enlever</button>
          </div>
        </div>
      </div>
    `;

  const enleverDuPanierBtn = element.querySelector(
    ".btn.btn-outline-danger.btn-sm"
  );
  enleverDuPanierBtn.addEventListener("click", () => {
    enleverDuPanier(article.id);
  });

  return element;
}

// Affichage du panier et de la facture //

async function afficherArticlesPanier() {
  const panierArticlesContainer = document.getElementById(
    "panier-articles-container"
  );
  panierArticlesContainer.innerHTML = "";
  const panier = JSON.parse(localStorage.getItem("panier")) || {};
  const articles = await recupererArticles();

  let sousTotal = 0;

  for (const articleId in panier) {
    const article = articles.find((a) => a.id === parseInt(articleId));
    const quantite = panier[articleId];
    sousTotal += article.prix * quantite;

    const elementArticlePanier = creerElementArticlePanier(article, quantite);
    panierArticlesContainer.appendChild(elementArticlePanier);
  }

  const taxes = sousTotal * 0.15;
  const total = sousTotal + taxes;

  const factureInfo = `
      <h6>Sous-total: ${sousTotal.toFixed(2)} $</h6>
      <h6>Taxes: ${taxes.toFixed(2)} $</h6>
      <h6>Total: ${total.toFixed(2)} $</h6>
    `;

  const factureContainer = document.getElementById("facture-container");
  factureContainer.innerHTML = factureInfo;
}

function genererFacture() {
  alert(
    "Merci pour votre paiement. Une copie de la facture à été envoyée à votre courriel. (Cette fonctionnalité n'est pas encore disponible)"
  );
}

function mettreAJourNombreArticlesPanier() {
  const panier = JSON.parse(localStorage.getItem("panier")) || {};
  const nombreArticles = Object.values(panier).reduce(
    (total, quantite) => total + quantite,
    0
  );

  document.getElementById("nombre-articles-panier").innerText = nombreArticles;
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("panier")
    .addEventListener("click", afficherArticlesPanier);
});

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("modifier-mdp")
    .addEventListener("click", modifierMotDePasse);
});

// Charger les articles lors du chargement de la page
window.addEventListener("DOMContentLoaded", () => {
  afficherArticles();
  fetchMembreInfo();
});
