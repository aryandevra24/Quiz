// will optimized soon 

const BASE_URL = "https://opentdb.com/api.php";
const categoryURL = "https://opentdb.com/api_category.php";
const amount = 10;

let data = [];
let currentIndex = 0;
let score = 0;
let time = 30;
let timeRef;
let selectedCategory;
let selectedLevel;


const startPage = document.querySelector(".start-page");
const scorePage = document.querySelector(".score-page");
const qtnPage = document.querySelector(".qtn-page");

const startBtn = document.querySelector("#start-btn");
const resetBtn = document.querySelector("#reset-btn");
const levels = document.querySelectorAll(".levels");
const select = document.querySelector(".category-select");

const qtnBtn = document.querySelector("#qtn-btn");
const qtnInputs = document.querySelectorAll(".option-container input");
const qtnLabels = document.querySelectorAll(".option-container label");

const qtnTxt = document.querySelector(".qtn-txt");
const qtnNoTxt = document.querySelector(".qtn-no");
const scoreTxt = document.querySelector(".score-txt");
const timeTxt = document.querySelector(".time-txt");


fetch(categoryURL)
    .then(res => res.json())
    .then(res => {
        res.trivia_categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.name;
            select.append(option);
        });
    });


levels.forEach(btn => {
    btn.addEventListener("click", () => {
        selectedLevel = btn.id;
        startBtn.disabled = false;
    });
});


startBtn.addEventListener("click", async e => {
    e.preventDefault();

    selectedCategory = select.value;
    startPage.style.display = "none";
    qtnPage.style.display = "flex";

    await loadQuestions();
    renderQuestion();
});

async function loadQuestions() {
    let apiURL;

    if (selectedCategory === "all") {
        apiURL = `${BASE_URL}?amount=${amount}&difficulty=${selectedLevel}&type=multiple`;
    } else {
        apiURL = `${BASE_URL}?amount=${amount}&category=${selectedCategory}&difficulty=${selectedLevel}&type=multiple`;
    }

    const res = await fetch(apiURL);
    const json = await res.json();

    data = json.results;
    currentIndex = 0;
    score = 0;
}


function startTimer() {
    clearInterval(timeRef);
    time = 30;
    timeTxt.textContent = time;
    timeTxt.style.color = "#fff";

    timeRef = setInterval(() => {
        time--;
        timeTxt.textContent = time;

        if (time === 0) {
            revealAnswer();
            clearInterval(timeRef);
        }
    }, 1000);
}


function renderQuestion() {
    startTimer();

    const q = data[currentIndex];
    qtnNoTxt.textContent = `${currentIndex + 1}`;
    qtnTxt.innerHTML = q.question;

    let options = [...q.incorrect_answers];
    options.splice(Math.floor(Math.random() * 4), 0, q.correct_answer);

    qtnInputs.forEach(input => input.disabled = false);

    qtnLabels.forEach((label, i) => {
        label.innerHTML = options[i];
        label.dataset.correct = options[i] === q.correct_answer;
        label.style.background = "#958f8f76";
        label.style.transform = "scale(1)";
        label.style.opacity = "1";
        label.style.cursor = "pointer";
    });

    qtnBtn.style.display = "none";
}


qtnInputs.forEach(input => {
    input.addEventListener("click", e => {
        clearInterval(timeRef);
        revealAnswer(e.target.id);
    });
});


function revealAnswer(selectedId = null) {
    qtnInputs.forEach(input => input.disabled = true);

    qtnLabels.forEach(label => {
        const isCorrect = label.dataset.correct === "true";
        const isSelected = label.getAttribute("for") === selectedId;

        // Always show correct answer
        if (isCorrect) {
            label.style.background = "rgba(0,255,0,.5)";
        }

        // If user clicked correct
        if (isSelected && isCorrect) {
            label.style.transform = "scale(1.1)";
            score++;
        }

        // If user clicked wrong
        if (isSelected && !isCorrect) {
            label.style.background = "rgba(255,0,0,.5)";
            label.style.transform = "scale(1.1)";
        }

        label.style.cursor = "not-allowed";
        label.style.opacity = ".7";
    });

    qtnBtn.style.display = "block";
}



qtnBtn.addEventListener("click", () => {
    currentIndex++;

    if (currentIndex >= amount) {
        endQuiz();
    } else {
        renderQuestion();
    }
});


function endQuiz() {
    clearInterval(timeRef);
    qtnPage.style.display = "none";
    scorePage.style.display = "flex";

    scoreTxt.textContent = score;

    if (score >= 8) scoreTxt.style.color = "#0f0";
    else if (score >= 5) scoreTxt.style.color = "#ff0";
    else scoreTxt.style.color = "#f00";
}


resetBtn.addEventListener("click", () => {
    scorePage.style.display = "none";
    startPage.style.display = "flex";
});
