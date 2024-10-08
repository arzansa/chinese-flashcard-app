import { Link } from "react-router-dom";
import * as authService from "../../services/authService";
import "./NavBar.css";

export default function NavBar({ user, setUser }) {
  function handleLogOut() {
    authService.logOut();
    setUser(null);
  }

  return (
    <nav className="NavBar">
      <Link to="/">Home</Link>
      &nbsp; ~~~~~~~~~ &nbsp;
      {user ? (
        <>
          <Link to="/decks">My Decks</Link>
          &nbsp; ~~~~~~~~~ &nbsp;
          <Link to="/community-decks">Community Decks</Link>
          &nbsp; ~~~~~~~~~ &nbsp;
          <Link to="" onClick={handleLogOut}>
            Log Out
          </Link>
        </>
      ) : (
        <>
          <Link to="/login">Log In</Link>
          &nbsp; ~~~~~~~~~ &nbsp;
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
}
