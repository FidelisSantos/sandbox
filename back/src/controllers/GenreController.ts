import { Request, Response } from "express";
import { GenreService } from "../services/GenreService";

const service = new GenreService();

export class GenreController {

    static async create(req: Request, res: Response) {
        const { name } = req.body;
        const genre = await service.create(name);
        res.status(201).json(genre);
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params;
        await service.delete(Number(id));
        res.status(204).send();
    }

    static async get(req: Request, res: Response) {
        const genres = await service.get();
        res.json(genres);
    }

    static async find(req: Request, res: Response) {
        const { id } = req.params;
        const genre = await service.find(Number(id));
        if (genre) {
            res.json(genre);
        } else {
            res.status(404).json({ message: "Not found" });
        }
    }
}