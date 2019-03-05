export interface Direction {
    name: string; // from DIRECTIONS
    modifier: Point;
    rotateLeft?: Direction; // link
    rotateRight?: Direction; // link
}

export interface Point {
    x: number;
    y: number;
}

export const DIRECTIONS = {
    up: 'up',
    down: 'down',
    left: 'left',
    right: 'right'
};

export enum Actions {
    moveForvard = 'f',
    turnRight = 'r',
    turnLeft = 'l'
}

export const MODIFIERS: { [val: string]: Point } = {
    [DIRECTIONS.up]: { x: 0, y: -1 },
    [DIRECTIONS.down]: { x: 0, y: 1 },
    [DIRECTIONS.left]: { x: -1, y: 0 },
    [DIRECTIONS.right]: { x: 1, y: 0 },
};

export enum Fields {
    walkable = '.',
    blocked = '#',
    start = 'S',
    target = 'T'
}

/**
 *
 * @param name is DIRECTION wich you need of down as default
 * @returns Direction(stack) with links to neigboring directions
 */
export function createDirection(name?: string): Direction {
    const up: Direction = { name: DIRECTIONS.up, modifier: MODIFIERS[DIRECTIONS.up] };
    const down: Direction = { name: DIRECTIONS.down, modifier: MODIFIERS[DIRECTIONS.down] };
    const left: Direction = { name: DIRECTIONS.left, modifier: MODIFIERS[DIRECTIONS.left] };
    const right: Direction = { name: DIRECTIONS.right, modifier: MODIFIERS[DIRECTIONS.right] };
    up.rotateLeft = down.rotateRight = left;
    left.rotateRight = right.rotateLeft = up;
    up.rotateRight = down.rotateLeft = right;
    right.rotateRight = left.rotateLeft = down;
    const directions = [up, right, down, left];
    const result = directions.find((value, index) => {
        if (value.name == name) {
            return true;
        }
        return false;
    });
    return result !== undefined ? result : down;
}
