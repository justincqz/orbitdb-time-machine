import DatabaseUIProvider from "../../providers/DatabaseUIProvider";
import React, { useState } from 'react';
import ToolbarStyle from '../viewDatabase/Sidebar.module.css';
import { Store } from "orbit-db-store";
import AceEditor from "react-ace";
import Popup from "reactjs-popup";
import PopupEditorStyles from './PopupEditor.module.css';
import DatabaseTableDisplay from "../DisplayComponents/DatabaseTableDisplay";

export default class FeedStoreUI implements DatabaseUIProvider {
  getSidebar: React.FC<Store> = ({ store }) => {
    const [editorStatus, setEditorStatus] = useState({data: "", open: false});
    const [errorStatus, setErrorStatus] = useState({error: false, msg:""});
    const [input, setInput] = useState("");
    const [activeField, setActiveField] = useState("");

    function handleDelFormSubmit() {
      store.del(input);
    }

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

    const addOp = "Add";
    const delOp = "Del";
    
    const opTypes = {
      [addOp]: {
        onClickHandler: () => { setEditorStatus({...editorStatus, open: true })},
        component: addEventEditor()
      },
      [delOp]: {
        onClickHandler: () => {},
        component: delField(delOp, handleDelFormSubmit)
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
