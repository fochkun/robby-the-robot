import { MazeInfoService } from '../services/maze-info.service';
import { Fields, Point, Direction, Actions, createDirection } from './pole-utils';
import { RobbyTheRobotComponent } from '../hero/robby-the-robot/robby-the-robot.component';
import { tick } from '@angular/core/testing';
import { transition } from '@angular/core';

const ACTIONS = [Actions.moveForvard, Actions.turnLeft, Actions.turnRight];

export const Solutions = {
    0: 'Robby can\'t exit',
    1: 'Robby have no energy to exit',
    2: 'Robby have find the exit',
    noExit: 0,
    noEnergy: 1,
    exitFind: 2,
}
export class MazeSolver {
    private maze: Array<Array<MazeDirectionalPlate>>;
    private mazeSteps: Array<Array<Transition>> = [];
    private step = 0;
    // private steps=[];
    private mockRobby: RobbyTheRobotComponent;

    constructor(private mazeInfo: MazeInfoService) {
        this.mockRobby = new RobbyTheRobotComponent();
    }

    solveMaze(maze: Array<Array<Fields>>) {
        this.mockRobby = new RobbyTheRobotComponent();
        this.maze = this.createMaze(maze);
        const startPoint: Point = this.findStartPlate(maze);
        const finishPlate = this.findEndPlate(maze);
        const startDirection = this.mockRobby.direction;
        let actionDone = true;
        this.mockRobby.position = startPoint;
        this.mazeSteps.push([]);
        this.mazeSteps[0].push({
            step: this.step,
            to: { direction: startDirection.name, position: { x: startPoint.x, y: startPoint.y } },
            isFinal: false,
        });
        console.log({ mazeSteps: this.mazeSteps, maze: this.maze });
        this.maze[startPoint.x][startPoint.y][startDirection.name] = 0;
        while (!(this.comparePoints(this.mockRobby.position, finishPlate) || !actionDone)) {
            console.log('another try', this.step);
            actionDone = false;
            for (let transition of this.mazeSteps[this.step]) {
                if (this.comparePoints(this.mockRobby.position, finishPlate)) { // to prevent next actions if robby have find the exit
                    console.log('\n\n\nexit is found\n\n\n');
                    break;
                }
                ACTIONS.forEach((action: Actions) => {  // make all possible actions in point and check them for success
                    if (this.comparePoints(this.mockRobby.position, finishPlate)) { // to prevent next actions if robby have find the exit
                        console.log('\n\n\nexit is found\n\n\n');
                        return;
                    }
                    this.mockRobby.position.x = transition.to.position.x;
                    this.mockRobby.position.y = transition.to.position.y;
                    this.mockRobby.direction = createDirection(transition.to.direction); // this part can eat all your memory

                    if (this.mockRobby.makeAction(action)) {
                        const isSuccess = this.checkAction(action);
                        actionDone = actionDone ? actionDone : isSuccess;    // if done any unblocked action on this
                        // step, then next step is enable
                        if (isSuccess) {
                            this.addNewStepInfo({
                                action,
                                isFinal: this.comparePoints(this.mockRobby.position, finishPlate),
                                step: this.step + 1,
                                to: {
                                    direction: this.mockRobby.direction.name,
                                    position: { x: this.mockRobby.position.x, y: this.mockRobby.position.y }
                                },
                                from: transition.to,
                                prev: transition
                            });

                            console.log('currentPosition is ', this.mockRobby.position);
                        }
                    }
                });
            }
            ++this.step;
        }
        console.log({ mazeSteps: this.mazeSteps, maze: this.maze });
        return this.mazeSteps;
    }


    /**
     * check's maze steps array for solution
     * @param mazeStepsArray 
     * @returns number from Solutions
     */
    public checkSolution(mazeStepsArray: Transition[][]): number {
        let result = Solutions.noExit;
        const lastSteps = mazeStepsArray[mazeStepsArray.length - 1];
        if (lastSteps[lastSteps.length - 1].isFinal) {
            result = Solutions.exitFind;
            const solution = this.getSolutionString(mazeStepsArray);
            if (this.mazeInfo.energy < solution.length) {
                result = Solutions.noEnergy;
            }
        }
        return result;
    }

    public getSolutionString(mazeStepsArray: Transition[][]): string {
        let resultWay = this.getSolutionSteps(mazeStepsArray);
        let result = resultWay.reduce((sum, current) => {
            return sum + current.action;
        }, '');
        console.log({result,resultWay});
        // const lastSteps = mazeStepsArray[mazeStepsArray.length - 1];
        // let recursiveResult: (transition: Transition) => void = (winTransition: Transition) => {
        //     if (winTransition.action) {
        //         resultWay += winTransition.action;
        //     }
        //     if (winTransition.prev) {
        //         recursiveResult(winTransition.prev);
        //     }
        // };
        // recursiveResult(lastSteps[lastSteps.length - 1]);
        // return resultWay.split('').reverse().join('');
        return result

    }

