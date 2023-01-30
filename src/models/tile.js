export class Tile {
  staticNum = 0;
  number = 0;
  origin = false;
  memo = [];
  hide = false;
  constructor(number = 0, origin = false, hide = false) {
    this.staticNum = number;
    this.number = number;
    this.origin = origin;
    this.hide = hide;
  }
  copy(oldTile) {
    this.number = oldTile.number;
    this.origin = oldTile.origin;
    this.memo = oldTile.memo.slice(0);
    return this;
  }
  setNumber(number) {
    this.number = number;
  }
  deleteNumber() {
    this.number = 0;
  }

  setMemo(number) {
    if (!this.memo.includes(number)) this.memo.push(number);
  }
  deleteMemo(number) {
    try {
      this.memo.splice(this.memo.findIndex(number), 1);
      return true;
    } catch (e) {
      console.log("존재하지 않는 수 입니다.", number);
      return false;
    }
  }
}
