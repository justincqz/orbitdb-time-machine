import {DatabaseProvider} from "./DatabaseProvider";
import {DAGNode} from "./DAGNode";
import * as IPFS from 'ipfs';
import * as OrbitDB from 'orbit-db';
import {Store} from 'orbit-db-store';

const ipfsOptions = {
    EXPERIMENTAL: {
        pubsub: true
    }
};

export class OrbitDBProvider implements DatabaseProvider {

    private readonly address: string;
    private readonly ipfs: IPFS;
    private readonly dbInstance: OrbitDB;
    private readonly store: Store;

    private constructor(address: string, ipfs: IPFS, dbInstance: OrbitDB, store: Store) {
        this.address = address;
        this.ipfs = ipfs;
        this.dbInstance = dbInstance;
        this.store = store;
    }

    static async build(address: string): Promise<OrbitDBProvider> {
        // Checks if address supplied is valid
        if (!OrbitDB.isValidAddress(address)) {
            throw Error("Invalid OrbitDB address supplied: " + address);
        }

        // Creates an IPFS instance and waits till its ready
        const ipfs: IPFS = new IPFS(ipfsOptions);
        await ipfs.ready;

        // Creates an OrbitDB instance on top of IPFS
        const dbInstance: OrbitDB = await OrbitDB.createInstance(ipfs);

        // Connects to address of DB and waits for it to load
        const db: Store = await dbInstance.open(address);
        await db.load();

        return new OrbitDBProvider(address, ipfs, dbInstance, db);
    }

    async getDatabaseGraph(): Promise<DAGNode> {
        // Read head of oplog
        let oplog: any = this.store._oplog;
        let heads: Array<any> = oplog.heads;

        if (heads.length == 0) {
            return DAGNode.emptyDAG();
        }

        return DAGNode.createDAG(heads[0], this.store, 10);
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

    async getNodeInfo(node: DAGNode): Promise<any> {
        return this.store.get(node.hash);
    }
}