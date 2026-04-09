import react, { useState, useEffect } from 'react';
import './App.css';
import { backgrounds } from './iterates.js';
import Clock from './components/clock.js'
import ToDo from './components/toDoList/toDo.js';
import Search from './components/searchBar/search.js'
import Focus from './components/focus/focus.js'

function App() {

  const [back, setBack] = useState("");
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const cached = sessionStorage.getItem('dash-background');
    if (cached) {
      const { url, quote } = JSON.parse(cached);
      setBack(url);
      setQuote(quote);
    } else {
      const num = Math.floor(Math.random() * 10);
      const url = backgrounds[num]["url"];
      const quote = `"${backgrounds[num]["quote"]}" - ${backgrounds[num]["author"]}`;
      setBack(url);
      setQuote(quote);
      sessionStorage.setItem('dash-background', JSON.stringify({ url, quote }));
    }
  }, [])

  
  return (
    <div className="App">
      <div className ="content" style={{backgroundImage:`url(${back})`}}>
        <div className="main">
          <div className="left">
            <div className="time">
              <Clock />
              <div className="quote">{quote}</div>
              <Search />
            </div>
            <Focus />
          </div>
        </div>
        <div className="to-do"> 
          <ToDo /> 
        </div>
      </div>
    </div>
  );
}

export default App;
