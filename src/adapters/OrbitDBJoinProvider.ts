import JoinStorageProvider from '../providers/JoinStorageProvider';
import JoinEvent from '../model/JoinEvent';
import Store from 'orbit-db-store';

export default class OrbitDBJoinProvider implements JoinStorageProvider {
  currentDatabase : string = null;
  currentUser : string = null;
  orbitDBStorage = null;

  readonly storageAddress : string = "/orbitdb/zdpuApcbZpiyV3HU5ojrTMuvcBwfdewGQWqQgKU8NfuDUXafW/JoinStorage";

  connectToStorage(s : Store) {
    this.orbitDBStorage = s;
  }

  getStorageAddress(): string {
    return this.storageAddress;
  }

  setDatabase(id: string) {
    this.currentDatabase = id;
  }

  setUser(id: string) {
    this.currentUser = id;
  }

  constructor() {
    this.currentUser = null;
    this.currentDatabase = null;
  }

  getJoins(): string[] {
    this.checkInitialization();

    let databaseMetadataList = this.orbitDBStorage.get(this.currentDatabase);
    let databaseMetadata;

    console.log(databaseMetadataList);

    if (databaseMetadataList.length === 0) {
      databaseMetadata = {"_id": this.currentDatabase};
    } else {
      databaseMetadata = databaseMetadataList[0];
    }

    console.log(databaseMetadata);
    console.log(databaseMetadata[this.currentUser]);
    // This is the first time we are debugging this database - no object exists
    // in orbitDB storage
    if (databaseMetadata[this.currentUser] === undefined) {
      console.log("intitialising metadata for user");
      databaseMetadata[this.currentUser] = [];
      this.orbitDBStorage.put(databaseMetadata);
    }

    console.log(databaseMetadata);

    let vals: string[] = [];
    for (let i = 0; i < databaseMetadata[this.currentUser].length; i++) {
      vals.push(`${i}`);
    }
    return vals;
  }

  getJoinEvent(id: string): JoinEvent {
    this.checkInitialization();

    return new JoinEvent(this.orbitDBStorage.get(this.currentDatabase)[0][this.currentUser][id]);
  }

  addJoinEvent(event: JoinEvent) {
    this.checkInitialization();

    const databaseMetadata = this.orbitDBStorage.get(this.currentDatabase)[0];
    const userMetadata = databaseMetadata[this.currentUser];
    console.log(databaseMetadata);

    userMetadata.push(event.root);
    databaseMetadata[this.currentUser] = userMetadata;

    console.log(userMetadata);

    this.orbitDBStorage.put(databaseMetadata);
  }

  checkInitialization() {
    // You forgot to set the current database
    if (this.currentDatabase === null) {
      throw new Error("Current database has not been initialised");
    }

    // You forgot to connect to orbitDB storage
    if (this.orbitDBStorage === null) {
      throw new Error("Have not connected to OrbitDB storage");
    }

    // You forgot to set user
    if (this.currentUser === null) {
      throw new Error("Current user has not been set");
    }
  }
}
