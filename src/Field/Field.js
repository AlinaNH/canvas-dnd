import './Field.css';
import Circle from '../Circle/Circle.js';
import Square from '../Square/Square.js';

function Field() {
    return (
      <div className='field-container'>
          <div className='field-section-figures'>
            <div className='field-section-name'>Figures</div>
            <div className='field-section-container'>
              <Circle />
              <Square />
            </div>
          </div>
          <div className='field-section-canvas'>
            <div className='field-section-name'>Canvas</div>
          </div>
      </div>
    );
  }
  
export default Field;
  