const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

// Predefined questions and answers
const qaPairs = [
    { question: "What is your name?", answer: "Hi! Welcome to BotPenguin. I'll be assisting you here today." },
    { question: "How are you?", answer: "I'm doing well, thank you!" },
    { question: "What can you do?", answer: "I can answer your questions." },
    { question: "What query do you have?", answer: "I have query with abc" },
];



router.use(bodyParser.json());

// Endpoint to get predefined questions
router.get("/questions", (req, res) => {
    const questions = qaPairs.map(pair => pair.question);
    res.json({ questions });
});

router.post("/chat", (req, res) => {
    const { message } = req.body;

    // Find a matching question in predefined QA pairs
    const qaPair = qaPairs.find(pair => pair.question.toLowerCase() === message.toLowerCase());

    if (qaPair) {
        // If a match is found, send the corresponding answer
        res.json({ reply: qaPair.answer });
    } else {
        // If no match is found, respond with a default message
        res.json({ reply: "I'm sorry, I don't understand your question." });
    }
});

module.exports = router;
