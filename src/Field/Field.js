/* eslint-disable no-restricted-globals */
import React from 'react';
import { connect } from 'react-redux';
import './Field.css';
import Circle from '../Circle/Circle.js';
import Square from '../Square/Square.js';
import {
  addFigure,
  moveFigure,
  isFigureInCanvas,
  deleteFigure
} from '../redux/actions';
import store from './../redux/store';

class Field extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      circles: [],
      squares: [],
      highlighted: null,
      zIndex: 1,
      highlightedBorderStyle: '2px dashed yellow',
      defaultBorderStyle: '1px solid black'
    };
    this.dragAndDropElement = this.dragAndDropElement.bind(this);
    this.highlightElementByClick = this.highlightElementByClick.bind(this);
  }

  restoreData = () => {
    const figuresDataInLocalStorage = localStorage.getItem('figures');
    if (figuresDataInLocalStorage) {
      const figures = JSON.parse(figuresDataInLocalStorage);
      const circles = [];
      const squares = [];
      let element = null;
      const states = figures[figures.length-1];
      figures.forEach((figure, index) => {
          if (index < figures.length-1) {
          const figureProps = { id: figure.id, className: figure.className, key: figure.key };
          if (figure.className === 'circle') {
            element = <Circle {...figureProps} style={figure.style} />;
            circles.push(element);
          } else {
            element = <Square {...figureProps} style={figure.style} />;
            squares.push(element);
          }
        }
      });
      this.setState({
        circles: circles,
        squares: squares,
        count: states.count,
        zIndex: states.zIndex
      }, () => {
        const circles = document.querySelectorAll('.circle');
        const squares = document.querySelectorAll('.square');
        [...circles, ...squares].forEach((element) => {
          if (element.id) {
            const left = window.getComputedStyle(element).left;
            const top = window.getComputedStyle(element).top;
            this.props.addFigure(element, {left: left, top: top});
            this.props.isFigureInCanvas(element, true);
          }
        });
      });
    }
  }

  isOutOfCanvas = (coordinates, canvasBorder) => {
    const elementBorderLeft = +coordinates.left.slice(0, -2);
    const elementBorderTop = +coordinates.top.slice(0, -2);
    return (elementBorderLeft <= canvasBorder.left
     || elementBorderLeft >= canvasBorder.right
     || elementBorderTop <= canvasBorder.top
     || elementBorderTop >= canvasBorder.bottom) ? true : false;
  }

  setCanvasBorder = (element) => {
    const canvas = document.querySelector('.canvas');
    return {
      top: canvas.offsetTop,
      right: canvas.offsetWidth + canvas.offsetLeft - element.offsetWidth,
      bottom: canvas.offsetHeight + canvas.offsetTop - element.offsetHeight,
      left: canvas.offsetLeft
    };
  } 

  moveElement = (event, element, shiftX, shiftY, canvasBorder) => {
    const figuresStore = store.getState().figuresReducer;
    const elementId = +element.id.split('figure_')[1];
    const elementIndex = figuresStore.figures.map((figure) => figure.id).indexOf(elementId);
    const isFigureInCanvas = figuresStore.figures[elementIndex].isFigureInCanvas;

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
  }

  saveFigures = () => {
    const figures = store.getState().figuresReducer.figures;
    const figuresData = [];
    figures.forEach((figure) => {
      const zIndex = window.document.defaultView.getComputedStyle(figure.element).getPropertyValue('z-index');
      figuresData.push({
        id: figure.element.id,
        className: figure.element.className,
        key: figure.element.id.split('figure_')[1],
        style: {
          left: figure.coordinates.left,
          top: figure.coordinates.top,
          zIndex: zIndex,
          position: 'absolute'
        }
      });
    });
    figuresData.count = this.state.count;
    figuresData.zIndex = this.state.zIndex;
    figuresData.push({ count: this.state.count, zIndex: this.state.zIndex} );
    localStorage.figures = JSON.stringify(figuresData);
  }

  dragAndDropElement = (event) => {
    const elementClass = event.target.className;
    if (elementClass === 'circle' || elementClass === 'square') {
      const element = event.target;
      const canvasBorder = this.setCanvasBorder(element);

      const box = element.getBoundingClientRect();
      const coordinates = {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
      };

      const shiftX = event.pageX - coordinates.left;
      const shiftY = event.pageY - coordinates.top;

      if (!element.id) {
        (elementClass === 'circle')
          ? this.setState({ circles: [...this.state.circles, <Circle key={this.state.count} />] })
          : this.setState({ squares: [...this.state.squares, <Square key={this.state.count} />] });

        element.id = 'figure_' + this.state.count;
        this.props.addFigure(element, coordinates);
        this.setState({ count: this.state.count + 1 })
      }
  
      element.style.position = 'absolute';
      
      document.onmousemove = (event) => {
        event.preventDefault();
        this.moveElement(event, element, shiftX, shiftY, canvasBorder);
      };
  
      document.onmouseup = (event) => {
        event.preventDefault();
        document.onmousemove = null;
        element.onmouseup = null;
        const newCoordinates = {
          left: element.style.left,
          top: element.style.top
        }
        this.highlightElementByClick(event);
        const isOutOfCanvas = this.isOutOfCanvas(newCoordinates, canvasBorder);
        if (isOutOfCanvas) {
          element.remove();
          this.props.deleteFigure(element);
          this.saveFigures();
        } else {
          this.props.isFigureInCanvas(element, true);
          this.props.moveFigure(element, newCoordinates);
          this.saveFigures();
        }
      };
    }
  };

  makeElementHighlighed(element) {
    element.style.border = this.state.highlightedBorderStyle;
    element.style.zIndex = this.state.zIndex;
    this.setState({ highlighted: element, zIndex: this.state.zIndex + 1 });
  }

  makeElementUnhighlighed(element) {
    const highlighted = this.state.highlighted;
    highlighted.style.border = this.state.defaultBorderStyle;
    element.style.border = this.state.highlightedBorderStyle;
    element.style.zIndex = this.state.zIndex;
    this.setState({ highlighted: element, zIndex: this.state.zIndex + 1 });
  }

  highlightElementByClick = (event) => {
    const element = event.target;
    const highlighted = this.state.highlighted;
  
    if (element.id && !this.state.highlighted) {
      this.makeElementHighlighed(element)
    } else if (element.id && this.state.highlighted.id !== element.id) {
      this.makeElementUnhighlighed(element);
    } else if (!element.id && this.state.highlighted) {
      highlighted.style.border = this.state.defaultBorderStyle;
      this.setState({ highlighted: null });
    } else return;
  };

  removeElementByDelete = (event) => {
    const highlightedElement = this.state.highlighted;
    if(event.keyCode === 46 && highlightedElement) {
      highlightedElement.remove();
      this.props.deleteFigure(highlightedElement);
      this.setState({ highlighted: null });
      this.saveFigures();
    }
  }

  componentDidMount() {
    this.restoreData();
  }

  render() {
    return (
      <div
        className='field-container'
        onMouseDown={(event) => this.dragAndDropElement(event)}
        onKeyDown={this.removeElementByDelete}
        tabIndex={0}
      >
          <div className='field-section-figures'>
            <div className='field-section-name'>Figures</div>
            <div className='field-section-container'>
              <div className='figure'>
                <Circle />
                {this.state.circles}
              </div>
              <div className='figure'>
                <Square />
                {this.state.squares}
              </div>
            </div>
          </div>
          <div className='field-section-canvas'>
            <div className='field-section-name'>Canvas</div>
            <div className='field-section-container canvas'></div>
          </div>
      </div>
    );
  }
}
  
export default connect(null, {
  addFigure,
  moveFigure,
  isFigureInCanvas,
  deleteFigure
})(Field);
