const $ = (el) => document.querySelector(el);
/** @type {HTMLElement} */
const app = $("#app");
/** @type {HTMLCanvasElement } */
const canvas = document.createElement("canvas");
/** @type {CanvasRenderingContext2D } */
const ctx = canvas.getContext("2d");

app.insertAdjacentElement("beforeend", canvas);

/* animation */
const WIDTH = 3;
const HEIGHT = 3;
const BLOCK_WIDTH = 3;
const BLOCK_HEIGHT = 3;
const TILE_SIZE_X = 50;
const TILE_SIZE_Y = 50;
const tileList = /* new Array(WIDTH * BLOCK_WIDTH).fill(
  new Array(HEIGHT * BLOCK_HEIGHT).fill(0)
); */ [
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [4, 5, 6, 3, 0, 0, 0, 1, 0],
  [7, 8, 9, 0, 0, 0, 0, 0, 0],

  [0, 5, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 6, 0, 0, 0, 0, 0, 0],

  [0, 0, 0, 0, 0, 9, 0, 0, 0],
  [0, 0, 0, 7, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const currentPoint = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (e) => {
  const x = e.screenX;
  const y = e.screenY;
  // rayPoint(x, y);
  currentPoint.x = x;
  currentPoint.y = y;
});

function rayPoint() {
  const left = canvas.width / 2 - (tileList.length / 2) * TILE_SIZE_X;
  const top =
    TILE_SIZE_Y * 2 +
    canvas.height / 2 -
    (tileList[0].length / 2) * TILE_SIZE_Y;
  const right = left + TILE_SIZE_X * WIDTH * BLOCK_WIDTH;
  const bottom = top + TILE_SIZE_Y * HEIGHT * BLOCK_HEIGHT;
  const indexX = parseInt(
    ((currentPoint.x - left) / (right - left)) * (WIDTH * BLOCK_WIDTH)
  );
  const indexY = parseInt(
    ((currentPoint.y - top) / (bottom - top)) * (HEIGHT * BLOCK_HEIGHT)
  );
  if (
    left < currentPoint.x &&
    top < currentPoint.y &&
    right > currentPoint.x &&
    bottom > currentPoint.y
  ) {
    ctx.fillStyle = "#77777756";
    ctx.fillRect(
      Number(indexX) * TILE_SIZE_X +
        canvas.width / 2 -
        (tileList.length / 2) * TILE_SIZE_X,
      Number(indexY) * TILE_SIZE_Y +
        canvas.height / 2 -
        (tileList[0].length / 2) * TILE_SIZE_Y,
      TILE_SIZE_X,
      TILE_SIZE_Y
    );
    ctx.fillStyle = "#000";
    document.body.style.cursor = "pointer";
  } else {
    document.body.style.cursor = "inherit";
  }
}

function getBlock(x, y) {
  const temp = [];
  for (let i = x * 3; i < (x + 1) * 3; i++) {
    temp.push(tileList[i][y * 3]);
    temp.push(tileList[i][y * 3 + 1]);
    temp.push(tileList[i][y * 3 + 2]);
  }
  return temp;
}

console.log("block", isFullNumbers(getBlock(0,0)));

function isFullNumbers(array) {
  return !array.reduce((acc, cur) => acc - cur, 45);
}

function checkRow() {
  tileList.forEach((row) => {
    console.log(isFullNumbers(row));
  });
}
checkRow();
function checkColumn() {}

function tiles() {
  for (let y in tileList) {
    const row = tileList[y];
    const baseX = canvas.width / 2 - (tileList.length / 2) * TILE_SIZE_X;
    const baseY = canvas.height / 2 - (tileList[0].length / 2) * TILE_SIZE_Y;
    const FONT_SIZE = 16;
    for (let x in row) {
      if (x % 3 === 0 && y % 3 === 0) {
        ctx.strokeRect(
          parseInt(x / 3) - 1 + baseX + x * TILE_SIZE_X,
          parseInt(y / 3) - 1 + baseY + y * TILE_SIZE_Y,
          TILE_SIZE_X * 3,
          TILE_SIZE_Y * 3
        );
      }
      const tile = row[x];
      ctx.strokeStyle = "#777";
      ctx.strokeRect(
        x * TILE_SIZE_X + baseX,
        y * TILE_SIZE_Y + baseY,
        TILE_SIZE_X,
        TILE_SIZE_Y
      );
      if (tile !== 0) {
        ctx.strokeStyle = "#000";
        ctx.fillText(
          tile,
          x * TILE_SIZE_X + baseX + TILE_SIZE_X / 2 - FONT_SIZE / 4,
          y * TILE_SIZE_Y + baseY + TILE_SIZE_Y / 2 + FONT_SIZE / 4
        );
        ctx.font = `${FONT_SIZE}px bold`;
      }
    }
  }
  rayPoint();
}

function clearBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function render(time) {
  time *= 0.001;
  requestAnimationFrame(render);

  clearBoard();
  tiles();
}
requestAnimationFrame(render);

/* canvas sizing */
canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener("resize", (e) => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});
