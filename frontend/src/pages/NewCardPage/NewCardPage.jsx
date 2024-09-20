// NewCardPage.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./NewCardPage.css";

export default function NewCardPage({ decks, setDecks }) {
  const { id } = useParams();
  const [english, setEnglish] = useState("");
  const [chinese, setChinese] = useState("");
  const [pinyin, setPinyin] = useState("");
  const [notes, setNotes] = useState("");
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
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/decks/${id}/cards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(cardData),
      });
      if (response.ok) {
        const newCard = await response.json();

        // Update the decks state
        const updatedDecks = decks.map((d) => {
          if (d._id === id) {
            return {
              ...d,
              cards: [...d.cards, newCard],
            };
          }
          return d;
        });
        setDecks(updatedDecks);

        navigate(`/decks/${id}`);
      } else {
        console.error("Failed to add card to deck");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleCharacterClick = (char) => {
    setPinyin(pinyin + char);
  };

  const characters = [
    "ā", "á", "ǎ", "à",
    "ē", "é", "ě", "è",
    "ī", "í", "ǐ", "ì",
    "ō", "ó", "ǒ", "ò",
    "ū", "ú", "ǔ", "ù",
    "ǖ", "ǘ", "ǚ", "ǜ"
  ];

  return (
    <main>
      <h1>Add New Card to Deck</h1>
      <form onSubmit={handleSubmit}>
        <label>
          English:
          <br />
          <input
            type="text"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Chinese:
          <br />
          <input
            type="text"
            value={chinese}
            onChange={(e) => setChinese(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Pinyin:
          <br />
          <input
            type="text"
            value={pinyin}
            onChange={(e) => setPinyin(e.target.value)}
            required
          />
        </label>
        <div className="character-buttons">
          {characters.map((char) => (
            <button
              type="button"
              key={char}
              onClick={() => handleCharacterClick(char)}
            >
              {char}
            </button>
          ))}
        </div>
        <br />
        <label>
          Notes:
          <br />
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
