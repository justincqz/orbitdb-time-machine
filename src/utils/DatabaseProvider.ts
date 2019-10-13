import {DAGNode} from "./DAGNode";

export interface DatabaseProvider {
    getDatabaseGraph(address: string) : Promise<DAGNode>;

    getEdges(node: DAGNode) : Array<[string, string]>;

    getNodeInfo(node: DAGNode) : Promise<any>;
}