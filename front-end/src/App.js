import react, { useState, useEffect } from 'react';
import './App.css';
import { backgrounds } from './iterates.js';
import Clock from './components/clock.js'
import ToDo from './components/toDoList/toDo.js';
import Search from './components/searchBar/search.js'

function App() {

  const [back, setBack] = useState("");
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const num = Math.floor(Math.random() * 10)

    setBack(backgrounds[num]["url"])
    setQuote(`"${backgrounds[num]["quote"]}" - ${backgrounds[num]["author"]}`)
    }, [])

  
  return (
    <div className="App">
      <div className ="content" style={{backgroundImage:`url(${back})`}}>
        <div className="main">
          <div className="top">
            <Clock />
            <div className="quote">{quote}</div>
            <Search />
          </div>
          <div className="bottom">
            
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
