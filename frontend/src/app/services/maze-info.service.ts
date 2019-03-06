import { Injectable } from '@angular/core';
import { Point, Fields } from '../model/pole-utils';
import { GuardsCheckStart } from '@angular/router';
import { Transition } from '../model/maze-solver';

@Injectable()
export class MazeInfoService {

  public readonly minRows = 2;
  public readonly maxRows = 20;
  public readonly minColumns = 2;
  public readonly maxColumns = 10;
  public solution: Transition[][];
  private _rows = 2;
  private _columns = 2;
  public energy = 5;
  private _maze: Array<Array<Fields>> = [[]];

  // I can use enum, but I wan't
  poleTypes = {};
  poleNumberTypes: Array<string> = [Fields.start, Fields.target, Fields.walkable, Fields.blocked];


  constructor() {
    this.redrawMaze();
    this.poleTypes[Fields.start] = 0;
    this.poleTypes[Fields.target] = 1;
    this.poleTypes[Fields.walkable] = 2;
    this.poleTypes[Fields.blocked] = 3;
  }

  public set rows(val: number) {
    if (val <= this.maxRows && val >= this.minRows) {
      this._rows = val;
    }
  }

  public get rows(): number {
    return this._rows;
  }


  public set columns(val: number) {
    if (val <= this.maxColumns && val >= this.minColumns) {
      this._columns = val;
    }
  }

  public get columns(): number {
    return this._columns;
  }

  public get maze(): Array<Array<Fields>> {
    return this._maze;
  }

  public redrawMaze() {

    // check columns
    if (this._maze.length > this._columns) {
      this._maze.length = this._columns;
    } else {
      for (let idx = this._maze.length; idx < this._columns; idx++) {
        this._maze.push([]);
      }
    }

    // check rows
    for (let column of this._maze) {
      if (column.length > this._rows) {
        column.length = this._rows;
      } else {
        for (let idx = column.length; idx < this._rows; idx++) {
          column.push(Fields.walkable);
        }
      }
    }
  }

  togglePlate(point: Point) {
    console.log('toggle tile');

    const plate = this._maze[point.x][point.y];
    if (plate == undefined) {
      return;
    }
    const nextPlate = this.poleTypes[plate] + 1 < this.poleNumberTypes.length
      ? this.poleNumberTypes[this.poleTypes[plate] + 1]
      : this.poleNumberTypes[0];
    this._maze[point.x][point.y] = nextPlate === Fields.start
      || nextPlate === Fields.target
      || nextPlate === Fields.walkable
      || nextPlate === Fields.blocked
      ? nextPlate : Fields.walkable;
    if (this.checkSymbolRepeating(point, [Fields.start, Fields.target])) {
      this.togglePlate(point);
    }
  }

  /**
   *
   *
   * @param point
   * @param checkArray
   * @returns true, if any symbol of checkArray symbols con
   */
  checkSymbolRepeating(point: Point, checkArray: Array<Fields>): boolean {
    // tslint:disable-next-line:forin
    for (let symbolIndex in checkArray) {
      let repeat = 0;
      for (let column of this._maze) {
        for (let plate of column) {
          if (plate == checkArray[symbolIndex]) {
            repeat += 1;
          }
          if (repeat >= 2) {
            return true;
          }
        }
      }
    }
    return false;
  }


}
