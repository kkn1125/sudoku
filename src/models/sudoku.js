import {
  BLOCK_HEIGHT,
  BLOCK_WIDTH,
  canvas,
  correct,
  CORRECT_COLOR,
  ctx,
  EMPTY_NUMBER_COLOR,
  FONT_SIZE,
  HEIGHT,
  INITIAL_COLOR,
  INSERT_WRONG_LIMIT,
  NEW_VALUE_COLOR,
  NUMBER_RESOURCES,
  on,
  SAME_NUMBER_MARK_COLOR,
  SELECTED_COLOR,
  STROKE_COLOR,
  tileNumberCompares,
  tileNumbers,
  TILE_SIZE_X,
  TILE_SIZE_Y,
  WIDTH,
  wrong,
  WRONG_COLOR,
} from "../utils/tools";
import { Row } from "./row";

class NumberPad {
  render(sudoku) {
    try {
      const sortedNumbers = NUMBER_RESOURCES.sort();
      const left = canvas.width / 2 - (sudoku.rows.length / 2) * TILE_SIZE_X;
      const top =
        canvas.height / 2 - (sudoku.rows[0].tiles.length / 2) * TILE_SIZE_Y;
      const right = left + TILE_SIZE_X * WIDTH * BLOCK_WIDTH;
      const bottom = top + TILE_SIZE_Y * HEIGHT * BLOCK_HEIGHT;
      // 숫자 패드 스도쿠 간격 조절
      const PAD_FROM_RIGHT = canvas.width * 0.06;
      // number delete button
      ctx.fillStyle = WRONG_COLOR;
      ctx.fillRect(
        right + PAD_FROM_RIGHT - TILE_SIZE_X,
        top,
        TILE_SIZE_X,
        TILE_SIZE_Y
      );
      ctx.fillStyle = INITIAL_COLOR;
      ctx.textAlign = "center";
      ctx.font = `${FONT_SIZE}px bold`;
      ctx.fillText(
        "❌",
        right + PAD_FROM_RIGHT - TILE_SIZE_X + TILE_SIZE_X / 2,
        top + TILE_SIZE_Y / 2 + FONT_SIZE / 3
      );
      ctx.font = `${FONT_SIZE - 6}px bold`;

      ctx.fillStyle = INITIAL_COLOR;
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
    } catch (e) {
      console.log(e);
    }
  }
}

class ScoreBoard {
  render(sudoku) {
    const left = canvas.width / 2 - (sudoku.rows.length / 2) * TILE_SIZE_X;
    const top =
      canvas.height / 2 - (sudoku.rows[0].tiles.length / 2) * TILE_SIZE_Y;
    const right = left + TILE_SIZE_X * WIDTH * BLOCK_WIDTH;
    const bottom = top + TILE_SIZE_Y * HEIGHT * BLOCK_HEIGHT;
    const score = `${wrong.count}/${INSERT_WRONG_LIMIT}`;
    const PADDING = 20;
    const topPlace = 45;

    ctx.strokeRect(
      canvas.width / 2 - (score.length * FONT_SIZE) / 2 - PADDING / 2,
      topPlace - FONT_SIZE - PADDING / 3,
      score.length * FONT_SIZE + PADDING,
      FONT_SIZE + PADDING
    );
    ctx.fillText(score, canvas.width / 2, topPlace);
  }
}

export class Sudoku {
  rows = [];
  numberPad = new NumberPad();
  scoreBoard = new ScoreBoard();

  constructor(...rows) {
    this.rows.push(
      ...rows.map((row) => (row instanceof Row ? row : new Row(...row)))
    );
  }

  // 게임 초기화
  initialize(newSdoku) {
    const copy = Sudoku.deepCopy(newSdoku);

    for (let y in this.rows) {
      this.rows[y] = copy.rows[y];
    }
    correct.number = null;
    correct.place = null;
    on.selectTile = null;
    on.selected = null;
    wrong.number = null;
    wrong.place = null;
    wrong.count = 0;
  }

  // 랜덤 스도쿠 생성
  fillNumbers(suffle = false) {
    let numbers = NUMBER_RESOURCES;
    for (let i = 0; i < this.rows.length; i++) {
      if (suffle && i > 0 && i % 3 === 0) {
        numbers = numbers.slice(4).concat(numbers.slice(0, 4));
      }
      for (let j = 0; j < this.rows[i].tiles.length; j++) {
        this.rows[i].tiles[j] = numbers[(j + i * 3) % 9];
        tileCountDown(this.rows[i].tiles[j]);
      }
    }
    return this;
  }

  // 3x3 block 숫자 배열 가져오기
  getBlock(y, x, number) {
    const convertY = parseInt((y / 3).toString());
    const convertX = parseInt((x / 3).toString());
    const sliced = this.rows
      .slice(convertY * 3, (convertY + 1) * 3)
      .reduce((acc, cur) => {
        acc.tiles.push(...cur.tiles.slice(convertX * 3, (convertX + 1) * 3));
        return acc;
      }, new Row());
    return sliced;
  }

  // 열 가져오기
  getColumn(x) {
    // console.log(this.rows);
    return this.rows.reduce((acc, cur) => {
      acc.tiles.push(cur.tiles[x]);
      return acc;
    }, new Row());
  }

  // row 적합 검증
  isCorrectInRow(y, number) {
    const isFitRow = this.rows[y].isFitNumber(number);
    const restNumbers = Sudoku.substraction(this.rows[y]);
    return [isFitRow, restNumbers];
  }

