import { RayPoint } from "./models/raypoint";
import { Sudoku } from "./models/sudoku";
import { app, canvas } from "./utils/tools";

app.insertAdjacentElement("beforeend", canvas);

const currentPoint = {
  x: 0,
  y: 0,
};
const sudoku = new Sudoku(
  [0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],

  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 5, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],

  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
);
const raypoint = new RayPoint();
const saveSudoku = Sudoku.deepCopy(sudoku);

/* rendering */
function render(time) {
  time *= 0.001;
  requestAnimationFrame(render);

  sudoku.clearBoard();
  raypoint.detect(currentPoint);
  raypoint.render(sudoku);
  sudoku.render();
  sudoku.numberPad.render(sudoku);
  sudoku.scoreBoard.render(sudoku);
}
requestAnimationFrame(render);

/* canvas sizing */
canvas.width = innerWidth;
canvas.height = innerHeight;

/* events */
window.addEventListener("resize", (e) => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});
window.addEventListener("mousemove", (e) => {
  const x = e.clientX;
  const y = e.clientY;
  currentPoint.x = x;
  currentPoint.y = y;
});
window.addEventListener("keydown", (e) => {
  const key = e.key;
  raypoint.keydown(key);
});
window.addEventListener("click", (e) => {
  raypoint.click(saveSudoku);
});
