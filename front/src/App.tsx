import { useEffect, useState } from "react";
import { Card, Row, Col, Container,Button } from "react-bootstrap";
import MovieCreateModal from "./components/MovieCreateModal";
import './App.css';
import {socketService} from "./services/socket";
import { useSandbox, type IRequest } from "./services";
import { SandboxService } from "./services/sandbox";

type Movie = {
  id: number;
  title: string;
  description: string;
  img_url: string;
  genre: {
    id: number;
    name: string;
  };
  age_rating: {
    id: number;
    name: string;
  };
};
function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isSandbox, setIsSandbox] = useState(false);
  const [request, setRequest] = useState<IRequest>(useSandbox(isSandbox));
  const [isLoading, setIsLoading] = useState(false);
  socketService.connect();

  useEffect(() => {
    request?.getMovies().then(setMovies);
  }, [request]);

  function handleCreated() {
    request?.getMovies().then(setMovies);
  }

  async function handleToggleSandbox(newSandboxState: boolean) {
    try {
      setIsLoading(true);
      setMovies([]); 
      if (newSandboxState) {
        await initSandbox();
      } else {
        await finishSandbox();
      }
    } catch (error) {
      console.error('Erro ao alternar modo:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function finishSandbox() {
    await SandboxService.deleteDb();
    const newRequest = useSandbox(false);
    setRequest(newRequest);
    setIsSandbox(false);
    const apiMovies = await newRequest.getMovies();
    setMovies(apiMovies);
  }

  async function initSandbox() {
    await SandboxService.createTablesToMovies();
    const newRequest = useSandbox(true);
    setRequest(newRequest);
    setIsSandbox(true);
    const sandboxMovies = await newRequest.getMovies();
    setMovies(sandboxMovies);
  }

  async function handleSaveMovies() {
    const sandboxMovies = await request?.getMovies();
    socketService.saveMovies(sandboxMovies);
    setIsLoading(true);
  }

  socketService.onSaveMoviesSuccess(async () => {
    setIsLoading(false);
    await finishSandbox();
  });

  socketService.onSaveMoviesError(() => {
    setIsLoading(false);
    alert("Erro ao salvar filmes");
  });


  async function handleDeleteMovie(id: number) {
    confirm("Tem certeza que deseja deletar este filme?") && await request?.deleteMovie(id);
    await request?.getMovies().then(setMovies);
  }

  return (
    <Container className="mt-4">
      {isLoading ? 
      <div className="loading-overlay d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div> : <>
        <div className="d-flex justify-content gap-2">
          <Button className="mb-3" onClick={() => setShowModal(true)}>
            Criar Filme
          </Button>
          <Button
            id="sandbox-toggle"
            className="mb-3"
            onClick={() => handleToggleSandbox(!isSandbox)}
          >
            {isSandbox ? "To API" : "To Sandbox"}
          </Button>
          {isSandbox && <Button
            id="sandbox-toggle"
            className="mb-3"
            onClick={() => handleSaveMovies()}
            disabled={movies.length === 0}
          >
            Save Movies
          </Button>}
        </div>
        <MovieCreateModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onCreated={handleCreated}
          request={request}
        />
        <Row>
          {movies.map((movie) => (
            <Col md={4} key={movie.id} className="mb-4">
              <Card>
                <Card.Img variant="top" style={{maxHeight: "300px"}} src={movie.img_url} />
                <Card.Body>
                  <Card.Title>Titulo: {movie.title}</Card.Title>
                  <Card.Text>Descrição: {movie.description}</Card.Text>
                  <Card.Text>Gênero: {movie.genre.name}</Card.Text>
                  <Card.Text>Classificação: {movie.age_rating.name}</Card.Text>
                  
                </Card.Body>
                <div className="d-flex justify-content-end">
                  <Button variant="danger" onClick={() => handleDeleteMovie(movie.id)}>Delete Movie</Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </>}
    </Container>
  );
}

export default App;
