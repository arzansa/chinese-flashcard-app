import { useState } from "react";
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

function App() {
  const [user, setUser] = useState(getUser());
  const [decks, setDecks] = useState([]);

  return (
    <main id="react-app">
      <NavBar user={user} setUser={setUser} />
      <section id="main-section">
        {user ? (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/decks" element={<DeckListPage decks={decks} />} />
            <Route path="/decks/new" element={<NewDeckPage />} />
            <Route path="/decks/:id/edit" element={<EditDeckPage />} />
            <Route path="/decks/:id/cards/new" element={<NewCardPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
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
