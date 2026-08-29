import { useState, useEffect, useMemo } from "react";

import { fetchQuestions } from "../api/questionsApi";
import { saveProgress } from "../api/progress";
const correctMessages = [
    "Excellent!",
    "Outstanding!",
    "Brilliant!",
    "Fantastic!",
    "Amazing!",
    "Superb!",
    "Well Done!",
    "Great Job!",
    "Perfect!",
    "Awesome!"
];

const wrongMessages = [
    "Oops!",
    "Try Again!",
    "Not Quite!",
    "Better Luck Next Time!",
    "Keep Practicing!",
    "Incorrect!",
    "Wrong Answer!",
    "You Can Do Better!",
    "Keep Going!",
    "Nice Try!"
];

const happyEmojis = ["😄", "😊", "🥳", "🎉", "⭐", "✨", "🌟", "💫", "🎊", "👏", "🙌", "💯", "🔥", "😍", "🚀", "💪"];
const sadEmojis = ["😔", "😕", "😢", "😞", "🤔", "😫", "😤", "💔", "⚠️", "🆘"];

const partyRewards = {
    1: "🍫 Chocolate Party",
    2: "🎂 Cake Party",
    3: "🍜 Chowmein Party",
    4: "🍝 Pasta Party",
    5: "🥟 Momos Party",
    6: "🍔 Burger Party",
    7: "🍕 Pizza Party",
    8: "🍭 Lollipop Party",
    9: "🍦 Ice Cream Party",
    10: "🍟 French Fries Party"
};

function speak(text) {
    if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
}

