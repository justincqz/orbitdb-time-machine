import DatabaseUIProvider from "../../providers/DatabaseUIProvider";
import React, { useState } from 'react';
import ToolbarStyle from '../viewDatabase/Sidebar.module.css';
import { Store } from "orbit-db-store";
import DatabaseTableDisplay from "../DisplayComponents/DatabaseTableDisplay";

export default class EventStoreUI implements DatabaseUIProvider {
  getSidebar: React.FC<Store> = ({ store }) => {
    const [showAddFields, toggleAddFields] = useState(false);
    const [input, setInput] = useState("");

    const inputFields = () => {
      return (<div className={ToolbarStyle.inputFieldContainer}>
      <form onSubmit={(e) => {e.preventDefault(); store.add(input)}}>
        <div className={ToolbarStyle.inputFieldRow}>
          <label>Value: </label>
          <input
            className={ToolbarStyle.inputField}
            type="text"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: '0.5vh'}}>
          <input type="submit" value="Add" className={ToolbarStyle.inputFieldSubmit}/>
        </div>
      </form>
    </div>);
    };

    return (<div>
      <div className={ToolbarStyle.buttonBar}>
        <button className={ToolbarStyle.addButton} onClick={() => toggleAddFields(!showAddFields)}>Add</button>
      </div>
      {showAddFields ? inputFields() : null}
    </div>);
  }

  getDataDisplay: React.FC<any> = ({ index }) => {
    let filteredData = index.get().map((data) => {
      return {"value" : data.payload.value};
    });

    return <DatabaseTableDisplay data={filteredData.reverse()} />
  }
}
