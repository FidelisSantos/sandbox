import { AgeRating } from "../models/AgeRating";

export class AgeRatingRepository {
    async create(name: string): Promise<AgeRating> {
        return await AgeRating.create({name});
    }

    async delete(id: number): Promise<void> {
        await AgeRating.destroy({where:{id}});
    }

    async get(): Promise<AgeRating[]> {
        return AgeRating.findAll();
    }

    async find(id: number): Promise<AgeRating | null> {
        return AgeRating.findByPk(id);
    }
}