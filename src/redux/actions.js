import { ADD_FIGURE, MOVE_FIGURE } from './actionTypes';

let nextId = 0;

export const addFigure = (element, coordinates) => ({
  type: ADD_FIGURE,
  payload: {
    id: ++nextId,
    element,
    coordinates
  }
});

export const moveFigure = (element, newCoordinates) => ({
  type: MOVE_FIGURE,
  payload: { element, newCoordinates }
});
