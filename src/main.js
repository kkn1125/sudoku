const $ = (el) => document.querySelector(el);
/** @type {HTMLElement} */
const app = $("#app");
/** @type {HTMLCanvasElement } */
const canvas = document.createElement("canvas");
/** @type {CanvasRenderingContext2D } */
const ctx = canvas.getContext("2d");

/* clickable */
let onTile = null;
let onSelectTile = null;
let selected = null;

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
  [0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],

  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 5, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],

  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// 기본 스도쿠 출력 넘버 배열
const NUMBER_RESOURCES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// 옳은 값 컬러
const CORRECT_COLOR = "#00772250";
// 잘못된 값 컬러
const WRONG_COLOR = "#84112270";
// 호버링 컬러
const HOVERING_COLOR = "#77777756";
// 선택한 숫자 마킹 컬러
const SELECTED_COLOR = "#84253240";
// 선택한 숫자와 같은 수 마킹 컬러
const SAME_NUMBER_MARK_COLOR = "#84253230";
// 해당 숫자 모두 사용했을 때 컬러
const EMPTY_NUMBER_COLOR = "#00000020";
// 초기화 컬러
const INITIAL_COLOR = "#000000";
// stroke color
const STROKE_COLOR = "#777777";
// font size
const FONT_SIZE = 16;

const currentPoint = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (e) => {
  const x = e.clientX;
  const y = e.clientY;
  currentPoint.x = x;
  currentPoint.y = y;
});

const tileNumbers = new Map([
  [1, 9],
  [2, 9],
  [3, 9],
  [4, 9],
  [5, 9],
  [6, 9],
  [7, 9],
  [8, 9],
  [9, 9],
]);

// 타일 카운터 복사본
let tileNumberCompares = new Map(tileNumbers.entries());
// 잘못된 값 좌표
let wrongNumber = null;
let wrongPlace = null;

function tileCountDown(key) {
  if (tileNumberCompares.get(key) > 0) {
    tileNumberCompares.set(key, tileNumberCompares.get(key) - 1);
  }
}

// 검증 완료
function validation(list) {
  tileNumberCompares = new Map(tileNumbers.entries());
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list[i].length; j++) {
      if (list[i][j] > 0) {
        tileCountDown(list[i][j]);
      }
    }
  }
}

// 랜덤 스도쿠 생성
function fillNumbers(list, suffle = false) {
  validation(list);
  let numbers = NUMBER_RESOURCES;
  for (let i = 0; i < list.length; i++) {
    if (suffle && i > 0 && i % 3 === 0) {
      numbers = numbers.slice(4).concat(numbers.slice(0, 4));
    }
    for (let j = 0; j < list[i].length; j++) {
      list[i][j] = numbers[(j + i * 3) % 9];
      tileCountDown(list[i][j]);
    }
  }
  return list;
}

// row 적합 검증
function isCorrectInRow(y, number) {
  // 에러처리 나중에
  const isFitRow = !tileList[y].includes(number);
  const restNumbers = substraction(tileList[y]);
  return [isFitRow, restNumbers];
}

// column 적합 검증
function isCorrectInColumn(x, number) {
  const temp = [];
  for (let tile of tileList) {
    temp.push(tile[x]);
  }
  const isFitColumn = !temp.includes(number);
  const restNumbers = substraction(temp);
  return [isFitColumn, restNumbers];
}

// block 적합 검증
function isCorrectInBlock(y, x, number) {
  const temp = getBlock(y, x);
  const isFitBlock = !temp.includes(number);
  const restNumbers = substraction(temp);
  return [isFitBlock, restNumbers];
}

// block 넘버 가져오기
function getBlock(y, x) {
  const convertY = parseInt((y / WIDTH).toString());
  const convertX = parseInt((x / WIDTH).toString());
  const temp = [];
  for (let i = convertY * 3; i < (convertY + 1) * 3; i++) {
    temp.push(tileList[i][convertX * 3]);
    temp.push(tileList[i][convertX * 3 + 1]);
    temp.push(tileList[i][convertX * 3 + 2]);
  }
  return temp;
}

