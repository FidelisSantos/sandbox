import { MovieRepository } from "../repositories/MovieRepository";
import { Movie } from "../models/Movie";
import { GenreRepository } from "../repositories/GenreRepository";
import { AgeRatingRepository } from "../repositories/AgeRatingRepository";

export class MovieService {
    private repo = new MovieRepository();
    private genreRepo = new GenreRepository();
    private ageRatingRepo = new AgeRatingRepository();

    async create(
        title: string,
        description: string,
        img_url: string,
        genre_id: number,
        age_rating_id: number
    ): Promise<Movie> {
        const genre = await this.genreRepo.find(genre_id);
        if (!genre) throw new Error("Genre not found");

        const ageRating = await this.ageRatingRepo.find(age_rating_id);
        if (!ageRating) throw new Error("Age rating not found");

        return this.repo.create(title, description, img_url, genre_id, age_rating_id);
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete(id);
    }

    async get(): Promise<Movie[]> {
        return this.repo.get();
    }

    async find(id: number): Promise<Movie | null> {
        return this.repo.find(id);
    }
}