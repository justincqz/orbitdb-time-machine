import React, { useState } from 'react';
import "react-table/react-table.css";
import { DatabaseProvider } from '../providers/DatabaseProvider';
import GraphDisplay, { GraphDisplayNodeMouseEvents } from './viewDatabase/GraphDisplay';
import { D3Data } from '../model/D3Data';
import DAGNodeTooltip from './viewDatabase/DAGNodeTooltip';
import storeDisplayStyles from './StoreDisplay.module.css';
import { NodeProvider } from '../providers/NodeProvider';
import DatabaseUIProvider from '../providers/DatabaseUIProvider';

/**
 * The component responsible for displaying an OrbitDB Store.
 * Includes generic logic such as tooltip positioning.
 * 
 * @param operationLogData The operations log graph we need to visualise
 * @param nodeProvider The store we need to visualise
 * @param dbProvider The underlying OrbitDB database.
 * @param uiProvider Provides store-specific components to render.
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
    index: null
  });

  /**
   * Handler for the onclick event for the rendered nodes in GraphDisplay.
   * Reconstructs data based on the given entry's hash.
   *
   * @param entryHash The hash of the entry corresponding to the GraphDisplay node
   * @param DOMElem The DOM element that registered this click event
   */
  function onOperationLogNodeClick(entryHash: string, DOMElem: Element): void {
    try {
      let nodeEntry = nodeProvider.getNodeInfoFromHash(entryHash);
      dbProvider.constructOperationsLogFromEntries([nodeEntry]).then((operationsLog) => {
        let reconstructedDataIndex = nodeProvider.reconstructData(operationsLog);
        setDatabaseState({
          ...databaseState,
          index: reconstructedDataIndex
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


  let eventCallbacks: GraphDisplayNodeMouseEvents = {
    'click': onOperationLogNodeClick,
    'mouseenter': onOperationLogNodeMouseEnter,
    'mouseleave': onOperationLogNodeMouseLeave
  };

  return (
    <div className={storeDisplayStyles.container}>
      {
        toolTipState.nodeInfo && (
          <DAGNodeTooltip 
            title={uiProvider.getTooltipTitle(toolTipState.nodeInfo)}
            message={uiProvider.getTooltipMsg(toolTipState.nodeInfo)}
            rect={toolTipState.targetRect}
          />
        )
      }
      <div>
      <GraphDisplay
        inputData={operationLogData}
        mouseEvents={eventCallbacks}
        nodeColour='#7bb1f1ff'
        lineColour='#1d5495ff'
      />
      </div>
      <div className={storeDisplayStyles.table}>
        { databaseState.index && (
          <uiProvider.getDataDisplay index={databaseState.index} />
        )}
      </div>
    </div>
  );
};

export default OrbitDBStoreDisplay;