function totalCorrectInPlace(y, x, number) {
  const [isFitRow, rows] = isCorrectInRow(y, number);
  const [isFitColumn, columns] = isCorrectInColumn(x, number);
  const [isFitBlock, blocks] = isCorrectInBlock(y, x, number);
  if (isFitRow && isFitColumn && isFitBlock) {
    return true;
  } else {
    return false;
  }
}

// 배열 차집합
function substraction(array) {
  const temp = [];
  for (let i of NUMBER_RESOURCES) {
    if (!array.includes(i)) {
      temp.push(i);
    }
  }
  return temp;
}

// console.log(fillNumbers(tileList, true));
// console.log(tileNumberCompares);

function rayPoint() {
  const PAD_FROM_RIGHT = canvas.width * 0.05;
  const left = canvas.width / 2 - (tileList.length / 2) * TILE_SIZE_X;
  const top = canvas.height / 2 - (tileList[0].length / 2) * TILE_SIZE_Y;
  const right = left + TILE_SIZE_X * WIDTH * BLOCK_WIDTH;
  const bottom = top + TILE_SIZE_Y * HEIGHT * BLOCK_HEIGHT;
  const indexX = parseInt(
    ((currentPoint.x - left) / (right - left)) * (WIDTH * BLOCK_WIDTH)
  );
  const indexY = parseInt(
    ((currentPoint.y - top) / (bottom - top)) * (HEIGHT * BLOCK_HEIGHT)
  );
  // const indexSelectX = parseInt(
  //   ((currentPoint.x - right + PAD_FROM_RIGHT) /
  //     (right + PAD_FROM_RIGHT + TILE_SIZE_X - right + PAD_FROM_RIGHT)) *
  //     (WIDTH * BLOCK_WIDTH)
  // );
  // const indexSelectY = parseInt(
  //   ((currentPoint.y - top) / (bottom - top)) * (HEIGHT * BLOCK_HEIGHT)
  // );
  if (
    left < currentPoint.x &&
    top < currentPoint.y &&
    right > currentPoint.x &&
    bottom > currentPoint.y
  ) {
    if (!onTile || onTile[0] !== indexX || onTile[1] !== indexY) {
      onTile = [indexX, indexY];
    }
    ctx.fillStyle = HOVERING_COLOR;
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

    /* row marker */
    ctx.fillRect(
      left,
      Number(indexY) * TILE_SIZE_Y +
        canvas.height / 2 -
        (tileList[0].length / 2) * TILE_SIZE_Y,
      right - left,
      TILE_SIZE_Y
    );

    /* column marker */
    ctx.fillRect(
      Number(indexX) * TILE_SIZE_X +
        canvas.width / 2 -
        (tileList.length / 2) * TILE_SIZE_X,
      top,
      TILE_SIZE_X,
      bottom - top
    );

    ctx.fillStyle = INITIAL_COLOR;
  }

  // number pad select
  if (
    right + PAD_FROM_RIGHT < currentPoint.x &&
    top < currentPoint.y &&
    right + PAD_FROM_RIGHT + TILE_SIZE_X > currentPoint.x &&
    bottom > currentPoint.y
  ) {
    // if (onSelectTile === null) {
    onSelectTile = indexY;
    // }
    ctx.fillStyle = HOVERING_COLOR;
    ctx.fillRect(
      right + PAD_FROM_RIGHT,
      Number(indexY) * TILE_SIZE_Y +
        canvas.height / 2 -
        (tileList[0].length / 2) * TILE_SIZE_Y,
      TILE_SIZE_X,
      TILE_SIZE_Y
    );
    ctx.fillStyle = INITIAL_COLOR;
  } else {
    if (onSelectTile !== null) {
      onSelectTile = null;
    }
  }

  // sudoku pad or numbers pad hovering action
  if (
    (left < currentPoint.x &&
      top < currentPoint.y &&
      right > currentPoint.x &&
      bottom > currentPoint.y) ||
    (right + PAD_FROM_RIGHT < currentPoint.x &&
      top < currentPoint.y &&
      right + PAD_FROM_RIGHT + TILE_SIZE_X > currentPoint.x &&
      bottom > currentPoint.y)
  ) {
    document.body.style.cursor = "pointer";
  } else {
    document.body.style.cursor = "inherit";
    if (onTile) {
      onTile = null;
    }
  }
}

