import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MazeInfoService } from '../../services/maze-info.service';
import { Title } from '@angular/platform-browser';
import { MazeSolver, Solutions, Transition } from '../../model/maze-solver';
import { RobbyTheRobotComponent } from '../../hero/robby-the-robot/robby-the-robot.component';
import { Point, Direction, createDirection } from '../../model/pole-utils';
import { reject } from 'q';

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
  private startPoint: Point;
  private startDirection: Direction;

  constructor(public mazeInfo: MazeInfoService) {
    this.mazeSolver = new MazeSolver(mazeInfo);
    this.title = mazeInfo.solution ? Solutions[this.mazeSolver.checkSolution(mazeInfo.solution)] : '';
    this.startPoint = this.mazeSolver.findStartPlate(this.mazeInfo.maze);
    this.startDirection = createDirection(this.iocContainer.robby.direction.name);
  }

  ngOnInit() {
    this.isActing = false;
  }
  ngAfterViewInit() {
    this.startDirection = createDirection(this.iocContainer.robby.direction.name);
    this.startPoint = this.mazeSolver.findStartPlate(this.mazeInfo.maze);
    this.iocContainer.robby.position = { x: this.startPoint.x, y: this.startPoint.y };
  }
  exitMaze() {
    let actions = this.mazeSolver.getSolutionSteps(this.mazeInfo.solution);
    actions.length = this.mazeInfo.energy < actions.length ? this.mazeInfo.energy : actions.length;
    if (!this.isActing) {
      if (this.robbyOnStart()) {
        this.makeActions(actions);
      } else {
        this.moveRobbyToStart().then(() => {
          this.makeActions(actions);
        });
      }
    }
  }

  robbyOnStart(): boolean {
    const robby = this.iocContainer.robby;
    return (robby.position.x == this.startPoint.x) &&
      (robby.position.y == this.startPoint.y);
  }
  moveRobbyToStart(): Promise<any> {
    const robby = this.iocContainer.robby;
    const result: Promise<any> = new Promise<any>((resolve) => {
      robby.visible = false;
      setTimeout(() => {
        robby.position.x = this.startPoint.x;
        robby.position.y = this.startPoint.y;
        robby.direction = this.startDirection;
        setTimeout(() => {
          robby.visible = true;
          setTimeout(() => {
            resolve(true);
          }, 200);
        }, 200);
      }, 200);
    });
    return result;

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
