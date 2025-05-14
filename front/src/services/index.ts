import { SandboxService } from "./sandbox";
import { url } from "./api";
import type { AgeRating, CreateMovie, Genre, Movie } from "../types";
import type { IRequest } from "../interface";
const api: IRequest = {
    getMovies: async () => {
        const response = await fetch(`${url}/movies`);
        return response.json();
    },
    createMovie: async (movie: CreateMovie) => {
        const response = await fetch(`${url}/movies`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(movie),
        });

        return response.json();
    },
    deleteMovie: async (id: number) => {
        await fetch(`${url}/movies/${id}`, {
            method: "DELETE",
        });
    },
    getGenres: async () => {
        const response = await fetch(`${url}/genres`);
        return response.json();
    },
    createGenre: async (name: string) => {
        const response = await fetch(`${url}/genres`, {
            method: "POST",
            body: JSON.stringify({ name }),
        });
        return response.json();
    },
    getAgeRatings: async () => {
        const response = await fetch(`${url}/age_ratings`);
        return response.json();
    }
}

const sandbox: IRequest = {
    getMovies: async () => {
        const db = await SandboxService.getDb();
        const result = db.exec(`
            SELECT 
                m.id,
                m.title,
                m.description,
                m.img_url,
                g.id as genre_id,
                g.name as genre_name,
                ar.id as age_rating_id,
                ar.name as age_rating_name
            FROM movies m
            LEFT JOIN genres g ON m.genre_id = g.id
            LEFT JOIN age_ratings ar ON m.age_rating_id = ar.id
        `);
        
        if (result.length === 0) return [];
        
        return result[0].values.map((row: any[]) => {
            const movie: any = {
                id: row[0],
                title: row[1],
                description: row[2],
                img_url: row[3],
                genre: {
                    id: row[4],
                    name: row[5]
                },
                age_rating: {
                    id: row[6],
                    name: row[7]
                }
            };
            return movie as Movie;
        });
    },
    createMovie: async (movie: CreateMovie) => {
        const db = await SandboxService.getDb();
        
        const genreResult = db.exec('SELECT * FROM genres WHERE id = ?', [movie.genre_id]);
        if (genreResult.length === 0) {
            db.exec('INSERT INTO genres (id, name) VALUES (?, ?)', [movie.genre_id, 'Novo Gênero']);
        }

        const ageRatingResult = db.exec('SELECT * FROM age_ratings WHERE id = ?', [movie.age_rating_id]);
        if (ageRatingResult.length === 0) {
            db.exec('INSERT INTO age_ratings (id, name) VALUES (?, ?)', [movie.age_rating_id, 'Nova Classificação']);
        }

        const columns = Object.keys(movie);
        const values = Object.values(movie);
        const placeholders = values.map(() => '?').join(', ');
        
        const insertSQL = `
            INSERT INTO movies (${columns.join(', ')})
            VALUES (${placeholders})
        `;
        console.log(insertSQL, values);
        
        db.exec(insertSQL, values);
        
        const result = db.exec('SELECT last_insert_rowid() as id');
        const id = result[0].values[0][0];

        const movieResult = db.exec(`
            SELECT 
                m.id,
                m.title,
                m.description,
                m.img_url,
                g.id as genre_id,
                g.name as genre_name,
                ar.id as age_rating_id,
                ar.name as age_rating_name
            FROM movies m
            LEFT JOIN genres g ON m.genre_id = g.id
            LEFT JOIN age_ratings ar ON m.age_rating_id = ar.id
            WHERE m.id = ?
        `, [id]);

        if (movieResult.length === 0) {
            const genre = genreResult.length > 0 ? {
                id: genreResult[0].values[0][0],
                name: genreResult[0].values[0][1]
            } : { id: movie.genre_id, name: 'Novo Gênero' };
            
            const ageRating = ageRatingResult.length > 0 ? {
                id: ageRatingResult[0].values[0][0],
                name: ageRatingResult[0].values[0][1]
            } : { id: movie.age_rating_id, name: 'Nova Classificação' };

            return {
                id,
                title: movie.title,
                description: movie.description,
                img_url: movie.img_url,
                genre,
                age_rating: ageRating
            } as Movie;
        }

        const row = movieResult[0].values[0];
        return {
            id: row[0],
            title: row[1],
            description: row[2],
            img_url: row[3],
            genre: {
                id: row[4],
                name: row[5]
            },
            age_rating: {
                id: row[6],
                name: row[7]
            }
        } as Movie;
    },
    deleteMovie: async (id: number) => {
        const db = await SandboxService.getDb();
        db.exec('DELETE FROM movies WHERE id = ?', [id]);
    },
    getGenres: async () => {
        const db = await SandboxService.getDb();
        const result = db.exec('SELECT * FROM genres');
        if (result.length === 0) return [];
        
        const columns = result[0].columns;
        return result[0].values.map((row: any[]) => {
            const genre: any = {};
            columns.forEach((col: string, i: number) => {
                genre[col] = row[i];
            });
            return genre as Genre;
        });
    },
    createGenre: async (name: string) => {
        const db = await SandboxService.getDb();
        db.exec('INSERT INTO genres (name) VALUES (?)', [name]);
        
        const result = db.exec('SELECT last_insert_rowid() as id');
        const id = result[0].values[0][0];
        
        return { id, name };
    },
    getAgeRatings: async () => {
        const db = await SandboxService.getDb();
        const result = db.exec('SELECT * FROM age_ratings');
        if (result.length === 0) return [];
        
        const columns = result[0].columns;
        return result[0].values.map((row: any[]) => {
            const ageRating: any = {};
            columns.forEach((col: string, i: number) => {
                ageRating[col] = row[i];
            });
            return ageRating as AgeRating;
        });
    }
}

const useSandbox = (isSandbox: boolean) => {
    return isSandbox ? sandbox : api;
}

export { api, sandbox, useSandbox };