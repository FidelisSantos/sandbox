import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { Genre } from './Genre';
import { AgeRating } from './AgeRating';

@Table({ tableName: 'movies', timestamps: false })
export class Movie extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id!: number;

  @Column({ type: DataType.STRING(100) })
  title!: string;

  @Column({ type: DataType.STRING(500) })
  description!: string;

  @Column({ type: DataType.STRING(1000) })
  img_url!: string;

  @ForeignKey(() => Genre)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  genre_id!: number;

  @ForeignKey(() => AgeRating)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  age_rating_id!: number;

  @BelongsTo(() => Genre)
  genre!: Genre;

  @BelongsTo(() => AgeRating)
  age_rating!: AgeRating;
}
