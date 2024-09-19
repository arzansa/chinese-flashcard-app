import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function EditDeckPage() {
  const { id } = useParams(); // Deck ID from URL
  const [deck, setDeck] = useState(null);
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDeck() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/decks/${id}`, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        if (response.ok) {
          const deckData = await response.json();
          setDeck(deckData);
          setTitle(deckData.title);
          setDifficulty(deckData.difficulty);
          setIsPublic(deckData.isPublic);
        } else {
          console.error('Failed to fetch deck');
        }
      } catch (err) {
        console.error('Error:', err);
      }
    }
    fetchDeck();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedDeck = {
      title,
      difficulty,
      isPublic,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/decks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(updatedDeck),
      });
      if (response.ok) {
        navigate(`/decks/${id}`); // Redirect using navigate
      } else {
        console.error('Failed to update deck');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  if (!deck) {
    return <p>Loading deck...</p>;
  }

  return (
    <main>
      <h1>Edit Deck</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:<br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Difficulty:<br />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            required
          >
            <option value="">Select Difficulty</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </label>
        <br />
        <label>
          Public:<br />
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
        </label>
        <br />
        <button type="submit">Save Changes</button>
      </form>
      <br />
      <Link to={`/decks/${id}/cards/new`}>
        <button>Add New Card</button>
      </Link>
    </main>
  );
}
