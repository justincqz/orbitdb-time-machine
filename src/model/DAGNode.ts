import D3DataOutput, {D3Data, getTreeAtSplit} from './D3Data';

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

  toD3Data(): D3Data {
    // Queue of nodes to visit in BFS
    let visitQueue: DAGNode[] = [];
    // Queue of D3 nodes to visit in BFS
    let resultMap: any = {};

    // Add this node to queue
    visitQueue.push(this);

    let root: D3Data = {
      id: this.hash + Math.random(),
      payload: {
        "actualId": this.hash
      },
      children: []
    };

    resultMap[this.hash] = root;
    while (visitQueue.length > 0) {
      // Remove head of queue
      let visitNode = visitQueue.shift();

      let cur: D3Data = resultMap[visitNode.hash];

      // Add all parents visit list and output
      for (let child of visitNode.nodeList) {
        visitQueue.push(child);

        let childD3Node = resultMap[child.hash];

        if (childD3Node === undefined) {
          childD3Node = {
            id: this.hash + Math.random(),
            children: [],
            payload: {
              "actualId": child.hash
            }
          };

          resultMap[child.hash] = childD3Node;
        }

        cur.children.push(childD3Node);
      }
    }

    return resultMap[this.hash];
  }

  static emptyDAG(): DAGNode {
    return new DAGNode("EMPTY", []);
  }

  private static createStraightDAG(allNodes: any, head: any, limit: number): DAGNode {
    let headNode: DAGNode = new DAGNode(head.hash, []);

    // There is only a single node
    if (head.next && head.next.length === 0) {
      return headNode;
    }

    // Add head node
    if (head.next && head.next.length !== 0) {
      let headParent: DAGNode = allNodes[head.next[0]] !== undefined
        ? allNodes[head.next[0]]
        : new DAGNode(head.next[0], []);
      headParent.nodeList.push(headNode);

      allNodes[head.next[0]] = headParent;
    }

    // Add remaining nodes, while they exist and fewer than limit -2
    // This -2 accouts for the 2 head nodes
    for (let i = 0; i < head.next.length && i < limit - 2; i++) {
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

    let index = Math.min(head.next.length - 1, limit - 2)

    return allNodes[head.next[index]];
  }

  // TODO: Replace heads type with Entry adapter class.
  static createDAG(heads: any[], limit?: number): DAGNode[] {
    let allNodes: any = {};
    let detectedInconsistency = false;

    if (limit === null || limit < 0) {
      limit = Infinity;
    }

    if (heads.length === 1) {
      return [this.createStraightDAG(allNodes, heads[0], limit)];
    }

    // Get list of common ancestors
    let commonAncestorList: string[] = heads.reduce((ancestors, h2) => {
      let currentIndex = 0;
      let highestH2Index = 0;

      let earliestAncestorIndex = null;

      while (h2.next) {
        let curH2Index = h2.next.indexOf(ancestors[currentIndex])
        if (curH2Index < highestH2Index) {
          // Inconsistency
          detectedInconsistency = true;
          break;
        }

        highestH2Index = curH2Index;

        if (h2.next.includes(ancestors[currentIndex]) && earliestAncestorIndex === null) {
          earliestAncestorIndex = currentIndex;
        }
        currentIndex++;
      }

      return ancestors.slice(earliestAncestorIndex);
    }, heads[0].next);

    // If list is empty, return list of detached heads
    if (commonAncestorList.length === 0) {
      return heads.map(h => {
      console.log(h)
        return new DAGNode(h.hash, []);
      });
    }

    // If list is not empty, connect remaining nodes back to ancestor
    let commonAncestor: DAGNode = new DAGNode(commonAncestorList[0], []);

    allNodes[commonAncestor.hash] = commonAncestor;

    let rootNode: DAGNode = this.emptyDAG();
    if (detectedInconsistency) {
      return heads.map((h) => {
        return this.createStraightDAG({}, h, limit);
      });
    } else {
      heads.forEach((h) => {
        rootNode = this.createStraightDAG(allNodes, h, limit);
      });
    }

    return [rootNode];
  }

  static saveHeadsAsD3Data(heads: any[]): D3Data {
    let DAGheads = this.createDAG(heads);
    let D3DAG = DAGheads[0].toD3Data();
    return getTreeAtSplit(D3DAG);
  }
}
