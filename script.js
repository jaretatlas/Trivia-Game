const categories = ["Science", "Geography", "Animals", "Sports", "Math"];

const questions = [
    { question: "Which planet is known as the Red Planet?", answer: "Mars" },
    { question: "What gas do humans need to breathe?", answer: "Oxygen" },
    { question: "What is the chemical formula for water?", answer: "H2O" },
    { question: "What force keeps us on the ground?", answer: "Gravity" },
    { question: "What star is at the center of our solar system?", answer: "The Sun" },
    { question: "What is the capital of France?", answer: "Paris" },
    { question: "What is the largest ocean on Earth?", answer: "The Pacific Ocean" },
    { question: "Which continent is Egypt in?", answer: "Africa" },
    { question: "Which country is shaped like a boot?", answer: "Italy" },
    { question: "What is the capital of Japan?", answer: "Tokyo" },
    { question: "What is the tallest living land animal?", answer: "A giraffe" },
    { question: "How many legs does a spider have?", answer: "Eight" },
    { question: "What is a baby frog called?", answer: "A tadpole" },
    { question: "What is the largest living animal?", answer: "The blue whale" },
    { question: "What do caterpillars turn into?", answer: "Butterflies or moths" },
    { question: "How many players per team are on a basketball court?", answer: "Five" },
    { question: "Which sport uses a bat, bases, and a diamond?", answer: "Baseball" },
    { question: "How many rings are in the Olympic symbol?", answer: "Five" },
    { question: "Which sport uses a puck on ice?", answer: "Ice hockey" },
    { question: "What is a score of zero called in tennis?", answer: "Love" },
    { question: "What is 7 times 8?", answer: "56" },
    { question: "How many sides does a hexagon have?", answer: "Six" },
    { question: "What is half of 100?", answer: "50" },
    { question: "What is the square root of 81?", answer: "9" },
    { question: "How many degrees are in a right angle?", answer: "90 degrees" }
];

let used = [];
let scores = [0, 0];
let team = 0;
let currentQuestion = -1;
let completed = 0;
let seconds = 60;
let timer = null;

const board = document.getElementById("board");
const questionScreen = document.getElementById("question-screen");
const message = document.getElementById("message");

function makeBoard() {
    board.innerHTML = "";

    for (let category = 0; category < categories.length; category++) {
        const column = document.createElement("div");
        column.className = "category";
        const heading = document.createElement("h2");
        heading.textContent = categories[category];
        column.appendChild(heading);

        for (let row = 0; row < 5; row++) {
            let index = category * 5 + row;
            const button = document.createElement("button");
            button.className = "clue-button";
            button.textContent = row + 1;
            button.disabled = used[index] === true;
            button.setAttribute("aria-label", categories[category] + " clue " + (row + 1));
            button.onclick = function () {
                openQuestion(index);
            };
            column.appendChild(button);
        }

        board.appendChild(column);
    }
}

function openQuestion(index) {
    currentQuestion = index;
    board.hidden = true;
    questionScreen.hidden = false;
    document.getElementById("category").textContent = categories[Math.floor(index / 5)];
    document.getElementById("question").textContent = questions[index].question;
    document.getElementById("answer").textContent = questions[index].answer;
    document.getElementById("answer").hidden = true;
    document.getElementById("show-answer").hidden = false;
    document.getElementById("turn").textContent = "Team " + (team + 1) + " is playing";
    document.getElementById("show-answer").focus();

    if (timer === null) {
        timer = setInterval(countDown, 1000);
    }
}

function showAnswer() {
    document.getElementById("answer").hidden = false;
    document.getElementById("show-answer").hidden = true;
    document.getElementById("correct").focus();
}

function scoreAnswer(points) {
    if (currentQuestion === -1) {
        return;
    }

    scores[team] = scores[team] + points;
    document.getElementById("score1").textContent = scores[0];
    document.getElementById("score2").textContent = scores[1];
    used[currentQuestion] = true;
    completed++;
    let categoryStart = Math.floor(currentQuestion / 5) * 5;
    currentQuestion = -1;
    message.textContent = "Team " + (team + 1) + " scored " + points + " on that clue.";

    if (completed === questions.length) {
        finishGame();
        return;
    }

    for (let index = categoryStart; index < categoryStart + 5; index++) {
        if (used[index] !== true) {
            openQuestion(index);
            return;
        }
    }

    showBoard();
    message.textContent = "Category complete! Choose another box before time runs out.";
}

function showBoard() {
    questionScreen.hidden = true;
    board.hidden = false;
    makeBoard();
    document.getElementById("turn").textContent = "Team " + (team + 1) + ", choose a box!";
}

function countDown() {
    seconds--;
    document.getElementById("timer").textContent = "0:" + String(seconds).padStart(2, "0");

    if (seconds === 0) {
        clearInterval(timer);
        timer = null;

        if (currentQuestion !== -1) {
            used[currentQuestion] = true;
            completed++;
            currentQuestion = -1;
        }

        if (completed === questions.length) {
            finishGame();
            return;
        }

        if (team === 0) {
            team = 1;
        } else {
            team = 0;
        }

        seconds = 60;
        document.getElementById("timer").textContent = "1:00";
        showBoard();
        message.textContent = "Time is up! Team " + (team + 1) + ", choose a box to start your turn.";
    }
}

function finishGame() {
    clearInterval(timer);
    timer = null;
    currentQuestion = -1;
    showBoard();
    document.getElementById("turn").textContent = "Game over!";

    if (scores[0] > scores[1]) {
        message.textContent = "Team 1 wins!";
    } else if (scores[1] > scores[0]) {
        message.textContent = "Team 2 wins!";
    } else {
        message.textContent = "It is a tie!";
    }
}

makeBoard();
