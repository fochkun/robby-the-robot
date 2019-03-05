import { MazeInfoService } from '../services/maze-info.service';
import { Fields, Point, Direction, Actions, createDirection } from '../model/pole-utils';
import { RobbyTheRobotComponent } from './robby-the-robot/robby-the-robot.component';

const ACTIONS = [Actions.moveForvard, Actions.turnLeft, Actions.turnRight];
export class MazeSolver {
    private maze: Array<Array<MazeDirectionalPlate>>;
    private mazeSteps: Array<Array<Transition>> = [];
    private step = 0;
    //private steps=[];
    private mockRobby: RobbyTheRobotComponent;

    constructor(private mazeInfo: MazeInfoService) {
        this.mockRobby = new RobbyTheRobotComponent();
    }

    solveMaze(maze: Array<Array<Fields>>) {
        const own = this;
        this.mockRobby = new RobbyTheRobotComponent();
        this.maze = this.createMaze(maze);
        const startPoint: Point = this.findStartPlate(maze);
        const startDirection = this.mockRobby.direction;
        let actionDone = true;
        this.mockRobby.position = startPoint;
        this.mazeSteps.push([]);
        this.mazeSteps[0].push({
            step: this.step,
            to: { direction: startDirection.name, position: startPoint },
            isFinal: false,
            isSuccessfully: true
        });
        console.log({ mazeSteps: this.mazeSteps });
        this.maze[startPoint.x][startPoint.y][startDirection.name] = 0;
        while (!(this.isFindingDone(maze) || !actionDone)) {
            actionDone = false;
            for (let transition of own.mazeSteps[this.step]) {
                if (transition.isSuccessfully) {            // if last action is not successful
                    // then we don't need to continue finding in this direction
                    ACTIONS.forEach((action: Actions) => {  // make all possible actions in point and check them for success
                        if (this.isFindingDone(maze)) { // to prevent next actions if robby have find the exit
                            return;
                        }
                        this.mockRobby.position.x = transition.to.position.x;
                        this.mockRobby.position.y = transition.to.position.y;
                        this.mockRobby.direction = createDirection(transition.to.direction); // this part can eat all your memory
                        if (own.mockRobby.makeAction(action)) {
                            actionDone = own.checkAction(action);
                            own.addNewStepInfo({
                                action,
                                isSuccessfully: own.checkAction(action),
                                isFinal: this.isFindingDone(maze),
                                step: own.step + 1,
                                to: { direction: own.mockRobby.direction.name, position: own.mockRobby.position },
                                from: transition.to,
                                prev: transition
                            });
                        }
                    });
                }
            }
            ++this.step;
        }

    }

    private checkAction(action: Actions) {
        const checkPosition = this.mockRobby.position;
        const checkDirection = this.mockRobby.direction;
        if (action == Actions.moveForvard) {
            return !(this.maze[checkPosition.x][checkPosition.y][checkDirection.name] <= this.step + 1 // point potential comparation
                || this.maze[checkPosition.x][checkPosition.y].type == Fields.blocked) // point is blocked
        } else {
            return !(this.mockRobby.forvardPosition.x < 0
                || this.mockRobby.forvardPosition.y < 0);
        }
    }

    addNewStepInfo(transition: Transition) {
        if (this.mazeSteps.length == this.step + 1) {
            this.mazeSteps.push([]);
        }
        this.mazeSteps[this.step + 1].push(transition);

        const checkPosition = this.mockRobby.position;
        const checkDirection = this.mockRobby.direction;
        this.maze[checkPosition.x][checkPosition.y][checkDirection.name] = this.step + 1;


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
                    rigth: Number.MAX_VALUE
                };
                if (item == Fields.blocked) {
                    plate.up = plate.down = plate.left = plate.rigth = Number.MAX_VALUE;
                }
                newMaze[newMaze.length - 1].push(plate);
            }
        }
        return newMaze;
    }


    private isFindingDone(maze: Array<Array<Fields>>) {

        return this.mockRobby.position == this.findEndPlate(maze) || this.step >= this.mazeInfo.energy;
    }

    private findStartPlate(maze: Array<Array<Fields>>): Point {
        // tslint:disable-next-line:forin
        for (const columnIndex in maze) {
            const column = maze[columnIndex];
            for (const itemIndex in column) {
                if (maze[columnIndex][itemIndex] == Fields.start) {
                    return { x: Number(columnIndex), y: Number(itemIndex) };
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
                    return { x: Number(columnIndex), y: Number(itemIndex) };
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
    rigth: number;
}

export interface Transition {
    step: number;
    from?: { position: Point, direction: string };
    to: { position: Point, direction: string };
    action?: Actions;
    isFinal: boolean;
    isSuccessfully: boolean;
    prev?: Transition;
}

