import {
  ADD_FIGURE,
  MOVE_FIGURE,
  IS_FIGURE_IN_CANVAS,
  DELETE_FIGURE
} from '../actionTypes';

export default function figuresReducer(state = { figures: [] }, action) {

  const getElementIndex = () => {
    const index = +action.payload.element.id.split('figure_')[1];
    return state.figures.map((figure) => figure.id).indexOf(index);
  }

  switch (action.type) {

    case  ADD_FIGURE:
      return { figures: [...state.figures, action.payload] };

    case  MOVE_FIGURE: {
      const elementIndex = getElementIndex();
      state.figures[elementIndex].coordinates = action.payload.newCoordinates;
      return state;
    }

    case IS_FIGURE_IN_CANVAS: {
      const elementIndex = getElementIndex();
      state.figures[elementIndex].isFigureInCanvas = action.payload.isFigureInCanvas;
      return state;
    }

    case DELETE_FIGURE: {
      const elementIndex = getElementIndex();
      state.figures.splice(elementIndex, 1);
      return state;
    }

    default:
      return state;
  }
}
