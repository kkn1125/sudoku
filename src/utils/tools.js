/* animation */
export const WIDTH = 3;
export const HEIGHT = 3;
export const BLOCK_WIDTH = 3;
export const BLOCK_HEIGHT = 3;
export const TILE_SIZE_X = 50;
export const TILE_SIZE_Y = 50;

/* clickable */
export const on = {
  tile: null,
  selectTile: null,
  selected: null,
  deletion: false,
};

// 기본 스도쿠 출력 넘버 배열
export const NUMBER_RESOURCES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// 옳은 값 컬러
export const CORRECT_COLOR = "#00772250";
// 잘못된 값 컬러
export const WRONG_COLOR = "#84112270";
// 호버링 컬러
export const HOVERING_COLOR = "#77777756";
// 선택한 숫자 마킹 컬러
export const SELECTED_COLOR = "#84253240";
// 선택한 숫자와 같은 수 마킹 컬러
export const SAME_NUMBER_MARK_COLOR = "#84253230";
// 해당 숫자 모두 사용했을 때 컬러
export const EMPTY_NUMBER_COLOR = "#00000070";
// 초기화 컬러
export const INITIAL_COLOR = "#000000";
// 초기화 컬러
export const NEW_VALUE_COLOR = "#009922";
// stroke color
export const STROKE_COLOR = "#777777";
// font size
export const FONT_SIZE = 16;
// PAD RATIO
export const PAD_RATIO = 0.06;

/* correct / wrong value */
// 옳은 값 좌표
export const correct = { number: null, place: null };
// let correctPlace = null;
// 잘못된 값 좌표
export const wrong = { number: null, place: null, count: 0 };
// let wrongPlace = null;
export const INSERT_WRONG_LIMIT = 3;

export const tileNumbers = new Map([
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

/* resize ratio values */
export const max = 1;
export const mid = 0.8;
export const min = 0.6;

// 타일 카운터 복사본
export const tileNumberCompares = new Map(tileNumbers.entries());

export const $ = (el) => document.querySelector(el);

/** @type {HTMLElement} */
export const app = $("#app");
/** @type {HTMLCanvasElement } */
export const canvas = document.createElement("canvas");
/** @type {CanvasRenderingContext2D } */
export const ctx = canvas.getContext("2d");
