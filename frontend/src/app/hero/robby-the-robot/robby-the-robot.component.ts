import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { Point, Direction, createDirection, Actions } from '../../model/pole-utils';

@Component({
  selector: 'app-robby-the-robot',
  templateUrl: './robby-the-robot.component.html',
  styleUrls: ['./robby-the-robot.component.less']
})
export class RobbyTheRobotComponent implements OnInit, AfterViewInit {

  @Input('control') robbyIOC: { robby: RobbyTheRobotComponent };

  private readonly offset = 50;

  private _position: Point;
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
      x: this._position.x + this.direction.modifier.x,
      y: this._position.y + this.direction.modifier.y
    };
  }

  public set position(val: Point) {
    this._position = val;
    this.update();
  }
  public get position(): Point {
    return this._position;
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.robbyIOC.robby = this;
    console.log('robby is in ioc');
  }

  update() {
    const robby = document.getElementById('robby-container');
    console.log('update, robby is', robby);
    if (robby) {
      robby.setAttribute("style", "top:" + (this.position.y * this.offset) +
        "px; left: " + (this.position.x * this.offset) + "px;");
      // robby.style.top = '' + (this.position.y * this.offset) + ' px';
      // robby.style.left = '' + (this.position.x * this.offset) + ' px';
    }
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
    this._position.x += this.direction.modifier.x;
    this._position.y += this.direction.modifier.y;
    this.update();
  }

  makeAction(action: Actions): boolean {
    if (this.actions[action]) {
      this.actions[action]();
      return true;
    }
    return false;

  }

}
