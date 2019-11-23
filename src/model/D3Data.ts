import { NodeProvider } from "../providers/NodeProvider";

interface D3DataOutput {
  toD3Data(limit: number): D3Data;
}

export type D3Data = { id: string; children: D3Data[]; payload: any };

/** Returns the node with a hash */
const findNode = function(hash: string, root: D3Data): D3Data {
  if (root.id === hash) {
    return root;
  }
  for (let node of root.children) {
    return findNode(hash, node);
  }
  return null;
};

/** Returns first leaf */
const getFirstLeaf = function(root: D3Data): D3Data {
  if (root.children.length === 0) {
    return root;
  }
  return getFirstLeaf(root.children[0]);
};

/** Prunes root node (returns root until the node with hash) */
const pruneDag = function(hash: string, root: D3Data): D3Data {
  if (root.id === hash) {
    return { id: root.id, children: [], payload: root.payload };
  }
  root.children = root.children.map(c => pruneDag(hash, c));
  return root;
};

/** Appends child to node */
const joinDag = function(node: D3Data, child: D3Data): void {
  node.children.push(child);
};

/** Returns the tree as it was at a certain join event */
const viewJoinEvent = function(root: D3Data, top: D3Data): D3Data {
  // Deep copy the object using JSON so we can go back to the old object
  root = JSON.parse(JSON.stringify(root));

  // Prune the DAG to only the common nodes
  let pruned = pruneDag(top.id, root);

  // Get the end of the pruned DAG
  let leaf = getFirstLeaf(pruned);
  // Jon the historic nodes onto the end of the pruned DAG
  for (let child of top.children) {
    joinDag(leaf, child);
  }
  return pruned;
};

/** Returns the depth of the tree */
const getDepth = function(root: D3Data): number {
  if (root.children.length === 0) {
    return 1;
  }
  return (
    root.children.reduce((acc, cur) => Math.max(acc, getDepth(cur)), 0) + 1
  );
};

/** Returns the number of leaves */
const getNumberOfLeaves = function(root: D3Data): number {
  if (root.children.length === 0) {
    return 1;
  }
  return root.children.reduce((acc, cur) => getNumberOfLeaves(cur) + acc, 0);
};

/** Get the first node of the tree where it splits into branches */
const getTreeAtSplit = function(root: D3Data): D3Data {
  if (root.children.length === 0) {
    return null;
  }

  if (root.children.length >= 2) {
    return root;
  }

  return getTreeAtSplit(root.children[0]);
};

/** Add user identities as payload to each d3data node */
const addUserIdentities = async (root: D3Data, nodeProvider: NodeProvider) => {
  if (root.id === "EMPTY") {
    root.payload["identity"] = 0;
    return root;
  }
  async function addUserId(node: D3Data) {
    let promise = nodeProvider.getNodeInfoFromHash(node.payload.actualId);
    for (let child of node.children) {
      addUserId(child);
    }
    let nodeInfo = await promise;
    if (nodeInfo === undefined) {
      node.payload = {
        ...node.payload,
        identity: 0
      }
    } else {
      node.payload = {
        ...node.payload,
        identity: nodeInfo.identity.id
      };
    }
    return node;
  }

  return addUserId(root);
};

export {
  findNode,
  pruneDag,
  viewJoinEvent,
  getDepth,
  getNumberOfLeaves,
  getTreeAtSplit,
  addUserIdentities
};

export default D3DataOutput;
