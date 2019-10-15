import DAGNode from "../model/DAGNode";

export interface NodeProvider {
  getDatabaseGraph(): Promise<DAGNode>;

  listenForDatabaseGraph(): AsyncGenerator<DAGNode>;

  getEdges(node: DAGNode): any;

  getNodeInfo(node: DAGNode): Promise<any>;
}
