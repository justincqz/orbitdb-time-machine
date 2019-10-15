import DAGNode from "../model/DAGNode";
import { EventEmitter } from 'events'

export interface NodeProvider {
  getDatabaseGraph(): Promise<DAGNode>;

  listenForDatabaseGraph(): EventEmitter;

  getEdges(node: DAGNode): any;

  getNodeInfo(node: DAGNode): Promise<any>;
}
