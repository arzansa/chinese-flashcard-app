import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditDeckPage() {
  const { id } = useParams(); // Deck ID from URL
  const [deck, setDeck] = useState(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [isPublic, setIsPublic] = useState(false); // Add state for public
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDeck() {
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching deck with ID:", id); // Log the deck ID
        const response = await fetch(`/api/decks/${id}`, {
          headers: {
            Authorization: "Bearer " + token,
            "Cache-Control": "no-cache", // Disable caching
            Pragma: "no-cache", // Disable caching
            Expires: "0", // Disable caching
          },
        });
        if (response.ok) {
          const deckData = await response.json();
          console.log("Deck data fetched:", deckData); // Log the fetched deck data
          setDeck(deckData);
          setTitle(deckData.title);
          setText(deckData.text);
          setDifficulty(deckData.difficulty);
          setIsPublic(deckData.isPublic); // Set public state
        } else {
          console.error(
            "Failed to fetch deck",
            response.status,
            response.statusText
          );
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }
    fetchDeck();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedDeck = {
      title,
      text,
      difficulty,
      isPublic, // Include public in the updated deck data
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
        navigate("/decks"); // Redirect to the decks list page after deletion
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
    <main>
      <h1>Edit Deck</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Description:
          <br />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </label>
        <br />
        <label>
          Difficulty:
          <br />
          <input
            type="text"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Public:
          <br />
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
        </label>
        <br />
        <button type="submit">Save Changes</button>
      </form>
      <button
        onClick={handleDelete}
        style={{ marginTop: "20px", color: "red" }}
      >
        Delete Deck
      </button>
    </main>
  );
}
