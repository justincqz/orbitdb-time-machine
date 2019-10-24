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
    // Number of nodes visited
    let count: number = 0;
    // Queue of nodes to visit in BFS
    let visitQueue: DAGNode[] = [];
    // Queue of D3 nodes to visit in BFS
    let resultMap: any = {};

    // Add this node to queue
    visitQueue.push(this);

    let root: { id: string, children: D3Data[] } = {
      id: this.hash,
      children: []
    };

    resultMap[this.hash] = root;
    count++;
    while (count < limit && visitQueue.length > 0) {
      // Remove head of queue
      let visitNode = visitQueue.shift();

      let cur: { id: string, children: D3Data[] } = resultMap[visitNode.hash];

      // Add all parents visit list and output
      for (let child of visitNode.nodeList) {
        visitQueue.push(child);

        let childD3Node = resultMap[child.hash];

        if (childD3Node === undefined) {
          childD3Node = {
            id: child.hash,
            children: []
          };

          resultMap[child.hash] = childD3Node;
        }

        cur.children.push(childD3Node);
      }
      count++;
    }

    return resultMap[this.hash];
  }

  static emptyDAG(): DAGNode {
    return new DAGNode("EMPTY", []);
  }

  private static createStraightDAG(allNodes: any, head: any): DAGNode {
    let headNode: DAGNode = new DAGNode(head.hash, []);

    if (head.next && head.next.length !== 0) {
      let headParent: DAGNode = allNodes[head.next[0]] !== undefined
        ? allNodes[head.next[0]]
        : new DAGNode(head.next[0], []);
      headParent.nodeList.push(headNode);

      allNodes[head.next[0]] = headParent;
    }

    for (let i: number = 0; i < head.next.length; i++) {
      let node: DAGNode = allNodes[head.next[i]] !== undefined
        ? allNodes[head.next[i]]
        : new DAGNode(head.next[i], []);

      if (i + 1 < head.next.length) {
        let parentNode: DAGNode = allNodes[head.next[i + 1]] !== undefined
          ? allNodes[head.next[i + 1]]
          : new DAGNode(head.next[i + 1], []);

        if (!parentNode.nodeList.includes(node)) {
          parentNode.nodeList.push(node);
        }

        allNodes[head.next[i + 1]] = parentNode;
      }

      allNodes[head.next[i]] = node;
    }

    return allNodes[head.next[head.next.length - 1]];
  }

  static createDAG(heads: any[]): DAGNode[] {
    let allNodes: any = {};

    if (heads.length === 1) {
      return [this.createStraightDAG(allNodes, heads[0])];
    }

    // Get list of common ancestors
    let commonAncestorList: any[] = heads.reduce((ancestors, h2) => {
      let currentIndex: number = 0;

      while (h2.next && !h2.next.includes(ancestors[currentIndex])) {
        currentIndex++;
      }

      return ancestors.slice(currentIndex);
    }, heads[0].next);

    // If list is empty, return list of detached heads
    if (commonAncestorList.length === 0) {
      return heads.map(h => {
        return new DAGNode(h.hash, []);
      });
    }

    // If list is not empty, connect remaining nodes back to ancestor
    let commonAncestor: DAGNode = new DAGNode(commonAncestorList[0], []);

    allNodes[commonAncestor.hash] = commonAncestor;

    let rootNode: DAGNode = this.emptyDAG();
    heads.forEach((h) => {
      rootNode = this.createStraightDAG(allNodes, h);
    });

    return [rootNode];
  }

}
