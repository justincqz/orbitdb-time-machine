import {Store} from 'orbit-db-store';

export class DAGNode {
    nodeList: [DAGNode];
    hash: string;

    constructor(hash, nodeList) {
        this.nodeList = nodeList;
        this.hash = hash;
    }

    static emptyDAG(): DAGNode {
        return new DAGNode("EMPTY", []);
    }

    static createDAG(head: any, db: Store, depth: number = 10): DAGNode {
        return depth > 0
            ? new DAGNode(
                head.hash,
                (head.next
                    ? head.next.map(node => this.createDAG(db.get(node), db, --depth))
                    : [])
            )
            : new DAGNode(
                head.hash,
                []
            );
    }
}
