import DatabaseUIProvider from "../../providers/DatabaseUIProvider";
import React, { useState } from 'react';
import ToolbarStyle from '../viewDatabase/Sidebar.module.css';
import { Store } from "orbit-db-store";

export default class KeyValueUI implements DatabaseUIProvider {
  
  getSidebar: React.FC<Store> = ({ store }) => {
    const [input, setInput] = useState({key: "", val: ""});

    return (<div className={ToolbarStyle.inputFieldContainer}>
        <form onSubmit={(e) => {e.preventDefault(); store.put(input.key, input.val)}}>
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
            <input type="submit" value="PUT" className={ToolbarStyle.inputFieldSubmit}/>
          </div>
        </form>
      </div>);
  }  
  
  getDataDisplay(index: any) {
    return Object.keys(index._index).map((key) => {
      return { key: key, value: index._index[key] }
    })
  }
}