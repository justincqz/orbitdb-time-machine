import OperationsLog from '../providers/OperationsLog';
import Log from 'ipfs-log';
import { DatabaseProvider } from '../providers/DatabaseProvider';
import EventIndex from 'orbit-db-eventstore/src/EventIndex';

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

  // Assumes EventIndex for now. Pass into constructor next time?
  reconstructData(): any {
    // switch (this.store.type) {
    //   case 'store':
    //     break;
    //   case 'eventlog':
    console.log("Constructing new EventIndex");
    let index = new EventIndex();

    console.log("Updating log to");
    console.log(this.oplog);
    index.updateIndex(this.oplog);

    let result = index.get();
    console.log("Result");
    console.log(result);
    return result;
    //   default:
    //     return;
    // }
  }
}
