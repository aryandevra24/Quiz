// ---------------- CONFIG ----------------
const CONFIG = {
    API: "https://opentdb.com/api.php",
    CAT_API: "https://opentdb.com/api_category.php",
    Q_AMOUNT: 10,
    TIME: 30
};

const state = {
    questions: [],
    index: 0,
    score: 0,
    timer: CONFIG.TIME,
    timerRef: null,
    category: "all",
    difficulty: null
};

// DOM
const UI = {
    pages: {
        start: document.querySelector(".start-page"),
        question: document.querySelector(".qtn-page"),
        score: document.querySelector(".score-page")
    },
    startBtn: document.querySelector("#start-btn"),
    resetBtn: document.querySelector("#reset-btn"),
    difficultyBtns: document.querySelectorAll(".levels"),
    categorySelect: document.querySelector(".category-select"),
    nextBtn: document.querySelector("#qtn-btn"),
    optionInputs: document.querySelectorAll(".option-container input"),
    optionLabels: document.querySelectorAll(".option-container label"),
    qText: document.querySelector(".qtn-txt"),
    qNo: document.querySelector(".qtn-no"),
    timerText: document.querySelector(".time-txt"),
    scoreText: document.querySelector(".score-txt")
};

// PAGE SWITCHER
function showPage(name) {
    document.querySelectorAll(".page")
        .forEach(p => p.classList.remove("active-page"));
    UI.pages[name].classList.add("active-page");
}

// API
async function loadCategories() {
    const res = await fetch(CONFIG.CAT_API);
    const data = await res.json();
    data.trivia_categories.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat.id;
        opt.textContent = cat.name;
        UI.categorySelect.append(opt);
    });
}

async function loadQuestions() {
    let url = `${CONFIG.API}?amount=${CONFIG.Q_AMOUNT}&difficulty=${state.difficulty}&type=multiple`;
    if (state.category !== "all") url += `&category=${state.category}`;
    const res = await fetch(url);
    state.questions = (await res.json()).results;
    state.index = 0;
    state.score = 0;
}

// TIMER
function startTimer() {
    clearInterval(state.timerRef);
    state.timer = CONFIG.TIME;
    UI.timerText.textContent = state.timer;

    state.timerRef = setInterval(() => {
        state.timer--;
        UI.timerText.textContent = state.timer;
        if (state.timer === 0) {
            clearInterval(state.timerRef);
            revealAnswer();
        }
    }, 1000);
}

// GAME
function shuffle(correct, incorrect) {
    const arr = [...incorrect];
    arr.splice(Math.floor(Math.random() * 4), 0, correct);
    return arr;
}

function resetOptionsStyle() {
    UI.optionInputs.forEach(i => i.disabled = false);
    UI.optionLabels.forEach(l => {
        l.style.background = "#958f8f76";
        l.style.transform = "scale(1)";
        l.style.opacity = "1";
        l.style.cursor = "pointer";
    });
}

function showQuestion() {
    startTimer();
    resetOptionsStyle();

    const q = state.questions[state.index];
    UI.qNo.textContent = state.index + 1;
    UI.qText.innerHTML = q.question;

    const options = shuffle(q.correct_answer, q.incorrect_answers);

    UI.optionLabels.forEach((label, i) => {
        label.innerHTML = options[i];
        label.dataset.correct = options[i] === q.correct_answer;
    });

    UI.nextBtn.style.display = "none";
}

function revealAnswer(selectedId = null) {
    UI.optionInputs.forEach(i => i.disabled = true);

    UI.optionLabels.forEach(label => {
        const correct = label.dataset.correct === "true";
        const selected = label.getAttribute("for") === selectedId;

        if (correct) { label.style.background = "rgba(0,255,0,.5)"; }
        if (selected && !correct) { label.style.background = "rgba(255,0,0,.5)"; }
        if (selected && correct) { state.score++; }
        if (selected) { label.style.transform = "scale(1.1)"; }

        label.style.opacity = ".7";
        label.style.cursor = "not-allowed";
    });

    UI.nextBtn.style.display = "block";
}

function nextQuestion() {
    state.index++;

    if (state.index >= CONFIG.Q_AMOUNT - 1) {
        UI.nextBtn.value = "Show Score";
    }

    state.index >= CONFIG.Q_AMOUNT ? showScore() : showQuestion();
}

function showScore() {
    showPage("score");
    UI.scoreText.textContent = state.score;

    if (state.score >= 8) UI.scoreText.style.color = "#0f0";
    else if (state.score >= 5) UI.scoreText.style.color = "#ff0";
    else UI.scoreText.style.color = "#f00";
}

// EVENTS
UI.difficultyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        state.difficulty = btn.id;
        UI.startBtn.disabled = false;
    });
});

UI.startBtn.addEventListener("click", async e => {
    e.preventDefault();
    state.category = UI.categorySelect.value;
    showPage("question");
    await loadQuestions();
    showQuestion();
});

UI.optionInputs.forEach(input => {
    input.addEventListener("click", e => {
        clearInterval(state.timerRef);
        revealAnswer(e.target.id);
    });
});

UI.nextBtn.addEventListener("click", nextQuestion);
UI.resetBtn.addEventListener("click", () => showPage("start"));

loadCategories();
