/* eslint-disable no-restricted-globals */
import React from 'react';
import { connect } from 'react-redux';
import './Field.css';
import Circle from '../Circle/Circle.js';
import Square from '../Square/Square.js';
import { addFigure, moveFigure } from '../redux/actions';

class Field extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, highlighted: null };
    this.dragElement = this.dragElement.bind(this);
    this.highlightElement = this.highlightElement.bind(this);
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
      
      document.onmousemove = (event) => {
        event.preventDefault();
        element.style.left = event.pageX - shiftX + 'px';
        element.style.top = event.pageY - shiftY + 'px';
      };
  
      document.onmouseup = (event) => {
        event.preventDefault();
        document.onmousemove = null;
        element.onmouseup = null;
        const newCoordinates = {
          left: element.style.left,
          top: element.style.top
        }
        this.props.moveFigure(element, newCoordinates);
      };
    }
  };

  highlightElement = (event) => {
    const element = event.target;
    const highlighted = this.state.highlighted;
  
    if (element.id && !this.state.highlighted) {
      element.style.border = '2px dashed yellow';
      this.setState({ highlighted: element });
    } else if (element.id && this.state.highlighted.id !== element.id) {
      highlighted.style.border = '1px solid black';
      element.style.border = '2px dashed yellow';
      this.setState({ highlighted: element });
    } else {
      highlighted.style.border = '1px solid black';
      this.setState({ highlighted: null });
    }
  };

  render() {
    return (
      <div
        className='field-container'
        onMouseDown={(event) => this.dragElement(event)}
        onClick={(event) => this.highlightElement(event)}
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
          </div>
      </div>
    );
  }
}
  
export default connect(null, { addFigure, moveFigure })(Field);
