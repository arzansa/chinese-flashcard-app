import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getUser } from "../../services/authService";
import "./App.css";
import NavBar from "../../components/NavBar/NavBar";
import HomePage from "../HomePage/HomePage";
import SignUpPage from "../SignUpPage/SignUpPage";
import LogInPage from "../LogInPage/LogInPage";
import DeckListPage from "../DeckListPage/DeckListPage";
import NewDeckPage from "../NewDeckPage/NewDeckPage";
import EditDeckPage from "../EditDeckPage/EditDeckPage";
import NewCardPage from "../NewCardPage/NewCardPage";
import DeckDetailPage from "../DeckDetailPage/DeckDetailPage";
import StudyDeckPage from "../StudyDeckPage/StudyDeckPage";
import EditCardPage from "../EditCardPage/EditCardPage";
import CommunityDecksPage from "../CommunityDecksPage/CommunityDecksPage";
import CommunityDeckDetailPage from "../CommunityDeckDetailPage/CommunityDeckDetailPage"; 
function App() {
  const [user, setUser] = useState(getUser());
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    if (user) {
      fetchDecks();
    }
  }, [user]);

  async function fetchDecks() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/decks", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDecks(data);
      } else {
        console.error("Failed to fetch decks");
      }
    } catch (err) {
      console.error("Error fetching decks:", err);
    }
  }

  async function addDeckToUser(deck) {
    try {
      const token = localStorage.getItem("token");
      console.log("Cloning deck with ID:", deck._id);       const response = await fetch(`/api/decks/clone/${deck._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (response.ok) {
        const newDeck = await response.json();
        setDecks([...decks, newDeck]);
        console.log("Deck cloned successfully:", newDeck);       } else {
        console.error(
          "Failed to clone deck",
          response.status,
          response.statusText
        );
      }
    } catch (err) {
      console.error("Error cloning deck:", err);
    }
  }

  return (
    <main id="react-app">
      <NavBar user={user} setUser={setUser} />
      <section id="main-section">
        {user ? (
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route
              path="/decks"
              element={<DeckListPage decks={decks} user={user} />}
            />
            <Route path="/decks/new" element={<NewDeckPage />} />
            <Route
              path="/decks/:id"
              element={
                <DeckDetailPage decks={decks} user={user} setDecks={setDecks} />
              }
            />
            <Route path="/decks/:id/edit" element={<EditDeckPage />} />
            <Route path="/decks/:id/cards/new" element={<NewCardPage />} />
            <Route
              path="/decks/:id/cards/:cardId/edit"
              element={<EditCardPage />}
            />
            <Route path="/decks/:id/study" element={<StudyDeckPage />} />
            <Route
              path="/community-decks"
              element={
                <CommunityDecksPage
                  decks={decks}
                  user={user}
                  addDeckToUser={addDeckToUser}
                />
              }
            />
            <Route
              path="/community-decks/:id"
              element={
                <CommunityDeckDetailPage
                  decks={decks}
                  addDeckToUser={addDeckToUser}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/login" element={<LogInPage setUser={setUser} />} />
            <Route path="/signup" element={<SignUpPage setUser={setUser} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </section>
    </main>
  );
}

export default App;