function numberPad() {
  const sortedNumbers = NUMBER_RESOURCES.sort();
  const left = canvas.width / 2 - (tileList.length / 2) * TILE_SIZE_X;
  const top = canvas.height / 2 - (tileList[0].length / 2) * TILE_SIZE_Y;
  const right = left + TILE_SIZE_X * WIDTH * BLOCK_WIDTH;
  const bottom = top + TILE_SIZE_Y * HEIGHT * BLOCK_HEIGHT;
  const PAD_FROM_RIGHT = canvas.width * 0.05;
  for (let index in sortedNumbers) {
    const number = sortedNumbers[index];
    if (tileNumberCompares.get(number) === 0) {
      ctx.fillStyle = EMPTY_NUMBER_COLOR;
      ctx.fillRect(
        right + PAD_FROM_RIGHT,
        top + TILE_SIZE_Y * index,
        TILE_SIZE_X,
        TILE_SIZE_Y
      );
      ctx.fillStyle = INITIAL_COLOR;
    }
    ctx.strokeRect(
      right + PAD_FROM_RIGHT,
      top + TILE_SIZE_Y * index,
      TILE_SIZE_X,
      TILE_SIZE_Y
    );
    ctx.textAlign = "center";
    ctx.font = `${FONT_SIZE}px bold`;
    ctx.fillText(
      number,
      TILE_SIZE_X / 2 + right + PAD_FROM_RIGHT,
      TILE_SIZE_Y / 2 + top + FONT_SIZE / 3 + TILE_SIZE_Y * index
    );
    ctx.font = `${FONT_SIZE - 6}px bold`;
    ctx.fillText(
      tileNumberCompares.get(number) + "개 남음",
      TILE_SIZE_X / 2 + right + PAD_FROM_RIGHT + TILE_SIZE_X * 1.3,
      TILE_SIZE_Y / 2 + top + FONT_SIZE / 3 + TILE_SIZE_Y * index
    );
    ctx.font = `${FONT_SIZE}px bold`;
  }
}

