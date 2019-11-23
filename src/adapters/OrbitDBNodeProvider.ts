import { NodeProvider } from "../providers/NodeProvider";
import DAGNode from "../model/DAGNode";
import OperationsLog from '../providers/OperationsLog';
import { OrbitDBOperationsLog } from "./OrbitDBOperationsLog";
import { DatabaseProvider } from "../providers/DatabaseProvider";
import Store from 'orbit-db-store';
import Index from 'orbit-db-store/src/Index';
import EventIndex from 'orbit-db-eventstore/src/EventIndex';
import KeyValueIndex from 'orbit-db-kvstore/src/KeyValueIndex';
import FeedIndex from 'orbit-db-feedstore/src/FeedIndex';
import CounterIndex from 'orbit-db-counterstore/src/CounterIndex';
import DocumentIndex from 'orbit-db-docstore/src/DocumentIndex';
import OrbitDBDatabaseTypes from "./OrbitDBDatabaseTypes";

export class OrbitDBNodeProvider implements NodeProvider {

  private readonly store: Store;
  private readonly dbInstance: DatabaseProvider;

  constructor(store: Store, dbInstance: DatabaseProvider) {
    this.store = store;
    this.dbInstance = dbInstance;
  }

  async getDatabaseGraph(limit: number): Promise<Array<DAGNode>> {
    // Read head of oplog
    let oplog: any = this.store._oplog;
    let heads: Array<any> = oplog.heads;

    if (heads.length === 0) {
      return [DAGNode.emptyDAG()];
    }

    return DAGNode.createDAG(heads, limit);
  }

  getOperationsLog(): OperationsLog {
    return new OrbitDBOperationsLog(this.store._oplog, this.dbInstance);
  }

  listenForDatabaseGraph(cb: () => void) {
    this.store.events.on('replicated', () => {
      cb();
    })
  }

  listenForLocalWrites(cb: () => void) {
    this.store.events.on('write', () => {
      cb();
    })
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

  getNodeInfo(node: DAGNode): Promise<any> {
    return this.getNodeInfoFromHash(node.hash);
  }

  getNodeInfoFromHash(nodeHash: string): Promise<any> {
    return this.store._oplog.get(nodeHash);
  }

  // TODO: Return type based on store type...
  // need a good generic representation for all return types.
  reconstructData(operationsLog: OperationsLog): any {
    let index;

    switch (this.store.type) {
      case 'store':
        index = new Index();
        break;

      case OrbitDBDatabaseTypes.EventStore:
        index = new EventIndex();
        break;

      case OrbitDBDatabaseTypes.DocumentStore:
        index = new DocumentIndex();
        break;

      case OrbitDBDatabaseTypes.FeedStore:
        index = new FeedIndex();
        break;

      case OrbitDBDatabaseTypes.CounterStore:
        index = new CounterIndex();
        break;

      case OrbitDBDatabaseTypes.KeyValueStore:
        index = new KeyValueIndex();
        break;

      default:
        console.error("Found unrecognised store type in OrbitDBOperationsLog.");
        return null;
    }

    let ipfsLog = operationsLog.getInnerLog();
    index.updateIndex(ipfsLog);
    return index;
  }
}
