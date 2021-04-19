import { ADD_FIGURE, MOVE_FIGURE,FIGURE_IN_CANVAS, DELETE_FIGURE } from './actionTypes';

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

export const isFigureInCanvas = (element, isFigureInCanvas) => ({
  type: FIGURE_IN_CANVAS,
  payload: { element, isFigureInCanvas }
});

export const deleteFigure = (element) => ({
  type: DELETE_FIGURE,
  payload: { element }
});
