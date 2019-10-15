import { DatabaseProvider } from "../providers/DatabaseProvider";
import * as OrbitDB from "orbit-db";
import * as IPFS from "ipfs";
import { Store } from "orbit-db-store";

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
      create: true,
      sync: true
    });

    const db: Store = await Promise.race([timeout, dbPromise]).catch(() => {
      throw new Error(`Timeout awaiting database ${address}`);
    });

    await db.load();
    return db;
  }
}
