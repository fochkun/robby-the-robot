import { Component, OnInit } from '@angular/core';
import { Point, Direction, createDirection, Actions } from '../../model/pole-utils';

@Component({
  selector: 'app-robby-the-robot',
  templateUrl: './robby-the-robot.component.html',
  styleUrls: ['./robby-the-robot.component.less']
})
export class RobbyTheRobotComponent implements OnInit {
  public position: Point;
  public direction: Direction;
  private actions: { [action: string]: () => void } = {};


  constructor() {
    this.direction = createDirection();
    // some closures
    this.actions[Actions.moveForvard] = () => { this.moveForvard(); };
    this.actions[Actions.turnLeft] = () => { this.rotateLeft(); };
    this.actions[Actions.turnRight] = () => { this.rotateRight(); };

  }

  public get forvardPosition(): Point {
    return {
      x: this.position.x + this.direction.modifier.x,
      y: this.position.y + this.direction.modifier.y
    };
  }

  ngOnInit() {
  }

  rotateRight() {
    if (this.direction.rotateRight) {
      this.direction = this.direction.rotateRight;
    }
  }

  rotateLeft() {
    if (this.direction.rotateLeft) {
      // console.log('rotate left', this.direction);
      this.direction = this.direction.rotateLeft;
      // console.log('rotate left:after', this.direction);
    }
  }

  moveForvard() {
    console.log('hero moved forward');
    this.position.x += this.direction.modifier.x;
    this.position.y += this.direction.modifier.y;
  }

  makeAction(action: Actions): boolean {
    if (this.actions[action]) {
      this.actions[action]();
      return true;
    }
    return false;

  }

}
