import { useEffect, useState } from "react";
import { getProgress } from "../api/progress";

export default function LevelSelection({
    category,
    onSelectLevel,
    onBack,
    user
}) {

    const levels = [1, 2, 3, 4, 5];

    const [highestLevel, setHighestLevel] = useState(1);
    const [showLockedPopup, setShowLockedPopup] = useState(false);
    const currentUser = typeof user === "string" ? { username: user } : user;
    const username = currentUser?.username || "Guest";

    useEffect(() => {

        const loadProgress = async () => {

            try {

                const data = await getProgress(
                    username,
                    category
                );

                setHighestLevel(data?.highestLevel || 1);

            } catch (err) {
                console.log(err);
            }

        };

        if (user) {
            loadProgress();
        }

    }, [category, user, username]);

    return (
        <div
            style={{
                minHeight: "100vh",
                background:
                    "radial-gradient(circle at top, rgba(129,140,248,0.18), transparent 25%), linear-gradient(135deg, #ece9ff, #dbe4ff)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "30px",
                color: "#312e81"
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "1000px",
                    background: "rgba(248, 244, 255, 0.93)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "28px",
                    padding: "40px",
                    border: "1px solid rgba(167,139,250,.28)",
                    boxShadow: "0 30px 65px rgba(167,139,250,.16)"
                }}
            >

                <h1
                    style={{
                        textAlign: "center",
                        marginBottom: "20px",
                        fontSize: "2.5rem",
                        letterSpacing: "1px",
                        color: "#4f46e5"
                    }}
                >
                    🎯 {category} Levels
                </h1>

                <p
                    style={{
                        textAlign: "center",
                        color: "#6b7280",
                        marginBottom: "42px",
                        fontSize: "1rem",
                        lineHeight: "1.8",
                        maxWidth: "760px",
                        marginLeft: "auto",
                        marginRight: "auto",
                        letterSpacing: "0.02em"
                    }}
                >
                    Choose your challenge level and prove your mastery.
                </p>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))",
                        gap: "25px"
                    }}
                >

                    {levels.map((level) => {

                        const completed = level < highestLevel;
                        const unlocked = level <= highestLevel;
                        const current = level === highestLevel;
                        const locked = !unlocked;
                        const statusLabel = completed
                            ? "🏆 COMPLETED"
                            : current
                                ? "▶ READY"
                                : "🔒 LOCKED";
                        const statusColor = completed
                            ? "#eaf4f0"
                            : current
                                ? "#083873"
                                : "#cc530d";

                        return (
                            <div
                                key={level}
                                onClick={() => {
                                    if (locked) {
                                        setShowLockedPopup(true);
                                        return;
                                    }

                                    onSelectLevel(level);
                                }}

                                style={{
                                    background: "linear-gradient(135deg,rgba(167,139,250,.95),rgba(192,132,252,.95))",
                                    border: "1px solid rgba(167,139,250,.35)",
                                    borderRadius: "24px",
                                    padding: "28px",
                                    cursor: locked ? "not-allowed" : "pointer",
                                    textAlign: "center",
                                    transition: ".3s",
                                    boxShadow: "0 18px 45px rgba(167,139,250,.22)",
                                    opacity: locked ? 0.72 : 1,
                                    position: "relative",
                                    overflow: "hidden"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                        "translateY(-8px) scale(1.03)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform =
                                        "translateY(0) scale(1)";
                                }}
                            >

                                <div
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        borderRadius: "50%",
                                        border: "1px solid rgba(167,139,250,.4)",
                                        background: "rgba(240,234,255,.9)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 18px",
                                        fontSize: "1.35rem",
                                        fontWeight: 800,
                                        color: "#4c1d95"
                                    }}
                                >
                                    {level}
                                </div>

                                <h2
                                    style={{
                                        margin: "0 0 12px",
                                        fontSize: "1.5rem",
                                        letterSpacing: "0.5px"
                                    }}
                                >
                                    Stage {level}
                                </h2>

                                <p
                                    style={{
                                        opacity: .95,
                                        fontWeight: 700,
                                        color: statusColor
                                    }}
                                >
                                    {statusLabel}
                                </p>

                            </div>
                        );
                    })}

                </div>

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "35px"
                    }}
                >

                    <button
                        onClick={onBack}
                        style={{
                            background:
                                "linear-gradient(135deg,rgba(167,139,250,.95),rgba(192,132,252,.95))",
                            color: "#1f2937",
                            border: "none",
                            padding: "14px 34px",
                            borderRadius: "999px",
                            cursor: "pointer",
                            fontWeight: "700",
                            letterSpacing: "0.6px",
                            boxShadow: "0 18px 45px rgba(167,139,250,.22)"
                        }}
                    >
                        ← Back
                    </button>

                </div>
                {showLockedPopup && (
                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(80, 77, 77, 0)",
                            backdropFilter: "blur(12px)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 99999
                        }}
                    >
                        <div
                            style={{
                                width: "450px",
                                maxWidth: "90%",
                                borderRadius: "28px",
                                padding: "40px",
                                textAlign: "center",
                                background:
                                    "linear-gradient(145deg, rgba(152, 109, 171, 0.98), rgba(190, 124, 223, 0.85))",
                                border: "1px solid rgba(167,139,250,.35)",
                                boxShadow:
                                    "0 30px 80px rgba(167,139,250,.18)",
                                color: "#1f2937",
                                position: "relative",
                                overflow: "hidden"
                            }}
                        >

                            {/* Glow */}
                            <div
                                style={{
                                    position: "absolute",
                                    width: 250,
                                    height: 250,
                                    borderRadius: "50%",
                                    background:
                                        "rgba(124,58,237,.25)",
                                    filter: "blur(80px)",
                                    top: -80,
                                    right: -80
                                }}
                            />

                            {/* Lock */}
                            <div
                                style={{
                                    fontSize: "85px",
                                    marginBottom: "15px",
                                    animation: "bounceLock 1.6s infinite"
                                }}
                            >
                                🔒
                            </div>

                            <h2
                                style={{
                                    fontSize: "32px",
                                    marginBottom: "15px",
                                    fontWeight: "800"
                                }}
                            >
                                Level Locked
                            </h2>

                            <p
                                style={{
                                    color: "#100212",
                                    fontSize: "17px",
                                    lineHeight: "30px",
                                    marginBottom: "18px"
                                }}
                            >
                                You haven't unlocked this level yet.
                            </p>

                            <div
                                style={{
                                    background: "rgba(255,255,255,.08)",
                                    borderRadius: "20px",
                                    padding: "18px",
                                    border: "1px solid rgba(255,255,255,.08)",
                                    marginBottom: "28px"
                                }}
                            >
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: "16px",
                                        lineHeight: "28px",
                                        color: "#09000b"
                                    }}
                                >
                                    ✨ Complete the previous level first to continue your journey.
                                    <br /><br />
                                    🏆 Every completed level unlocks new challenges and exciting rewards.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowLockedPopup(false)}
                                style={{
                                    padding: "15px 38px",
                                    border: "none",
                                    borderRadius: "50px",
                                    cursor: "pointer",
                                    fontWeight: "700",
                                    fontSize: "16px",
                                    color: "#fff",
                                    background:
                                        "linear-gradient(135deg,#7c3aed,#3b82f6)",
                                    boxShadow:
                                        "0 15px 35px rgba(59,130,246,.35)",
                                    transition: ".3s"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                        "translateY(-3px) scale(1.05)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform =
                                        "translateY(0px) scale(1)";
                                }}
                            >
                                🚀 Continue Learning
                            </button>

                        </div>

                        <style>
                            {`
            @keyframes bounceLock{
                0%,100%{
                    transform:translateY(0);
                }
                50%{
                    transform:translateY(-12px);
                }
            }
        `}npm
                        </style>

                    </div>
                )}
            </div>

        </div>
    );
}