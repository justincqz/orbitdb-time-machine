import { DatabaseProvider } from "../providers/DatabaseProvider";
import * as OrbitDB from "orbit-db";
import * as IPFS from "ipfs";
import { Store } from "orbit-db-store";

const ipfsOptions = {
  EXPERIMENTAL: {
    pubsub: true
  }
};

export default class OrbitDBProvider implements DatabaseProvider {
  private readonly dbInstance: OrbitDB;

  private constructor(dbInstance: OrbitDB) {
    this.dbInstance = dbInstance;
  }

  static async build(): Promise<OrbitDBProvider> {
    // Creates an IPFS instance and waits till its ready
    const ipfs: IPFS = new IPFS(ipfsOptions);
    await ipfs.ready;

    // Creates an OrbitDB instance on top of IPFS
    const dbInstance: OrbitDB = await OrbitDB.createInstance(ipfs);

    return new OrbitDBProvider(dbInstance);
  }

  async createDatabase(name: string): Promise<any> {
    const db: any = this.dbInstance.create(name, "eventlog");
    return db;
  }

  // Connects to address of DB and waits for it to load
  async openDatabase(address: string): Promise<Store> {
    // Checks if address supplied is valid
    if (!OrbitDB.isValidAddress(address)) {
      throw Error("Invalid OrbitDB address supplied: " + address);
    }

    let timeout = new Promise((_, reject) =>
      setTimeout(() => {
        reject();
      }, 5000)
    );

    const dbPromise: Promise<Store> = this.dbInstance.open(address, {
      create: true
    });

    const db: Store = await Promise.race([timeout, dbPromise]).catch(() => {
      throw new Error(`Timeout awaiting database ${address}`);
    });

    await db.load();
    return db;
  }
}
