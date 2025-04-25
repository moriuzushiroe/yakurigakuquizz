let correctList = [];
let incorrectList = [];
let questions = [];
let currentQuestion = 0;
let correctCount = 0;
let checkedQuestions = [];

function generateQuiz() {
    const correctInput = document.getElementById('correctList').value.trim().split('\n');
    const incorrectInput = document.getElementById('incorrectList').value.trim().split('\n');
    localStorage.setItem('correctList', JSON.stringify(correctInput));
    localStorage.setItem('incorrectList', JSON.stringify(incorrectInput));
    window.location.href = 'quiz.html';
}

function loadQuiz() {
    correctList = JSON.parse(localStorage.getItem('correctList'));
    incorrectList = JSON.parse(localStorage.getItem('incorrectList'));

    const totalQuestions = Math.ceil((correctList.length + incorrectList.length) / 3);
    for (let i = 0; i < totalQuestions; i++) {
        const choices = [];
        let usedCorrect = 0;
        let usedIncorrect = 0;
        while (choices.length < 3) {
            if (Math.random() < 0.5 && correctList.length > 0 && usedCorrect < correctList.length) {
                const rand = Math.floor(Math.random() * correctList.length);
                choices.push({text: correctList[rand], isCorrect: true, index: rand + 1});
                usedCorrect++;
                correctList.splice(rand, 1);
            } else if (incorrectList.length > 0 && usedIncorrect < incorrectList.length) {
                const rand = Math.floor(Math.random() * incorrectList.length);
                choices.push({text: incorrectList[rand], isCorrect: false, index: rand + 1});
                usedIncorrect++;
                incorrectList.splice(rand, 1);
            }
        }
        questions.push(choices);
    }
    showQuestion();
}

function showQuestion() {
    const questionTitle = document.getElementById('questionTitle');
    const questionArea = document.getElementById('questionArea');
    const choiceRows = document.getElementById('choiceRows');

    const q = questions[currentQuestion];
    questionTitle.innerText = `問題 ${currentQuestion + 1} / ${questions.length}`;

    let html = "";
    q.forEach((item, idx) => {
        html += `<p>${idx + 1}. ${item.text}</p>`;
    });
    questionArea.innerHTML = html;

    choiceRows.innerHTML = `
        <tr>
            <td>a.</td>${createOptionRow([true, false, true])}
        </tr>
        <tr>
            <td>b.</td>${createOptionRow([true, true, false])}
        </tr>
        <tr>
            <td>c.</td>${createOptionRow([false, true, true])}
        </tr>
    `;
}

function createOptionRow(pattern) {
    let html = "";
    const correctPattern = questions[currentQuestion].map(q => q.isCorrect);
    for (let i = 0; i < 8; i++) {
        html += `<td><button onclick="checkAnswer(${i})">○</button></td>`;
    }
    return html;
}

function checkAnswer(index) {
    const correctPattern = questions[currentQuestion].map(q => q.isCorrect);
    const answerPatterns = [
        [true, true, true], [true, true, false], [true, false, true], [true, false, false],
        [false, true, true], [false, true, false], [false, false, true], [false, false, false]
    ];
    const selected = answerPatterns[index];
    const correct = JSON.stringify(selected) === JSON.stringify(correctPattern);

    if (correct) {
        alert("正解！");
        correctCount++;
    } else {
        alert("不正解！");
    }
    updateStatus();
}

function updateStatus() {
    const statusArea = document.getElementById('statusArea');
    statusArea.innerText = `正答率: ${Math.round((correctCount / (currentQuestion + 1)) * 100)}%`;
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}

function toggleCheck() {
    if (!checkedQuestions.includes(currentQuestion)) {
        checkedQuestions.push(currentQuestion);
        alert("チェックしました！");
    } else {
        checkedQuestions = checkedQuestions.filter(q => q !== currentQuestion);
        alert("チェックを外しました！");
    }
}

function showCheckedOnly() {
    questions = checkedQuestions.map(idx => questions[idx]);
    currentQuestion = 0;
    showQuestion();
}

function showExplanation() {
    const q = questions[currentQuestion];
    let explanation = "【解説】\n";
    q.forEach(item => {
        if (item.isCorrect) {
            explanation += `${item.index}. ${item.text}\n`;
        }
    });
    alert(explanation);
}

if (window.location.pathname.includes('quiz.html')) {
    loadQuiz();
}
