import { Store } from 'orbit-db-store';
import DatabaseFactory from '../model/DatabaseFactory';
import OperationsLog from './OperationsLog';

export interface DatabaseProvider {

  // Creates database factory
  createDBFactory(name: string): DatabaseFactory;

  openDatabase(address: string): Promise<Store>;

  close(): Promise<void>;

  /**
   * @param entries The operation log snapshot JSON string used to fetch/construct operations log.
   * @param callback The callback to be called once the operations log is fetched/constructed.
   * A Promise containing the fetched/constructed operations log.
   */
  operationsLogFromSnapshot(snapshot: string, callback: (log: OperationsLog) => void);

  /**
   * @param entries The operation log entries to reconstruct an operations log from
   * A Promise containing the newly constructed operations log.
   */
  // TODO: Replace with entry class.
  constructOperationsLogFromEntries(entries: Array<any>): Promise<OperationsLog>;
}
