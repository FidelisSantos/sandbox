import { Genre } from "../models/Genre";
import { AgeRating } from "../models/AgeRating";
import { Movie } from "../models/Movie";

export class MovieRepository {
    async create(title: string, description: string, img_url: string, genre_id: number, age_rating_id: number) : Promise<Movie> {
        return await Movie.create({
            title, description, img_url, genre_id, age_rating_id
        });
    }

    async delete(id: number): Promise<void> {
        await Movie.destroy({where: {id}});
    }

    async get(): Promise<Movie[]> {
        return await Movie.findAll({
            include: [
                {       
                    model: Genre,
                    as: 'genre'
                },
                {
                    model: AgeRating,
                    as: 'age_rating'
                }
            ]
        });
    }

    async find(id: number): Promise<Movie | null> {
        return await Movie.findByPk(id)
    }

    async describe() {
        return await Movie.describe();
    }
}