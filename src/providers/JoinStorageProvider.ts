import JoinEvent from "../model/JoinEvent";
import Store from 'orbit-db-store';

export default interface JoinStorageProvider {
  // List of join events
  getJoins(): string[];

  // Get a join event
  getJoinEvent(id: string): JoinEvent;

  // Add a join event
  addJoinEvent(event: JoinEvent): void;

  // Set current database
  setDatabase(id: string): void;

  // Set user
  setUser(id: string): void;

  // Connect to storage
  connectToStorage(s: Store): void;

  // Get storage address
  getStorageAddress(): string;

  // Get user ids of a database
  getUserIds(): string[];

  // Get joins of a specific user in the join database
  getUserJoins(id: string): JoinEvent[];
}
