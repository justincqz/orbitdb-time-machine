export class DAGNode {
    nodeList: [DAGNode];
    hash: string;

    constructor(hash, nodeList) {
        this.nodeList = nodeList;
        this.hash = hash;
    }
}
