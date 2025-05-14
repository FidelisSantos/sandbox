import { GenreRepository } from "../repositories/GenreRepository";
import { AgeRatingRepository } from "../repositories/AgeRatingRepository";
import { MovieRepository } from "../repositories/MovieRepository";

export class SandboxService {
    private genreRepo = new GenreRepository();
    private ageRatingRepo = new AgeRatingRepository();
    private movieRepo = new MovieRepository();

    async describeTables() {
        return {
            genres: await this.genreRepo.describe(),
            age_ratings: await this.ageRatingRepo.describe(),
            movies: await this.movieRepo.describe(),
        }
    }

    async populateTables() {
        return {
            genres: await this.genreRepo.get(),
            age_ratings: await this.ageRatingRepo.get(),
        }
    }
}