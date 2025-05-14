import express from 'express';
import http from "http";
import { Server } from "socket.io";
import cors from 'cors';

import { sequelize } from '../database';
import { registerSocketEvents } from './events';

import ageRatingRoutes from './routes/AgeRatingRoutes';
import movieRoutes from './routes/MovieRoutes'; 
import genreRoutes from './routes/GenreRoutes';
import sandboxRoutes from './routes/SanboxRoutes';

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
const PORT = 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

registerSocketEvents(io);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Online');
});

app.use("/age_ratings", ageRatingRoutes);
app.use("/movies", movieRoutes);
app.use("/genres", genreRoutes);
app.use("/sandbox", sandboxRoutes);

server.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running at http://localhost:${PORT}`);
});