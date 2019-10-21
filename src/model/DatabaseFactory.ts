import { Store } from 'orbit-db-store';

export default interface DatabaseFactory {
  // Creates the initialised database. Returns store
  create(): Promise<Store>;

  // Sets the name of the database
  setName(name: string): DatabaseFactory;

  // Takes in an object of options, and adds it to the factory
  // Current supported options:
  //   isPublic: <boolean>
  //     Set if everyone has write access (default: false)
  addOptions(options: any): DatabaseFactory;
}
