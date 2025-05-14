import { useEffect, useState } from "react";
import { Card, Row, Col, Container,Button } from "react-bootstrap";
import MovieCreateModal from "./components/MovieCreateModal";
import './App.css';

type Movie = {
  id: number;
  title: string;
  description: string;
  img_url: string;
};

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data));
  }, []);

  function handleCreated() {
    fetch("http://localhost:5000/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data));
  }

  return (
    <Container className="mt-4">
        <Button className="mb-3" onClick={() => setShowModal(true)}>
        Criar Filme
      </Button>
      <MovieCreateModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onCreated={handleCreated}
      />
      <Row>
        {movies.map((movie) => (
          <Col md={4} key={movie.id} className="mb-4">
            <Card>
              <Card.Img variant="top" src={movie.img_url} />
              <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text>{movie.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default App;
