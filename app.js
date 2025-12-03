let questions = [];
let currentIndex = 0;
let score = 0;
let selectedOptionIndex = null;

const quizBox = document.getElementById("quiz-box");
const resultBox = document.getElementById("result-box");
const questionNumberEl = document.getElementById("question-number");
const questionTextEl = document.getElementById("question-text");
const optionsListEl = document.getElementById("options-list");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const scoreTextEl = document.getElementById("score-text");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");

// Load questions from JSON file
fetch("data/questions.json")
  .then((res) => res.json())
  .then((data) => {
    questions = data;
    loadingEl.classList.add("hidden");
    quizBox.classList.remove("hidden");
    showQuestion();
  })
  .catch((err) => {
    loadingEl.classList.add("hidden");
    errorEl.textContent = "Failed to load questions.";
    errorEl.classList.remove("hidden");
    console.error(err);
  });

function showQuestion() {
  const q = questions[currentIndex];
  selectedOptionIndex = null;
  nextBtn.disabled = true;

  // Correct template string with backticks
  questionNumberEl.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  questionTextEl.textContent = q.question;

  optionsListEl.innerHTML = "";

  q.options.forEach((opt, index) => {
    const li = document.createElement("li");
    li.textContent = opt;
    li.className = "option";

    li.addEventListener("click", () => handleOptionClick(li, index));

    optionsListEl.appendChild(li);
  });
}

function handleOptionClick(optionEl, index) {
  // Prevent changing answer after selecting one
  if (selectedOptionIndex !== null) return;

  selectedOptionIndex = index;
  nextBtn.disabled = false;

  const q = questions[currentIndex];
  const optionElements = document.querySelectorAll(".option");

  optionElements.forEach((el, i) => {
    el.classList.remove("selected", "correct", "wrong");

    // Mark correct answer as green
    if (i === q.answerIndex) {
      el.classList.add("correct");
    }
  });

  // Check if selected answer is correct
  if (index === q.answerIndex) {
    score++;
  } else {
    optionEl.classList.add("wrong");
  }
}

nextBtn.addEventListener("click", () => {
  currentIndex++;

  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    finishQuiz();
  }
});

function finishQuiz() {
  quizBox.classList.add("hidden");
  resultBox.classList.remove("hidden");

  // Correct template string
  scoreTextEl.textContent = `You scored ${score} out of ${questions.length}.`;
}

restartBtn.addEventListener("click", () => {
  currentIndex = 0;
  score = 0;

  resultBox.classList.add("hidden");
  quizBox.classList.remove("hidden");

  showQuestion();
});
