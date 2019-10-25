import DAGNode from "../model/DAGNode";
import { EventEmitter } from 'events'
import OperationsLog from "./OperationsLog";

export interface NodeProvider {
  getDatabaseGraph(): Promise<DAGNode>;

  listenForDatabaseGraph(cb: () => void): void;
  
  listenForLocalWrites(cb: () => void): void;

  getEdges(node: DAGNode): any;

  getNodeInfo(node: DAGNode): Promise<any>;

  getNodeInfoFromHash(nodeHash: String): Promise<any>;

  getOperationsLog(): OperationsLog;
}
