import { Store } from 'orbit-db-store';
import OrbitDBDatabaseTypes from '../adapters/OrbitDBDatabaseTypes';

export default interface DatabaseFactory {
  // Creates the initialised database. Returns store
  create(): Promise<Store>;

  // Sets the name of the database
  setName(name: string): DatabaseFactory;

  // Sets the type of the database
  setType(type: OrbitDBDatabaseTypes): DatabaseFactory;

  // Takes in an object of options, and adds it to the factory
  // Current supported options:
  //   isPublic: <boolean>
  //     Set if everyone has write access (default: false)
  //   type: <string>
  //     Set type of database to create   (default: 'eventlog')
  addOptions(options: any): DatabaseFactory;
}
