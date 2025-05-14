import { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { type IRequest } from "../services";
type Genre = { id: number; name: string };
type AgeRating = { id: number; name: string };

type Props = {
  show: boolean;
  onHide: () => void;
  onCreated: () => void;
  request: IRequest;
};

export default function MovieCreateModal({ show, onHide, onCreated, request }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [genreId, setGenreId] = useState<number | "">("");
  const [ageRatingId, setAgeRatingId] = useState<number | "">("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [ageRatings, setAgeRatings] = useState<AgeRating[]>([]);
  const [showGenreModal, setShowGenreModal] = useState(false);
  const [newGenre, setNewGenre] = useState("");

  useEffect(() => {
    request.getGenres().then(setGenres);
    request.getAgeRatings().then(setAgeRatings);
  }, [show, showGenreModal]);

  function handleCreateMovie(e: React.FormEvent) {
    e.preventDefault();
    request.createMovie({
        title,
        description,
        img_url: imgUrl,
        genre_id: genreId as number,
        age_rating_id: ageRatingId as number,
      }).then(() => {
      onCreated();
      onHide();
      setTitle("");
      setDescription("");
      setImgUrl("");
      setGenreId("");
      setAgeRatingId("");
    });
  }

  function handleAddGenre(e: React.FormEvent) {
    e.preventDefault();
    request.createGenre(newGenre).then((genre) => {
      setGenres((prev) => [...prev, genre]);
      setGenreId(genre.id);
      setShowGenreModal(false);
      setNewGenre("");
      });
  }

  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Form onSubmit={handleCreateMovie}>
          <Modal.Header closeButton>
            <Modal.Title>Criar Filme</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Título</Form.Label>
              <Form.Control value={title} onChange={e => setTitle(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Descrição</Form.Label>
              <Form.Control value={description} onChange={e => setDescription(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Imagem (URL)</Form.Label>
              <Form.Control value={imgUrl} onChange={e => setImgUrl(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Gênero</Form.Label>
              <InputGroup>
                <Form.Select
                  value={genreId}
                  onChange={e => setGenreId(Number(e.target.value))}
                  required
                >
                  <option value="">Selecione...</option>
                  {genres.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </Form.Select>
                <Button variant="outline-secondary" onClick={() => setShowGenreModal(true)}>+</Button>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Classificação Indicativa</Form.Label>
              <Form.Select
                value={ageRatingId}
                onChange={e => setAgeRatingId(Number(e.target.value))}
                required
              >
                <option value="">Selecione...</option>
                {ageRatings.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>Cancelar</Button>
            <Button type="submit" variant="primary">Criar</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal para adicionar novo gênero */}
      <Modal show={showGenreModal} onHide={() => setShowGenreModal(false)}>
        <Form onSubmit={handleAddGenre}>
          <Modal.Header closeButton>
            <Modal.Title>Novo Gênero</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Nome do Gênero</Form.Label>
              <Form.Control
                value={newGenre}
                onChange={e => setNewGenre(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowGenreModal(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">Adicionar</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}