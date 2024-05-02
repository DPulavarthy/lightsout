let userBoard = new Map();
let gameEnded = false;
let numberCalled = [];
let numbers = [
  Array.from({ length: 15 }, (_, i) => i + 1),
  Array.from({ length: 15 }, (_, i) => i + 15),
  Array.from({ length: 15 }, (_, i) => i + 31),
  Array.from({ length: 15 }, (_, i) => i + 46),
  Array.from({ length: 15 }, (_, i) => i + 61),
];

function callNumber() {
  if (gameEnded) return;
  const number = Math.floor(Math.random() * 75) + 1;
  if (numberCalled.includes(number)) {
    return callNumber();
  }
  numberCalled.unshift(number);
  recentNumbers = numberCalled.slice(1, 6);
  document.getElementById(
    "number"
  ).innerHTML = `Current Number: <div class="numberCircle">${number}</div>`;
  document.getElementById("recentNumbers").innerHTML = recentNumbers
    .map((num) => `<div class="numberCircle">${num}</div>`)
    .join("");
}

function checkNumber(number) {
  if (!numberCalled.includes(number)) return;
  document.getElementById(
    `${number}`
  ).innerHTML = `<div class="active">${number}</div>`;
  const rowIndex = userBoard
    .get(1)
    .findIndex((row) => row[number] !== undefined);
  userBoard.get(1)[rowIndex][number] = true;
  if (
    bingoRemaining().row === 0 ||
    bingoRemaining().col === 0 ||
    bingoRemaining().diag1 === 0 ||
    bingoRemaining().diag2 === 0 ||
    bingoRemaining().fullHouse === 0
  ) {
    gameEnded = true;
    bingo();
  }
}

function createBoard() {
  const board = document.getElementById("playablearea");
  let numbers = [{}, {}, {}, {}, {}];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      let number = getRandomNumber(j);
      numbers[i][number] = false;
    }
  }
  userBoard.set(1, numbers);
  board.innerHTML = numbers
    .map((row, i) => {
      return `<div id="bingoRow">${Object.keys(row)
        .map((number) => {
          return `<div class="bingoRowItem" id="${number}">${number}</div>`;
        })
        .join("")}</div>`;
    })
    .join("");
  document
    .querySelectorAll("#playablearea > #bingoRow > .bingoRowItem")
    .forEach((el) =>
      el.addEventListener("click", () => checkNumber(parseInt(el.id)))
    );
}

function getRandomNumber(j) {
  number = numbers[j].splice(Math.floor(Math.random() * numbers[j].length), 1);
  numbers[j] = numbers[j].filter(function (item) {
    return item !== number[0];
  });
  return number[0];
}

function bingoRemaining() {
  const data = userBoard.get(1);
  const rows = data.length;
  const cols = Object.keys(data[0]).length;
  let remainingFullHouse = 0;

  const rowCounts = new Array(rows).fill(0);
  const colCounts = new Array(cols).fill(0);
  let diag1Count = 0;
  let diag2Count = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (!data[i][Object.keys(data[i])[j]]) {
        rowCounts[i]++;
        colCounts[j]++;
        if (i === j) diag1Count++;
        if (i + j === rows - 1) diag2Count++;
        remainingFullHouse++;
      }
    }
  }

  const minRowCount = Math.min(...rowCounts);
  const minColCount = Math.min(...colCounts);

  return {
    row: minRowCount,
    col: minColCount,
    diag1: diag1Count,
    diag2: diag2Count,
    fullHouse: remainingFullHouse,
  };
}

function bingo() {
    document.getElementById("number").innerHTML = "";
    document.getElementById("recentNumbers").innerHTML = "";
    document.getElementById("playablearea").innerHTML = "";
    document.getElementById("bingoRow").innerHTML = "";

    document.getElementById("win").innerHTML = `<div class="bingo-message">
    <h1>BINGO!</h1>
    <p>Congratulations, you won!</p>
    <button id="playagain">Play Again</button>
</div >`;
document.getElementById("playagain").addEventListener("click", () => {
    document.getElementById("win").innerHTML = "";
    document.getElementById("bingoRow").innerHTML = `<div id="bingoRow">
    <div class="bingoRowHeader">B</div>
    <div class="bingoRowHeader">I</div>
    <div class="bingoRowHeader">N</div>
    <div class="bingoRowHeader">G</div>
    <div class="bingoRowHeader">O</div>
</div>`;
    gameEnded = false;
    numberCalled = [];
    numbers = [
        Array.from({ length: 15 }, (_, i) => i + 1),
        Array.from({ length: 15 }, (_, i) => i + 15),
        Array.from({ length: 15 }, (_, i) => i + 31),
        Array.from({ length: 15 }, (_, i) => i + 46),
        Array.from({ length: 15 }, (_, i) => i + 61),
      ];
    userBoard = new Map();
    createBoard();
    callNumber();
});
}

callNumber();
createBoard();
setInterval(callNumber, 2000);
