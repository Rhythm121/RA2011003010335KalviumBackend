import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [calculation, setCalculation] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/history')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setHistory(data);
        } else {
          // Convert single history object to an array
          setHistory([data]);
        }
      })
      .catch(error => {
        console.error('Error fetching history:', error);
      });
  }, []);

  const performCalculation = async () => {
    try {
      const response = await fetch(`http://localhost:3000/${calculation}`);
      const data = await response.json();
      setResult(data.answer);

      // Fetch updated history after performing a calculation
      fetch('http://localhost:3000/history')
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setHistory(data);
          } else {
            // Convert single history object to an array
            setHistory([data]);
          }
        })
        .catch(error => {
          console.error('Error fetching history:', error);
        });
    } catch (error) {
      console.error('Error performing calculation:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Math Operations</h1>
        <input
          type="text"
          placeholder="Enter calculation"
          value={calculation}
          onChange={(e) => setCalculation(e.target.value)}
        />
        <button onClick={performCalculation}>Calculate</button>
        <p>Result: {result}</p>
        <h2>Calculation History</h2>
        <ul>
  {history.length > 0 ? (
    <>
      {history.length > 0 &&
        history.map((item, index) => (
          <li key={index}>
            <strong>Question:</strong> {item.question} |{" "}
            <strong>Answer: </strong> {Number(item.answer).toLocaleString()}
          </li>
        ))}
    </>
  ) : (
    <li>No history available</li>
  )}
</ul>
      </header>
    </div>
  );
}

export default App;

