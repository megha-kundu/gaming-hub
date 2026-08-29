require("dotenv").config();
const mongoose = require("mongoose");

const Question = require("./models/Question");

const {
    englishQuestions,
    englishQuestionsLevel2,
    englishQuestionsLevel3,
    englishQuestionsLevel4,
    englishQuestionsLevel5,
    imageOptionsQuestions,
    imageQuestionQuestions,

} = require("./data/Questions");

mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("✅ MongoDB Connected");

        await Question.deleteMany({});
        console.log("🗑 Old questions deleted");

        const allQuestions = [];

        const addQuestions = (source, subject) => {
            Object.keys(source).forEach((key) => {
                const questions = source[key];

                if (Array.isArray(questions)) {
                    questions.forEach((q) => {
                        allQuestions.push({
                            type: q.type,
                            question: q.question || null,
                            options: q.options || [],
                            correct: q.correct,

                            image: q.image || null,
                            left: q.left || null,
                            right: q.right || null,

                            category:
                                subject === "Image Options" ||
                                    subject === "Image Question" ||
                                    subject === "Slide Match"
                                    ? subject
                                    : key,

                            subject,

                            level:
                                key === "level1"
                                    ? 1
                                    : key === "level2"
                                        ? 2
                                        : key === "level3"
                                            ? 3
                                            : key === "level4"
                                                ? 4
                                                : key === "level5"
                                                    ? 5
                                                    : subject === "English"
                                                        ? 1
                                                        : subject === "English Level 2"
                                                            ? 2
                                                            : subject === "English Level 3"
                                                                ? 3
                                                                : subject === "English Level 4"
                                                                    ? 4
                                                                    : 5,
                        });
                    });
                }
            });
        };

        // English
        addQuestions(englishQuestions, "English");
        addQuestions(englishQuestionsLevel2, "English Level 2");
        addQuestions(englishQuestionsLevel3, "English Level 3");
        addQuestions(englishQuestionsLevel4, "English Level 4");
        addQuestions(englishQuestionsLevel5, "English Level 5");

        // Image Categories
        addQuestions(imageOptionsQuestions, "Image Options");
        addQuestions(imageQuestionQuestions, "Image Question");


        await Question.insertMany(allQuestions);

        console.log(`🎉 Imported ${allQuestions.length} questions`);

        process.exit();
    })
    .catch((err) => {
        console.log("❌ Error:", err);
        process.exit();
    });