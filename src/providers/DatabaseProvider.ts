import { Store } from 'orbit-db-store';
import DatabaseFactory from '../model/DatabaseFactory';
import OperationsLog from './OperationsLog';

export interface DatabaseProvider {

  // Creates database factory
  createDBFactory(name: string): DatabaseFactory;

  openDatabase(address: string): Promise<Store>;

  close(): Promise<void>;

  operationsLogFromSnapshot(snapshot: string, callback: (log: OperationsLog) => void);

  // TODO: Replace with entry class.
  constructOperationsLogFromEntries(entries: Array<any>): Promise<OperationsLog>;
}
