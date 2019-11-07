import DatabaseUIProvider from "../../providers/DatabaseUIProvider";
import React, { useState } from 'react';
import ToolbarStyle from '../viewDatabase/Sidebar.module.css';
import { Store } from "orbit-db-store";

export default class EventStoreUI implements DatabaseUIProvider {
  getSidebar: React.FC<Store> = ({ store }) => {
    const [input, setInput] = useState("");

    return <div className={ToolbarStyle.inputFieldContainer}>
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
    </div>
  }  
  
  getDataDisplay(index: any) {
    return index.get().map((data) => {
      return {"value" : data.payload.value};
    });
  }


}