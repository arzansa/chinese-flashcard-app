// DeckDetailPage.jsx
import { useParams, Link } from "react-router-dom";

export default function DeckDetailPage({ decks = [], user, setDecks }) {
  const { id } = useParams();
  const deck = decks.find((deck) => deck._id === id);

  if (!deck) return <p>Deck not found.</p>;

  const isCreator = user && deck.creator._id === user._id;

  async function handleRemoveCard(deckId, cardId) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/decks/${deckId}/cards/${cardId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (response.ok) {
        const updatedDecks = decks.map((d) => {
          if (d._id === deckId) {
            return {
              ...d,
              cards: d.cards.filter((c) => c._id !== cardId),
            };
          }
          return d;
        });
        setDecks(updatedDecks);
      } else {
        console.error("Failed to remove card");
      }
    } catch (err) {
      console.error("Error removing card:", err);
    }
  }

  return (
    <main>
      <h1>{deck.title}</h1>
      <p>{deck.text}</p>
      <p>
        {deck.creator?.name || "Unknown"} posted on{" "}
        {new Date(deck.createdAt).toLocaleDateString()}
      </p>
      {isCreator && (
        <>
          <Link to={`/decks/${deck._id}/edit`}>
            <button>Edit Deck</button>
          </Link>
          <Link to={`/decks/${deck._id}/cards/new`}>
            <button>Add Card</button>
          </Link>
        </>
      )}
      <section>
        <h2>Cards</h2>
        {deck.cards && deck.cards.length > 0 ? (
          deck.cards.map((card) => (
            <article key={card._id}>
              <p>
                <strong>English:</strong> {card.english}
              </p>
              <p>
                <strong>Chinese:</strong> {card.chinese}
              </p>
              <p>
                <strong>Pinyin:</strong> {card.pinyin}
              </p>
              {card.notes && (
                <p>
                  <strong>Notes:</strong> {card.notes}
                </p>
              )}
              {isCreator && (
                <>
                  <Link to={`/decks/${deck._id}/cards/${card._id}/edit`}>
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => handleRemoveCard(deck._id, card._id)}>
                    Remove
                  </button>
                </>
              )}
            </article>
          ))
        ) : (
          <p>No cards available in this deck.</p>
        )}
      </section>
    </main>
  );
}
