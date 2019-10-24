import DAGNode from "./DAGNode";

export default class JoinEvent {

  readonly heads: DAGNode[];
  readonly tailHash: string;

  constructor(heads: DAGNode[], tailHash: string) {
    this.heads = heads;
    this.tailHash = tailHash
  }

}
