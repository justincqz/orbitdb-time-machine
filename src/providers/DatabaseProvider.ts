import {Store} from 'orbit-db-store';

export interface DatabaseProvider {

  // Creates database. Returns store
  createDatabase(name: string): Promise<Store>;

  openDatabase(address: string): Promise<Store>;

  close(): Promise<void>;
}
