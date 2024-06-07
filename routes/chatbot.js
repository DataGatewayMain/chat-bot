const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const morgan = require('morgan');
router.use(bodyParser.json());
const apicache = require('apicache');
let cache = apicache.middleware;
// Predefined questions and answers with nested sets
const qaSets = [
    [
        { 
            question: "Start!", 
            answer: "Hi! I'll be assisting you here today.",
            nextSet: [
                { 
                    question: "How to start using vectorDb?", 
                    answer: "To start using vectorDb, follow these steps...",
                    nextSet: [
                        { 
                            question: "Step one", 
                            answer: "Go to the sidebar and click on the search icon.",
                            nextSet: [
                                { 
                                    question: "Step two", 
                                    answer: "Then go to the people section and apply the filter you want to get the leads within a minute.",
                                    nextSet: [
                                        { 
                                            question: "Next Step", 
                                            answer: "Continue with the next steps...",
                                            nextSet: [
                                                {
                                                    question: "Step three",
                                                    answer: "Next instruction..."
                                                },
                                                {
                                                    question: "Step four",
                                                    answer: "Next instruction..."
                                                },
                                                // Add more steps as needed
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                { 
                    question: "I face a technical problem with VectorDb?", 
                    answer: "Please describe the problem and share a full-page screenshot (including the search bar) of the issue, and the team will be happy to help."
                },
                { 
                    question: "How to apply filters?", 
                    answer: "To start using VectorDb, follow these steps...",
                    nextSet: [
                        { 
                            question: "Step one", 
                            answer: "Go to the sidebar and click on the VectorDb tab.",
                            nextSet: [
                                { 
                                    question: "Step two", 
                                    answer: "Then follow the instructions provided in the VectorDb setup wizard."
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
];

// Endpoint to get the initial set of questions
// router.get("/questions", (req, res) => {
//     const questions = qaSets[0].map(pair => pair.question);
//     res.json({ questions });
// });
router.get("/questions", cache('1 minutes'), (req, res) => {
    const questions = qaSets[0].map(pair => pair.question);
    res.json({ questions });
});

// Endpoint to handle user responses and return the next set of questions
router.post("/chat", (req, res) => {
    const { message } = req.body;
    let reply = "I'm sorry, I don't understand your question.";
    let nextQuestions = [];

    console.log("User's message:", message); // Debugging statement

    // Function to find the matching question and its nested set
    function findQaPair(questions) {
        for (const pair of questions) {
            if (pair.question.toLowerCase() === message.trim().toLowerCase()) {
                reply = pair.answer;
                if (pair.nextSet) {
                    nextQuestions = pair.nextSet.map(q => q.question);
                }
                return;
            } else if (pair.nextSet) {
                findQaPair(pair.nextSet); // Recursively search nested sets
            }
        }
    }

    findQaPair(qaSets[0]); // Start searching from the initial set of questions

    console.log("Reply:", reply); // Debugging statement
    console.log("Next questions:", nextQuestions); // Debugging statement

    res.json({ reply, nextQuestions });
});

module.exports = router;
