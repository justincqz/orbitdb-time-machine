import JoinEvent from "../model/JoinEvent";
import Store from 'orbit-db-store';

export default interface JoinStorageProvider {
  // List of join events
  getJoins(): string[];

  // Get a join event
  getJoinEvent(id: string): JoinEvent;

  // Add a join event
  addJoinEvent(event: JoinEvent);

  // Set current database
  setDatabase(id: string);

  // Set user
  setUser(id: string);

  // Connect to storage
  connectToStorage(s: Store);

  // Get storage address
  getStorageAddress();
}
