import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io('http://localhost:5000');

      this.socket.on('connect', () => {
        console.log('Conectado ao servidor de socket');
      });

      this.socket.on('disconnect', () => {
        console.log('Desconectado do servidor de socket');
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(message: string) {
    if (this.socket) {
      this.socket.emit('mensagem', message);
    }
  }

  saveMovies(movies: any) {
    if (this.socket) {
      this.socket.emit('saveMovies', movies);
    }
  }

  saveMovie(movie: any) {
    if (this.socket) {
      this.socket.emit('saveMovie', movie);
    }
  }

  onMessage(callback: (message: string) => void) {
    if (this.socket) {
      this.socket.on('mensagem', callback);
    }
  }

  onSaveMoviesSuccess(callback: () => void) {
    if (this.socket) {
      this.socket.on('saveMoviesSuccess', callback);
    }
  }

  onSaveMoviesError(callback: (movies: any) => void) {
    if (this.socket) {
      this.socket.on('saveMoviesError', callback);
    }
  }
}

export const socketService = new SocketService(); 