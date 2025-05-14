import { Genre } from '../models/Genre';

export class GenreRepository {
  async create(name: string): Promise<Genre> {
    return await Genre.create({ name });
  }

  async delete(id: number): Promise<void> {
    await Genre.destroy({ where: { id } });
  }

  async get(): Promise<Genre[]> {
    return await Genre.findAll();
  }

  async find(id: number): Promise<Genre | null> {
    return await Genre.findByPk(id);
  }
}
