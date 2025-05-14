import { Sequelize } from 'sequelize-typescript';
import { Movie } from '../src/models/Movie';
import { Genre } from '../src/models/Genre';
import { AgeRating } from '../src/models/AgeRating';
import config from './config/config.js';

const env = process.env.NODE_ENV || 'development';
const dbConfig = (config as any)[env];

const sequelize = new Sequelize({
  ...dbConfig,
  models: [Movie, Genre, AgeRating],
});

export { sequelize };