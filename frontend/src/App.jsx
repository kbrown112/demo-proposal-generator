import React from 'react';
import './App.css';
import Proposals from './components/Proposals';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Proposal Generator Demo</h1>
      </header>
      <main>
        <Proposals />
      </main>
    </div>
  );
};

export default App;