function tiles() {
  const baseX = canvas.width / 2 - (tileList.length / 2) * TILE_SIZE_X;
  const baseY = canvas.height / 2 - (tileList[0].length / 2) * TILE_SIZE_Y;
  const left = canvas.width / 2 - (tileList.length / 2) * TILE_SIZE_X;
  const top = canvas.height / 2 - (tileList[0].length / 2) * TILE_SIZE_Y;
  const right = left + TILE_SIZE_X * WIDTH * BLOCK_WIDTH;
  const bottom = top + TILE_SIZE_Y * HEIGHT * BLOCK_HEIGHT;
  // click marking
  if (selected) {
    ctx.fillStyle = SELECTED_COLOR;
    ctx.fillRect(
      selected[0] * TILE_SIZE_X + baseX,
      selected[1] * TILE_SIZE_Y + baseY,
      TILE_SIZE_X,
      TILE_SIZE_Y
    );
    ctx.fillStyle = INITIAL_COLOR;
  }

  // if (wrongPlace) {
  //   ctx.fillStyle = WRONG_COLOR;
  //   /* row marker */
  //   ctx.fillRect(
  //     left,
  //     Number(wrongPlace[0]) * TILE_SIZE_Y +
  //       canvas.height / 2 -
  //       (tileList[0].length / 2) * TILE_SIZE_Y,
  //     right - left,
  //     TILE_SIZE_Y
  //   );

  //   /* column marker */
  //   ctx.fillRect(
  //     Number(wrongPlace[1]) * TILE_SIZE_X +
  //       canvas.width / 2 -
  //       (tileList.length / 2) * TILE_SIZE_X,
  //     top,
  //     TILE_SIZE_X,
  //     bottom - top
  //   );
  //   ctx.fillStyle = INITIAL_COLOR;
  // }

  for (let y in tileList) {
    const row = tileList[y];

    // tie renlder
    for (let x in row) {
      const tile = row[x];

      /* wrong marker */
      if (wrongNumber) {
        if (row[x] === wrongNumber) {
          ctx.fillStyle = WRONG_COLOR;
          ctx.fillRect(
            x * TILE_SIZE_X + baseX,
            y * TILE_SIZE_Y + baseY,
            TILE_SIZE_X,
            TILE_SIZE_Y
          );
          ctx.fillStyle = INITIAL_COLOR;
        }
      }

      /* selected marker */
      if (
        selected &&
        row[x] !== 0 &&
        row[x] === tileList[selected[1]][selected[0]]
      ) {
        ctx.fillStyle = SAME_NUMBER_MARK_COLOR;
        ctx.fillRect(
          x * TILE_SIZE_X + baseX,
          y * TILE_SIZE_Y + baseY,
          TILE_SIZE_X,
          TILE_SIZE_Y
        );
        ctx.fillStyle = INITIAL_COLOR;
      }

      /* 3x3 block outline */
      if (x % 3 === 0 && y % 3 === 0) {
        ctx.strokeRect(
          parseInt(x / 3) - 1 + baseX + x * TILE_SIZE_X,
          parseInt(y / 3) - 1 + baseY + y * TILE_SIZE_Y,
          TILE_SIZE_X * 3,
          TILE_SIZE_Y * 3
        );
      }

      /* each tile outline */
      ctx.strokeStyle = STROKE_COLOR;
      ctx.strokeRect(
        x * TILE_SIZE_X + baseX,
        y * TILE_SIZE_Y + baseY,
        TILE_SIZE_X,
        TILE_SIZE_Y
      );

      /* text in tile */
      if (tile !== 0) {
        ctx.strokeStyle = INITIAL_COLOR;
        ctx.fillText(
          tile,
          x * TILE_SIZE_X + baseX + TILE_SIZE_X / 2,
          y * TILE_SIZE_Y + baseY + TILE_SIZE_Y / 2 + FONT_SIZE / 3
        );
        ctx.font = `${FONT_SIZE}px bold`;
      }
    }
  }
  /* validation for tile counter */
  validation(tileList);
}

function clearBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function render(time) {
  time *= 0.001;
  requestAnimationFrame(render);

  clearBoard();
  rayPoint();
  tiles();
  numberPad();
}
requestAnimationFrame(render);

/* canvas sizing */
canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener("resize", (e) => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});
window.addEventListener("click", (e) => {
  // const target = e.target;
  try {
    if (onSelectTile !== null) {
      const [x, y] = selected;
      const newTile = NUMBER_RESOURCES[onSelectTile];
      if (totalCorrectInPlace(y, x, newTile) || newTile === tileList[y][x]) {
        tileList[y][x] = newTile;
        onSelectTile = null;
        selected = null;
        wrongNumber = null;
        wrongPlace = null;
      } else {
        console.log("잘못된 수");
        wrongNumber = newTile;
        wrongPlace = [y, x];
        onSelectTile = null;
      }
    }

    if (onTile) {
      // console.log("tile click", onTile, tileList[y][x]);
      selected = onTile;
      console.log(selected);
      wrongNumber = null;
      wrongPlace = null;
    } else {
      if (onSelectTile) {
        selected = null;
      }
    }
  } catch (e) {
    console.log("에러 확인");
  }
});
