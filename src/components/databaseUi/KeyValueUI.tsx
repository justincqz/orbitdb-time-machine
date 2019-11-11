import DatabaseUIProvider from "../../providers/DatabaseUIProvider";
import React, { useState } from 'react';
import ToolbarStyle from '../viewDatabase/Sidebar.module.css';
import { Store } from "orbit-db-store";
import DatabaseTableDisplay from "../DisplayComponents/DatabaseTableDisplay";

export default class KeyValueUI implements DatabaseUIProvider {
  getSidebar: React.FC<Store> = ({ store }) => {
    const [activeField, setActiveField] = useState("");
    const [input, setInput] = useState({key: "", val: ""});

    const oneInputField = (opName, op) => {
      return () => (<div className={ToolbarStyle.inputFieldContainer}>
      <form onSubmit={(e) => {e.preventDefault(); op()}}>
        <div className={ToolbarStyle.inputFieldRow}>
          <label>Key: </label>
          <input
            className={ToolbarStyle.inputField}
            type="text"
            onChange={(e) => setInput({key: e.target.value, val: ""})}
          />
        </div>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: '0.5vh'}}>
          <input type="submit" value={opName} className={ToolbarStyle.inputFieldSubmit}/>
        </div>
      </form>
    </div>);
    };
    
    const twoInputFields = (opName, op) => {
      return () => (<div className={ToolbarStyle.inputFieldContainer}>
        <form onSubmit={(e) => {e.preventDefault(); op()}}>
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
              onChange={(e) => setInput({key: input.key, val: e.target.value})}
            />
          </div>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: '0.5vh'}}>
            <input type="submit" value={opName} className={ToolbarStyle.inputFieldSubmit}/>
          </div>
        </form>
      </div>);
    };

    const opTypes = {
      Add: twoInputFields("Put", () => store.put(input.key, input.val)),
      Set: twoInputFields("Set", () => store.set(input.key, input.val)),
      Del: oneInputField("Del", () => store.del(input.key))
    };

    return (<div>
      <div className={ToolbarStyle.buttonBar}>
        {Object.keys(opTypes)
          .map(op => (<button className={ToolbarStyle.addButton} onClick={() => setActiveField(op)}>{op}</button>))}
      </div>
      {opTypes[activeField] ? opTypes[activeField]() : null}
    </div>);
  }

  getDataDisplay: React.FC<any> = ({ index }) => {
    let filteredData = Object.keys(index._index).map((key) => {
      return { key: key, value: index._index[key] }
    });

    return <DatabaseTableDisplay data={filteredData.reverse()} />
  }

  getTooltipMsg(entry): string {
    return (
      `Operation: ${entry.payload.op}
      Key: ${entry.payload.key}
      Value: ${entry.payload.value}`);
  }

  getTooltipTitle(entry): string {
    return `Added by ${entry.identity.id}`;
  }
}