export default function QuizGame({
    category,
    level: initialLevel,
    user,
    onSelect,
    onExit,
}) {

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(initialLevel || 1);
    const [finished, setFinished] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [perfectLevel, setPerfectLevel] = useState(true);
    const [showParty, setShowParty] = useState(false);
    const [levelScore, setLevelScore] = useState(0);
    const [showClaimed, setShowClaimed] = useState(false);
    const [trophyEarned, setTrophyEarned] = useState(null);
    const [timeLeft, setTimeLeft] = useState(10);
    const [showEmojiFlash, setShowEmojiFlash] = useState(false);
    const [emojiFlashType, setEmojiFlashType] = useState("happy");

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [questions, setQuestions] = useState([]);

    const selectedCategory = category;
    const currentUser = typeof user === "string" ? { username: user } : user;
    const username = currentUser?.username || "Guest";

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                const data = await fetchQuestions(selectedCategory, level);

                if (Array.isArray(data)) {
                    setQuestions(data);
                } else {
                    setQuestions([]);
                }

            } catch (error) {
                console.log("Error loading questions:", error);
                setQuestions([]);
            }
        };

        if (selectedCategory) {
            loadQuestions();
        }
    }, [selectedCategory, level]);

    const saveScore = async () => {
        try {
            await fetch("http://localhost:5000/api/scores", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    score,
                    category: selectedCategory
                }),
            });

            console.log("Score saved successfully ✅");
        } catch (error) {
            console.error("Error saving score:", error);
        }
    };

    useEffect(() => {
        if (category !== undefined && category !== selectedCategory) {
            setSelectedCategory(category);
        }
    }, [category, selectedCategory]);

    useEffect(() => {
        setTimeLeft(10);
    }, [currentQuestion]);

    useEffect(() => {
        if (showFeedback) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQuestion, showFeedback]);


    const normalizedCategory = typeof selectedCategory === "string" ? selectedCategory.toLowerCase().trim() : "";
    // support level 2 question bank if provided as `englishQuestionsLevel2`
    // Ensure we always end up with an array. If the external variable is an object keyed by category,
    // pick that category; if it's already an array use it; otherwise fallback to empty array.


    const handleCategorySwitch = (newCategory) => {
        setCurrentQuestion(0);
        setScore(0);
        setLevel(1);
        setFinished(false);
        setLevelScore(0);
        setPerfectLevel(true);
        setSelectedCategory(newCategory);
        if (typeof onSelect === 'function') {
            onSelect(newCategory);
        }
    };
    const getQuestionBank = () => {
        return questions;
    };


    // helper to shuffle options and adjust correct index
    function shuffleOptions(q) {
        const opts = (q.options || []).map((o, i) => ({ o, i }));
        for (let i = opts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [opts[i], opts[j]] = [opts[j], opts[i]];
        }
        const options = opts.map(x => x.o);
        // support correct being an index or the correct option value/string
        let correct = -1;
        if (typeof q.correct === "number") {
            correct = opts.findIndex(x => x.i === q.correct);
        } else {
            correct = options.findIndex(opt => opt === q.correct || String(opt) === String(q.correct));
        }
        if (correct === -1) correct = 0; // fallback
        return { ...q, options, correct };
    }

    // each level has 10 questions; pick slice for current level
    const levelQuestions = useMemo(() => {
        return questions.map(shuffleOptions);
    }, [questions]);

    const question = levelQuestions?.[currentQuestion];
    if (!question) return null;
    const levelProgress = levelQuestions.length ? ((currentQuestion + 1) / levelQuestions.length) * 100 : 0;
    const progressStyle = { width: `${levelProgress}%` };

    // Handle missing questions state
    if (!question || levelQuestions.length === 0) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                fontFamily: 'Arial, sans-serif',
                padding: '20px'
            }}>
                <div style={{ fontSize: 60, marginBottom: 20 }}>📚</div>
                <h2 style={{ fontSize: 28, marginBottom: 10 }}>Loading Quiz...</h2>
                <p style={{ fontSize: 18, opacity: 0.8 }}>Please wait while we prepare your questions</p>
                <p style={{ fontSize: 14, marginTop: 20, opacity: 0.6 }}>If this persists, please check if question data is loaded</p>
            </div>
        );
    }
    const timerStyle = { color: timeLeft <= 3 ? "#ff4d6d" : "#1e1e28" };

    const header = (
        <div className="header">
            <h1 className="main-title">
                <span className="header-emoji">🎓</span>
                <span className="header-title-text">English Quest</span>
            </h1>
            <div className="stats-bar">
                <div className="stat-item">
                    <div className="stat-label">Level</div>
                    <div className="stat-value">{level}</div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">Score</div>
                    <div className="stat-value">{score}</div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">Correct</div>
                    <div className="stat-value">{levelScore}</div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">Timer</div>
                    <div className="stat-value timer">{timeLeft}s</div>
                </div>
            </div>
        </div>
    );




    const handleAnswer = (selectedIndex) => {
        if (!question) return;

        const correct = selectedIndex === question.correct;

        if (!correct) {
            setPerfectLevel(false);
        }

        setSelectedAnswer(selectedIndex);
        setIsCorrect(correct);
        setShowFeedback(true);
        setEmojiFlashType(correct ? "happy" : "sad");
        setShowEmojiFlash(true);
        setTimeout(() => setShowEmojiFlash(false), 1400);

        const message = correct
            ? correctMessages[
            Math.floor(Math.random() * correctMessages.length)
            ]
            : wrongMessages[
            Math.floor(Math.random() * wrongMessages.length)
            ];

        setFeedbackMessage(message);
        speak(message);

        if (correct) {
            setScore((prev) => prev + 10);
            setLevelScore((prev) => prev + 1);
        }
        setTimeout(async () => {
            setShowFeedback(false);
            setSelectedAnswer(null);

            const next = currentQuestion + 1;

            if (next % 10 === 0) {
                const finalScore = correct ? score + 10 : score;
                console.log("USER OBJECT:", user);
                console.log("USERNAME:", username);
                fetch("http://localhost:5000/api/scores", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        score: finalScore,
                        category: selectedCategory,
                    }),
                });

                try {
                    const result = await saveProgress(
                        username,
                        selectedCategory,
                        level + 1
                    );

                    console.log("Progress saved:", result);
                } catch (progressError) {
                    console.error("Error saving progress:", progressError);
                }

                if (levelScore + (correct ? 1 : 0) === 10) {
                    setShowParty(true);
                } else {
                    setFinished(true);
                }
            } else {
                setCurrentQuestion(next);
            }

        }, correct ? 1200 : 2500);
    };


    if (showParty) {
        return (
            <div style={{
                position: "fixed",
                inset: 0,
                width: "100vw",
                height: "100vh",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)",
                backgroundSize: "400% 400%",
                animation: "gradient-shift 8s ease infinite",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                overflow: "hidden",
                fontFamily: "'Arial', sans-serif"
            }}>
                {/* Animated background particles */}
                <div style={{ position: "absolute", inset: 0 }}>
                    {Array.from({ length: 50 }).map((_, i) => {
                        const size = Math.random() * 40 + 10;
                        const duration = Math.random() * 10 + 8;
                        const delay = Math.random() * 5;
                        const emoji = ["⭐", "✨", "💫", "🌟", "💥", "🎆", "🎇"][Math.floor(Math.random() * 7)];

                        return (
                            <div
                                key={i}
                                style={{
                                    position: "absolute",
                                    fontSize: size,
                                    left: Math.random() * 100 + "%",
                                    top: Math.random() * 100 + "%",
                                    animation: `float-particle ${duration}s linear ${delay}s infinite`,
                                    pointerEvents: "none"
                                }}
                            >
                                {emoji}
                            </div>
                        );
                    })}
                </div>

                {/* Main celebration content */}
                <div style={{
                    position: "relative",
                    zIndex: 100,
                    textAlign: "center",
                    animation: "scale-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards"
                }}>
                    {/* Top celebration emoji */}
                    <div style={{
                        fontSize: 120,
                        marginBottom: 20,
                        animation: "bounce 1.2s ease-in-out infinite",
                        textShadow: "0 10px 30px rgba(0,0,0,0.3)"
                    }}>
                        🎉🎊🥳
                    </div>

                    {/* Main title */}
                    <h1 style={{
                        fontSize: 80,
                        fontWeight: "900",
                        margin: "20px 0",
                        color: "#fff",
                        textShadow: "0 5px 20px rgba(0,0,0,0.4), 0 0 60px rgba(255,255,255,0.6)",
                        letterSpacing: "3px",
                        animation: "glow-pulse 2s ease-in-out infinite"
                    }}>
                        🏆 PERFECT! 🏆
                    </h1>

                    {/* Level subtitle */}
                    <h2 style={{
                        fontSize: 48,
                        fontWeight: "700",
                        margin: "15px 0",
                        color: "#fff",
                        textShadow: "0 3px 15px rgba(0,0,0,0.3)",
                        animation: "slide-down 0.8s ease-out 0.2s both"
                    }}>
                        Level {level} Completed!
                    </h2>

                    {/* Reward message */}
                    <div style={{
                        fontSize: 56,
                        fontWeight: "bold",
                        margin: "25px 0",
                        color: "#fff",
                        textShadow: "0 3px 15px rgba(0,0,0,0.3)",
                        animation: "bounce-in 0.8s ease-out 0.4s both",
                        padding: "20px 40px",
                        background: "rgba(255,255,255,0.2)",
                        borderRadius: "30px",
                        backdropFilter: "blur(10px)",
                        border: "3px solid rgba(255,255,255,0.3)"
                    }}>
                        {partyRewards[level]}
                    </div>


                    <button
                        onClick={() => {
                            setTrophyEarned({ reward: partyRewards[level] });
                            setShowClaimed(true);
                        }}
                        style={{
                            padding: "16px 28px",
                            borderRadius: 999,
                            border: "none",
                            cursor: "pointer",
                            background: "linear-gradient(135deg, #ffd86f, #fc6262)",
                            color: "#1b0b3b",
                            fontWeight: 800,
                            fontSize: 18,
                            boxShadow: "0 18px 40px rgba(252,98,98,0.24)",
                            marginBottom: 26
                        }}
                    >
                        Claim Reward🎁
                    </button>
                    {/* Completion message */}
                    <p style={{
                        fontSize: 32,
                        color: "#fff",
                        margin: "20px 0",
                        textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                        fontWeight: "600",
                        animation: "fade-in 1s ease-out 0.6s both"
                    }}>
                        You answered all 10 questions correctly! 🎯
                    </p>

                    {/* Star rating */}
                    <div style={{
                        fontSize: 60,
                        margin: "30px 0",
                        animation: "star-appear 0.8s ease-out 0.8s both",
                        letterSpacing: "10px"
                    }}>
                        ⭐⭐⭐
                    </div>


                    {/* Claimed modal */}
                    {showClaimed && (
                        <div style={{
                            position: 'fixed',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10000,
                            background: 'rgba(10, 10, 30, 0.82)',
                            backdropFilter: 'blur(14px)',
                            pointerEvents: 'auto'
                        }}>
                            <div style={{
                                position: 'relative',
                                width: 'min(92vw, 460px)',
                                padding: '36px 28px',
                                borderRadius: '32px',
                                background: 'radial-gradient(circle at top, rgba(255,255,255,0.14), rgba(48, 16, 112, 0.94))',
                                border: '1px solid rgba(255,255,255,0.16)',
                                boxShadow: '0 24px 80px rgba(32, 16, 80, 0.35)',
                                color: '#fff',
                                textAlign: 'center',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'radial-gradient(circle at top center, rgba(255,255,255,0.18), transparent 42%)',
                                    pointerEvents: 'none'
                                }} />
                                <div style={{
                                    position: 'absolute',
                                    width: 160,
                                    height: 160,
                                    borderRadius: '50%',
                                    background: 'radial-gradient(circle, rgba(255,255,255,0.25), transparent 62%)',
                                    top: -70,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    filter: 'blur(18px)',
                                    pointerEvents: 'none'
                                }} />

                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={{ fontSize: 72, marginBottom: 12, transform: 'translateY(-6px)' }}>🏆</div>
                                    <h2 style={{
                                        margin: '8px 0 14px',
                                        fontSize: 32,
                                        letterSpacing: '1px',
                                        textShadow: '0 0 28px rgba(255,255,255,0.28)'
                                    }}>
                                        Magical Trophy Unlocked!
                                    </h2>
                                    <div style={{
                                        fontSize: 18,
                                        opacity: 0.92,
                                        marginBottom: 24,
                                        lineHeight: 1.5
                                    }}>
                                        You earned <strong>{trophyEarned?.reward}</strong> for a perfect level finish.
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gap: 14,
                                        marginBottom: 24
                                    }}>
                                        <div style={{
                                            padding: '16px 18px',
                                            borderRadius: 22,
                                            background: 'rgba(255,255,255,0.08)',
                                            border: '1px solid rgba(255,255,255,0.16)',
                                            boxShadow: 'inset 0 0 12px rgba(255,255,255,0.08)'
                                        }}>
                                            A new badge has been added to your collection.
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                                        <button
                                            onClick={() => {
                                                setShowClaimed(false);
                                                setShowParty(false);
                                                setFinished(false);
                                                setLevel((prev) => prev + 1);
                                                setCurrentQuestion(0);
                                                setLevelScore(0);
                                                setPerfectLevel(true);
                                            }}
                                            style={{
                                                padding: '14px 26px',
                                                borderRadius: 999,
                                                border: 'none',
                                                cursor: 'pointer',
                                                background: 'linear-gradient(135deg, #7c55ff, #6dd5fa)',
                                                color: '#fff',
                                                fontWeight: 700,
                                                boxShadow: '0 16px 30px rgba(109,213,250,0.25)',
                                                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 20px 36px rgba(109,213,250,0.35)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 16px 30px rgba(109,213,250,0.25)';
                                            }}
                                        >
                                            Continue →
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowClaimed(false);
                                                setShowParty(false);
                                                setFinished(true);
                                                setLevelScore(0);
                                                setPerfectLevel(true);
                                                if (onExit) {
                                                    onExit();
                                                }
                                            }}
                                            style={{
                                                padding: '14px 26px',
                                                borderRadius: 999,
                                                border: '1px solid rgba(255,255,255,0.22)',
                                                cursor: 'pointer',
                                                background: 'rgba(255,255,255,0.08)',
                                                color: '#fff',
                                                fontWeight: 700,
                                                boxShadow: '0 10px 24px rgba(0,0,0,0.15)',
                                                transition: 'transform 0.2s ease, background 0.2s ease'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                            }}
                                        >
                                            Exit to Menu
                                        </button>
                                    </div>
                                </div>

                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    pointerEvents: 'none'
                                }}>
                                    {Array.from({ length: 10 }).map((_, i) => (
                                        <span
                                            key={i}
                                            style={{
                                                position: 'absolute',
                                                width: 12 + Math.random() * 14,
                                                height: 12 + Math.random() * 14,
                                                borderRadius: '50%',
                                                background: 'rgba(255,255,255,0.6)',
                                                top: `${10 + Math.random() * 80}%`,
                                                left: `${5 + Math.random() * 90}%`,
                                                filter: 'blur(1px)',
                                                opacity: 0.85
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Confetti animation */}
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                    {Array.from({ length: 80 }).map((_, i) => {
                        const left = Math.random() * 100;
                        const duration = Math.random() * 3 + 2;
                        const delay = Math.random() * 0.5;
                        const confetti = ["🎊", "🎉", "🎈", "✨", "⭐", "💝", "🎁", "🏆"][Math.floor(Math.random() * 8)];

                        return (
                            <div
                                key={i}
                                style={{
                                    position: "absolute",
                                    left: left + "%",
                                    top: "-50px",
                                    fontSize: Math.random() * 40 + 20,
                                    animation: `confetti-fall ${duration}s linear ${delay}s forwards`,
                                    opacity: 0.9
                                }}
                            >
                                {confetti}
                            </div>
                        );
                    })}
                </div>

                <style>{`
                    @keyframes gradient-shift {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    @keyframes float-particle {
                        0% {
                            transform: translateY(0) rotate(0deg);
                            opacity: 1;
                        }
                        100% {
                            transform: translateY(-150vh) rotate(360deg);
                            opacity: 0;
                        }
                    }
                    @keyframes confetti-fall {
                        0% {
                            transform: translateY(0) rotateZ(0deg) translateX(0);
                            opacity: 1;
                        }
                        100% {
                            transform: translateY(100vh) rotateZ(720deg) translateX(100px);
                            opacity: 0;
                        }
                    }
                    @keyframes scale-in {
                        0% { transform: scale(0); opacity: 0; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    @keyframes bounce {
                        0%, 100% { transform: translateY(0) scale(1); }
                        50% { transform: translateY(-50px) scale(1.2); }
                    }
                    @keyframes glow-pulse {
                        0%, 100% { 
                            text-shadow: 0 5px 20px rgba(0,0,0,0.4), 0 0 60px rgba(255,255,255,0.6);
                            transform: scale(1);
                        }
                        50% { 
                            text-shadow: 0 5px 20px rgba(0,0,0,0.4), 0 0 80px rgba(255,255,255,0.9);
                            transform: scale(1.05);
                        }
                    }
                    @keyframes slide-down {
                        0% { transform: translateY(-50px); opacity: 0; }
                        100% { transform: translateY(0); opacity: 1; }
                    }
                    @keyframes bounce-in {
                        0% { transform: scale(0) rotateX(-360deg); opacity: 0; }
                        100% { transform: scale(1) rotateX(0deg); opacity: 1; }
                    }
                    @keyframes fade-in {
                        0% { opacity: 0; }
                        100% { opacity: 1; }
                    }
                    @keyframes star-appear {
                        0% { transform: scale(0) rotate(-180deg); opacity: 0; }
                        100% { transform: scale(1) rotate(0deg); opacity: 1; }
                    }
                    @keyframes button-pop {
                        0% { transform: scale(0) rotate(-180deg); opacity: 0; }
                        70% { transform: scale(1.15); }
                        100% { transform: scale(1); opacity: 1; }
                    }
                `}</style>
            </div>
        );
    }

    // RESULT SCREEN

    if (finished) {
        return (
            <>
                {header}
                {showPopup && (
                    <div className="popup-overlay">
                        <div className="popup-box">

                            <div className="popup-icon">⚠️</div>

                            <h2>Level Locked</h2>

                            <p>{popupMessage}</p>

                            <button
                                className="popup-btn"
                                onClick={() => {
                                    setShowPopup(false);

                                    // Restart Level 1
                                    setCurrentQuestion(0);
                                    setFinished(false);
                                    setShowFeedback(false);
                                    setSelectedAnswer(null);
                                    setLevelScore(0);
                                    setScore(0);
                                }}
                            >
                                Try Again
                            </button>

                        </div>
                    </div>
                )}

                <div className="level-complete active">

                    <h1>
                        🎉 Level {level} Complete!
                    </h1>

                    <div className="score-display">
                        {score}
                    </div>

                    <div className="button-group">

                        <button
                            className="btn"
                            onClick={() => {

                                if (levelScore >= 8) {

                                    // Unlock next level
                                    setLevel((prev) => prev + 1);


                                } else {

                                    setPopupMessage("❌ You need at least 8 correct answers to unlock the next level!");
                                    setShowPopup(true);
                                    return;
                                    // Stay on the same level
                                }
                                // Reset for next level (only once)
                                setCurrentQuestion(0);
                                setFinished(false);
                                setShowFeedback(false);
                                setSelectedAnswer(null);
                                setLevelScore(0);
                                setTimeLeft(10);
                                setIsCorrect(false);
                            }}
                        >
                            Next Level →
                        </button>

                        <button
                            className="btn"
                            onClick={() => {

                                setCurrentQuestion(0);
                                setScore(0);
                                setLevel(1);
                                setFinished(false);
                                setLevelScore(0);
                                setPerfectLevel(true);

                            }}
                        >
                            Exit To Menu
                        </button>

                    </div>

                </div >
            </>
        );
    }

    if (!question) {
        return (
            <>
                {header}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '70vh',
                    gap: '20px',
                    color: '#fff'
                }}>
                    <div style={{ fontSize: '48px' }}>❌</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>No Questions Available</div>
                    <div style={{ fontSize: '16px', textAlign: 'center', opacity: 0.8 }}>
                        Questions for this category are not loaded yet.
                    </div>
                    <button
                        onClick={() => handleCategorySwitch("")}
                        style={{
                            marginTop: '20px',
                            padding: '12px 24px',
                            fontSize: '16px',
                            backgroundColor: '#6ce7b4',
                            color: '#1e1e28',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'transform 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Back to Menu
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            {header}
            {showEmojiFlash && (
                <div className="emoji-shower-overlay">
                {Array.from({ length: 40 }).map((_, i) => {
                    const emoji = emojiFlashType === "happy"
                        ? happyEmojis[Math.floor(Math.random() * happyEmojis.length)]
                        : sadEmojis[Math.floor(Math.random() * sadEmojis.length)];
                    const left = Math.random() * 100;
                    const size = 24 + Math.random() * 28;
                    const delay = Math.random() * 0.35;
                    const duration = 1.2 + Math.random() * 0.8;
                    const animationName = emojiFlashType === "happy" ? "emoji-fall" : "emoji-rise";
                    const startPosition = emojiFlashType === "happy" ? "-12%" : "112%";

                    return (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                left: `${left}%`,
                                top: startPosition,
                                fontSize: size,
                                animation: `${animationName} ${duration}s ease-out ${delay}s forwards`,
                                opacity: 0,
                                pointerEvents: "none"
                            }}
                        >
                            {emoji}
                        </div>
                    );
                })}
                <style>{`
                        .emoji-shower-overlay {
                            position: fixed;
                            inset: 0;
                            pointer-events: none;
                            overflow: hidden;
                            z-index: 9999;
                        }
                        @keyframes emoji-fall {
                            0% {
                                transform: translateY(0) rotate(0deg);
                                opacity: 1;
                            }
                            100% {
                                transform: translateY(130vh) rotate(720deg);
                                opacity: 0;
                            }
                        }
                        @keyframes emoji-rise {
                            0% {
                                transform: translateY(0) rotate(0deg);
                                opacity: 1;
                            }
                            100% {
                                transform: translateY(-130vh) rotate(-720deg);
                                opacity: 0;
                            }
                        }
                    `}</style>
            </div>
            )}


            <div className="game-screen active">

                {/* playful step progress: 10 platforms and a jumping character */}
                <div className="progress-meter" style={{ marginBottom: 16 }}>
                    <div className="progress-label">Level progress</div>
                    <div
                        className="progress-steps"
                        style={{
                            position: "relative",
                            height: 80,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0 8px"
                        }}
                    >
                        {Array.from({ length: 10 }).map((_, i) => {
                            const stepIndex = i;
                            const isActive = stepIndex <= currentQuestion;
                            return (
                                <div
                                    key={i}
                                    style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: "50%",
                                        background: isActive ? "#6ce7b4" : "#ddd",
                                        boxShadow: isActive ? "0 0 8px rgba(108,231,180,0.6)" : "none"
                                    }}
                                />
                            );
                        })}

                        {/* jumping character overlay */}
                        <div
                            className="jumper"
                            aria-hidden
                            style={{
                                position: "absolute",
                                top: 0,
                                left: `${(currentQuestion / 9) * 100}%`,
                                transform: "translate(-50%, 0)",
                                transition: "left 600ms cubic-bezier(.2,.9,.3,1), transform 200ms",
                                pointerEvents: "none",
                                width: 48,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 32,
                                    transform: showFeedback ? "translateY(0)" : "translateY(-18px)",
                                    transition: "transform 300ms ease",
                                    filter: "drop-shadow(0 6px 6px rgba(0,0,0,0.2))"
                                }}
                            >
                                🐵
                            </div>
                        </div>
                    </div>
                </div>

                <div className="question-header">
                    <div className="header-left">
                        <span className="question-number">
                            Question {currentQuestion + 1}/{levelQuestions.length}
                        </span>
                    </div>
                    <div className="header-right">
                        <span className="header-tag">Stay focused</span>
                    </div>
                </div>

                <div className="question-card">
                    <div className="question-card-title">Choose the best answer</div>
                    <div className="question-container">
                        <div className="question-text">
                            {question.question || question.prompt || question.text}
                        </div>
                        {(question.image || question.img || question.questionImage || question.imageUrl) && (
                            <img
                                src={question.image || question.img || question.questionImage || question.imageUrl}
                                alt="question"
                                style={{ maxWidth: "100%", borderRadius: 16, marginTop: 16, objectFit: "contain" }}
                            />
                        )}
                    </div>
                </div>

                {/* OPTIONS */}
                <div className={`options ${question.type === 'image-options' ? 'image-options-grid' : ''}`}>
                    {question.type === 'image-options' ? (
                        // Render image tiles with preloading + fallback
                        question.options.map((optionValue, index) => {


                            let cls = "option option-tile";

                            if (showFeedback) {
                                if (index === question.correct)
                                    cls += " correct";

                                if (index === selectedAnswer && index !== question.correct)
                                    cls += " incorrect";
                            }

                            return (
                                <button
                                    key={index}
                                    className={cls}
                                    disabled={showFeedback}
                                    onClick={() => handleAnswer(index)}
                                    style={{ padding: 0 }}
                                >
                                    <img
                                        src={optionValue}
                                        alt={`option-${index}`}
                                        loading="eager"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain"
                                        }}
                                    />
                                </button>
                            );

                        })
                    ) : (
                        // fallback: render text/options as before
                        question.options.map((option, index) => {
                            let cls = 'option';
                            if (showFeedback) {
                                if (index === question.correct) cls += ' correct';
                                if (index === selectedAnswer && index !== question.correct) cls += ' incorrect';
                            }
                            return (
                                <button key={index} className={cls} disabled={showFeedback} onClick={() => handleAnswer(index)}>
                                    {String(option)}
                                </button>
                            );
                        })
                    )}
                </div>

                {/* FEEDBACK */}
                {showFeedback && (
                    <>
                        <div style={{
                            position: "fixed",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 5000,
                            pointerEvents: "none"
                        }}>
                            {/* Large centered message with transformations */}
                            <div style={{
                                fontSize: 72,
                                fontWeight: "bold",
                                textAlign: "center",
                                color: isCorrect ? "#6ce7b4" : "#ff4d6d",
                                textShadow: isCorrect
                                    ? "0 0 20px rgba(108,231,180,0.8), 0 0 40px rgba(108,231,180,0.5)"
                                    : "0 0 20px rgba(255,77,109,0.8), 0 0 40px rgba(255,77,109,0.5)",
                                animation: isCorrect
                                    ? "popup-message 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards"
                                    : "shake-message 0.6s ease-in-out forwards",
                                maxWidth: "90%",
                                whiteSpace: "nowrap",
                                letterSpacing: "2px"
                            }}>
                                {feedbackMessage}
                            </div>

                            {/* Emoji surround animation */}
                            <div style={{
                                position: "absolute",
                                width: 600,
                                height: 600,
                                borderRadius: "50%"
                            }}>
                                {Array.from({ length: 20 }).map((_, i) => {
                                    const emoji = isCorrect
                                        ? happyEmojis[Math.floor(Math.random() * happyEmojis.length)]
                                        : sadEmojis[Math.floor(Math.random() * sadEmojis.length)];
                                    const angle = (i / 20) * Math.PI * 2;
                                    const distance = 200;
                                    const startX = Math.cos(angle) * distance;
                                    const startY = Math.sin(angle) * distance;
                                    const delay = (i / 20) * 0.3;

                                    return (
                                        <div
                                            key={i}
                                            style={{
                                                position: "absolute",
                                                fontSize: 48,
                                                left: "50%",
                                                top: "50%",
                                                marginLeft: -24,
                                                marginTop: -24,
                                                animation: `orbit-emoji ${isCorrect ? "1.2s" : "0.8s"} ease-out ${delay}s forwards`,
                                                "--startX": `${startX}px`,
                                                "--startY": `${startY}px`,
                                                pointerEvents: "none"
                                            }}
                                        >
                                            {emoji}
                                        </div>
                                    );
                                })}
                            </div>

                            <style>{`
                                @keyframes popup-message {
                                    0% {
                                        transform: scale(0) rotate(-360deg);
                                        opacity: 0;
                                    }
                                    50% {
                                        transform: scale(1.2) rotate(10deg);
                                    }
                                    100% {
                                        transform: scale(1) rotate(0deg);
                                        opacity: 1;
                                    }
                                }
                                @keyframes shake-message {
                                    0%, 100% {
                                        transform: translate(0, 0) scale(1);
                                        opacity: 1;
                                    }
                                    10%, 30%, 50%, 70%, 90% {
                                        transform: translate(-20px, -20px) scale(1.05);
                                    }
                                    20%, 40%, 60%, 80% {
                                        transform: translate(20px, 20px) scale(0.95);
                                    }
                                }
                                @keyframes orbit-emoji {
                                    0% {
                                        transform: translate(var(--startX), var(--startY)) scale(1);
                                        opacity: 1;
                                    }
                                    100% {
                                        transform: translate(0, 0) scale(0.3);
                                        opacity: 0;
                                    }
                                }
                            `}</style>
                        </div>

                        <div className="feedback">
                            <div className="feedback-icon-container">
                                {isCorrect ? (
                                    <div style={{ position: "relative", height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {Array.from({ length: 15 }).map((_, i) => {
                                            const emoji = happyEmojis[Math.floor(Math.random() * happyEmojis.length)];
                                            const delay = Math.random() * 0.2;
                                            const xOffset = (Math.random() - 0.5) * 300;
                                            const rotation = Math.random() * 360;
                                            return (
                                                <div
                                                    key={i}
                                                    style={{
                                                        position: "absolute",
                                                        fontSize: 28 + Math.random() * 12,
                                                        animation: `float-emoji 1.5s ease-out ${delay}s forwards`,
                                                        transformOrigin: "center",
                                                        left: "50%",
                                                        top: "50%",
                                                        marginLeft: -14,
                                                        marginTop: -14,
                                                        pointerEvents: "none"
                                                    }}
                                                >
                                                    {emoji}
                                                </div>
                                            );
                                        })}
                                        <style>{`
                                            @keyframes float-emoji {
                                                0% {
                                                    transform: translate(0, 0) scale(1) rotate(0deg);
                                                    opacity: 1;
                                                }
                                                100% {
                                                    transform: translate(${(Math.random() - 0.5) * 300}px, -300px) scale(0.1) rotate(${Math.random() * 360}deg);
                                                    opacity: 0;
                                                }
                                            }
                                        `}</style>
                                    </div>
                                ) : (
                                    <div style={{ position: "relative", height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {Array.from({ length: 12 }).map((_, i) => {
                                            const emoji = sadEmojis[Math.floor(Math.random() * sadEmojis.length)];
                                            const delay = Math.random() * 0.2;
                                            const xOffset = (Math.random() - 0.5) * 250;
                                            return (
                                                <div
                                                    key={i}
                                                    style={{
                                                        position: "absolute",
                                                        fontSize: 24 + Math.random() * 10,
                                                        animation: `shake-emoji 0.6s ease-in-out ${delay}s`,
                                                        left: "50%",
                                                        top: "50%",
                                                        marginLeft: -14,
                                                        marginTop: -14,
                                                        pointerEvents: "none"
                                                    }}
                                                >
                                                    {emoji}
                                                </div>
                                            );
                                        })}
                                        <style>{`
                                            @keyframes shake-emoji {
                                                0%, 100% {
                                                    transform: translate(0, 0) scale(1);
                                                    opacity: 1;
                                                }
                                                50% {
                                                    transform: translate(${(Math.random() - 0.5) * 80}px, ${(Math.random() - 0.5) * 80}px) scale(1.1);
                                                }
                                            }
                                        `}</style>
                                    </div>
                                )}
                            </div>

                            <div className={isCorrect ? "correct" : "incorrect"}>
                                {feedbackMessage}
                            </div>
                        </div>
                    </>
                )}

                {/* SCORE */}
                <div className="score-box highlight">
                    Total score: {score}
                </div>

            </div>
        </>
    );
}

