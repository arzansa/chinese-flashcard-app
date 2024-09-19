import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const DeckDetailPage = () => {
  const { id } = useParams(); // Deck ID from URL
  const [deck, setDeck] = useState(null);

  useEffect(() => {
    async function fetchDeck() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/decks/${id}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (response.ok) {
          const deckData = await response.json();
          setDeck(deckData);
        } else {
          console.error("Failed to fetch deck");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }
    fetchDeck();
  }, [id]);

  async function handleDeleteCard(cardId) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/cards/${cardId}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (response.ok) {
        setDeck((prevDeck) => ({
          ...prevDeck,
          cards: prevDeck.cards.filter((card) => card._id !== cardId),
        }));
      } else {
        console.error("Failed to delete card");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }

  if (!deck) {
    return <p>Loading deck...</p>;
  }

  return (
    <main>
      <h1>{deck.title}</h1>
      <p>Difficulty: {deck.difficulty}</p>
      <p>Public: {deck.isPublic ? "Yes" : "No"}</p>
      <p>Created by: {deck.creator?.name || "Unknown"}</p>
      <p>Created on: {new Date(deck.createdAt).toLocaleDateString()}</p>
      <Link to={`/decks/${id}/cards/new`}>
        <button>Add Card</button>
      </Link>
      <h2>Cards</h2>
      {deck.cards.length > 0 ? (
        deck.cards.map((card) => (
          <article key={card._id}>
            <p>English: {card.english}</p>
            <p>Chinese: {card.chinese}</p>
            <p>Pinyin: {card.pinyin}</p>
            <p>Notes: {card.notes}</p>
            <Link to={`/decks/${id}/cards/${card._id}/edit`}>
              <button>Edit Card</button>
            </Link>
            <button onClick={() => handleDeleteCard(card._id)}>
              Delete Card
            </button>
          </article>
        ))
      ) : (
        <p>No cards available.</p>
      )}
    </main>
  );
};

export default DeckDetailPage;
