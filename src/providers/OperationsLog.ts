import DAGNode from '../model/DAGNode';

export default interface OperationsLog {
  findDifferences(OperationsLog): Object;
  toSnapshotJSON(): string;
  getHeads(): Array<string>
}
