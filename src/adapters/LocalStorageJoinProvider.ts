import JoinStorageProvider from '../providers/JoinStorageProvider';
import JoinEvent from '../model/JoinEvent';

export default class LocalStoreageJoinProvider implements JoinStorageProvider {

  constructor() {
    if (!window.localStorage) {
      throw new Error("Local Storage not supported by browser.");
    }
  }

  nextId(): string {
    return `${localStorage.length}`;
  }

  getJoins(): string[] {
    let vals: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      vals.push(`${localStorage.key(i)}`);
    }
    return vals;
  }

  getJoinEvent(id: string): JoinEvent {
    return JSON.parse(localStorage.getItem(id)) as JoinEvent;
  }

  addJoinEvent(event: JoinEvent) {
    localStorage.put(this.nextId(), JSON.stringify(event));
  }
}
