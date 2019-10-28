import DAGNode from '../model/DAGNode';

export default interface OperationsLog {
  /**
   * @param operationsLog The operations log to compare with.
   * 
   * Returns a JSON containing the log entries that
   * are present in this log, but not in the provided .
   */
  findDifferences(operationsLog: OperationsLog): Object;

  /**
   * Returns a JSON string to represent a snapshot of the log.
   */
  toSnapshotJSON(): string;

  getHeads(): Array<string>;

  /**
   * Returns the underlying operations log.
   */
  getInnerLog(): any;
}
