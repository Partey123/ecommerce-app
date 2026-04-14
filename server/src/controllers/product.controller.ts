import { Request, Response } from "express";
import { CategoryModel } from "../models/Category";
import { ProductModel } from "../models/Product";

export const productController = {
  async listProducts(_req: Request, res: Response): Promise<void> {
    const products = await ProductModel.listActive();
    res.status(200).json({ products });
  },

  async listCategories(_req: Request, res: Response): Promise<void> {
    const categories = await CategoryModel.listAll();
    res.status(200).json({ categories });
  },
};

