import { Injectable } from '@angular/core';
import { Point } from '../model/pole-utils';

@Injectable()
export class MazeInfoService {

  public readonly minRows = 2;
  public readonly maxRows = 20;
  public readonly minColumns = 2;
  public readonly maxColumns = 10;
  private _rows = 2;
  private _columns = 2;
  public energy = 1;
  private maze: Array<Array<'S' | 'F' | '.' | '#'>> = [[]];

  // I can use enum, but I wan't
  poleTypes = { 'S': 0, 'F': 1, '.': 2, '#': 3 };
  poleNumberTypes: Array<string> = ['S', 'F', '.', '#'];


  constructor() {
    this.redrawMaze();
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

  public redrawMaze() {

    //check columns
    if (this.maze.length > this._columns) {
      this.maze.length = this._columns;
    } else {
      for (let idx = this.maze.length; idx < this._columns; idx++) {
        this.maze.push([]);
      }
    }

    //check rows
    for (let column of this.maze) {
      if (column.length > this._rows) {
        column.length = this._rows;
      } else {
        for (let idx = column.length; idx < this._rows; idx++) {
          column.push('.');
        }
      }
    }
    console.log({ maze: this.maze });
  }

  togglePlate(point: Point) {
    console.log('toggle tile');

    const plate = this.maze[point.x][point.y];
    if (plate == undefined) {
      return;
    }
    const nextPlate = this.poleTypes[plate] + 1 < this.poleNumberTypes.length
      ? this.poleNumberTypes[this.poleTypes[plate] + 1]
      : this.poleNumberTypes[0];
    this.maze[point.x][point.y] = nextPlate === 'S' || nextPlate === 'F' || nextPlate === '.' || nextPlate === '#' ? nextPlate : '.';
  }


}
