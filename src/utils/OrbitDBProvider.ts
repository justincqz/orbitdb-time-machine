import { DatabaseProvider } from "./DatabaseProvider";
import DAGNode from "./DAGNode";
import * as IPFS from "ipfs";
import * as OrbitDB from "orbit-db";
import { Store } from "orbit-db-store";

const ipfsOptions = {
  EXPERIMENTAL: {
    pubsub: true
  }
};

export class OrbitDBProvider implements DatabaseProvider {
  private readonly address: string;

  constructor(address: string) {
    this.address = address;
  }

  async getDatabaseGraph(): Promise<DAGNode> {
    // Checks if address supplied is valid
    if (!OrbitDB.isValidAddress(this.address)) {
      throw Error("Invalid OrbitDB address supplied: " + this.address);
    }

    // Creates an IPFS instance and waits till its ready
    const ipfs: IPFS = new IPFS(ipfsOptions);
    await ipfs.ready;

    // Creates an OrbitDB instance on top of IPFS
    const dbInstance: OrbitDB = await OrbitDB.createInstance(ipfs);

    // Connects to address of DB and waits for it to load
    let timeout = new Promise((_, reject) =>
      setTimeout(() => {
        reject();
      }, 5000)
    );

    const dbPromise: Promise<Store> = dbInstance.open(this.address, {
      create: true
    });

    const db: Store = await Promise.race([timeout, dbPromise]).catch(() => {
      throw new Error(`Timeout awaiting database ${this.address}`);
    });

    await db.load();

    // Read head of oplog
    let oplog: any = db._oplog;
    let heads: Array<any> = oplog.heads;

    if (heads.length === 0) {
      return DAGNode.emptyDAG();
    }

    return DAGNode.createDAG(heads[0], db, 10);
  }

  getEdges(node: DAGNode): Array<[string, string]> {
    const queue: Array<DAGNode> = [];
    const visited: any = {};
    const edges: Array<[string, string]> = [];

    queue.push(node);

    while (queue.length !== 0) {
      const curr: DAGNode = queue.pop();

      curr.nodeList.forEach(node => {
        if (!visited[node.hash]) {
          visited[node.hash] = 1;
          queue.push(node);
        }

        edges.push([curr.hash, node.hash]);
      });
    }

    return edges;
  }
}
