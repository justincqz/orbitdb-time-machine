import {Store} from 'orbit-db-store';

export interface DatabaseProvider {

  // Creates database. Returns address
  createDatabase(name: string): Promise<string>;

  openDatabase(address: string): Promise<Store>;

}
