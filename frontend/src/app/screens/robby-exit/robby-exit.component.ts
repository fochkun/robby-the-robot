import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MazeInfoService } from '../../services/maze-info.service';
import { Title } from '@angular/platform-browser';
import { MazeSolver, Solutions, Transition } from '../../model/maze-solver';
import { RobbyTheRobotComponent } from '../../hero/robby-the-robot/robby-the-robot.component';

@Component({
  selector: 'app-robby-exit',
  templateUrl: './robby-exit.component.html',
  styleUrls: ['./robby-exit.component.less']
})
export class RobbyExitComponent implements OnInit, AfterViewInit {

  public robbyActionSpeed = 200;
  public title = '';
  private mazeSolver: MazeSolver;
  private isActing = false;
  public iocContainer: { robby: RobbyTheRobotComponent } = { robby: new RobbyTheRobotComponent() };

  constructor(public mazeInfo: MazeInfoService) {
    this.mazeSolver = new MazeSolver(mazeInfo);
    this.title = mazeInfo.solution ? Solutions[this.mazeSolver.checkSolution(mazeInfo.solution)] : '';
  }

  ngOnInit() {
    this.isActing = false;
  }
  ngAfterViewInit() {
    const startPoint = this.mazeSolver.findStartPlate(this.mazeInfo.maze);
    this.iocContainer.robby.position = { x: startPoint.x, y: startPoint.y };
  }
  exitMaze() {
    let actions = this.mazeSolver.getSolutionSteps(this.mazeInfo.solution);
    actions.length = this.mazeInfo.energy < actions.length ? this.mazeInfo.energy : actions.length;
    if (!this.isActing) {
      this.makeActions(actions);
    }
  }
  makeActions(actions: Transition[]) {
    this.isActing = true;
    if (actions.length == 0) {
      return;
    }
    if (this.iocContainer.robby) {
      this.iocContainer.robby.makeAction(actions.shift().action);
    }
    if (actions.length > 0) {
      setTimeout(() => {
        this.makeActions(actions);
      }, this.robbyActionSpeed);
    } else {
      this.isActing = false;
    }
  }





}
