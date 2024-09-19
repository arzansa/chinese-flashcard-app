import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function NewCardPage() {
  const { id } = useParams(); // Deck ID from URL
  const [english, setEnglish] = useState('');
  const [chinese, setChinese] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cardData = {
      english,
      chinese,
      pinyin,
      notes,
    };

    try {
      const token = localStorage.getItem('token');
      // Add card to the deck via the deck's API endpoint
      const response = await fetch(`/api/decks/${id}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(cardData),
      });
      if (response.ok) {
        navigate(`/decks/${id}`); // Redirect using navigate
      } else {
        console.error('Failed to add card to deck');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <main>
      <h1>Add New Card</h1>
      <form onSubmit={handleSubmit}>
        <label>
          English:<br />
          <input
            type="text"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Chinese:<br />
          <input
            type="text"
            value={chinese}
            onChange={(e) => setChinese(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Pinyin:<br />
          <input
            type="text"
            value={pinyin}
            onChange={(e) => setPinyin(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Notes:<br />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </label>
        <br />
        <button type="submit">Add Card</button>
      </form>
    </main>
  );
}
