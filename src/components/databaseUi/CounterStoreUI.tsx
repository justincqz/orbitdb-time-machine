import DatabaseUIProvider from "../../providers/DatabaseUIProvider";
import React, { useState } from 'react';
import ToolbarStyle from '../viewDatabase/Sidebar.module.css';
import { Store } from "orbit-db-store";
import CounterStoreStyles from './CounterStoreUI.module.css';

export default class CounterStoreUI implements DatabaseUIProvider {

  getSidebar: React.FC<Store> = ({ store }) => {
    const [input, setInput] = useState("");
    const [activeField, setActiveField] = useState("");
    
    // Assumes input type="number" so we don't need to check.
    function handleFormSubmit() {
      let amount = Number(input);
      store.inc(amount);
    }

    const incrementField = (opName, op) => {
      return () => (
        <div className={ToolbarStyle.inputFieldContainer}>
          <form onSubmit={(e) => {e.preventDefault(); op()}}>
            <div className={ToolbarStyle.inputFieldRow}>
              <label>Amount: </label>
              <input
                className={ToolbarStyle.inputField}
                type="number"
                min="0"
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: '0.5vh'}}>
              <input type="submit" value={opName} className={ToolbarStyle.inputFieldSubmit}/>
            </div>
          </form>
        </div>
      );
    };

    const opTypes = {
      Increment: incrementField("Inc", handleFormSubmit),
    };

    return (
      <div>
        <div className={ToolbarStyle.buttonBar}>
          {Object.keys(opTypes)
            .map(op => (<button className={ToolbarStyle.addButton} onClick={() => setActiveField(op)}>{op}</button>))}
        </div>
        {opTypes[activeField] ? opTypes[activeField]() : null}
      </div>
    );
  }  
  
  /**
   * 
   * @param index The CounterIndex holding the data to display.
   */
  getDataDisplay: React.FC<any> = ({ header, index }) => {
    let value = index.get().value;

    return (
      <div className={CounterStoreStyles.counter}>
        <div>
         <p>{header}</p>
        </div>
        <div>
          <h1>{value}</h1>
        </div>
      </div>
    );
  }

  getTooltipMsg(entry): string {
    return (
      `Operation: ${entry.payload.op}
      Amount: ${entry.payload.value.counters[entry.key]}`);
  }

  getTooltipTitle(entry): string {
    return `Added by ${entry.identity.id}`;
  }
}
