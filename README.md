# 🧩 Quiz Web App

A modern, lightweight Quiz Application built with Vanilla JavaScript that fetches real-time questions from the Open Trivia DB API.

Users can select category, choose difficulty, answer timed questions, and get a final score.

---

## 🚀 Demo Features

✨ Start screen with category & difficulty selection  
⏱️ 30-second timer per question  
🎯 Real-time scoring  
📊 Final score screen with color feedback  
🔄 Restart quiz anytime  
🌐 Questions fetched from live API

---

## 🛠️ Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Open Trivia Database API

---

## 📂 Project Structure

```text
Quiz/
│
├── index.html     # App layout and pages
├── style.css      # UI styling
└── script.js      # App logic & API integration
```

---

## ⚙️ How It Works

1. Start Page
   - User selects:
     - Category
     - Difficulty (Easy / Medium / Hard)
   - Start button becomes active after selecting difficulty.

   The app dynamically loads quiz categories from the API.

2. Fetch Questions from API

   The app requests 10 multiple-choice questions using Open Trivia DB API:

   ```js
   https://opentdb.com/api.php??amount=${CONFIG.Q_AMOUNT}&difficulty=${state.difficulty}&type=multiple
   ```

   Questions are loaded based on:
   - Selected difficulty
   - Selected category (optional)

3. Timer System ⏱️

   Each question has a 30 second countdown timer.

   If time runs out:
   - Answer is automatically revealed
   - User moves to next question

   Timer logic is handled using setInterval() and resets for each question.

4. Answer System 🎯

   When user selects an option:
   - Correct answer → Green highlight
   - Wrong answer → Red highlight
   - Score updates instantly
   - Next button appears

   Answers are shuffled randomly to avoid predictable positions.

5. Score Screen 📊

   At the end of the quiz:

   Score color changes based on performance:  
   | Score | Color |
   |:--------:|:---------:|
   |8–10 |🟢 Green |
   |5–7🟡 |Yellow |
   |0–4🔴 | Red |

   User can restart the game anytime.

---

# 🎮 How to Run Locally

1. Clone the repository

   ```bash
   git clone https://github.com/aryandevra24/Quiz.git
   ```

2. Open project folder

   ```bash
   cd Quiz
   ```

3. Run the app
   Simply open index.html in your browser.

   No build tools required ✅

---

## 🙌 Contributing

Contributions are welcome!

1. Fork the repo
2. Create new branch
3. Commit changes
4. Open Pull Request

---

## 📜 License

This project is open-source and free to use.

---
