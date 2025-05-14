import { AgeRatingRepository } from "../repositories/AgeRatingRepository";
import { AgeRating } from "../models/AgeRating";

export class AgeRatingService {
    private repo = new AgeRatingRepository();

    async create(name: string): Promise<AgeRating> {
        return this.repo.create(name);
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete(id);
    }

    async get(): Promise<AgeRating[]> {
        return this.repo.get();
    }

    async find(id: number): Promise<AgeRating | null> {
        return this.repo.find(id);
    }
}