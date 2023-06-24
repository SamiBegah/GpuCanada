$(document).ready(function () {
  function refreshTable() {
    $("#productTable").empty();

    $.ajax({
      url: "/products/search",
      data: { search: $("#searchInput").val() },
      dataType: "json",
      success: function (data) {
        console.log("Données reçues:", data);
        if (!Array.isArray(data)) {
          data = [data];
        }

        var productTable = $("#productTable");
        productTable.empty();
        $.each(data, function (i, product) {
          var row = $("<tr>").appendTo(productTable);
          console.log(product.categorie);

          $("<td>").text(product.id).appendTo(row);
          $("<td>")
            .html(
              "<img src='client/ressources/images/" +
                product.categorie +
                "/" +
                product.nom_de_l_image +
                "' class='product-image' onerror='this.src=\"/client/ressources/images/logo.png\";' />"
            )
            .appendTo(row);
          $("<td>").text(product.categorie).appendTo(row);
          $("<td>").text(product.nom_de_l_article).appendTo(row);
          $("<td>").text(product.description_de_l_article).appendTo(row);
          $("<td>")
            .text("$" + product.prix.toFixed(2))
            .appendTo(row);
          $("<td>").text(product.quantite_en_inventaire).appendTo(row);
          $("<td>").text(product.seuil).appendTo(row);
          var actions = $("<td>").appendTo(row);
          $("<button>")
            .text("Modifier")
            .addClass("btn btn-sm btn-primary edit-product-btn")
            .data("product", product)
            .appendTo(actions);
          $("<button>")
            .text("Supprimer")
            .addClass("btn btn-sm btn-danger delete-product-btn")
            .data("product", product)
            .appendTo(actions);
        });
      },
      error: function (xhr, status, error) {
        console.log(
          "Erreur lors du chargement des données des produits:",
          xhr,
          status,
          error
        );
        alert("Erreur lors du chargement des données des produits.");
      },
    });
  }

  // Ouverture la fenêtre modale de modification de produit lorsqu'un bouton Modifier est cliqué
  $(document).on("click", ".edit-product-btn", function () {
    var product = $(this).data("product");
    $("#addEditProductModalLabel").text("Modifier le produit");
    $("#id").val(product.id);
    $("#nom_de_l_article").val(product.nom_de_l_article);
    $("#description_de_l_article").val(product.description_de_l_article);
    $("#prix").val(product.prix);
    $("#categorie").val(product.categorie);
    $("#quantite_en_inventaire").val(product.quantite_en_inventaire);
    $("#seuil").val(product.seuil);
    $("#addEditProductModal").modal("show");
  });

  // Supprimer un produit lorsqu'un bouton supprimer est cliqué
  $(document).on("click", ".delete-product-btn", function () {
    var product = $(this).data("product");
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit?")) {
      console.log("Suppression du produit :", product);
      $.ajax({
        url: "/products/delete/" + product.id,
        method: "DELETE",

        data: {
          action: "delete",
          id: product.id,
        },
        success: function () {
          refreshTable();
        },
        error: function (xhr, status, error) {
          console.log(
            "Erreur lors de la suppression du produit :",
            xhr,
            status,
            error
          );
          alert("Erreur lors de la suppression du produit.");
        },
      });
    }
  });

  // Enregistrer les modifications d'un produit ou ajouter un nouveau produit
  $("#addEditProductSubmitBtn").click(function () {
    var product = {
      id: $("#id").val(),
      nom_de_l_article: $("#nom_de_l_article").val(),
      description_de_l_article: $("#description_de_l_article").val(),
      prix: parseFloat($("#prix").val()) || 0,
      categorie: $("#categorie").val(),
      quantite_en_inventaire: parseInt($("#quantite_en_inventaire").val()) || 0,
      seuil: parseInt($("#seuil").val()) || 0,
    };
    var action = product.id ? "update" : "add";
    var successMessage = product.id ? "Produit mis à jour." : "Produit ajouté.";
    console.log("produit: ", product);
    console.log("action: ", action);
    console.log("successMessage: ", successMessage);

    // Vérifier si l'ID du produit existe, sinon, en générer un nouveau pour le nouveau produit
    if (!product.id) {
      $.ajax({
        url: "/products",
        method: "POST",
        data: product,
        success: function () {
          refreshTable();
          alert(successMessage);
        },
        error: function () {
          alert("Erreur lors de l'ajout du produit à la base de données.");
        },
      });
    } else {
      updateProduct(product, action, successMessage);
    }
  });

  // Mettre à jour ou ajouter le produit dans la base de données et actualiser le tableau
  function updateProduct(product, action, successMessage) {
    $.ajax({
      url: "/products/" + product.id,
      method: "POST",
      data: {
        product: JSON.stringify(product),
        action: action,
      },
      success: function () {
        // Fermer la fenêtre modale et actualiser le tableau après avoir enregistré les modifications
        $("#addEditProductModal").modal("hide");
        refreshTable();
        alert(successMessage);
      },
      error: function () {
        alert("Erreur lors de l'enregistrement des modifications du produit.");
      },
    });
  }

  // Ouvrir la fenêtre modale d'ajout de produit lorsque le bouton ajouter un produit est cliqué
  $("#addProductBtn").click(function () {
    $("#addEditProductModalLabel").text("Ajouter un produit");
    $("#id").val("");
    $("#nom_de_l_article").val("");
    $("#description_de_l_article").val("");
    $("#prix").val("");
    $("#categorie").val("");
    $("#quantite_en_inventaire").val("");
    $("#seuil").val("");
    $("#addEditProductModal").modal("show");
  });

  // Actualiser les tableaux lors du chargement de la page
  refreshTable();
  refreshMemberTable();

  // Fermer la fenêtre modale lorsque le bouton 'x' est cliqué
  $("#closeModalBtn").click(function () {
    $("#addEditProductModal").modal("hide");
  });

  // Lancer la recherche lorsque le bouton Rechercher est cliqué
  $("#searchButton").click(function () {
    refreshTable();
  });
});

