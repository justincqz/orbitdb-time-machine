import DatabaseUIProvider from "../../providers/DatabaseUIProvider";
import React, { useState } from 'react';
import ToolbarStyle from '../viewDatabase/Sidebar.module.css';
import { Store } from "orbit-db-store";
import AceEditor from "react-ace";
import Popup from "reactjs-popup";
import "ace-builds/src-noconflict/mode-jsx";
import ReactTable from "react-table";

const languages = [
  "javascript",
  "json"
];

const themes = [
  "monokai",
  "github",
  "tomorrow",
  "kuroir",
  "twilight",
  "xcode",
  "textmate",
  "solarized_dark",
  "solarized_light",
  "terminal"
];

languages.forEach(lang => {
  require(`ace-builds/src-noconflict/mode-${lang}`);
  require(`ace-builds/src-noconflict/snippets/${lang}`);
});

themes.forEach(theme => require(`ace-builds/src-noconflict/theme-${theme}`));

export default class DocStoreUI implements DatabaseUIProvider {

  getSidebar: React.FC<Store> = ({ store }) => {
    const [editorStatus, setEditorStatus] = useState({data: "{}", open: false});
    const [input, setInput] = useState("");
    const [errorStatus, setErrorStatus] = useState({error: false, msg:""});
    const [activeField, setActiveField] = useState("");

    async function submitDocument(e) {
      e.preventDefault();
      try {
        await store.put(JSON.parse(editorStatus.data));
        setEditorStatus({...editorStatus, open: false});
      } catch (error) {
        setEditorStatus({...editorStatus, open: true});
        setErrorStatus({error: true, msg: error});
      }
    }

    const oneInputField = (opName, op) => {
      return () => (<div className={ToolbarStyle.inputFieldContainer}>
        <form onSubmit={(e) => {e.preventDefault(); op()}}>
          <div className={ToolbarStyle.inputFieldRow}>
            <label>Key: </label>
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
      </div>);
    };

    const addEditorField = (opName, op) => {
      return () => (<div className={ToolbarStyle.inputFieldContainer}>
        <form onSubmit= {op}>
          <Popup open={editorStatus.open}
                 closeOnDocumentClick={false}
                 contentStyle={{backgroundColor:"#0A3464FF"}}>
            <div>
              <AceEditor
                mode="json"
                theme="solarized_dark"
                fontSize="2vh"
                onChange={(data) => {setEditorStatus({data: data, open: true}); setErrorStatus({...errorStatus, error:false})}}
                name="aceEditor"
                value= {editorStatus.data}
                width="50vw"
                height="40vh"
                editorProps={{ $blockScrolling: true }}
                defaultValue={"{}"}
              />
              { errorStatus.error
                ?
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', padding:'0.8vh', backgroundColor: "#A15050"}}>
                  <label>Error! Please check your syntax and if you have included the "_id" field</label>
                </div>
                :
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', padding:'0.8vh', backgroundColor: "#1C424B"}}>
                  <label className={ToolbarStyle.editButton} onClick={()=> setEditorStatus({...editorStatus, open: false})}>Cancel</label>
                  <input type="submit" value="Save" className={ToolbarStyle.inputFieldSubmit}/>
                </div>
              }
            </div>
          </Popup>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '0.5vh'}}>
            <label className={ToolbarStyle.editButton} onClick={()=> setEditorStatus({...editorStatus, open: true})}>{opName}</label>
          </div>
        </form>
      </div>);
    };

    const opTypes = {
      Add: addEditorField("Add", (e) => submitDocument(e)),
      Del: oneInputField("Del", () => store.del(input))
    };

    return (<div>
      <div className={ToolbarStyle.buttonBar}>
        {Object.keys(opTypes)
          .map(op => (<button className={ToolbarStyle.addButton} onClick={() => setActiveField(op)}>{op}</button>))}
      </div>
      {opTypes[activeField] ? opTypes[activeField]() : null}
    </div>);
  };

  getDataDisplay: React.FC<any> = ({ index }) => {
    const [viewStatus, setViewStatus] = useState({data: "{}", open: false});

    let filteredData = Object.keys(index._index).map((key) => {
      return { Document: index._index[key].payload.value }
    });


    let columns = [
      {
        Header: () => (
          <span>
        Document
      </span>
        ),
        Cell: row => (
          <div style={{textAlign: "center"}}>
            <span>
              {JSON.stringify(row.original.Document._id)}
            </span>
          </div>
        )
      }
    ];

    return (
      <div>
        <ReactTable
          className="-striped -highlight"
          data={filteredData.reverse()}
          columns={columns}
          defaultPageSize={5}
          pageSizeOptions={[5,10,20]}
          getTdProps={(state, rowInfo) => {
            return {
              onClick: () => {
                setViewStatus({data: JSON.stringify(rowInfo.original.Document, null, '\t'), open: true});
                console.log(viewStatus.data);
              }
            }
          }}
        />
        <Popup open={viewStatus.open}
               onClose={() => setViewStatus({...viewStatus, open: false})}
               contentStyle={{backgroundColor:"#0A3464FF"}}>
          <AceEditor
            mode="json"
            theme="solarized_dark"
            fontSize="2vh"
            readOnly={true}
            name="aceEditor"
            value= {viewStatus.data}
            onLoad={(e) => {console.log(e)}}
            width="50vw"
            height="40vh"
            editorProps={{ $blockScrolling: true }}
            defaultValue={""}
            setOptions={{tabSize: 2}}
          />
        </Popup>
      </div>);
  }

  getTooltipMsg(entry): string {
    return (
      `Operation: ${entry.payload.op}
      Document: ${JSON.stringify(entry.payload.value)}`);
  }

  getTooltipTitle(entry): string {
    return `Added by ${entry.identity.id}`;
  }
}
