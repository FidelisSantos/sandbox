import { Server, Socket } from "socket.io";
import { Movie } from "../models/Movie";
import { Genre } from "../models/Genre";
import { AgeRating } from "../models/AgeRating";

type GenreType = {
  id: number;
  name: string;
};

type AgeRatingType = {
  id: number;
  name: string;
};

type MovieType = {
  id: number;
  title: string;
  description: string;
  img_url: string;
  genre: GenreType;
  age_rating: AgeRatingType;
};

export function registerSocketEvents(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("Novo cliente conectado:", socket.id);

    socket.on("mensagem", (data) => {
      console.log("Mensagem recebida:", data);
      io.emit("mensagem", data);
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);
    });

    socket.on("saveMovies", async (data: MovieType[]) => {
      try {
        console.log("Salvando filmes:", data);
        
        const genres = new Set(data.map((movie) => movie.genre.name));
        const ageRatings = new Set(data.map((movie) => movie.age_rating.name));

        const genreMap = new Map<string, number>();
        for (const genreName of genres) {
          const [genre] = await Genre.findOrCreate({
            where: { name: genreName }
          });
          genreMap.set(genreName, genre.id);
        }

        const ageRatingMap = new Map<string, number>();
        for (const ageRatingName of ageRatings) {
          const [ageRating] = await AgeRating.findOrCreate({
            where: { name: ageRatingName }
          });
          ageRatingMap.set(ageRatingName, ageRating.id);
        }

        const moviesToCreate = data.map(movie => ({
          title: movie.title,
          description: movie.description,
          img_url: movie.img_url,
          genre_id: genreMap.get(movie.genre.name),
          age_rating_id: ageRatingMap.get(movie.age_rating.name)
        }));

        await Movie.bulkCreate(moviesToCreate);

        io.emit("saveMoviesSuccess");
      } catch (error) {
        console.error("Erro ao salvar filmes:", error);
        io.emit("saveMoviesError", []);
      }
    });
  });
}