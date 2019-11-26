import React, { useState } from 'react';
import AutoCompleteStyle from './AutoComplete.module.css';

const AutoComplete: React.FC<{
  onSubmit: (user: string) => void,
  suggestions?: string[],
}> = ({ suggestions, onSubmit }) => {
  const [input, setInput] = useState("");
  const [showSuggestions, toggleSuggestions] = useState(false);
  const [activeVal, setActiveVal] = useState(0);

  const filtered = suggestions ?
    suggestions.filter(val => !val.toLowerCase().indexOf(input.toLowerCase())) : [];

  const handleInput = (value) => {
    onSubmit(value);
    setInput(value);
  }

  const handleKeyPress = e => {
    if (!filtered || filtered.length === 0)
      return false;

    // Up Key
    if (e.keyCode === 38) {
      e.preventDefault();
      setActiveVal((filtered.length + activeVal - 1) % filtered.length);
    }

    // Down Key
    if (e.keyCode === 40) {
      e.preventDefault();
      setActiveVal((activeVal + 1) % filtered.length);
    }

    // Enter Key
    if (e.keyCode === 13) {
      handleInput(filtered[activeVal]);
      e.currentTarget.blur();
    }
  }

  const suggestionComponent = suggestions && suggestions.length > 0 ?
    (<ul className={AutoCompleteStyle.suggestionList}>
      {filtered.map((val, index) => {
        let className = AutoCompleteStyle.suggestion;
        if (index === activeVal) 
          className = AutoCompleteStyle.selected;

        return (
          <li className={className} 
            id={val}
            key={val}
            onClick={e=>{handleInput(e.currentTarget.id)}}
            onMouseOver={e=>{setActiveVal(filtered.indexOf(e.currentTarget.id))}} >
            {val}
          </li>
        );
      })}
    </ul>) : 
    (<li key="Local" className={AutoCompleteStyle.selected}>Local User</li>);

  return (
    <div className={AutoCompleteStyle.container}>
      <input
        type="search"
        className={AutoCompleteStyle.input}
        value={input}
        onChange={e=>{setInput(e.target.value); setActiveVal(0)}}
        onFocus={(()=>{toggleSuggestions(true)})}
        onBlur={()=>{setTimeout(() => toggleSuggestions(false), 100);}}
        onKeyDown={handleKeyPress}
      />
      {showSuggestions ? suggestionComponent : null}
    </div>
  );
}

export default AutoComplete;