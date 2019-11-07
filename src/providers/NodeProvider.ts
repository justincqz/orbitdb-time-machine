import DAGNode from "../model/DAGNode";
import OperationsLog from "./OperationsLog";

export interface NodeProvider {
  getDatabaseGraph(): Promise<DAGNode>;

  listenForDatabaseGraph(cb: () => void): void;
  
  /**
   * @param {() => void} cb The callback to run after intercepting a local write event.
   */
  listenForLocalWrites(cb: () => void): void;

  getEdges(node: DAGNode): any;

  getNodeInfo(node: DAGNode): Promise<any>;
  getNodeInfoFromHash(nodeHash: String): Promise<any>;

  /**
   * Returns the current operations log.
   */
  getOperationsLog(): OperationsLog;

  /**
   * @param {OperationsLog} operationsLog The operations log used by provider to reconstruct the data by replaying changes.
   * Returns the reconstructed data. Contents depend on the underlying Database type.
   */
  // TODO: Variable return types depending on store types.
  reconstructData(operationsLog: OperationsLog): any;
}
