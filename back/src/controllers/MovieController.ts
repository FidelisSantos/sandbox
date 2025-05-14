import { Request, Response } from "express";
import { MovieService } from "../services/MovieService";

const service = new MovieService();

export class MovieController {
    static async create(req: Request, res: Response) {
        const { title, description, img_url, genre_id, age_rating_id } = req.body;
        try {
            const movie = await service.create(title, description, img_url, genre_id, age_rating_id);
            res.status(201).json(movie);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params;
        await service.delete(Number(id));
        res.status(204).send();
    }

    static async get(req: Request, res: Response) {
        const movies = await service.get();
        res.json(movies);
    }

    static async find(req: Request, res: Response) {
        const { id } = req.params;
        const movie = await service.find(Number(id));
        if (movie) {
            res.json(movie);
        } else {
            res.status(404).json({ message: "Not found" });
        }
    }
}