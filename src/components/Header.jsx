import React from "react";

export default function Header({ setUser, theme, toggleTheme }) {
    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <div className="header">
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem"
                }}
            >
                <h1 className="main-title" style={{ margin: 0 }}>
                    <span className="header-emoji">🎓</span>
                    <span className="header-title-text">English Quest</span>
                </h1>

                <div style={{ display: "flex", itemsAlign: "center", gap: "10px" }}>
                    {/* Light/Dark Mode Switch */}
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle-btn"
                        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
                    </button>

                    <button
                        onClick={handleLogout}
                        className="logout-btn"
                    >
                        🚪 Logout
                    </button>
                </div>
            </div>

            <div className="stats-bar">
                <div className="stat-item">
                    <div className="stat-label">Level</div>
                    <div className="stat-value">1</div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">Score</div>
                    <div className="stat-value">0</div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">Correct</div>
                    <div className="stat-value">0</div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">Timer</div>
                    <div className="stat-value timer" id="timerDisplay">
                        60s
                    </div>
                </div>
            </div>
        </div>
    );
}