import { Link } from "react-router-dom";

export default function DeckListPage({ decks, user }) {
  return (
    <main>
      <h1>Deck List Page</h1>
      <Link to="/decks/new">
        <button>Create New Deck</button>
      </Link>
      {decks.length > 0 ? (
        decks.map((deck) => (
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
            <Link to={`/decks/${deck._id}/edit`}>
              <button>Edit Deck</button>
            </Link>
          </article>
        ))
      ) : (
        <p>No decks available.</p>
      )}
    </main>
  );
}
