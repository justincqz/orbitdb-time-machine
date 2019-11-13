import DatabaseUIProvider from "../../providers/DatabaseUIProvider";
import React, { useState } from 'react';
import ToolbarStyle from '../viewDatabase/Sidebar.module.css';
import { Store } from "orbit-db-store";
import DatabaseTableDisplay from "../DisplayComponents/DatabaseTableDisplay";

export default class EventStoreUI implements DatabaseUIProvider {
  getSidebar: React.FC<Store> = ({ store }) => {
    const [input, setInput] = useState("");
    const [activeField, setActiveField] = useState("");

    function handleAddFormSubmit() {
      store.add(input);
    }

    function handleDelFormSubmit() {
      store.del(input);
    }

    const addField = (opName, op) => {
      return () => (
        <div className={ToolbarStyle.inputFieldContainer}>
          <form onSubmit={(e) => {e.preventDefault(); op();}}>
            <div className={ToolbarStyle.inputFieldRow}>
              <label>Value: </label>
              <input
                className={ToolbarStyle.inputField}
                type="text"
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

    const delField = (opName, op) => {
      return () => (
        <div className={ToolbarStyle.inputFieldContainer}>
          <form onSubmit={(e) => {e.preventDefault(); op();}}>
            <div className={ToolbarStyle.inputFieldRow}>
              <label>Value: </label>
              <input
                className={ToolbarStyle.inputField}
                type="text"
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
      Add: addField("Add", handleAddFormSubmit),
      Del: delField("Del", handleDelFormSubmit)
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

  getDataDisplay: React.FC<any> = ({ index }) => {
    let filteredData = index.get().map((data) => {
      return {"value" : data.payload.value};
    });

    return <DatabaseTableDisplay data={filteredData.reverse()} />
  }

  getTooltipMsg(entry): string {

    console.log(entry);

    return (
      `Operation: ${entry.payload.op}
      Value: ${entry.payload.value}`);
  }
  
  getTooltipTitle(entry): string {
    return `Added by ${entry.identity.id}`;
  }
}
