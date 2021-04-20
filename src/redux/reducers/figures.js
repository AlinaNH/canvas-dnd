import {
  ADD_FIGURE,
  MOVE_FIGURE,
  IS_FIGURE_IN_CANVAS,
  DELETE_FIGURE
} from '../actionTypes';

export default function figuresReducer(state = { figures: [] }, action) {
  switch (action.type) {

    case  ADD_FIGURE:
      return { figures: [...state.figures, action.payload] };

    case  MOVE_FIGURE: {
      const movedElement = action.payload;
      const elementIndex = movedElement.element.id.split('figure_')[1];
      state.figures[elementIndex].coordinates = movedElement.newCoordinates;
      return { figures: [...state.figures]};
    }

    case IS_FIGURE_IN_CANVAS: {
      const movedElement = action.payload;
      const elementIndex = movedElement.element.id.split('figure_')[1];
      state.figures[elementIndex].isFigureInCanvas = movedElement.isFigureInCanvas;
      return { figures: [...state.figures]};
    }

    case DELETE_FIGURE: {
      const element = action.payload.element;
      const elementIndex = +element.id.split('figure_')[1];
      state.figures.splice(elementIndex, 1);
      return { figures: [...state.figures]};
    }

    default:
      return state;
  }
}
