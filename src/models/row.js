import { Tile } from "./tile";

export class Row {
  tiles = [];
  constructor(...tiles) {
    this.tiles.push(
      ...tiles.map((tile) =>
        tile instanceof Tile ? tile : new Tile(tile, tile !== 0)
      )
    );
  }

  getColumns(x) {}

  isFitNumber(number) {
    return this.tiles.findIndex((tile) => tile.number === number) === -1;
  }

  deepCopy() {
    return this.tiles.map((/** @type {Tile} */ oldTile) =>
      new Tile().copy(oldTile)
    );
  }
}
