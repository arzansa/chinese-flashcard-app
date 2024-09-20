// EditCardPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditCardPage.css";

export default function EditCardPage({ decks, setDecks }) {
  const { id, cardId } = useParams();
  const [card, setCard] = useState(null);
  const [english, setEnglish] = useState("");
  const [chinese, setChinese] = useState("");
  const [pinyin, setPinyin] = useState("");
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCard() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/cards/${cardId}`, {
          headers: {
            Authorization: "Bearer " + token,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        });
        if (response.ok) {
          const cardData = await response.json();
          setCard(cardData);
          setEnglish(cardData.english);
          setChinese(cardData.chinese);
          setPinyin(cardData.pinyin);
          setNotes(cardData.notes);
        } else {
          console.error(
            "Failed to fetch card",
            response.status,
            response.statusText
          );
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }
    fetchCard();
  }, [cardId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedCard = {
      english,
      chinese,
      pinyin,
      notes,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/cards/${cardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(updatedCard),
      });
      if (response.ok) {
        const updatedCardData = await response.json();

        // Update the decks state
        const updatedDecks = decks.map((d) => {
          if (d._id === id) {
            return {
              ...d,
              cards: d.cards.map((c) =>
                c._id === cardId ? updatedCardData : c
              ),
            };
          }
          return d;
        });
        setDecks(updatedDecks);

        navigate(`/decks/${id}`);
      } else {
        console.error(
          "Failed to update card",
          response.status,
          response.statusText
        );
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

  if (!card) {
    return <p>Loading card...</p>;
  }

  return (
    <main>
      <h1>Edit Card</h1>
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
        <button type="submit">Save Changes</button>
      </form>
    </main>
  );
}
