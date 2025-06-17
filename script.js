
const questions = [
    {
        question: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        correctAnswer: "Paris"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Jupiter", "Mars", "Venus", "Mercury"],
        correctAnswer: "Mars"
    },
    {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "4"
    }
];

let currentQuestionIndex = 0;
let score = 0;

function loadQuestion() {
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
    const currentQuestion = questions[currentQuestionIndex];

    questionElement.textContent = currentQuestion.question;
    optionsElement.innerHTML = "";

    currentQuestion.options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("option");
        button.onclick = () => selectOption(option, button);
        optionsElement.appendChild(button);
    });

    document.getElementById("next-btn").disabled = true;
}

function selectOption(selectedOption, button) {
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;
    const options = document.querySelectorAll(".option");

    options.forEach(opt => opt.disabled = true); 
    if (selectedOption === correctAnswer) {
        button.classList.add("selected");
        score++;
    } else {
        button.classList.add("wrong");
        options.forEach(opt => {
            if (opt.textContent === correctAnswer) {
                opt.classList.add("selected");
            }
        });
    }

    document.getElementById("next-btn").disabled = false;
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    document.getElementById("quiz").classList.add("hidden");
    const resultElement = document.getElementById("result");
    resultElement.classList.remove("hidden");
    document.getElementById("score").textContent = `${score} out of ${questions.length}`;
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById("quiz").classList.remove("hidden");
    document.getElementById("result").classList.add("hidden");
    loadQuestion();
}

// Initialize quiz
loadQuestion();