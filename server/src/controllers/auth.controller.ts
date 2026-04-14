import { Request, Response } from "express";
import { UserModel } from "../models/User";

export const authController = {
  async me(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const profile = await UserModel.getProfileById(userId);
    res.status(200).json({ user: req.user, profile });
  },
};

