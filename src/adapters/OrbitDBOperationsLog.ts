import OperationsLog from '../providers/OperationsLog';
import Log from 'ipfs-log';
import { DatabaseProvider } from '../providers/DatabaseProvider';

export class OrbitDBOperationsLog implements OperationsLog {

  private readonly oplog: Log;
  private readonly dbInstance: DatabaseProvider;

  constructor(oplog: Log, dbInstance: DatabaseProvider) {
    this.oplog = oplog;
    this.dbInstance = dbInstance;
  }

  findDifferences(otherLog: OperationsLog): Object {
    return Log.difference(this.oplog, otherLog);
  }

  toSnapshotJSON(): string {
    return this.oplog.toSnapshot();
  }

  wasJustJoined(): boolean {

    for (let headEntry of this.oplog.heads) {
      if (!this.dbInstance.isResponsibleForEntry(headEntry)) {
        console.log("join has occurred!");
        return true;
      }
    }

    return false;
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
