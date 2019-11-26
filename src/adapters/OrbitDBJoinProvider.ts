import JoinStorageProvider from '../providers/JoinStorageProvider';
import JoinEvent from '../model/JoinEvent';
import Store from 'orbit-db-store';

export default class OrbitDBJoinProvider implements JoinStorageProvider {
  currentDatabase : string = null;
  currentUser : string = null;
  orbitDBStorage = null;

  readonly storageAddress : string = "/orbitdb/zdpuApcbZpiyV3HU5ojrTMuvcBwfdewGQWqQgKU8NfuDUXafW/JoinStorage";

  connectToStorage(s : Store): void {
    this.orbitDBStorage = s;
  }

  getStorageAddress(): string {
    return this.storageAddress;
  }

  setDatabase(id: string): void {
    this.currentDatabase = id;
  }

  setUser(id: string): void {
    this.currentUser = id;
  }

  constructor() {
    this.currentUser = null;
    this.currentDatabase = null;
  }

  getDatabaseJoins(databaseMetadataList: any): any {
    if (databaseMetadataList.length === 0) {
      return {"_id": this.currentDatabase};
    } else {
      return databaseMetadataList[0];
    }
  }

  getUserIds(): string[] {
    this.checkInitialization();

    let databaseMetadataList = this.orbitDBStorage.get(this.currentDatabase);
    let databaseMetadata = this.getDatabaseJoins(databaseMetadataList);

    let userIds = [];

    for (let key in databaseMetadata) {
      if (databaseMetadata.hasOwnProperty(key) && key !== "_id") {
        userIds.push(key);
      }
    }

    return userIds;
  }

  getUserJoins(id: string): JoinEvent[] {
    this.checkInitialization();

    let databaseMetadataList = this.orbitDBStorage.get(this.currentDatabase);
    let databaseMetadata = this.getDatabaseJoins(databaseMetadataList);

    if (databaseMetadata[id] === undefined) {
      console.log("Intitialising metadata for user");
      databaseMetadata[id] = [];
      this.orbitDBStorage.put(databaseMetadata);
    }

    return databaseMetadata[id].map(join => {
      return new JoinEvent(join);
    });
  }

  mergeChildrenNodes(head1: any, head2: any): any {
    let mergedNodes = [];

    for (let i = 0; i < head1.children.length; i++) {
      let childNode1 = head1.children[i];
      let childNode2;
      for (let j = 0; j < head2.children.length; j++) {
        if (childNode1.id === head2.children[j].id) {
          childNode2 = head2.children[j];
        }
      }

      if (childNode2 !== undefined) {
        mergedNodes.push(
          this.mergeChildrenNodes(childNode1, childNode2)
        );

      } else {
        mergedNodes.push(childNode1);
      }
    }

    for (let j = 0; j < head2.children.length; j++) {
      let found = false;
      for (let k = 0; k < mergedNodes.length; k++) {
        if (head2.children[j].id === mergedNodes[k].id) {
          found = true;
        }
      }

      if (!found) {
        mergedNodes.push(head2.children[j]);
      }
    }

    return {
      id: head1.id,
      payload: head1.payload,
      children: mergedNodes
    };
  }

  mergeJoins(localJoins: any[], onlineJoins:any[]): any {
    let mergedJoins = [];

    for (let i = 0; i < localJoins.length; i++) {
      let found = false;

      for (let j = 0; j < onlineJoins.length; j++) {
        if (onlineJoins[j].id === localJoins[i].id) {
          mergedJoins.push(this.mergeChildrenNodes(onlineJoins[j], localJoins[i]));
          found = true;
        }
      }

      if (!found) {
        mergedJoins.push(localJoins[i]);
      }
    }

    for (let j = 0; j < onlineJoins.length; j++) {
      let found = false;
      for (let k = 0; k < mergedJoins.length; k++) {
        if (onlineJoins[j].id === mergedJoins[k].id) {
          found = true;
        }
      }

      if (!found) {
        mergedJoins.push(onlineJoins[j]);
      }
    }

    return mergedJoins;
  }

  updateJoins() {
    if (window.localStorage.getItem(this.currentDatabase) !== null) {
      console.log("Uploading from local storage to OrbitDB...");
      let localUserData = window.localStorage.getItem(this.currentDatabase);


      let databaseMetadataList = this.orbitDBStorage.get(this.currentDatabase);
      let databaseMetadata = this.getDatabaseJoins(databaseMetadataList);

      let currentUserData = databaseMetadata[this.currentUser];
      if (currentUserData === undefined) {
        currentUserData = [];
      }

      databaseMetadata[this.currentUser] = this.mergeJoins(JSON.parse(localUserData), currentUserData);

      this.orbitDBStorage.put(databaseMetadata);
    }
  }

  getJoins(): string[] {
    this.checkInitialization();

    let databaseMetadataList = this.orbitDBStorage.get(this.currentDatabase);
    let databaseMetadata = this.getDatabaseJoins(databaseMetadataList);

    // This is the first time we are debugging this database - no object exists
    // in orbitDB storage
    if (databaseMetadata[this.currentUser] === undefined) {
      console.log("intitialising metadata for user");
      databaseMetadata[this.currentUser] = [];
      this.orbitDBStorage.put(databaseMetadata);
    }

    this.updateJoins();

    window.localStorage.setItem(this.currentDatabase, JSON.stringify(databaseMetadata[this.currentUser]));

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

    userMetadata.push(event.root);
    databaseMetadata[this.currentUser] = userMetadata;


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
