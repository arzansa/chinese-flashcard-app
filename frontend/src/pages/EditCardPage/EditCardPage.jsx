import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditCardPage() {
  const { id, cardId } = useParams();   console.log("Deck ID:", id);   console.log("Card ID:", cardId); 
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
        console.log("Fetching card with ID:", cardId);         const response = await fetch(`/api/cards/${cardId}`, {
          headers: {
            Authorization: "Bearer " + token,
            "Cache-Control": "no-cache",             Pragma: "no-cache",             Expires: "0",           },
        });
        console.log("Response status:", response.status);         const responseText = await response.text();
        console.log("Response text:", responseText);         if (response.ok) {
          try {
            const cardData = JSON.parse(responseText);
            console.log("Card data fetched:", cardData);             setCard(cardData);
            setEnglish(cardData.english);
            setChinese(cardData.chinese);
            setPinyin(cardData.pinyin);
            setNotes(cardData.notes);
          } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
          }
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
