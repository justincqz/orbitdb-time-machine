import React, { useState } from 'react';
import "react-table/react-table.css";
import { DatabaseProvider } from '../providers/DatabaseProvider';
import OperationsLog from '../providers/OperationsLog';
import GraphDisplay, { GraphDisplayNodeMouseEvents } from './viewDatabase/GraphDisplay';
import { D3Data } from '../model/D3Data';
import Popup from "reactjs-popup";
import DatabaseStateDisplay from "../components/DatabaseStateDisplay";
import DAGNodeTooltip from './viewDatabase/DAGNodeTooltip';
import storeDisplayStyles from './StoreDisplay.module.css';
import { NodeProvider } from '../providers/NodeProvider';
import DatabaseUIProvider from '../providers/DatabaseUIProvider';

/**
 * The component responsible for displaying an OrbitDB EventStore.
 * Here, we take care of EventStore specific operations such as add.
 * 
 * @param operationLogData The operations log graph we need to visualise
 * @param eventStore The store we need to visualise
 * @param dbProvider The underlying database
 * 
 */
const OrbitDBStoreDisplay: React.FC<{
  operationLogData: D3Data,
  nodeProvider: NodeProvider
  dbProvider: DatabaseProvider,
  uiProvider: DatabaseUIProvider
}> = ({ operationLogData, nodeProvider, dbProvider, uiProvider }) => {

  const [toolTipState, setTooltipState] = useState({
    nodeInfo: null,
    toolTipHidden: true,
    targetRect: null
  });

  const [databaseState, setDatabaseState] = useState({
    data: [],
    openPopup: false
  });

  /**
   * Handler for the onclick event for the rendered nodes in GraphDisplay.
   * Reconstructs data based on the given entry's hash and displays it through
   * a Popup.
   * 
   * @param entryHash The hash of the entry corresponding to the GraphDisplay node
   * @param DOMElem The DOM element that registered this click event
   */
  function onOperationLogNodeClick(entryHash: string, DOMElem: Element): void {
    try {
      let nodeEntry = nodeProvider.getNodeInfoFromHash(entryHash);
      dbProvider.constructOperationsLogFromEntries([nodeEntry]).then((operationsLog) => {
        let reconstructedDataIndex = reconstructData(operationsLog);
        let filteredData = uiProvider.getDataDisplay(reconstructedDataIndex);
        setDatabaseState({
          ...databaseState,
          data: filteredData.reverse(),
          openPopup: true
        });
      });
    } catch (e) {
      // TODO: Error handling.
      console.log("Something went terribly wrong...");
    }
  }

  /**
   * Handler for the onmouseleave event for the rendered nodes in GraphDisplay.
   * Hide tooltip from display.
   * 
   * @param entryHash The hash of the entry corresponding to the GraphDisplay node
   * @param DOMElem The DOM element that registered this click event
   */
  function onOperationLogNodeMouseLeave(entryHash: string, DOMElem: Element): void {
    setTooltipState({
      ...toolTipState,
      nodeInfo: null,
      toolTipHidden: true,
      targetRect: null
    });
  }

  /**
   * Handler for the onmouseenter event for the rendered nodes in GraphDisplay.
   * Move and display tooltip on GraphDisplay node.
   * 
   * @param entryHash The hash of the entry corresponding to the GraphDisplay node
   * @param DOMElem The DOM element that registered this click event
   */
  function onOperationLogNodeMouseEnter(entryHash: string, DOMElem: Element): void {
    try {
      setTooltipState({
        ...toolTipState,
        nodeInfo: nodeProvider.getNodeInfoFromHash(entryHash),
        toolTipHidden: false,
        targetRect: DOMElem.getBoundingClientRect()
      });
    } catch (e) {
      // TODO: Error handling.
      console.log("Something went terribly wrong...");
    }
  }

  /**
   * Returns the entries of an EventIndex that has been updated using the
   * given operations log.
   * 
   * @param operationsLog The operations log used to reconstruct the database state.
   */
  function reconstructData(operationsLog: OperationsLog): Array<any> {
    return nodeProvider.reconstructData(operationsLog);
  }

  let eventCallbacks: GraphDisplayNodeMouseEvents = {
    'click': onOperationLogNodeClick,
    'mouseenter': onOperationLogNodeMouseEnter,
    'mouseleave': onOperationLogNodeMouseLeave
  };

  return (
    <div className={storeDisplayStyles.container}>
      <DAGNodeTooltip nodeInfo={toolTipState.nodeInfo} rect={toolTipState.targetRect}/>
      <GraphDisplay
        inputData={operationLogData}
        mouseEvents={eventCallbacks}
        nodeColour='#7bb1f1ff'
        lineColour='#1d5495ff'
      />
      <Popup 
        open={databaseState.openPopup}
        onClose={() => setDatabaseState({...databaseState, openPopup: false})}
        position="bottom center">
        <div>
        <DatabaseStateDisplay data={databaseState.data}/>
        </div>
      </Popup>
    </div>
  );
};

export default OrbitDBStoreDisplay;