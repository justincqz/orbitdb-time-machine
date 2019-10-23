// Compute x coordinates for nodes that left align assigns coordinates and then spaces them out
export default function() {

  function coordLeft(layers, separation) {
    // Assign degrees
    // The 3 at the end ensures that dummy nodes have the lowest priority
    console.log(layers);
    layers.forEach((layer) =>
      layer.forEach((n) => (n.degree = n.children.length + (n.data ? 0 : -3)))
    );
    layers.forEach((layer) =>
      layer.forEach((n) => n.children.forEach((c) => ++c.degree))
    );

    // Set first nodes
    layers.forEach(layer => {
      layer.forEach((node, i) => {
        if (i === 0) node.x = 0;
        else {
          const last = layer[i];
          node.x = last.x + separation(last, node);
        }
      });
    });

    const min = Math.min(
      ...layers.map((layer) => Math.min(...layer.map((n) => n.x)))
    );

    const span =
      Math.max(...layers.map((layer) => Math.max(...layer.map((n) => n.x)))) -
      min;
    
    layers.forEach((layer) => layer.forEach((n) => (n.x = (n.x - min) / span)));
    layers.forEach((layer) => layer.forEach((n) => delete n.degree));
    return layers;
  }

  return coordLeft;
}