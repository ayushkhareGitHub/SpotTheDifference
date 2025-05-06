let canvas1 = document.getElementById("canvas_01");
let canvas2 = document.getElementById("canvas_02");
let ctx1 = canvas1.getContext("2d");
let ctx2 = canvas2.getContext("2d");

let image1 = new Image();
let image2 = new Image();

let differences = [];
let foundDifferences = [];
let startTime;
let timerInterval;
const tolerance = 20;
const gameDuration = 300000;

const playBtn = document.getElementById("playBtn");
const restartBtn = document.getElementById("restartBtn");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const statusElement = document.getElementById("status");

let handleClickWrapper1;
let handleClickWrapper2;

playBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);

function startGame() {
  playBtn.style.display = "none";
  restartBtn.style.display = "inline-block";
  statusElement.textContent = "Status: Playing";
  scoreElement.textContent = "Score: Found 0/0 differences";
  startTime = Date.now();
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);

  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      document.title = data.gameTitle || "Spot the Difference";

      image1.src = data.images.image1;
      image2.src = data.images.image2;
      differences = data.differences || [];
      foundDifferences = [];

      scoreElement.textContent = `Score: Found 0/${differences.length} differences`;

      image1.onload = image2.onload = () => {
        canvas1.width = image1.width;
        canvas1.height = image1.height;
        canvas2.width = image2.width;
        canvas2.height = image2.height;

        ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        ctx1.drawImage(image1, 0, 0);
        ctx2.drawImage(image2, 0, 0);

        // Set up click handlers
        handleClickWrapper1 = (e) => handleClick(e, ctx1);
        handleClickWrapper2 = (e) => handleClick(e, ctx2);

        canvas1.addEventListener("click", handleClickWrapper1);
        canvas2.addEventListener("click", handleClickWrapper2);
      };
    })
    .catch((err) => console.error("Error loading game data:", err));
}

function restartGame() {
  clearInterval(timerInterval);
  canvas1.removeEventListener("click", handleClickWrapper1);
  canvas2.removeEventListener("click", handleClickWrapper2);
  startGame();
}

function handleClick(e, ctx) {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (let i = 0; i < differences.length; i++) {
    const d = differences[i];
    const dx = d.x - x;
    const dy = d.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= tolerance && !foundDifferences.includes(i)) {
      foundDifferences.push(i);
      drawMarker(d);
      updateScore();
      checkWin();
      break;
    }
  }
}

function drawMarker(d) {
  [ctx1, ctx2].forEach(ctx => {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(d.x, d.y, d.width, d.height);
  });
}

function updateScore() {
  scoreElement.textContent = `Score: Found ${foundDifferences.length}/${differences.length} differences`;
}

function checkWin() {
  if (foundDifferences.length === differences.length) {
    clearInterval(timerInterval);
    canvas1.removeEventListener("click", handleClickWrapper1);
    canvas2.removeEventListener("click", handleClickWrapper2);
    const timeTaken = formatTime(Date.now() - startTime);
    statusElement.textContent = `Status: You Win! Found all differences in ${timeTaken}`;
  }
}

function updateTimer() {
  const elapsed = Date.now() - startTime;
  const remaining = gameDuration - elapsed;

  if (remaining <= 0) {
    clearInterval(timerInterval);
    timerElement.textContent = "Time: 00:00";

    if (foundDifferences.length < differences.length) {
      statusElement.textContent = "Status: Game Over! Time's up!";
      canvas1.removeEventListener("click", handleClickWrapper1);
      canvas2.removeEventListener("click", handleClickWrapper2);
    }
    return;
  }

  timerElement.textContent = "Time: Is Running " + `${formatTime(remaining)}`;
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

statusElement.textContent = "Status: Click play to start";
