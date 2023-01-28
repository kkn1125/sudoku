import {
  BLOCK_HEIGHT,
  BLOCK_WIDTH,
  canvas,
  correct,
  ctx,
  HEIGHT,
  HOVERING_COLOR,
  INITIAL_COLOR,
  INSERT_WRONG_LIMIT,
  NUMBER_RESOURCES,
  on,
  PAD_RATIO,
  TILE_SIZE_X,
  TILE_SIZE_Y,
  WIDTH,
  wrong,
} from "../utils/tools";
import { Sudoku } from "./sudoku";

const WARNING_COMMENT = "고정 값은 변경할 수 없습니다.";
const WRONG_VALUE_COMMENT = "잘못된 수";

export class RayPoint {
  /** @type {Sudoku} */
  sudoku = null;
  newSudoku = null;
  currentPoint = { x: 0, y: 0 };
  detect(currentPoint) {
    this.currentPoint = currentPoint;
  }
  render(sudoku) {
    this.sudoku = sudoku;
    const PAD_FROM_RIGHT = canvas.width * PAD_RATIO;
    const left = canvas.width / 2 - (sudoku.rows.length / 2) * TILE_SIZE_X;
    const top =
      canvas.height / 2 - (sudoku.rows[0].tiles.length / 2) * TILE_SIZE_Y;
    const right = left + TILE_SIZE_X * WIDTH * BLOCK_WIDTH;
    const bottom = top + TILE_SIZE_Y * HEIGHT * BLOCK_HEIGHT;
    const indexX = parseInt(
      ((this.currentPoint.x - left) / (right - left)) * (WIDTH * BLOCK_WIDTH)
    );
    const indexY = parseInt(
      ((this.currentPoint.y - top) / (bottom - top)) * (HEIGHT * BLOCK_HEIGHT)
    );
    if (
      left < this.currentPoint.x &&
      top < this.currentPoint.y &&
      right > this.currentPoint.x &&
      bottom > this.currentPoint.y
    ) {
      if (!on.tile || on.tile[0] !== indexX || on.tile[1] !== indexY) {
        on.tile = [indexX, indexY];
      }
      ctx.fillStyle = HOVERING_COLOR;
      ctx.fillRect(
        Number(indexX) * TILE_SIZE_X +
          canvas.width / 2 -
          (sudoku.rows.length / 2) * TILE_SIZE_X,
        Number(indexY) * TILE_SIZE_Y +
          canvas.height / 2 -
          (sudoku.rows[0].tiles.length / 2) * TILE_SIZE_Y,
        TILE_SIZE_X,
        TILE_SIZE_Y
      );

      /* row marker */
      ctx.fillRect(
        left,
        Number(indexY) * TILE_SIZE_Y +
          canvas.height / 2 -
          (sudoku.rows[0].tiles.length / 2) * TILE_SIZE_Y,
        right - left,
        TILE_SIZE_Y
      );

      /* column marker */
      ctx.fillRect(
        Number(indexX) * TILE_SIZE_X +
          canvas.width / 2 -
          (sudoku.rows.length / 2) * TILE_SIZE_X,
        top,
        TILE_SIZE_X,
        bottom - top
      );

      ctx.fillStyle = INITIAL_COLOR;
    }

    // number pad select
    if (
      right + PAD_FROM_RIGHT < this.currentPoint.x &&
      top < this.currentPoint.y &&
      right + PAD_FROM_RIGHT + TILE_SIZE_X > this.currentPoint.x &&
      bottom > this.currentPoint.y
    ) {
      // if (on.selectTile === null) {
      on.selectTile = indexY;
      // }
      ctx.fillStyle = HOVERING_COLOR;
      ctx.fillRect(
        right + PAD_FROM_RIGHT,
        Number(indexY) * TILE_SIZE_Y +
          canvas.height / 2 -
          (sudoku.rows[0].tiles.length / 2) * TILE_SIZE_Y,
        TILE_SIZE_X,
        TILE_SIZE_Y
      );
      ctx.fillStyle = INITIAL_COLOR;
    } else {
      if (on.selectTile !== null) {
        on.selectTile = null;
      }
    }

    /* detect delection button */
    if (
      right + PAD_FROM_RIGHT - TILE_SIZE_X < this.currentPoint.x &&
      top < this.currentPoint.y &&
      right + PAD_FROM_RIGHT > this.currentPoint.x &&
      top + TILE_SIZE_Y > this.currentPoint.y
    ) {
      if (!on.deletion) {
        on.deletion = true;
      }
    } else {
      on.deletion = false;
    }

    // sudoku pad or numbers pad hovering action
    if (
      (left < this.currentPoint.x &&
        top < this.currentPoint.y &&
        right > this.currentPoint.x &&
        bottom > this.currentPoint.y) ||
      (right + PAD_FROM_RIGHT < this.currentPoint.x &&
        top < this.currentPoint.y &&
        right + PAD_FROM_RIGHT + TILE_SIZE_X > this.currentPoint.x &&
        bottom > this.currentPoint.y) ||
      (right + PAD_FROM_RIGHT - TILE_SIZE_X < this.currentPoint.x &&
        top < this.currentPoint.y &&
        right + PAD_FROM_RIGHT > this.currentPoint.x &&
        top + TILE_SIZE_Y > this.currentPoint.y)
    ) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "inherit";
      if (on.tile) {
        on.tile = null;
      }
    }
  }

  click(newSudoku) {
    this.newSudoku = newSudoku;
    try {
      if (correct.number) {
        /* correct 초기화 */
        correct.number = null;
        correct.place = null;
      }
			console.log(on.tile)
      if (on.selectTile !== null) {
        const [x, y] = on.selected;
        const newTile = NUMBER_RESOURCES[on.selectTile];
        if (
          this.sudoku.totalCorrectInPlace(y, x, newTile) ||
          newTile === this.sudoku.rows[y].tiles[x]
        ) {
          if (this.sudoku.rows[y].tiles[x].origin) {
            alert(WARNING_COMMENT);
          } else {
            this.sudoku.rows[y].tiles[x].setNumber(newTile);
            on.selectTile = null;
            on.selected = null;
            wrong.number = null;
            wrong.place = null;

            /* correct 값, 좌표 저장 */
            correct.number = newTile;
            correct.place = [y, x];
          }
        } else {
          if (this.sudoku.rows[y].tiles[x].origin) {
            // 고정 값 변경 시도 후 재시도 시 에러 표시 위함
            // on.selected = null;
            wrong.number = newTile;
            wrong.place = [y, x];
            on.selectTile = null;
            alert(WARNING_COMMENT);
          } else {
            // console.log(this.sudoku.rows[y].tiles[x]);
            console.log(WRONG_VALUE_COMMENT);

            wrong.number = newTile;
            wrong.place = [y, x];
            on.selectTile = null;

            wrong.count += 1;
            if (wrong.count >= INSERT_WRONG_LIMIT) {
              alert("game over\n You lose!");
              this.sudoku.initialize(newSudoku);
            }
          }
        }
      }

      if (on.tile) {
        on.selected = on.tile;
        wrong.number = null;
        wrong.place = null;
      } else {
        if (on.selectTile) {
          on.selected = null;
        }
      }

      if (on.selected && on.deletion) {
        const target = this.sudoku.rows[on.selected[1]].tiles[on.selected[0]];
        if (target.origin) {
          alert(WARNING_COMMENT);
        } else {
          target.deleteNumber();
          on.deletion = false;
          on.selected = null;
          on.selectTile = null;
          wrong.number = null;
          wrong.place = null;
        }
      }
    } catch (e) {
      console.log("에러 확인", e);
    }
  }

  keydown(key) {
    if (key.match(/[1-9]/g)) {
      on.selectTile = Number(key) - 1;
      try {
        if (correct.number) {
          /* correct 초기화 */
          correct.number = null;
          correct.place = null;
        }

        const [x, y] = on.selected;
        const newTile = NUMBER_RESOURCES[on.selectTile];
        if (
          this.sudoku.totalCorrectInPlace(y, x, newTile) ||
          newTile === this.sudoku.rows[y].tiles[x]
        ) {
          if (this.sudoku.rows[y].tiles[x].origin) {
            alert(WARNING_COMMENT);
          } else {
            this.sudoku.rows[y].tiles[x].setNumber(newTile);
            on.selectTile = null;
            on.selected = null;
            wrong.number = null;
            wrong.place = null;

            /* correct 값, 좌표 저장 */
            correct.number = newTile;
            correct.place = [y, x];
          }
        } else {
          if (this.sudoku.rows[y].tiles[x].origin) {
            // 고정 값 변경 시도 후 재시도 시 에러 표시 위함
            // on.selected = null;
            wrong.number = newTile;
            wrong.place = [y, x];
            on.selectTile = null;
            alert(WARNING_COMMENT);
          } else {
            // console.log(this.sudoku.rows[y].tiles[x]);
            console.log(WRONG_VALUE_COMMENT);

            wrong.number = newTile;
            wrong.place = [y, x];
            on.selectTile = null;

            wrong.count += 1;
            if (wrong.count >= INSERT_WRONG_LIMIT) {
              alert("game over\n You lose!");
              this.sudoku.initialize(this.newSudoku);
            }
          }
        }

        if (on.selectTile) {
          on.selected = null;
        }

        if (on.selected && on.deletion) {
          this.sudoku.rows[on.selected[1]].tiles[on.selected[0]].deleteNumber();
          on.deletion = false;
          on.selected = null;
          on.selectTile = null;
          wrong.number = null;
          wrong.place = null;
        }
      } catch (e) {
        console.log("에러 확인", e);
      }
    }
  }
}
