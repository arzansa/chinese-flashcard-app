import { Link } from "react-router-dom";
import "./CommunityDecksPage.css";

export default function CommunityDecksPage({ decks, user, addDeckToUser }) {
  const publicDecks = decks.filter((deck) => deck.isPublic);

  return (
    <main>
      <h1>Community Decks</h1>
      {publicDecks.length > 0 ? (
        publicDecks.map((deck) => (
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

              <Link to={`/community-decks/${deck._id}`}>
                <button>View Deck</button>
              </Link>
              <button
                onClick={() => {
                  addDeckToUser(deck);
                }}
              >
                Add to My Decks
              </button>
          </article>
        ))
      ) : (
        <p>No public decks available.</p>
      )}
    </main>
  );
}
