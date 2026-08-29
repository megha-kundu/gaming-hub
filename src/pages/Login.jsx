import { useState } from "react";

export default function Login({ onLogin, onSignup }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const userToLogin = username || "Guest Scholar";

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username: userToLogin, password: password || "123456" })
            });

            const data = await res.json();

            if (res.ok && data.user) {
                onLogin({ username: data.user.username || userToLogin });
            } else {
                onLogin({ username: userToLogin });
            }
        } catch (err) {
            onLogin({ username: userToLogin });
        }
    };

    const styles = {
        overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            background: "radial-gradient(circle at top, #1e293b, #050814)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            fontFamily: "'Outfit', 'Segoe UI', sans-serif"
        },
        modal: {
            width: "360px",
            padding: "36px 30px",
            borderRadius: "24px",
            background: "rgba(13, 19, 38, 0.88)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
            color: "white",
            textAlign: "center"
        },
        title: {
            fontSize: "24px",
            marginBottom: "20px",
            fontWeight: "900"
        },
        input: {
            width: "100%",
            padding: "14px",
            margin: "10px 0",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            background: "rgba(255, 255, 255, 0.08)",
            color: "#ffffff",
            outline: "none",
            fontSize: "15px",
            fontWeight: "600"
        },
        button: {
            width: "100%",
            padding: "14px",
            marginTop: "14px",
            borderRadius: "14px",
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            color: "white",
            fontWeight: "800",
            fontSize: "16px",
            boxShadow: "0 8px 25px rgba(37, 99, 235, 0.4)",
            transition: "0.25s"
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={styles.title}>🎮 Login to English Quest</h2>

                <input
                    style={styles.input}
                    placeholder="Username (e.g. Student Name)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    style={styles.input}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button style={styles.button} onClick={handleLogin}>
                    Login & Play
                </button>

                <p style={{ marginTop: "18px", fontSize: "13px", opacity: 0.8 }}>
                    New user?
                </p>

                <button
                    style={{ ...styles.button, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", boxShadow: "none" }}
                    onClick={onSignup}
                >
                    Create New Account
                </button>
            </div>
        </div>
    );
}