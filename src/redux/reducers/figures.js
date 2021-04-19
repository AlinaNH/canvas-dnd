import { ADD_FIGURE, MOVE_FIGURE, FIGURE_IN_CANVAS, DELETE_FIGURE } from '../actionTypes';

export default function figuresReducer(state = { figures: [] }, action) {
  switch (action.type) {

    case  ADD_FIGURE:
      return { figures: [...state.figures, action.payload] };

    case  MOVE_FIGURE: {
      const movedElement = action.payload;
      state.figures[movedElement.element.id].coordinates = movedElement.newCoordinates;
      return { figures: [...state.figures]};
    }

    case FIGURE_IN_CANVAS: {
      const movedElement = action.payload;
      state.figures[movedElement.element.id].isFigureInCanvas = movedElement.isFigureInCanvas;
      return { figures: [...state.figures]};
    }

    case DELETE_FIGURE: {
      const element = action.payload.element;
      state.figures.splice(element.id, 1);
      return { figures: [...state.figures]};
    }

    default:
      return state;
  }
}
