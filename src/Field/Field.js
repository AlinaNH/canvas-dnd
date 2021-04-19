/* eslint-disable no-restricted-globals */
import React from 'react';
import { connect } from 'react-redux';
import './Field.css';
import Circle from '../Circle/Circle.js';
import Square from '../Square/Square.js';
import { addFigure, moveFigure, isFigureInCanvas, deleteFigure } from '../redux/actions';
import store from './../redux/store';

class Field extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, highlighted: null, zIndex: 1 };
    this.dragElement = this.dragElement.bind(this);
    this.highlightElement = this.highlightElement.bind(this);
  }

  isOutOfCanvas = (coordinates, canvasBorder) => {
    if (+coordinates.left.slice(0, -2) <= canvasBorder.left
     || +coordinates.left.slice(0, -2) >= canvasBorder.right
     || +coordinates.top.slice(0, -2) <= canvasBorder.top
     || +coordinates.top.slice(0, -2) >= canvasBorder.bottom) {
       return true;
     } else return false;
  }

  dragElement = (event) => {
    if (event.target.className === 'circle' || event.target.className === 'square') {
      event.preventDefault();

      const element = event.target;
      const box = element.getBoundingClientRect();
      const coordinates = {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
      };

      if (!element.id) {
        const container = element.parentNode;
        container.appendChild(element.cloneNode());

        element.id = this.state.count;
        this.props.addFigure(element, coordinates);
        this.setState({ count: this.state.count + 1 })
      }
      
      const shiftX = event.pageX - coordinates.left;
      const shiftY = event.pageY - coordinates.top;
  
      element.style.position = 'absolute';

      const canvas = document.querySelectorAll('.field-section-container')[1];
      const canvasBorder = {
        top: canvas.offsetTop,
        right: canvas.offsetWidth + canvas.offsetLeft - element.offsetWidth,
        bottom: canvas.offsetHeight + canvas.offsetTop - element.offsetHeight,
        left: canvas.offsetLeft
      };
      
      document.onmousemove = (event) => {
        event.preventDefault();
        const isFigureInCanvas = store.getState().figuresReducer.figures[+element.id].isFigureInCanvas;
    
        if (!isFigureInCanvas) {
          element.style.left = event.pageX - shiftX + 'px';
          element.style.top = event.pageY - shiftY + 'px';
        } else {
          const newLocation = {
            x: canvasBorder.left,
            y: canvasBorder.top
          };
          if (event.pageX > canvasBorder.right) {
            newLocation.x = canvasBorder.right;
          } else if (event.pageX > canvasBorder.left) {
            newLocation.x = event.pageX;
          }
          if (event.pageY > canvasBorder.bottom) {
            newLocation.y = canvasBorder.bottom;
          } else if (event.pageY > canvasBorder.top) {
            newLocation.y = event.pageY;
          }
          element.style.left = newLocation.x + 'px';
          element.style.top = newLocation.y + 'px';
        }
      };
  
      document.onmouseup = (event) => {
        event.preventDefault();
        document.onmousemove = null;
        element.onmouseup = null;
        const newCoordinates = {
          left: element.style.left,
          top: element.style.top
        }
        
        const isOutOfCanvas = this.isOutOfCanvas(newCoordinates, canvasBorder);
        if (isOutOfCanvas) {
          element.remove();
        } else {
          this.props.isFigureInCanvas(element, true);
          this.props.moveFigure(element, newCoordinates); 
        }
      };
    }
  };

  highlightElement = (event) => {
    const element = event.target;
    const highlighted = this.state.highlighted;
  
    if (element.id && !this.state.highlighted) {
      element.style.border = '2px dashed yellow';
      this.setState({ highlighted: element });
      element.style.zIndex = this.state.zIndex;
      this.setState({ zIndex: this.state.zIndex + 1 });
    } else if (element.id && this.state.highlighted.id !== element.id) {
      highlighted.style.border = '1px solid black';
      element.style.border = '2px dashed yellow';
      this.setState({ highlighted: element });
      element.style.zIndex = this.state.zIndex;
      this.setState({ zIndex: this.state.zIndex + 1 });
    } else if (element.id && this.state.highlighted.id === element.id) {
      return;
    } else if (!element.id && this.state.highlighted) {
      highlighted.style.border = '1px solid black';
      this.setState({ highlighted: null });
    }
  };

  removeElementByDelete = (event) => {
    const highlightedElement = this.state.highlighted;
    if(event.keyCode === 46 && highlightedElement) {
      highlightedElement.remove();
      this.setState({ highlighted: null });
    }
  }

  render() {
    return (
      <div
        className='field-container'
        onMouseDown={(event) => this.dragElement(event)}
        onClick={(event) => this.highlightElement(event)}
        onKeyDown={this.removeElementByDelete}
        tabIndex={0}
      >
          <div className='field-section-figures'>
            <div className='field-section-name'>Figures</div>
            <div className='field-section-container'>
              <div className='figure'><Circle /></div>
              <div className='figure'><Square /></div>
            </div>
          </div>
          <div className='field-section-canvas'>
            <div className='field-section-name'>Canvas</div>
            <div className='field-section-container'></div>
          </div>
      </div>
    );
  }
}
  
export default connect(null, { addFigure, moveFigure, isFigureInCanvas, deleteFigure })(Field);
