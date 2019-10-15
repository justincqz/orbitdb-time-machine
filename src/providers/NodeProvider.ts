import DAGNode from "../model/DAGNode";
import { EventEmitter } from 'events'

export interface NodeProvider {
  getDatabaseGraph(): Promise<DAGNode>;

  listenForDatabaseGraph(cb: () => void): void;

  getEdges(node: DAGNode): any;

  getNodeInfo(node: DAGNode): Promise<any>;
}