    public getSolutionSteps(mazeStepsArray: Transition[][]): Transition[] {
        let resultWay: Transition[] = [];
        const lastSteps = mazeStepsArray[mazeStepsArray.length - 1];
        let recursiveResult: (transition: Transition) => void = (winTransition: Transition) => {
            if (winTransition.action) {
                resultWay.push(winTransition);
            }
            if (winTransition.prev) {
                recursiveResult(winTransition.prev);
            }
        };
        recursiveResult(lastSteps[lastSteps.length - 1]);
        return resultWay.reverse();

    }

    private checkAction(action: Actions): boolean {
        const checkPosition = this.mockRobby.position;
        const checkDirection = this.mockRobby.direction;
        if (action == Actions.moveForvard) {
            // console.log('point:', { x: checkPosition.x, y: checkPosition.y });
            if (checkPosition.y >= this.maze.length || checkPosition.x >= this.maze[0].length || checkPosition.y < 0
                || checkPosition.x < 0) {
                return false;
            }
            return !(this.maze[checkPosition.y][checkPosition.x][checkDirection.name] <= this.step + 1 // point potential comparation
                || this.maze[checkPosition.y][checkPosition.x].type == Fields.blocked); // point is blocked
        } else {
            return this.maze[checkPosition.y][checkPosition.x][checkDirection.name] > this.step + 1;
        }
    }

    addNewStepInfo(transition: Transition) {
        if (this.mazeSteps.length == this.step + 1) {
            this.mazeSteps.push([]);
        }
        this.mazeSteps[this.step + 1].push(transition);

        const checkPosition = this.mockRobby.position;
        const checkDirection = this.mockRobby.direction;
        if (this.maze[checkPosition.y][checkPosition.x][checkDirection.name] > this.step + 1) { // point potential comparation
            this.maze[checkPosition.y][checkPosition.x][checkDirection.name] = this.step + 1;
        }
    }

    private createMaze(maze: Array<Array<Fields>>): Array<Array<MazeDirectionalPlate>> {
        const newMaze: Array<Array<MazeDirectionalPlate>> = [];
        for (const column of maze) {
            newMaze.push([]);
            for (const item of column) {
                const plate: MazeDirectionalPlate = {
                    type: item,
                    up: Number.MAX_VALUE,
                    down: Number.MAX_VALUE,
                    left: Number.MAX_VALUE,
                    right: Number.MAX_VALUE
                };
                if (item == Fields.blocked) {
                    plate.up = plate.down = plate.left = plate.right = Number.MAX_VALUE;
                }
                newMaze[newMaze.length - 1].push(plate);
            }
        }
        return newMaze;
    }


    private isFindingDone(maze: Array<Array<Fields>>) {
        const finishPosition = this.findEndPlate(maze);
        console.log({
            robbyX: this.mockRobby.position.x, finishX: finishPosition.x,
            robbyY: this.mockRobby.position.y, finishY: finishPosition.y
        });

        return this.comparePoints(this.mockRobby.position, finishPosition);
    }

    private comparePoints(point1: Point, point2: Point): boolean {
        return (point1.x == point2.x && point1.y == point2.y);

    }

    public findStartPlate(maze: Array<Array<Fields>>): Point {
        // tslint:disable-next-line:forin
        for (const columnIndex in maze) {
            const column = maze[columnIndex];
            for (const itemIndex in column) {
                if (maze[columnIndex][itemIndex] == Fields.start) {
                    return { y: Number(columnIndex), x: Number(itemIndex) };
                }
            }
        }
        throw new Error('Can\'t find start');
    }
    private findEndPlate(maze: Array<Array<Fields>>): Point {
        // tslint:disable-next-line:forin
        for (const columnIndex in maze) {
            const column = maze[columnIndex];
            for (const itemIndex in column) {
                if (maze[columnIndex][itemIndex] == Fields.target) {
                    return { y: Number(columnIndex), x: Number(itemIndex) };
                }
            }
        }
        throw new Error('Can\'t find finish');
    }

}

export interface MazeDirectionalPlate {
    type: Fields;
    up: number;
    down: number;
    left: number;
    right: number;
}

export interface Transition {
    step: number;
    from?: { position: Point, direction: string };
    to: { position: Point, direction: string };
    action?: Actions;
    isFinal: boolean;
    prev?: Transition;
}


