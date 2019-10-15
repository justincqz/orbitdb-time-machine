import { NodeProvider } from "../providers/NodeProvider";
import DAGNode from "../model/DAGNode";
import { Store } from "orbit-db-store";
import { EventEmitter } from "events";

export class OrbitDBNodeProvider implements NodeProvider {

  private readonly store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  async getDatabaseGraph(): Promise<DAGNode> {
    // Read head of oplog
    let oplog: any = this.store._oplog;
    let heads: Array<any> = oplog.heads;

    console.log(oplog);
    if (heads.length === 0) {
      return DAGNode.emptyDAG();
    }

    return DAGNode.createDAG(heads[0]);
  }

  listenForDatabaseGraph(): EventEmitter {
    const emitter = new EventEmitter();
    this.store.events.on('replicated', () => {
      console.log('replicated');
      emitter.emit('refresh');
    })
    return emitter;
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
