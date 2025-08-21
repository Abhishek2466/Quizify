const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const endScreen = document.getElementById('end-screen');

const categorySelect = document.getElementById('category');
const difficultySelect = document.getElementById('difficulty');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const playAgainBtn = document.getElementById('play-again-btn');

const questionCounterText = document.getElementById('question-counter');
const scoreText = document.getElementById('score');
const questionText = document.getElementById('question');
const answerOptions = document.getElementById('answer-options');
const finalScoreText = document.getElementById('final-score');

let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
const TOTAL_QUESTIONS = 10;

startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
        showQuestion();
    } else {
        showEndScreen();
    }
});
playAgainBtn.addEventListener('click', () => {
    endScreen.classList.add('hide');
    startScreen.classList.remove('hide');
});

async function startQuiz() {
    const category = categorySelect.value;
    const difficulty = difficultySelect.value;
    const API_URL = `https://opentdb.com/api.php?amount=${TOTAL_QUESTIONS}&category=${category}&difficulty=${difficulty}&type=multiple`;

    startScreen.classList.add('hide');
    quizScreen.classList.remove('hide');
    questionText.innerHTML = "Loading questions..."; 

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        quizQuestions = data.results.map(item => {
            const allAnswers = [...item.incorrect_answers, item.correct_answer];

            for (let i = allAnswers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
            }
            return {
                question: item.question,
                answers: allAnswers,
                correct: item.correct_answer
            };
        });
        
        resetState();
        showQuestion();
    } catch (error) {
        console.error("Failed to fetch questions:", error);
        questionText.innerHTML = "Failed to load questions. Please try again.";
    }
}

function showQuestion() {
    resetQuestionUI();
    const questionData = quizQuestions[currentQuestionIndex];

    questionText.innerHTML = questionData.question;
    questionCounterText.textContent = `${currentQuestionIndex + 1} / ${TOTAL_QUESTIONS}`;

    questionData.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerHTML = answer;
        button.classList.add('answer-btn');
        button.addEventListener('click', selectAnswer);
        answerOptions.appendChild(button);
    });
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const isCorrect = selectedButton.innerHTML === quizQuestions[currentQuestionIndex].correct;

    if (isCorrect) {
        selectedButton.classList.add('correct');
        score += 10;
        scoreText.textContent = score;
    } else {
        selectedButton.classList.add('incorrect');
    }

    Array.from(answerOptions.children).forEach(button => {
        if (button.innerHTML === quizQuestions[currentQuestionIndex].correct) {
            button.classList.add('correct');
        }
        button.disabled = true;
    });

    nextBtn.classList.remove('hide');
}

function showEndScreen() {
    quizScreen.classList.add('hide');
    endScreen.classList.remove('hide');
    finalScoreText.textContent = score;
}

function resetState() {
    currentQuestionIndex = 0;
    score = 0;
    scoreText.textContent = '0';
}

function resetQuestionUI() {
    nextBtn.classList.add('hide');
    while (answerOptions.firstChild) {
        answerOptions.removeChild(answerOptions.firstChild);
    }
}