  // column 적합 검증
  isCorrectInColumn(x, number) {
    const columns = this.getColumn(x);
    const isFitColumn = columns.isFitNumber(number);
    const restNumbers = Sudoku.substraction(columns);
    return [isFitColumn, restNumbers];
  }

  // block 적합 검증
  isCorrectInBlock(y, x, number) {
    const block = this.getBlock(y, x);
    const isFitBlock = block.isFitNumber(number);
    const restNumbers = Sudoku.substraction(block);
    return [isFitBlock, restNumbers];
  }

  // 종합 검증
  totalCorrectInPlace(y, x, number) {
    const [isFitRow, rows] = this.isCorrectInRow(y, number);
    const [isFitColumn, columns] = this.isCorrectInColumn(x, number);
    const [isFitBlock, blocks] = this.isCorrectInBlock(y, x, number);

    return isFitRow && isFitColumn && isFitBlock;
  }

  // 스도쿠 보드 클리어
  clearBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // 타일 렌더
  render() {
    const baseX = canvas.width / 2 - (this.rows.length / 2) * TILE_SIZE_X;
    const baseY =
      canvas.height / 2 - (this.rows[0].tiles.length / 2) * TILE_SIZE_Y;
    const left = canvas.width / 2 - (this.rows.length / 2) * TILE_SIZE_X;
    const top =
      canvas.height / 2 - (this.rows[0].tiles.length / 2) * TILE_SIZE_Y;
    const right = left + TILE_SIZE_X * WIDTH * BLOCK_WIDTH;
    const bottom = top + TILE_SIZE_Y * HEIGHT * BLOCK_HEIGHT;

    // click marking
    if (on.selected) {
      ctx.fillStyle = SELECTED_COLOR;
      ctx.fillRect(
        on.selected[0] * TILE_SIZE_X + baseX,
        on.selected[1] * TILE_SIZE_Y + baseY,
        TILE_SIZE_X,
        TILE_SIZE_Y
      );
      ctx.fillStyle = INITIAL_COLOR;
    }
    // insert correct marking
    if (correct.number && correct.place) {
      ctx.fillStyle = CORRECT_COLOR;
      ctx.fillRect(
        correct.place[1] * TILE_SIZE_X + baseX,
        correct.place[0] * TILE_SIZE_Y + baseY,
        TILE_SIZE_X,
        TILE_SIZE_Y
      );
      ctx.fillStyle = INITIAL_COLOR;
    }

    /* 틀린 부분의 좌표에서 row, column 표시 */
    if (wrong.place) {
      ctx.fillStyle = WRONG_COLOR;
      /* row marker */
      ctx.fillRect(
        left,
        Number(wrong.place[0]) * TILE_SIZE_Y +
          canvas.height / 2 -
          (this.rows[0].tiles.length / 2) * TILE_SIZE_Y,
        right - left,
        TILE_SIZE_Y
      );

      /* column marker */
      ctx.fillRect(
        Number(wrong.place[1]) * TILE_SIZE_X +
          canvas.width / 2 -
          (this.rows.length / 2) * TILE_SIZE_X,
        top,
        TILE_SIZE_X,
        bottom - top
      );
      ctx.fillStyle = INITIAL_COLOR;
    }

    for (let y in this.rows) {
      const row = this.rows[y];

      // tie renlder
      for (let x in row.tiles) {
        const tile = row.tiles[x];

        /* wrong marker */
        if (wrong.number) {
          if (row.tiles[x].number === wrong.number) {
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

        /* on.selected marker */
        if (
          on.selected &&
          row.tiles[x].number !== 0 &&
          row.tiles[x].number ===
            this.rows[on.selected[1]].tiles[on.selected[0]].number
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
        if (tile.number !== 0) {
          ctx.fillStyle = tile.origin ? INITIAL_COLOR : NEW_VALUE_COLOR;
          ctx.fillText(
            tile.number,
            x * TILE_SIZE_X + baseX + TILE_SIZE_X / 2,
            y * TILE_SIZE_Y + baseY + TILE_SIZE_Y / 2 + FONT_SIZE / 3
          );
          ctx.font = `${FONT_SIZE}px bold`;
        }
      }
    }
    /* validation for tile counter */
    this.validation(this);
  }

  // 타일 현황 검증
  validation(list) {
    for (let [key, value] of tileNumbers.entries()) {
      tileNumberCompares.set(key, value);
    }
    for (let i = 0; i < list.rows.length; i++) {
      for (let j = 0; j < list.rows[i].tiles.length; j++) {
        if (list.rows[i].tiles[j].number > 0) {
          this.tileCountDown(list.rows[i].tiles[j].number);
        }
      }
    }
  }

  // 타일 카운트 감소
  tileCountDown(key) {
    if (tileNumberCompares.get(key) > 0) {
      tileNumberCompares.set(key, tileNumberCompares.get(key) - 1);
    }
  }

  // 깊은 복사
  static deepCopy(oldSudoku) {
    return new Sudoku(
      ...oldSudoku.rows.map(
        (/** @type {Row} */ row) => row.deepCopy()
        // row.map((oldTile) => new Row().copy(oldTile))
      )
    );
  }

  // 배열 차집합
  static substraction(/** @type {Row} */ row) {
    return NUMBER_RESOURCES.reduce((acc, cur) => {
      if (row.isFitNumber(cur)) {
        acc.push(cur);
      }
      return acc;
    }, []);
  }
}
