let flashcards = [];
let quizData = [];
let score = 0;
let timer;
let timeLimit = 30;

function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// FLASHCARD LOGIC
function addFlashcard() {
  const question = document.getElementById("fc_question").value;
  const answer = document.getElementById("fc_answer").value.toLowerCase();
  if (question && (answer === "true" || answer === "false")) {
    flashcards.push({ question, answer });
    renderFlashcards();
    document.getElementById("fc_question").value = "";
    document.getElementById("fc_answer").value = "";
  } else {
    alert("Answer must be 'True' or 'False'");
  }
}

function renderFlashcards() {
  const container = document.getElementById("flashcard_list");
  container.innerHTML = "";
  flashcards.forEach((card, i) => {
    const div = document.createElement("div");
    div.className = "flashcard";
    div.innerText = card.question;

    div.addEventListener("touchstart", (e) => {
      div.startX = e.touches[0].clientX;
    });

    div.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX;
      const direction = endX - div.startX > 50 ? "right" : endX - div.startX < -50 ? "left" : null;

      if (direction) {
        const userAnswer = direction === "right" ? "true" : "false";
        if (userAnswer === card.answer) {
          div.classList.add("correct");
        } else {
          div.classList.add("wrong");
        }
        setTimeout(() => {
          div.remove();
          flashcards.splice(i, 1);
          renderFlashcards();
        }, 1000);
      }
    });

    container.appendChild(div);
  });
}

// QUIZ CREATOR + PLAYER
function startQuiz() {
  const type = document.getElementById("quizType").value;
  const builder = document.getElementById("quizBuilder");

  const question = prompt("Enter question:");
  if (!question) return;

  let options = [], answer;

  switch (type) {
    case "mcq":
      for (let i = 0; i < 4; i++) {
        const opt = prompt(`Enter option ${i + 1}:`);
        options.push(opt);
      }
      answer = prompt("Enter correct option exactly:");
      quizData.push({ type, question, options, answer });
      break;

    case "truefalse":
      answer = prompt("Enter correct answer (true/false):").toLowerCase();
      quizData.push({ type, question, answer });
      break;

    case "fillblank":
    case "short":
      answer = prompt("Enter correct answer:");
      quizData.push({ type, question, answer });
      break;

    case "match":
      let match = [];
      let count = parseInt(prompt("How many pairs?"));
      for (let i = 0; i < count; i++) {
        const left = prompt(`Left ${i + 1}`);
        const right = prompt(`Right ${i + 1}`);
        match.push({ left, right });
      }
      quizData.push({ type, question, pairs: match });
      break;
  }

  alert("Question added!");
  renderQuiz();
}

function renderQuiz() {
  const area = document.getElementById("quiz_area");
  area.innerHTML = "";
  score = 0;

  let index = 0;

  function nextQuestion() {
    if (index >= quizData.length) {
      area.innerHTML = `<h3>Your Score: ${score}/${quizData.length}</h3>`;
      return;
    }

    const q = quizData[index];
    area.innerHTML = "";
    const container = document.createElement("div");
    container.className = "quiz-question";

    const qEl = document.createElement("p");
    qEl.textContent = q.question;
    container.appendChild(qEl);

    let inputEl;

    if (q.type === "mcq") {
      q.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.className = "option-btn";
        btn.onclick = () => {
          if (btn.textContent === q.answer) score++;
          index++;
          nextQuestion();
        };
        container.appendChild(btn);
      });
    } else if (q.type === "truefalse") {
      ["True", "False"].forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.className = "option-btn";
        btn.onclick = () => {
          if (btn.textContent.toLowerCase() === q.answer) score++;
          index++;
          nextQuestion();
        };
        container.appendChild(btn);
      });
    } else if (q.type === "fillblank" || q.type === "short") {
      inputEl = document.createElement("input");
      inputEl.placeholder = "Your answer...";
      container.appendChild(inputEl);

      const submitBtn = document.createElement("button");
      submitBtn.textContent = "Submit";
      submitBtn.onclick = () => {
        if (inputEl.value.trim().toLowerCase() === q.answer.trim().toLowerCase()) score++;
        index++;
        nextQuestion();
      };
      container.appendChild(submitBtn);
    } else if (q.type === "match") {
      q.pairs.forEach(pair => {
        const div = document.createElement("div");
        div.className = "match-pair";

        const left = document.createElement("span");
        left.textContent = pair.left;
        const right = document.createElement("span");
        right.textContent = pair.right;

        div.append(left, right);
        container.appendChild(div);
      });

      const confirm = document.createElement("button");
      confirm.textContent = "Continue";
      confirm.onclick = () => {
        // No logic, just for display in basic version
        index++;
        nextQuestion();
      };
      container.appendChild(confirm);
    }

    area.appendChild(container);
    startTimer(() => {
      index++;
      nextQuestion();
    });
  }

  nextQuestion();
}

function startTimer(callback) {
  clearInterval(timer);
  const limit = prompt("Set time per question (seconds):", "30");
  timeLimit = parseInt(limit);
  let count = timeLimit;

  const area = document.getElementById("quiz_area");
  const t = document.createElement("div");
  t.textContent = `⏱ ${count}s`;
  area.appendChild(t);

  timer = setInterval(() => {
    count--;
    t.textContent = `⏱ ${count}s`;
    if (count <= 0) {
      clearInterval(timer);
      alert("⏰ Time's up!");
      callback();
    }
  }, 1000);
}

// THEMES
function toggleTheme() {
  document.body.classList.toggle("dark");
}

function changeThemeColor() {
  const color = document.getElementById("themeColor").value;
  document.documentElement.style.setProperty("--main-color", color);
}

function changeBackground() {
  const url = document.getElementById("bgImage").value;
  document.body.style.backgroundImage = `url('${url}')`;
}