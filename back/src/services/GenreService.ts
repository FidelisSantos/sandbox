import { GenreRepository } from "../repositories/GenreRepository";
import { Genre } from "../models/Genre";

export class GenreService {
    private repo = new GenreRepository();

    async create(name: string): Promise<Genre> {
        return this.repo.create(name);
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete(id);
    }

    async get(): Promise<Genre[]> {
        return this.repo.get();
    }

    async find(id: number): Promise<Genre | null> {
        return this.repo.find(id);
    }
}