import { useState, useEffect } from "react";
import Signup from "./pages/Signup";
import CategoryGrid from "./components/CategoryGrid";
import QuizGame from "./components/QuizGame";
import Header from "./components/Header";
import Leaderboard from "./components/Leaderboard";
import LevelSelection from "./components/LevelSelection";
import "./App.css";
import Login from "./pages/Login";

const normalizeUser = (value) => {
  if (!value) return null;
  if (typeof value === "string") return { username: value };
  if (typeof value === "object" && value.username) return value;
  return null;
};

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return null;

    try {
      return normalizeUser(JSON.parse(savedUser));
    } catch {
      return normalizeUser(savedUser);
    }
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("app_theme") || "dark";
  });

  const [isSignup, setIsSignup] = useState(false);
  const [category, setCategory] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("app_theme", theme);
    document.body.className = `theme-${theme}`;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  const handleAuthSuccess = (authUser) => {
    setUser(normalizeUser(authUser));
    setIsSignup(false);
  };

  return (
    <div className={`app-root theme-${theme}`} data-theme={theme}>
      {showLeaderboard && (
        <Leaderboard onBack={() => setShowLeaderboard(false)} />
      )}

      {!user && !isSignup && (
        <Login
          onLogin={handleAuthSuccess}
          onSignup={() => setIsSignup(true)}
        />
      )}

      {isSignup && (
        <Signup onSignupSuccess={handleAuthSuccess} />
      )}

      {user && category && selectedLevel && (
        <QuizGame
          category={category}
          level={selectedLevel}
          user={user}
          onExit={() => setSelectedLevel(null)}
        />
      )}

      {user && category && !selectedLevel && (
        <LevelSelection
          category={category}
          user={user}
          onSelectLevel={setSelectedLevel}
          onBack={() => setCategory(null)}
        />
      )}

      {user && !category && !showLeaderboard && (
        <div className="home-page">
          <Header setUser={setUser} theme={theme} toggleTheme={toggleTheme} />

          <button
            onClick={() => setShowLeaderboard(true)}
            className="home-leaderboard-btn"
          >
            🏆 Leaderboard Rankings
          </button>

          <CategoryGrid
            onSelect={(cat) => {
              setCategory(cat);
              setSelectedLevel(null);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
