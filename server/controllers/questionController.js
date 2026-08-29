const Question = require("../models/Question");
const questionsData = require("../data/Questions");

// Fallback question aggregator from Questions.js
const getFallbackQuestions = (category, level) => {
  const levelNum = Number(level) || 1;
  const catKey = (category || 'vocabulary').toLowerCase();
  
  // Pick matching source object
  let sourceObj = questionsData.englishQuestions;
  if (levelNum === 2 && questionsData.englishQuestionsLevel2) sourceObj = questionsData.englishQuestionsLevel2;
  if (levelNum === 3 && questionsData.englishQuestionsLevel3) sourceObj = questionsData.englishQuestionsLevel3;
  if (levelNum === 4 && questionsData.englishQuestionsLevel4) sourceObj = questionsData.englishQuestionsLevel4;
  if (levelNum === 5 && questionsData.englishQuestionsLevel5) sourceObj = questionsData.englishQuestionsLevel5;

  if (category === 'image-options' && questionsData.imageOptionsQuestions) {
    sourceObj = questionsData.imageOptionsQuestions;
    return sourceObj[`level${levelNum}`] || sourceObj.level1 || [];
  }

  if (category === 'image-question' && questionsData.imageQuestionQuestions) {
    sourceObj = questionsData.imageQuestionQuestions;
    return sourceObj[`level${levelNum}`] || sourceObj.level1 || [];
  }

  const matches = sourceObj[catKey] || sourceObj.vocabulary || sourceObj.grammar || [];
  return matches;
};

// GET all questions
const getQuestions = async (req, res) => {
    try {
        const { category, level } = req.query;

        let filter = {};
        if (category) {
            const categoryMap = {
                "image-options": "Image Options",
                "image-question": "Image Question",
                "slide-match": "Slide Match"
            };

            filter.category = categoryMap[category] || category;
        }

        if (level) {
            filter.level = Number(level);
        }

        let questions = [];
        try {
          if (Question.db?.readyState === 1) {
            questions = await Question.find(filter);
          }
        } catch (dbErr) {
          console.log("DB Query notice:", dbErr.message);
        }

        // Fallback to local data if DB returned 0 questions
        if (!questions || questions.length === 0) {
          questions = getFallbackQuestions(category, level);
        }

        res.json(questions);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// POST a new question
const addQuestion = async (req, res) => {
    try {
        const question = new Question(req.body);
        const savedQuestion = await question.save();

        res.status(201).json(savedQuestion);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

module.exports = {
    getQuestions,
    addQuestion,
};