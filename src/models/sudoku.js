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
  max,
  mid,
  min,
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
import { Tile } from "./tile";

class NumberPad {
  render(sudoku) {
    const resizeRatio =
      canvas.width >= 768
        ? max
        : canvas.width < 768 && canvas.width >= 594
        ? mid
        : min;
    try {
      const sortedNumbers = NUMBER_RESOURCES.sort();
      const left =
        canvas.width / 2 - (sudoku.rows.length / 2) * TILE_SIZE_X * resizeRatio;
      const top =
        canvas.height / 2 -
        (sudoku.rows[0].tiles.length / 2) * TILE_SIZE_Y * resizeRatio;
      const right = left + TILE_SIZE_X * resizeRatio * WIDTH * BLOCK_WIDTH;
      const bottom = top + TILE_SIZE_Y * resizeRatio * HEIGHT * BLOCK_HEIGHT;
      // 숫자 패드 스도쿠 간격 조절
      const PAD_FROM_RIGHT = canvas.width * 0.06;
      // number delete button
      ctx.fillStyle = WRONG_COLOR;
      ctx.fillRect(
        right + PAD_FROM_RIGHT - TILE_SIZE_X * resizeRatio,
        top,
        TILE_SIZE_X * resizeRatio,
        TILE_SIZE_Y * resizeRatio
      );
      ctx.fillStyle = INITIAL_COLOR;
      ctx.textAlign = "center";
      ctx.font = `${FONT_SIZE}px bold`;
      ctx.fillText(
        "❌",
        right +
          PAD_FROM_RIGHT -
          TILE_SIZE_X * resizeRatio +
          (TILE_SIZE_X * resizeRatio) / 2,
        top + (TILE_SIZE_Y * resizeRatio) / 2 + FONT_SIZE / 3
      );
      ctx.font = `${FONT_SIZE - 6}px bold`;

      ctx.fillStyle = INITIAL_COLOR;
      for (let index in sortedNumbers) {
        const number = sortedNumbers[index];
        if (tileNumberCompares.get(number) === 0) {
          ctx.fillStyle = EMPTY_NUMBER_COLOR;
          ctx.fillRect(
            right + PAD_FROM_RIGHT,
            top + TILE_SIZE_Y * resizeRatio * index,
            TILE_SIZE_X * resizeRatio,
            TILE_SIZE_Y * resizeRatio
          );
          ctx.fillStyle = INITIAL_COLOR;
        }
        ctx.strokeRect(
          right + PAD_FROM_RIGHT,
          top + TILE_SIZE_Y * resizeRatio * index,
          TILE_SIZE_X * resizeRatio,
          TILE_SIZE_Y * resizeRatio
        );
        ctx.textAlign = "center";
        ctx.font = `${FONT_SIZE}px bold`;
        ctx.fillText(
          number,
          (TILE_SIZE_X * resizeRatio) / 2 + right + PAD_FROM_RIGHT,
          (TILE_SIZE_Y * resizeRatio) / 2 +
            top +
            FONT_SIZE / 3 +
            TILE_SIZE_Y * resizeRatio * index
        );
        ctx.font = `${FONT_SIZE - 6}px bold`;
        ctx.fillText(
          tileNumberCompares.get(number) + "개 남음",
          (TILE_SIZE_X * resizeRatio) / 2 +
            right +
            PAD_FROM_RIGHT +
            TILE_SIZE_X * resizeRatio * 1.3,
          (TILE_SIZE_Y * resizeRatio) / 2 +
            top +
            FONT_SIZE / 3 +
            TILE_SIZE_Y * resizeRatio * index
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
  level = {
    newbie: 40,
    low: 30,
    middel: 20,
    high: 10,
  };
  currentLevel = "newbie";

  constructor(...rows) {
    this.rows.push(
      ...rows.map((row) => (row instanceof Row ? row : new Row(...row)))
    );
    this.setLevel();
  }

  setLevel(level = "newbie") {
    this.currentLevel = level;
  }

  static randomSources() {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    return Sudoku.sorting(array);
  }
  static sorting(array) {
    return array.sort(() =>
      parseInt((Math.random() * 9).toString()) % 3 == 0 ? 1 : -1
    );
  }
  static randomize(array) {
    // return array.sort(() =>
    //   parseInt((Math.random() * 9).toString()) % 3 == 0 ? 1 : -1
    // );
    console.log(123);
    const suffle1 = array
      .slice(3, 6)
      .concat(...array.slice(0, 3))
      .concat(...array.slice(6, 9));
    for (let i in suffle1) {
      for (let j in suffle1[i]) {
        if (j % 3 === 0) {
          let temp = suffle1[i].tiles[j];
          suffle1[i].tiles[j] = suffle1[i * 3 + 2];
          suffle1[i * 3 + 2] = temp;
        }
      }
      suffle1[i].tiles = suffle1[i].tiles
        .slice(3, 6)
        .concat(...suffle1[i].tiles.slice(0, 3))
        .concat(...suffle1[i].tiles.slice(6, 9));
    }
    return suffle1;
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
    this.level = {
      newbie: 40,
      low: 30,
      middel: 20,
      high: 10,
    };
  }

  fillRandoms() {
    const temp = new Map([
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
    console.log(123);
    const filter = () =>
      Array.from(temp.entries())
        .filter(([a, b]) => b > 0)
        .map(([a]) => a);
    let filtered = filter();
    let randomKey =
      filtered[parseInt((Math.random() * filtered.length).toString())];
    const loopCount = 1;
    for (let i = 0; i < this.rows.length; i++) {
      for (let j = 0; j < this.rows[i].tiles.length; j++) {
        if (this.rows[i].tiles[j] > 0) continue;
        if (this.totalCorrectInPlace(i, j, randomKey)) {
          if (temp.get(randomKey) > 0) {
            this.rows[i].tiles[j] = new Tile(randomKey, true);
            temp.set(randomKey, temp.get(randomKey) - 1);
          } else {
            continue;
          }
        } else {
          continue;
        }
      }
      // filtered = filter();
      // randomKey =
      //   filtered[parseInt((Math.random() * filtered.length).toString())];
    }
    // for (let i in this.rows) {
    //   for (let j in this.rows[i].tiles) {
    //     const random1 = this.getCorrectNumber(i, j);
    //     // const random2 = this.getCorrectNumber(j, i);
    //     this.rows[i].tiles[j] = new Tile(random1, random1 > 0);
    //     this.rows[8 - i].tiles[8 - j] = new Tile(random1, random1 > 0);
    //   }
    // }
    return this;
  }

  getCorrectNumber(y, x) {
    const temp = [];
    for (let number = 1; number <= 9; number++) {
      const isCorrect = this.totalCorrectInPlace(y, x, number);
      if (isCorrect) {
        temp.push(number);
      }
    }
    const randNum = parseInt((Math.random() * temp.length).toString());
    return temp.splice(randNum)[0];
  }

  // 랜덤 스도쿠 생성
  fillNumbers(source, suffle = false) {
    const currentLevel = this.currentLevel;
    let numbers = source || NUMBER_RESOURCES;
    for (let i = 0; i < this.rows.length; i++) {
      if (i > 0 && i % 3 === 0) {
        numbers = numbers.slice(4).concat(numbers.slice(0, 4));
      }
      for (let j = 0; j < this.rows[i].tiles.length; j++) {
        let rand = parseInt(
          Math.random() * (this.rows.length * this.rows[i].tiles.length)
        );
        const isNotZero = rand % 2 === 0;
        this.rows[i].tiles[j] = new Tile(
          numbers[(j + i * 3) % 9],
          this.level[currentLevel] > 0 ? !isNotZero : true,
          this.level[currentLevel] > 0 ? isNotZero : false
        );
        // this.tileCountDown(this.rows[i].tiles[j]);
        if (this.level[currentLevel] > 0) {
          this.level[currentLevel] -= 1;
        }
      }
    }
    if (suffle) {
      this.rows = Sudoku.randomize(this.rows);
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
    const resizeRatio =
      canvas.width >= 768
        ? max
        : canvas.width < 768 && canvas.width >= 594
        ? mid
        : min;
    const baseX =
      canvas.width / 2 - (this.rows.length / 2) * TILE_SIZE_X * resizeRatio;
    const baseY =
      canvas.height / 2 -
      (this.rows[0].tiles.length / 2) * TILE_SIZE_Y * resizeRatio;
    const left =
      canvas.width / 2 - (this.rows.length / 2) * TILE_SIZE_X * resizeRatio;
    const top =
      canvas.height / 2 -
      (this.rows[0].tiles.length / 2) * TILE_SIZE_Y * resizeRatio;
    const right = left + TILE_SIZE_X * resizeRatio * WIDTH * BLOCK_WIDTH;
    const bottom = top + TILE_SIZE_Y * resizeRatio * HEIGHT * BLOCK_HEIGHT;

    // click marking
    if (on.selected) {
      ctx.fillStyle = SELECTED_COLOR;
      ctx.fillRect(
        on.selected[0] * TILE_SIZE_X * resizeRatio + baseX,
        on.selected[1] * TILE_SIZE_Y * resizeRatio + baseY,
        TILE_SIZE_X * resizeRatio,
        TILE_SIZE_Y * resizeRatio
      );
      ctx.fillStyle = INITIAL_COLOR;
    }
    // insert correct marking
    if (correct.number && correct.place) {
      ctx.fillStyle = CORRECT_COLOR;
      ctx.fillRect(
        correct.place[1] * TILE_SIZE_X * resizeRatio + baseX,
        correct.place[0] * TILE_SIZE_Y * resizeRatio + baseY,
        TILE_SIZE_X * resizeRatio,
        TILE_SIZE_Y * resizeRatio
      );
      ctx.fillStyle = INITIAL_COLOR;
    }

    /* 틀린 부분의 좌표에서 row, column 표시 */
    if (wrong.place) {
      ctx.fillStyle = WRONG_COLOR;
      /* row marker */
      ctx.fillRect(
        left,
        Number(wrong.place[0]) * TILE_SIZE_Y * resizeRatio +
          canvas.height / 2 -
          (this.rows[0].tiles.length / 2) * TILE_SIZE_Y * resizeRatio,
        right - left,
        TILE_SIZE_Y * resizeRatio
      );

      /* column marker */
      ctx.fillRect(
        Number(wrong.place[1]) * TILE_SIZE_X * resizeRatio +
          canvas.width / 2 -
          (this.rows.length / 2) * TILE_SIZE_X * resizeRatio,
        top,
        TILE_SIZE_X * resizeRatio,
        bottom - top
      );
      ctx.fillStyle = INITIAL_COLOR;
    }

    for (let y in this.rows) {
      const row = this.rows[y];

      // tile render
      for (let x in row.tiles) {
        const tile = row.tiles[x];

        /* wrong marker */
        if (wrong.number) {
          if (row.tiles[x].number === wrong.number) {
            ctx.fillStyle = WRONG_COLOR;
            ctx.fillRect(
              x * TILE_SIZE_X * resizeRatio + baseX,
              y * TILE_SIZE_Y * resizeRatio + baseY,
              TILE_SIZE_X * resizeRatio,
              TILE_SIZE_Y * resizeRatio
            );
            ctx.fillStyle = INITIAL_COLOR;
          }
        }

        /* on.selected marker */
        // row와 this.rows의 hide를 크로스체크해야 숨겨진 넘버 셀렉트 하지 않음
        if (
          on.selected &&
          !this.rows[on.selected[1]].tiles[on.selected[0]].hide &&
          !row.tiles[x].hide
        ) {
          if (
            on.selected &&
            row.tiles[x].number !== 0 &&
            row.tiles[x].number ===
              this.rows[on.selected[1]].tiles[on.selected[0]].number
          ) {
            ctx.fillStyle = SAME_NUMBER_MARK_COLOR;
            ctx.fillRect(
              x * TILE_SIZE_X * resizeRatio + baseX,
              y * TILE_SIZE_Y * resizeRatio + baseY,
              TILE_SIZE_X * resizeRatio,
              TILE_SIZE_Y * resizeRatio
            );
            ctx.fillStyle = INITIAL_COLOR;
          }
        }
        // if (on.selected) {
        //   console.log(this.rows[on.selected[1]].tiles[on.selected[0]]);
        // }

        /* 3x3 block outline */
        if (x % 3 === 0 && y % 3 === 0) {
          ctx.strokeRect(
            parseInt(x / 3) - 1 + baseX + x * TILE_SIZE_X * resizeRatio,
            parseInt(y / 3) - 1 + baseY + y * TILE_SIZE_Y * resizeRatio,
            TILE_SIZE_X * resizeRatio * 3,
            TILE_SIZE_Y * resizeRatio * 3
          );
        }

        /* each tile outline */
        ctx.strokeStyle = STROKE_COLOR;
        ctx.strokeRect(
          x * TILE_SIZE_X * resizeRatio + baseX,
          y * TILE_SIZE_Y * resizeRatio + baseY,
          TILE_SIZE_X * resizeRatio,
          TILE_SIZE_Y * resizeRatio
        );

        // text hide
        if (tile.hide) continue;
        /* text in tile */
        if (tile.number !== 0) {
          ctx.fillStyle = tile.origin ? INITIAL_COLOR : NEW_VALUE_COLOR;
          ctx.fillText(
            tile.number,
            x * TILE_SIZE_X * resizeRatio +
              baseX +
              (TILE_SIZE_X * resizeRatio) / 2,
            y * TILE_SIZE_Y * resizeRatio +
              baseY +
              (TILE_SIZE_Y * resizeRatio) / 2 +
              FONT_SIZE / 3
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
        if (list.rows[i].tiles[j].number > 0 && !list.rows[i].tiles[j].hide) {
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
