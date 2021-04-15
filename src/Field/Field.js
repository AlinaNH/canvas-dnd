/* eslint-disable no-restricted-globals */
import './Field.css';
import Circle from '../Circle/Circle.js';
import Square from '../Square/Square.js';

function Field() {
  const dragElement = (event) => {
    if (event.target.className === 'circle' || event.target.className === 'square') {
      event.preventDefault();

      const element = event.target;
      const box = element.getBoundingClientRect();
      const coordinates = {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
      };

      const container = element.parentNode;
      container.appendChild(element.cloneNode());
      
      const shiftX = event.pageX - coordinates.left;
      const shiftY = event.pageY - coordinates.top;
  
      element.style.position = 'absolute';
      
      document.onmousemove = (event) => {
        event.preventDefault();
        element.style.left = event.pageX - shiftX + 'px';
        element.style.top = event.pageY - shiftY + 'px';
      };
  
      document.onmouseup = function() {
        event.preventDefault();
        document.onmousemove = null;
        element.onmouseup = null;
      };
    }
  };

  return (
    <div className='field-container' onMouseDown={(event) => dragElement(event)}>
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
  
export default Field;
  