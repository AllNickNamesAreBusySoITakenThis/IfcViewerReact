import React from 'react';
import './App.css';
import { FiberCanvas } from './components/FiberCanvas';
import { XeokitViewer } from './xeokit/XeokitViewer';

function App() {
  return (
    <div className="App">
      {/* <FiberCanvas /> */}
      <XeokitViewer fileId="1" />
    </div>
  );
}

export default App;
