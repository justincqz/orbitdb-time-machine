import React, { useState } from 'react';
import ToolbarStyle from './Sidebar.module.css';
import JoinList from './JoinList';

const SideBar: React.FC<{
  joinEvents: string[],
  selectJoin(join: string): void,
  type: string,
  addEventlog(val: string): void,
  addKeyValue(key: string, val: string): void,
  goHome(): void
}> = ({ joinEvents, selectJoin, type, addEventlog, addKeyValue, goHome }) => {
  const [showAddFields, toggleAddFields] = useState(false);
  const [input, setInput] = useState({key: undefined, val: undefined});
  const inputField = (operation) => {
    if (type === 'eventlog')
      return <div className={ToolbarStyle.inputFieldContainer}>
      <form onSubmit={(e) => {e.preventDefault(); addEventlog(input.val)}}>
        <div className={ToolbarStyle.inputFieldRow}>
          <label>Value: </label>
          <input
            className={ToolbarStyle.inputField}
            type="text"
            onChange={(e) => setInput({key: input.key, val: e.currentTarget.value})}
          />
        </div>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: '0.5vh'}}>
          <input type="submit" value={operation} className={ToolbarStyle.inputFieldSubmit}/>
        </div>
      </form>
    </div>;

    if (type === 'keyvalue')
      return <div className={ToolbarStyle.inputFieldContainer}>
        <form onSubmit={(e) => {e.preventDefault(); addKeyValue(input.key, input.val)}}>
          <div className={ToolbarStyle.inputFieldRow}>
            <label>Key: </label>
            <input 
                className={ToolbarStyle.inputField}
                type="text"
                onChange={(e) => setInput({key: e.currentTarget.value, val: input.val})}
              />
          </div>
          <div className={ToolbarStyle.inputFieldRow}>
            <label>Value: </label>
            <input
              className={ToolbarStyle.inputField}
              type="text"
              onChange={(e) => setInput({key: input.key, val: e.currentTarget.value})}
            />
          </div>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: '0.5vh'}}>
            <input type="submit" value={operation} className={ToolbarStyle.inputFieldSubmit}/>
          </div>
        </form>
      </div>;
  }

  return <div className={ToolbarStyle.container}>
    <div className={ToolbarStyle.header} onClick={goHome}>Time Travel</div>
    <div className={ToolbarStyle.buttonBar}>
      <button className={ToolbarStyle.addButton} onClick={() => toggleAddFields(!showAddFields)}>Add</button>
    </div>
    {showAddFields ? inputField('Add') : null}
    <div className={ToolbarStyle.info}>{`Database Type: ${type}`}</div>
    <div>
      <JoinList 
      joinEvents={joinEvents} 
      selectJoin={selectJoin} />
    </div>
  </div>
}

export default SideBar;