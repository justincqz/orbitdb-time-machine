import { NodeProvider } from "../providers/NodeProvider";
import DAGNode from "../model/DAGNode";
import { Store } from "orbit-db-store";
import OperationsLog from '../providers/OperationsLog';
import { OrbitDBOperationsLog } from "./OrbitDBOperationsLog";
import { DatabaseProvider } from "../providers/DatabaseProvider";

export class OrbitDBNodeProvider implements NodeProvider {

  private readonly store: Store;
  private readonly dbInstance: DatabaseProvider;

  constructor(store: Store, dbInstance: DatabaseProvider) {
    this.store = store;
    this.dbInstance = dbInstance;
  }

  async getDatabaseGraph(): Promise<DAGNode> {
    // Read head of oplog
    let oplog: any = this.store._oplog;
    let heads: Array<any> = oplog.heads;

    if (heads.length === 0) {
      return DAGNode.emptyDAG();
    }

    return DAGNode.createDAG(heads)[0];
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

  async getNodeInfo(node: DAGNode): Promise<any> {
    return this.store.get(node.hash);
  }

  async getNodeInfoFromHash(nodeHash: String): Promise<any> {
    return this.store.get(nodeHash);
  }
}
