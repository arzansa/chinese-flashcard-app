import { useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function NewDeckPage() {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const deckData = {
      title,
      difficulty,
      isPublic,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/decks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(deckData),
      });
      if (response.ok) {
        const newDeck = await response.json();
        history.push(`/decks/${newDeck._id}`);
      } else {
        console.error('Failed to create deck');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <main>
      <h1>Create New Deck</h1>
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
        <button type="submit">Create Deck</button>
      </form>
    </main>
  );
}
