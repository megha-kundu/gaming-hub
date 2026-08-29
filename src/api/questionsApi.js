export const fetchQuestions = async (category, level) => {
    const res = await fetch(
        `http://localhost:5000/api/questions?category=${category}&level=${level}`
    );

    const data = await res.json();
    return data;
};