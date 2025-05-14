import { Server, Socket } from "socket.io";

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
  });
}