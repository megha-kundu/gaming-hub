import React from "react";

const categories = [
    {
        id: "vocabulary",
        name: "Vocabulary Quest",
        icon: "📚",
        desc: "Master new words, definitions, and synonyms.",
        badge: "Essential",
        color: "from-blue-600 to-indigo-600"
    },
    {
        id: "grammar",
        name: "Grammar Master",
        icon: "📖",
        desc: "Perfect your sentence structure & tenses.",
        badge: "Popular",
        color: "from-purple-600 to-pink-600"
    },
    {
        id: "comprehension",
        name: "Comprehension",
        icon: "📝",
        desc: "Sharpen passage reading & critical analysis.",
        badge: "Advanced",
        color: "from-emerald-600 to-teal-600"
    },
    {
        id: "spelling",
        name: "Spelling Bee",
        icon: "✏️",
        desc: "Test your word spelling accuracy.",
        badge: "Speed Run",
        color: "from-amber-600 to-orange-600"
    },
    {
        id: "image-options",
        name: "Image Options",
        icon: "🖼️",
        desc: "Category II: Visual option grid challenges.",
        badge: "Visual 2x2",
        color: "from-cyan-600 to-blue-600"
    },
    {
        id: "image-question",
        name: "Image Question",
        icon: "📷",
        desc: "Category III: Top hero picture questions.",
        badge: "Hero Image",
        color: "from-fuchsia-600 to-rose-600"
    }
];

export default function CategoryGrid({ onSelect }) {
    return (
        <div className="start-screen active homepage-hub">
            {/* Hero Quest Hub Banner */}
            <div className="hero-quest-card">
                <div className="hero-badge">🚀 ACADEMIC GAMIFIED PORTAL</div>
                <h2 className="hero-title">Welcome to English Quest Hub 🌍</h2>
                <p className="hero-subtitle">
                    Select a learning domain below to start your mastery journey, earn XP, and unlock food party celebrations!
                </p>
            </div>

            {/* Unique 3D Gaming Category Grid */}
            <div className="gaming-category-grid">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className="gaming-quest-card"
                        onClick={() => onSelect(cat.id)}
                    >
                        <div className="quest-card-header">
                            <span className="quest-icon">{cat.icon}</span>
                            <span className="quest-badge">{cat.badge}</span>
                        </div>
                        <h3 className="quest-title">{cat.name}</h3>
                        <p className="quest-desc">{cat.desc}</p>
                        <div className="quest-card-footer">
                            <span>Start Quest →</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}