import { Card, Row, Col, Container,Button } from "react-bootstrap";
import MovieCreateModal from "./components/MovieCreateModal";
import './App.css';
import { useApp } from "./hooks/useApp";

function App() {
  const { movies,
    showModal, 
    isSandbox, 
    isLoading, 
    handleToggleSandbox, 
    handleCreated, 
    handleDeleteMovie, 
    handleSaveMovies,
    setShowModal,
    request,
  } = useApp();

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
