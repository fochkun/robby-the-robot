import { Component, OnInit } from '@angular/core';
import { MazeInfoService } from '../../services/maze-info.service';
import { FormControl } from '@angular/forms';
import { MazeSolver } from '../../model/maze-solver';

@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.less']
})
export class DataEntryComponent implements OnInit {

  constructor(public mazeInfo: MazeInfoService) {
    console.log('rows', mazeInfo.rows);
  }

  ngOnInit() {
  }

  addRows(val: number) {
    this.mazeInfo.rows = this.mazeInfo.rows + val;
    this.redrawMaze();
  }

  addColumns(val: number) {
    this.mazeInfo.columns = this.mazeInfo.columns + val;
    this.redrawMaze();
  }
  addEnergy(val: number) {
    this.mazeInfo.energy = this.mazeInfo.energy + val;
    this.mazeInfo.energy = this.mazeInfo.energy < 0 ? 0 : this.mazeInfo.energy;
  }

  redrawMaze() {
    this.mazeInfo.redrawMaze();
  }
  toggleTile(x: number, y: number) {
    this.mazeInfo.togglePlate({ x, y });
  }

  findExit() {
    console.log('try to find exit');
    new MazeSolver(this.mazeInfo).solveMaze(this.mazeInfo.maze);
  }

}
