import React, { Fragment, useState } from 'react';
import AutoCompleteStyle from './AutoComplete.module.css';

const AutoComplete: React.FC<{
  onSubmit: (user: string) => void,
  suggestions?: string[],
}> = ({ suggestions, onSubmit }) => {
  const [input, setInput] = useState("");
  const [showSuggestions, toggleSuggestions] = useState(false);
  const [activeVal, setActiveVal] = useState(0);

  const filtered = suggestions ?
    suggestions.filter(val => val.toLowerCase().indexOf(input.toLowerCase())) : [];

  const handleInput = (value) => {
    onSubmit(value);
    setInput(value);
  }

  const handleKeyPress = e => {
    if (!suggestions || suggestions.length == 0)
      return;

    // Up Key
    if (e.keyCode == 38)
      setActiveVal((suggestions.length + activeVal - 1) % suggestions.length);

    // Down Key
    if (e.keyCode == 40)
      setActiveVal((activeVal + 1) % suggestions.length);

    // Enter Key
    if (e.keyCode == 13) {
      handleInput(suggestions[activeVal])
    }
  }

  const suggestionComponent = suggestions && suggestions.length > 0 ?
    (<ul>
      {filtered.map((val, index) => {
        let className = AutoCompleteStyle.suggestion;
        if (index === activeVal) 
          className = AutoCompleteStyle.selected;

        return (
          <li className={className} 
            key={val} 
            onClick={e=>{handleInput(e.currentTarget.accessKey)}}>
            {val}
          </li>
        );
      })}
    </ul>) : 
    (<li className={AutoCompleteStyle.selected} key="Local">Local User</li>);

  return (
    <Fragment>
      <input
        type="text"
        className={AutoCompleteStyle.input}
        value={input}
        onChange={e=>{setInput(e.target.value)}}
        onFocus={(()=>{toggleSuggestions(true)})}
        onBlur={()=>{toggleSuggestions(false)}}
        onKeyPress={handleKeyPress}
      />
      {showSuggestions ? suggestionComponent : null}
    </Fragment>
  );
}

export default AutoComplete;