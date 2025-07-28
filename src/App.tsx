import React from 'react';
import { IFCApp } from './components/IFCApp';
import { WebIFCTest } from './components/WebIFCTest';
import './App.css';

function App() {
  return (
    <div className="App">
      <WebIFCTest />
      <IFCApp />
    </div>
  );
}

export default App;
