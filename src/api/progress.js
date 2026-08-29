export const getProgress = async (username, category) => {
    const res = await fetch(
        `http://localhost:5000/api/progress?username=${username}&category=${category}`
    );

    return await res.json();
};

export const saveProgress = async (username, category, highestLevel) => {
    const res = await fetch("http://localhost:5000/api/progress", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            category,
            highestLevel,
        }),
    });

    return await res.json();
};