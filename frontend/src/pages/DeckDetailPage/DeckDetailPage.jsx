import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function DeckDetailPage() {
  const { id } = useParams();
  const [deck, setDeck] = useState(null);

  useEffect(() => {
    async function fetchDeck() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/decks/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setDeck(data);
        } else {
          console.error("Failed to fetch deck");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }
    fetchDeck();
  }, [id]);

  if (!deck) {
    return <p>Loading deck...</p>;
  }

  return (
    <main>
      <h1>{deck.title}</h1>
      <p>Difficulty: {deck.difficulty}</p>
      <p>Created by: {deck.creator.name}</p>
      <Link to={`/decks/${id}/study`}>
        <button>Study Deck</button>
      </Link>
    </main>
  );
}
