export interface Direction {
    name: string;
    modifier: Point;
    rotateLeft: Direction;
    rotateRight: Direction;
}

export interface Point {
    x: number;
    y: number;
}

export const DIRECTIONS = {
    up: 'UP',
    down: 'DOWN',
    left: 'LEFT',
    right: 'RIGHT'
}

export const MODIFIERS: { [val: string]: Point } = {
    [DIRECTIONS.up]: { x: 0, y: -1 },
    [DIRECTIONS.down]: { x: 0, y: 1 },
    [DIRECTIONS.left]: { x: -1, y: 0 },
    [DIRECTIONS.right]: { x: 1, y: 0 },
};
