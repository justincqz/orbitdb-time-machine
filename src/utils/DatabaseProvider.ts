import {DAGNode} from "./DAGNode";

export interface DatabaseProvider {
    getDatabaseGraph(address: string) : Promise<DAGNode>;

    getEdges(node: DAGNode) : any;
}