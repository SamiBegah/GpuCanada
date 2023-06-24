const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Route for getting all products
router.get("/", productController.getProducts);

// Route for adding a new product
router.post("/", productController.addProduct);

// Route for updating an existing product
router.post("/:id", productController.updateProduct);

// Route for deleting a product
router.delete("/:id", productController.deleteProduct);

module.exports = router;
