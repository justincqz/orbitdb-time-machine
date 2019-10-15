import DAGNode from "./DAGNode";

export interface DatabaseProvider {
  getDatabaseGraph(): Promise<DAGNode>;

  listenForDatabaseGraph(): AsyncGenerator<DAGNode>;

  getEdges(node: DAGNode): any;

  getNodeInfo(node: DAGNode): Promise<any>;
}
