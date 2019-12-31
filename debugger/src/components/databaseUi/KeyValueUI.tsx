import DatabaseUIProvider from "../../providers/DatabaseUIProvider";
import React, { useState } from 'react';
import ToolbarStyle from '../viewDatabase/Sidebar.module.css';
import { Store } from "orbit-db-store";
import DatabaseTableDisplay from "../DisplayComponents/DatabaseTableDisplay";

export const inputTestId = "inputTestId";
export const inputOneTestId = "inputOneTestId";
export const inputTwoTestId = "inputTwoTestId";
export const oneInputFormTestId = "oneInputFormTestId";
export const twoInputFormTestId = "twoInputFormTestId";

export default class KeyValueUI implements DatabaseUIProvider {
  getSidebar: React.FC<Store> = ({ store }) => {
    const [activeField, setActiveField] = useState("");
    const [input, setInput] = useState({key: "", val: ""});

    const oneInputField = (opName, op) => {
      return () => (<div className={ToolbarStyle.inputFieldContainer}>
      <form 
        data-testid={oneInputFormTestId}
        onSubmit={(e) => { if (e) e.preventDefault(); op()}}>
        <div className={ToolbarStyle.inputFieldRow}>
          <label>Key: </label>
          <input
            data-testid={inputTestId}
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
        <form 
          data-testid={twoInputFormTestId}
          onSubmit={(e) => { if (e) e.preventDefault(); op()}}>
          <div className={ToolbarStyle.inputFieldRow}>
            <label>Key: </label>
            <input
                data-testid={inputOneTestId}
                className={ToolbarStyle.inputField}
                type="text"
                onChange={(e) => setInput({key: e.target.value, val: input.val})}
              />
          </div>
          <div className={ToolbarStyle.inputFieldRow}>
            <label>Value: </label>
            <input
              data-testid={inputTwoTestId}
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
          .map(op => (<button data-testid={op} className={ToolbarStyle.addButton} key={op} onClick={() => setActiveField(op)}>{op}</button>))}
      </div>
      {opTypes[activeField] ? opTypes[activeField]() : null}
    </div>);
  }

  getDataDisplay: React.FC<any> = ({ header, index }) => {
    let filteredData = Object.keys(index._index).map((key) => {
      return { key: key, value: index._index[key] }
    });

    return <DatabaseTableDisplay tableHeader={header} data={filteredData.reverse()} />
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
