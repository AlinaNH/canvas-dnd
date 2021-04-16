import { ADD_FIGURE, MOVE_FIGURE } from '../actionTypes';

export default function figuresReducer(state = { figures: [] }, action) {
  switch (action.type) {
    case  ADD_FIGURE:
      return { figures: [...state.figures, action.payload] };
    case  MOVE_FIGURE: {
      const movedElement = action.payload;
      state.figures[movedElement.element.id].coordinates = movedElement.newCoordinates;
      return { figures: [...state.figures]};
    }
    default:
      return state;
  }
}
