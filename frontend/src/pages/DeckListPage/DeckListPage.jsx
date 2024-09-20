import { Link } from "react-router-dom";
import "./DeckListPage.css";

export default function DeckListPage({ decks, user }) {
  const userDecks = decks.filter((deck) => deck.creator._id === user._id);

  return (
    <main>
      <h1>My Decks</h1>
      <Link to="/decks/new">
        <div className="new-deck-btn-container">
          <button className="new-deck-btn">Create New Deck</button>
        </div>
      </Link>
      {userDecks.length > 0 ? (
        userDecks.map((deck) => (
          <article key={deck._id}>
            <header>
              <h2>{deck.title}</h2>
              <div className="added-by">
                <p>
                  {deck.creator?.name || "Unknown"} posted on{" "}
                  {new Date(deck.createdAt).toLocaleDateString()}
                </p>
              </div>
            </header>
            <p>{deck.text}</p>
            <Link to={`/decks/${deck._id}`}>
              <button>View/Edit Deck</button>
            </Link>
            <Link to={`/decks/${deck._id}/study`}>
              <button>Study Deck</button>
            </Link>
          </article>
        ))
      ) : (
        <p>No decks available.</p>
      )}
    </main>
  );
}
