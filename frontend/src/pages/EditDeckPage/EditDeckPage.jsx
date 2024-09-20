// EditDeckPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditDeckPage.css";

export default function EditDeckPage({ decks, setDecks, user }) {
  const { id } = useParams();
  // const [deck, setDeck] = useState(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const navigate = useNavigate();

const deck = decks.find((d) => d._id === id);
if (!deck) {
  return null;
}

  // useEffect(() => {
  //   async function fetchDeck() {
  //     try {
  //       const token = localStorage.getItem("token");
  //       console.log("Fetching deck with ID:", id);
  //       const response = await fetch(`/api/decks/${id}`, {
  //         headers: {
  //           Authorization: "Bearer " + token,
  //           "Cache-Control": "no-cache",
  //           Pragma: "no-cache",
  //           Expires: "0",
  //         },
  //       });
  //       if (response.ok) {
  //         const deckData = await response.json();
  //         console.log("Deck data fetched:", deckData);
  //         setDeck(deckData);
  //         setTitle(deckData.title);
  //         setText(deckData.text);
  //         setDifficulty(deckData.difficulty);
  //         setIsPublic(deckData.isPublic);
  //       } else {
  //         console.error(
  //           "Failed to fetch deck",
  //           response.status,
  //           response.statusText
  //         );
  //       }
  //     } catch (err) {
  //       console.error("Error:", err);
  //     }
  //   }
  //   fetchDeck();
  // }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedDeck = {
      title,
      text,
      difficulty,
      isPublic,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/decks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(updatedDeck),
      });
      if (response.ok) {
        const updatedDeckData = await response.json();
        const updatedDecks = decks.map((d) =>
          d._id === id ? updatedDeckData : d
        );
        setDecks(updatedDecks);

        navigate(`/decks/${id}`);
      } else {
        console.error(
          "Failed to update deck",
          response.status,
          response.statusText
        );
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/decks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (response.ok) {
        // Update the decks state by removing the deleted deck
        const updatedDecks = decks.filter((d) => d._id !== id);
        setDecks(updatedDecks);

        navigate("/decks");
      } else {
        console.error(
          "Failed to delete deck",
          response.status,
          response.statusText
        );
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  if (!deck) {
    return <p>Loading deck...</p>;
  }

  return (
    <main className="container mt-5">
      <h1>Edit Deck</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            className="form-control"
            id="description"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="difficulty">Difficulty:</label>
          <input
            type="text"
            className="form-control"
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            required
          />
        </div>
        <div className="form-group form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="isPublic">
            Public
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </form>
      <button onClick={handleDelete} className="btn btn-danger mt-3">
        Delete Deck
      </button>
    </main>
  );
}
