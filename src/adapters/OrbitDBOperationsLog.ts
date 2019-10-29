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

  getHeads(): Array<string> {

    let heads = this.oplog.heads;

    return heads;
  }

  getInnerLog(): any {
    return this.oplog;
  }
}
