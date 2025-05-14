import { Request, Response } from "express";
import { AgeRatingService } from "../services/AgeRatingService";

const service = new AgeRatingService();

export class AgeRatingController {
    static async create(req: Request, res: Response) {
        const { name } = req.body;
        const ageRating = await service.create(name);
        res.status(201).json(ageRating);
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params;
        await service.delete(Number(id));
        res.status(204).send();
    }

    static async get(req: Request, res: Response) {
        const ratings = await service.get();
        res.json(ratings);
    }

    static async find(req: Request, res: Response) {
        const { id } = req.params;
        const rating = await service.find(Number(id));
        if (rating) {
            res.json(rating);
        } else {
            res.status(404).json({ message: "Not found" });
        }
    }
}