import JoinEvent from "../model/JoinEvent";

export default interface JoinStorageProvider {
  // List of join events
  getJoins(): string[];

  // Get a join event
  getJoinEvent(id: string): JoinEvent;

  // Add a join event
  addJoinEvent(event: JoinEvent);

  // Set current database
  setDatabase(id: string);

}
