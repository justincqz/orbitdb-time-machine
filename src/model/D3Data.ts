interface D3DataOutput {
  toD3Data(limit: number): D3Data;
}

export type D3Data = {id: string, children: D3Data[]};

const findNode = function(hash: string, root: D3Data): D3Data {
  if (root.id === hash) {
    return root;
  }
  for (let node of root.children) {
    return findNode(hash, node);
  }
  return null;
}

const getFirstLeaf = function(root: D3Data): D3Data {
  if (root.children.length === 0) {
    return root;
  }
  return getFirstLeaf(root.children[0]);
}

const pruneDag = function(hash: string, root: D3Data): D3Data {
  if (root.id === hash) {
    return {id: root.id, children: []}
  }
  root.children = root.children.map((c) => pruneDag(hash, c));
  return root;
}

const joinDag = function(node: D3Data, child: D3Data): void {
  node.children.push(child);
}

const viewJoinEvent = function(root: D3Data, top: D3Data): D3Data {
  // Deep copy the object using JSON so we can go back to the old object
  root = JSON.parse(JSON.stringify(root));

  // Prune the DAG to only the common nodes
  let pruned = pruneDag(top.id, root);

  // Get the end of the pruned DAG
  let leaf = getFirstLeaf(pruned);
  // Jon the historic nodes onto the end of the pruned DAG
  for (let child of top.children) {
    joinDag(leaf, child)
  }
  return pruned;
}

const getDepth = function(root: D3Data): number {
  if (root.children.length === 0) {
    return 1;
  }
  return (root.children.reduce((acc, cur) => Math.max(acc, getDepth(cur)), 0)) + 1;
}

const getNumberOfLeaves = function(root: D3Data): number {
  if (root.children.length === 0) {
    return 1;
  }
  return root.children.reduce((acc, cur) => (getNumberOfLeaves(cur) + acc), 0);
}

const getTreeAtSplit = function(root: D3Data): D3Data {
  if (root.children.length === 0) {
    return null;
  }

  if (root.children.length >= 2) {
    return root;
  }

  return getTreeAtSplit(root.children[0]);
}

export { findNode, pruneDag, viewJoinEvent, getDepth, getNumberOfLeaves, getTreeAtSplit };

export default D3DataOutput;
