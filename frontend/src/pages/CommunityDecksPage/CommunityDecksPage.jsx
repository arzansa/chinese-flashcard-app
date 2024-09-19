import { Link } from "react-router-dom";

export default function CommunityDecksPage({ decks }) {
  const publicDecks = decks.filter((deck) => deck.isPublic);

  return (
    <main>
      <h1>Community Decks</h1>
      {publicDecks.length > 0 ? (
        publicDecks.map((deck) => (
          <article key={deck._id}>
            <header>
              <h2>{deck.title}</h2>
              <p>
                {deck.creator?.name || "Unknown"} posted on{" "}
                {new Date(deck.createdAt).toLocaleDateString()}
              </p>
            </header>
            <p>{deck.text}</p>
            <Link to={`/decks/${deck._id}`}>
              <button>View Deck</button>
            </Link>
            <Link to={`/decks/${deck._id}/study`}>
              <button>Study Deck</button>
            </Link>
          </article>
        ))
      ) : (
        <p>No public decks available.</p>
      )}
    </main>
  );
}
