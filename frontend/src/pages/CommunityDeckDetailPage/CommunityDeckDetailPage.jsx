import { useParams } from "react-router-dom";

export default function CommunityDeckDetailPage({ decks, addDeckToUser }) {
  const { id } = useParams();
  const deck = decks.find((deck) => deck._id === id);

  if (!deck) return <p>Deck not found.</p>;

  return (
    <main>
      <h1>{deck.title}</h1>
      <p>{deck.text}</p>
      <p>
        {deck.creator?.name || "Unknown"} posted on{" "}
        {new Date(deck.createdAt).toLocaleDateString()}
      </p>
      <button onClick={() => addDeckToUser(deck)}>Add to My Decks</button>
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
            </article>
          ))
        ) : (
          <p>No cards available in this deck.</p>
        )}
      </section>
    </main>
  );
}
