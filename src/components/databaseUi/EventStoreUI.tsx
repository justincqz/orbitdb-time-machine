import DatabaseUIProvider from "../../providers/DatabaseUIProvider";
import React, { useState } from 'react';
import ToolbarStyle from '../viewDatabase/Sidebar.module.css';
import { Store } from "orbit-db-store";
import DatabaseTableDisplay from "../DisplayComponents/DatabaseTableDisplay";
import AceEditor from "react-ace";
import Popup from "reactjs-popup";
import "ace-builds/src-noconflict/mode-jsx";
import PopupEditorStyles from './PopupEditor.module.css';

export default class EventStoreUI implements DatabaseUIProvider {
  getSidebar: React.FC<Store> = ({ store }) => {
    const [editorStatus, setEditorStatus] = useState({data: "", open: false});
    const [errorStatus, setErrorStatus] = useState({error: false, msg:""});
    const [activeField, setActiveField] = useState("");

    function handleEditorCancel() {
      setEditorStatus({...editorStatus, open: false});
    }

    async function handleEditorSubmit() {
      let data;
      try {
        data = JSON.parse(editorStatus.data);
      } catch (e) {
        // Cannot be parsed as JSON. Pass as string instead.
        data = editorStatus.data
      }
      
      // Can put any JSON-stringifyable data. 
      try {
        await store.add(data);
        setEditorStatus({...editorStatus, open: false});
      } catch (error) {
        setEditorStatus({...editorStatus, open: true});
        setErrorStatus({error: true, msg: error});
      }
    }

    const addEventEditor = () => {
      return () => (
        <Popup open={editorStatus.open}
                 closeOnDocumentClick={false}
                 contentStyle={{backgroundColor:"#0A3464FF"}}>
          <div>
            <AceEditor
              mode="json"
              theme="solarized_dark"
              fontSize="2vh"
              onChange={(data) => {
                setEditorStatus({data: data, open: true});
                setErrorStatus({...errorStatus, error:false});
              }}
              name="aceEditor"
              value= {editorStatus.data}
              width="50vw"
              height="40vh"
              editorProps={{ $blockScrolling: true }}
            />
            { errorStatus.error
              ?
              <div className={PopupEditorStyles.errorDiv}>
                <label>{errorStatus.msg}</label>
              </div>
              :
              <div className={PopupEditorStyles.buttonBar}>
                <button className={ToolbarStyle.editButton} onClick={handleEditorCancel}>Cancel</button>
                <button className={ToolbarStyle.editButton} onClick={handleEditorSubmit}>Submit</button>
              </div>
            }
          </div>
        </Popup>
      );
    };

    const addOp = "Add";
    
    const opTypes = {
      [addOp]: {
        onClickHandler: () => { setEditorStatus({...editorStatus, open: true })},
        component: addEventEditor()
      }
    };

    return (
      <div>
        <div className={ToolbarStyle.buttonBar}>
          {
            Object.keys(opTypes).map(op => (
              <button
               className={ToolbarStyle.addButton}
               onClick={() => {
                 opTypes[op].onClickHandler();
                 setActiveField(op);
              }}
              key={op}
              >
                {op}
              </button>)
            )
          }
        </div>
        {opTypes[activeField] ? opTypes[activeField].component() : null}
      </div>
    );
  }

  getDataDisplay: React.FC<any> = ({ header, index }) => {
    let filteredData = index.get().map((data) => {
      return {"value" : JSON.stringify(data.payload.value)};
    });

    return <DatabaseTableDisplay tableHeader={header} data={filteredData.reverse()} />
  }

  getTooltipMsg(entry): string {
    return (
      `Operation: ${entry.payload.op}
      Value: ${JSON.stringify(entry.payload.value)}`);
  }
  
  getTooltipTitle(entry): string {
    return `Added by ${entry.identity.id}`;
  }
}
