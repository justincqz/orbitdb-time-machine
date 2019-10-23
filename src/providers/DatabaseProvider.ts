import { Store } from 'orbit-db-store';
import DatabaseFactory from '../model/DatabaseFactory';

export interface DatabaseProvider {

  // Creates database factory
  createDBFactory(name: string): DatabaseFactory;

  openDatabase(address: string): Promise<Store>;

  close(): Promise<void>;
}
