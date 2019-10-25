import JoinStorageProvider from '../providers/JoinStorageProvider';
import JoinEvent from '../model/JoinEvent';

export default class LocalStoreageJoinProvider implements JoinStorageProvider {

  constructor() {
    if (!window.localStorage) {
      throw new Error("Local Storage not supported by browser.");
    }
  }

  nextId(): string {
    return `${window.localStorage.length}`;
  }

  getJoins(): string[] {
    let vals: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      vals.push(`${window.localStorage.key(i)}`);
    }
    return vals;
  }

  getJoinEvent(id: string): JoinEvent {
    return JSON.parse(window.localStorage.getItem(id)) as JoinEvent;
  }

  addJoinEvent(event: JoinEvent) {
    window.localStorage.setItem(this.nextId(), JSON.stringify(event));
  }
}
