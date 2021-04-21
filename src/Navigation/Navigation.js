import { useState, useEffect } from 'react';
import './Navigation.css';

function Navigation(props) {
  const [open, openModal] = useState(false);

  useEffect(() => {
    const modal = document.querySelector('.import-modal');
    const display = (open) ? 'block' : 'none';
    modal.style.display = display;
  }, [open]);

  const exportData = () => {
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=UTF-8,' + escape(localStorage.figures);
    link.download = 'output.txt';
    link.click();
  }

  const importData = () => {
    const files = document.querySelector('.import-form input').files;
    if (files.length === 0) return;
    if (!localStorage.figures) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      localStorage.figures = e.target.result;
      props.restoreData();
    };
    reader.onerror = (e) => alert(e.target.error.name);
    reader.readAsText(files[0]);
    openModal(false);
  }

  return (
    <>
      <div className='navigation-container'>
        <button onClick={exportData}>Export</button>
        <button onClick={() => openModal(true)}>Import</button>
      </div>
      <div className="import-modal">
        <div className="import-modal-content">
          <span className="close" onClick={() => openModal(false)}>&times;</span>
          <div className='import-form'>
            <input type="file" />
            <button onClick={importData}>Save</button>
          </div>
        </div>
      </div>
    </>
  );
}
  
export default Navigation;
