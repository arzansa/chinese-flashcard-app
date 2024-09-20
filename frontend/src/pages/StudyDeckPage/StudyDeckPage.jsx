<<<<<<< HEAD
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./StudyDeckPage.css"; // Import the CSS file
=======
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './StudyDeckPage.css'; // Import the CSS file
>>>>>>> d4f646bf2e5f5ffa24582a5ad6d2dbc37a065b3a

export default function StudyDeckPage() {
  const { id } = useParams();
  const [deck, setDeck] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

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

  const cards = deck.cards;
  const currentCard = cards[currentCardIndex];

  const handleNextCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const handlePreviousCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + cards.length) % cards.length
    );
  };

  return (
    <main className="study-deck-page">
      <h1>Studying: {deck.title}</h1>
      {cards.length > 0 ? (
        <div className="card-container">
          <div className={`card ${showAnswer ? "flipped" : ""}`}>
            <div className="card-front">
              <p>
                <strong>Chinese:</strong> {currentCard.chinese}
              </p>
            </div>
            <div className="card-back">
              <p>
                <strong>Pinyin:</strong> {currentCard.pinyin}
              </p>
              <p>
                <strong>English:</strong> {currentCard.english}
              </p>
              {currentCard.notes && (
                <p>
                  <strong>Notes:</strong> {currentCard.notes}
                </p>
              )}
            </div>
          </div>
          <button onClick={handlePreviousCard}>Previous Card</button>
          <button onClick={() => setShowAnswer(!showAnswer)}>
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </button>
          <button onClick={handleNextCard}>Next Card</button>
          <div className="progress-container">
            <div
              className="progress-bar"
<<<<<<< HEAD
              style={{
                width: `${((currentCardIndex + 1) / cards.length) * 100}%`,
              }}
=======
              style={{ width: `${((currentCardIndex + 1) / cards.length) * 100}%` }}
>>>>>>> d4f646bf2e5f5ffa24582a5ad6d2dbc37a065b3a
            ></div>
          </div>
          <p className="center-p">
            Card {currentCardIndex + 1} of {cards.length}
          </p>
        </div>
      ) : (
        <p>No cards in this deck.</p>
      )}
    </main>
  );
}
