import * as OrbitDB from "orbit-db";
import * as IPFS from "ipfs";
import { Store } from "orbit-db-store";
import { DatabaseProvider } from "../providers/DatabaseProvider";
import DatabaseFactory from "../model/DatabaseFactory";
import OrbitDBFactory from './OrbitDBFactory';
import OperationsLog from '../providers/OperationsLog'
import Log from 'ipfs-log';

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
  private readonly ipfs: IPFS;

  private constructor(dbInstance: OrbitDB, ipfs: IPFS) {
    this.dbInstance = dbInstance;
    this.ipfs = ipfs;
  }

  static async build(): Promise<OrbitDBProvider> {
    // Creates an IPFS instance and waits till its ready
    const ipfs: IPFS = new IPFS(ipfsOptions);
    await ipfs.ready;

    // Creates an OrbitDB instance on top of IPFS
    const dbInstance: OrbitDB = await OrbitDB.createInstance(ipfs);

    return new OrbitDBProvider(dbInstance, ipfs);
  }

  createDBFactory(name: string): DatabaseFactory {
    return new OrbitDBFactory(this.dbInstance, name);
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

  async close(): Promise<void> {
    this.ipfs.stop();
  }
  
  operationsLogFromSnapshot(snapshot: string, callback: (log: OperationsLog) => void) {
    Log.fromJSON(this.ipfs, this.dbInstance.identity, snapshot)
      .then(callback);
  }

  // TODO: Repalce with adapter entry class.
  isResponsibleForEntry(entry: any): boolean {
    console.log("dbInstance identity");
    console.log(this.dbInstance.identity);
    console.log("Entry identity");
    console.log(entry.identity);
    console.log("isResponsibleForEntry returning: " + entry.identity === this.dbInstance.identity);
    return entry.identity === this.dbInstance.identity;
  }
}
