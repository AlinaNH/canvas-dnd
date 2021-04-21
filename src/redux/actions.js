import {
  ADD_FIGURE,
  MOVE_FIGURE,
  IS_FIGURE_IN_CANVAS,
  DELETE_FIGURE
} from './actionTypes';

export const addFigure = (element, coordinates) => ({
  type: ADD_FIGURE,
  payload: {
    id: +element.id.split('figure_')[1],
    element,
    coordinates
  }
});

export const moveFigure = (element, newCoordinates) => ({
  type: MOVE_FIGURE,
  payload: { element, newCoordinates }
});

export const isFigureInCanvas = (element, isFigureInCanvas) => ({
  type: IS_FIGURE_IN_CANVAS,
  payload: { element, isFigureInCanvas }
});

export const deleteFigure = (element) => ({
  type: DELETE_FIGURE,
  payload: { element }
});
