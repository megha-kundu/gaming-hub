import React, { useEffect, useState } from "react";

function Leaderboard({ onBack }) {
    const [scores, setScores] = useState([]);

    useEffect(() => {
        fetch("/api/scores")
            .then((res) => res.json())
            .then((data) => setScores(data))
            .catch(console.error);
    }, []);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg,#667eea,#764ba2)",
                padding: "40px",
                color: "#fff"
            }}
        >
            <button
                onClick={onBack}
                style={{
                    background: "#fff",
                    color: "#6C63FF",
                    border: "none",
                    padding: "10px 18px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                    marginBottom: "25px"
                }}
            >
                ⬅ Back
            </button>

            <h1
                style={{
                    textAlign: "center",
                    marginBottom: "10px",
                    fontSize: "36px",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    textShadow: "0 4px 12px rgba(0,0,0,0.25)"
                }}
            >
                🏆 Level Leaderboard
            </h1>

            <p style={{ textAlign: "center", marginBottom: "25px", opacity: 0.95, fontSize: "16px" }}>
                Top players by level
            </p>

            <div
                style={{
                    maxWidth: "700px",
                    margin: "auto",
                    background: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "18px",
                    padding: "25px"
                }}
            >
                <table
                    style={{
                        width: "100%",
                        color: "#fff",
                        borderCollapse: "collapse"
                    }}
                >
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Player</th>
                            <th>Category</th>
                            <th>Score</th>
                        </tr>
                    </thead>

                    <tbody>
                        {scores.map((player, index) => (
                            <tr key={player._id}>
                                <td style={{ padding: "12px", textAlign: "center" }}>
                                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                                </td>

                                <td style={{ padding: "12px" }}>{player.username || "Guest"}</td>

                                <td style={{ padding: "12px" }}>{player.category}</td>

                                <td style={{ padding: "12px", fontWeight: "bold" }}>
                                    {player.score}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Leaderboard;