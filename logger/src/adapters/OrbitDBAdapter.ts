import * as OrbitDB from "orbit-db";
import * as IPFS from "ipfs";
import { Store } from "orbit-db-store";
import DatabaseProvider from '../providers/DatabaseProvider';

const ipfsOptions = {
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    Addresses: {
      Swarm: [
        // Use IPFS dev signal server
        // Websocket:
        // '/dns4/ws-star-signal-1.servep2p.com/tcp/443/wss/p2p-websocket-star',
        // '/dns4/ws-star-signal-2.servep2p.com/tcp/443/wss/p2p-websocket-star',
        '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
        // WebRTC:
        // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
        // Use local signal server
        // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
      ]
    },
  }
};

export default class OrbitDBAdapter implements DatabaseProvider {
  protected readonly dbInstance: OrbitDB;
  protected readonly ipfs: IPFS;
  protected static IPFS: IPFS;

  protected constructor(dbInstance: OrbitDB, ipfs: IPFS) {
    this.dbInstance = dbInstance;
    this.ipfs = ipfs;
  }

  static async build(): Promise<OrbitDBAdapter> {
    const [dbInstance, ipfs] = await this.newDBInstance();
    return new OrbitDBAdapter(dbInstance, ipfs);
  }

  protected static async newDBInstance(): Promise<[OrbitDB, IPFS]> {
    // Creates an IPFS instance and waits till its ready
    if (OrbitDBAdapter.IPFS === undefined || OrbitDBAdapter.IPFS === null) {
      console.log("creating ipfs instance")
      OrbitDBAdapter.IPFS = new IPFS(ipfsOptions)
    }
    const ipfs = OrbitDBAdapter.IPFS;
    await ipfs.ready;
    const db = await OrbitDB.createInstance(ipfs);

    // Creates an OrbitDB instance on top of IPFS
    return [db, ipfs];
  }

  // Connects to address of DB and waits for it to load
  async openDatabase(address: string): Promise<Store> {
    // Checks if address supplied is valid
    if (!OrbitDB.isValidAddress(address)) {
      throw Error("Invalid OrbitDB address supplied: " + address);
    }

    let timeout = new Promise((_, reject) =>
      setTimeout(() => {
        reject(new Error(`Timeout awaiting database ${address}`));
      }, 5000)
    );

    const dbPromise: Promise<Store> = this.dbInstance.open(address, {
      create: true,
      sync: true
    });

    // If any promise fails via a thrown error, we let it fall through.
    const db: Store = await Promise.race([timeout, dbPromise]);

    await db.load();
    return db;
  }

  async close(): Promise<void> {
    // this.ipfs.stop();
  }
}
