import { Link } from 'react-router-dom';

export default function DeckListPage(props) {
  return (
    <main>
      <h1>Deck List Page</h1>
      {props.decks.map((deck) => (
        <Link key={deck._id} to={`/decks/${deck._id}`}>
          <article>
            <header>
              <h2>{deck.title}</h2>
              <p>
                {deck.author.username} posted on 
                {new Date(deck.createdAt).toLocaleDateString()}
              </p>
            </header>
            <p>{deck.text}</p>
          </article>
        </Link>
      ))}
    </main>
  );
}
