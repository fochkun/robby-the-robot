import { Component, OnInit } from '@angular/core';
import { MazeInfoService } from '../../services/maze-info.service';
import { FormControl } from '@angular/forms';

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
    console.log({ val, rows: this.mazeInfo.rows });
    this.mazeInfo.rows = this.mazeInfo.rows + val;
    this.redrawMaze();
  }

  addColumns(val: number) {
    console.log({ val, columns: this.mazeInfo.columns });
    this.mazeInfo.columns = this.mazeInfo.columns + val;
    this.redrawMaze();
  }
  addEnergy(val: number) {
    console.log({ val, energy: this.mazeInfo.energy });
    this.mazeInfo.energy = this.mazeInfo.energy + val;
    this.mazeInfo.energy = this.mazeInfo.energy < 0 ? 0 : this.mazeInfo.energy;
  }

  redrawMaze() {
    this.mazeInfo.redrawMaze();
  }
  toggleTile(x: number, y: number) {
    this.mazeInfo.togglePlate({ x, y });
  }

}
