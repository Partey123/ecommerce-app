import { Request, Response } from "express";
import { OrderModel } from "../models/Order";
import { ProductModel } from "../models/Product";
import { UserModel } from "../models/User";
import { CategoryModel } from "../models/Category";

export const adminController = {
  async getOverview(_req: Request, res: Response): Promise<void> {
    const [orders, users, products] = await Promise.all([
      OrderModel.listAll(),
      UserModel.listProfiles(),
      ProductModel.listAll(),
    ]);

    const revenue = orders.reduce(
      (sum, order) => sum + Number(order.total_ghs ?? 0),
      0
    );

    res.status(200).json({
      stats: {
        revenueGhs: revenue,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalProducts: products.length,
      },
    });
  },

  async listOrders(_req: Request, res: Response): Promise<void> {
    const orders = await OrderModel.listAll();
    res.status(200).json({ orders });
  },

  async getOrder(req: Request, res: Response): Promise<void> {
    const orderIdParam = req.params.id;
    const orderId = typeof orderIdParam === "string" ? orderIdParam : undefined;
    if (!orderId) {
      res.status(400).json({ error: "Order id is required" });
      return;
    }

    const order = await OrderModel.getById(orderId);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const [items, user] = await Promise.all([
      OrderModel.listItems(orderId),
      UserModel.getProfileById(order.user_id),
    ]);

    res.status(200).json({ order, items, user });
  },

  async listUsers(_req: Request, res: Response): Promise<void> {
    const users = await UserModel.listProfiles();
    res.status(200).json({ users });
  },

  async listProducts(_req: Request, res: Response): Promise<void> {
    const products = await ProductModel.listAll();
    res.status(200).json({ products });
  },

  async getProduct(req: Request, res: Response): Promise<void> {
    const productIdParam = req.params.id;
    const productId = typeof productIdParam === "string" ? productIdParam : undefined;
    if (!productId) {
      res.status(400).json({ error: "Product id is required" });
      return;
    }

    const product = await ProductModel.getById(productId);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.status(200).json({ product });
  },

  async createProduct(req: Request, res: Response): Promise<void> {
    const {
      name,
      slug,
      description,
      category_id,
      price_ghs,
      stock,
      images,
      is_active,
    } = req.body as Record<string, unknown>;

    if (typeof name !== "string" || typeof slug !== "string") {
      res.status(400).json({ error: "name and slug are required" });
      return;
    }

    const created = await ProductModel.create({
      name,
      slug,
      description: typeof description === "string" ? description : null,
      category_id: typeof category_id === "string" ? category_id : null,
      price_ghs: Number(price_ghs ?? 0),
      stock: Number(stock ?? 0),
      images: Array.isArray(images) ? (images as string[]) : [],
      is_active: typeof is_active === "boolean" ? is_active : true,
    });

    res.status(201).json({ product: created });
  },

  async updateProduct(req: Request, res: Response): Promise<void> {
    const productIdParam = req.params.id;
    const productId = typeof productIdParam === "string" ? productIdParam : undefined;
    if (!productId) {
      res.status(400).json({ error: "Product id is required" });
      return;
    }

    const {
      name,
      slug,
      description,
      category_id,
      price_ghs,
      stock,
      images,
      is_active,
    } = req.body as Record<string, unknown>;

    const updated = await ProductModel.update(productId, {
      name: typeof name === "string" ? name : undefined,
      slug: typeof slug === "string" ? slug : undefined,
      description: typeof description === "string" ? description : undefined,
      category_id: typeof category_id === "string" ? category_id : undefined,
      price_ghs: typeof price_ghs !== "undefined" ? Number(price_ghs) : undefined,
      stock: typeof stock !== "undefined" ? Number(stock) : undefined,
      images: Array.isArray(images) ? (images as string[]) : undefined,
      is_active: typeof is_active === "boolean" ? is_active : undefined,
    });

    res.status(200).json({ product: updated });
  },

  async listCategories(_req: Request, res: Response): Promise<void> {
    const categories = await CategoryModel.listAll();
    res.status(200).json({ categories });
  },

  async createCategory(req: Request, res: Response): Promise<void> {
    const { name, slug, description } = req.body as Record<string, unknown>;
    if (typeof name !== "string" || typeof slug !== "string") {
      res.status(400).json({ error: "name and slug are required" });
      return;
    }

    const category = await CategoryModel.create({
      name,
      slug,
      description: typeof description === "string" ? description : null,
    });
    res.status(201).json({ category });
  },

  async updateCategory(req: Request, res: Response): Promise<void> {
    const categoryIdParam = req.params.id;
    const categoryId = typeof categoryIdParam === "string" ? categoryIdParam : undefined;
    if (!categoryId) {
      res.status(400).json({ error: "Category id is required" });
      return;
    }

    const { name, slug, description } = req.body as Record<string, unknown>;
    const category = await CategoryModel.update(categoryId, {
      name: typeof name === "string" ? name : undefined,
      slug: typeof slug === "string" ? slug : undefined,
      description: typeof description === "string" ? description : undefined,
    });
    res.status(200).json({ category });
  },

  async deleteCategory(req: Request, res: Response): Promise<void> {
    const categoryIdParam = req.params.id;
    const categoryId = typeof categoryIdParam === "string" ? categoryIdParam : undefined;
    if (!categoryId) {
      res.status(400).json({ error: "Category id is required" });
      return;
    }

    await CategoryModel.remove(categoryId);
    res.status(204).send();
  },
};

