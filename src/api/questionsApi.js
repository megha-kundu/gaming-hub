export const fetchQuestions = async (category, level) => {
    const res = await fetch(
        `/api/questions?category=${category}&level=${level}`
    );

    const data = await res.json();
    return data;
};nn