export type Movie = {
    id: number;
    title: string;
    description: string;
    img_url: string;
    genre: Genre;
    age_rating: AgeRating;
};

export type Genre = {
    id: number;
    name: string;
};

export type AgeRating = {
    id: number;
    name: string;
};

export type CreateMovie = {
    title: string;
    description: string;
    img_url: string;
    genre_id: number;
    age_rating_id: number;
}