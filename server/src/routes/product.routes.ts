import { Router } from "express";
import { productController } from "../controllers/product.controller";

export const productRoutes = Router();

productRoutes.get("/", productController.listProducts);
productRoutes.get("/categories", productController.listCategories);