function openAddEditProductModal() {
  $("#addEditProductForm")[0].reset();
  $("#addEditProductModal").modal("show");
}

// Gestion des membres

function refreshMemberTable() {
  $("#memberTable").empty();
  $.ajax({
    url: "/membre",
    dataType: "json",
    success: function (data) {
      console.log(data);
      var memberTable = $("#memberTable");
      memberTable.empty();

      $.each(data.membres, function (i, member) {
        var row = $("<tr>").appendTo(memberTable);

        $("<td>").text(member.Idm).appendTo(row);
        $("<td>")
          .text(member.nom + " " + member.prenom)
          .appendTo(row);
        $("<td>").text(member.courriel).appendTo(row);
        $("<td>").text(member.statut).appendTo(row);
        var actions = $("<td>").appendTo(row);
        $("<button>")
          .text(member.statut === "A" ? "Désactiver" : "Activer")
          .addClass("btn btn-sm btn-warning toggle-status-btn")
          .data("member", member)
          .appendTo(actions);
      });
    },
    error: function (xhr, status, error) {
      console.log(
        "Erreur lors du chargement des données des membres:",
        xhr,
        status,
        error
      );
      alert("Erreur lors du chargement des données des membres.");
    },
  });
}

// Changer statut du membre

$(document).on("click", ".toggle-status-btn", function () {
  var member = $(this).data("member");

  // Vérifier si l'ID utilisateur est différent de 1
  if (member.Idm == 1) {
    alert("L'administrateur principal ne peut pas être désactivé.");
    return;
  }

  var newStatus = member.statut === "A" ? "I" : "A";

  $.ajax({
    url: "/membre",
    method: "POST",
    dataType: "json",
    data: {
      action: "modifier_statut",
      id: member.Idm,
      statut: newStatus,
    },
    success: function (data) {
      if (data.error) {
        console.error(
          "Erreur lors de la modification du statut du membre:",
          data.error
        );
        alert("Erreur lors de la modification du statut du membre.");
      } else {
        refreshMemberTable();
      }
    },
    error: function (xhr, status, error) {
      console.error(
        "Erreur lors de la modification du statut du membre:",
        xhr,
        status,
        error
      );
      alert("Erreur lors de la modification du statut du membre.");
    },
  });
});
