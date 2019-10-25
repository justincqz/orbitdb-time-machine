import OperationsLog from '../providers/OperationsLog';
import Log from 'ipfs-log';

export class OrbitDBOperationsLog implements OperationsLog {

  private readonly oplog: Log;

  constructor(oplog: Log) {
    this.oplog = oplog;
  }

  findDifferences(otherLog: OperationsLog): Object {
    return Log.difference(this.oplog, otherLog);
  }

  toSnapshotJSON(): string {
    return this.oplog.toSnapshot();
  }

  wasJustJoined(): boolean {
    return this.oplog.heads.length > 1;
  }

  getHeads(): Array<string> {

    let heads = this.oplog.heads;
    console.log("oplog to query heads");
    console.log(this.oplog);
    console.log("Heads");
    console.log(heads);

    return heads;
  }
}
