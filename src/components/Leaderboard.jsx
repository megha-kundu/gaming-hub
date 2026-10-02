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
                padding: "clamp(16px, 4vw, 40px)",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}
        >
            <div style={{ width: "100%", maxWidth: "1100px" }}>
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
                        fontSize: "clamp(2rem, 4vw, 2.7rem)",
                        fontWeight: 700,
                        letterSpacing: "1px",
                        textShadow: "0 4px 12px rgba(0,0,0,0.25)"
                    }}
                >
                    🏆 Level Leaderboard
                </h1>

                <p style={{ textAlign: "center", marginBottom: "25px", opacity: 0.95, fontSize: "clamp(0.95rem, 2vw, 1.1rem)" }}>
                    Top players by level
                </p>

                <div
                    className="leaderboard-panel"
                    style={{
                        width: "100%",
                        maxWidth: "700px",
                        margin: "auto",
                        background: "rgba(255,255,255,0.12)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        borderRadius: "18px",
                        padding: "clamp(12px, 3vw, 25px)",
                        overflowX: "auto"
                    }}
                >
                    <table
                        className="leaderboard-table"
                        style={{
                            width: "100%",
                            minWidth: "420px",
                            color: "#fff",
                            borderCollapse: "collapse"
                        }}
                    >
                        <thead>
                            <tr>
                                <th style={{ padding: "12px 10px", fontSize: "0.85rem" }}>Rank</th>
                                <th style={{ padding: "12px 10px", fontSize: "0.85rem" }}>Player</th>
                                <th style={{ padding: "12px 10px", fontSize: "0.85rem" }}>Category</th>
                                <th style={{ padding: "12px 10px", fontSize: "0.85rem" }}>Score</th>
                            </tr>
                        </thead>

                        <tbody>
                            {scores.map((player, index) => (
                                <tr key={player._id}>
                                    <td style={{ padding: "12px 10px", textAlign: "center", fontSize: "0.9rem" }}>
                                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                                    </td>

                                    <td style={{ padding: "12px 10px", fontSize: "0.9rem" }}>{player.username || "Guest"}</td>

                                    <td style={{ padding: "12px 10px", fontSize: "0.9rem" }}>{player.category}</td>

                                    <td style={{ padding: "12px 10px", fontWeight: "bold", fontSize: "0.9rem" }}>
                                        {player.score}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                @media (max-width: 540px) {
                    .leaderboard-panel {
                        padding: 10px !important;
                    }

                    .leaderboard-table {
                        min-width: 360px !important;
                        font-size: 0.8rem;
                    }
                }
            `}</style>
        </div>
    );
}

export default Leaderboard;