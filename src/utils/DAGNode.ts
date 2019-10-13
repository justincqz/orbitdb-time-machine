import D3DataOutput, {D3Data} from './D3Data';

export default class DAGNode implements D3DataOutput {
  nodeList: DAGNode[];
  readonly hash: string;

  constructor(hash: string, nodeList: DAGNode[]) {
    this.nodeList = nodeList;
    this.hash = hash;
    this.toD3Data = this.toD3Data.bind(this);
  }

  addNext(node: DAGNode) {
    this.nodeList.push(node);
  }

  toD3Data(limit: number): D3Data {
    let result: D3Data = [];
    // Number of nodes visited
    let count: number = 0;
    // Queue of nodes to visit in BFS
    let visitQueue: DAGNode[] = [];

    // Add this node to queue
    visitQueue.push(this);

    while (count < limit && visitQueue.length > 0) {
      // Remove head of queue
      let node = visitQueue.shift();
      let cur: { id: string, parentIds: string[] } = {
        id: node.hash,
        parentIds: []
      };

      // Add all parents visit list and output
      for (let parent of node.nodeList) {
        visitQueue.push(parent);
        cur.parentIds.push(parent.hash);
      }
      result.push(cur);
      count++;
    }
    return result;
  }

  static emptyDAG(): DAGNode {
    return new DAGNode("EMPTY", []);
  }

  static createDAG(head: any): DAGNode {

    const curr: DAGNode = new DAGNode(head.hash, []);

    if (head.next) {
      head.next.reduce((acc, n) => {
        const next: DAGNode = new DAGNode(n, []);
        acc.addNext(next);
        return next;
      }, curr);
    }

    return curr;
  }
}
