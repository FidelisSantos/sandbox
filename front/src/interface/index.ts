import type { AgeRating, CreateMovie, Genre, Movie } from "../types";

export interface IRequest {
    getMovies: () => Promise<Movie[]>;
    createMovie: (movie: CreateMovie) => Promise<Movie>;
    getGenres: () => Promise<Genre[]>;
    createGenre: (name: string) => Promise<Genre>;
    getAgeRatings: () => Promise<AgeRating[]>;
    deleteMovie: (id: number) => Promise<void>;
}
