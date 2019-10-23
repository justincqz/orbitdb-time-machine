// Compute x coordinates for nodes that left align assigns coordinates and then spaces them out
export default function() {
  function coordLeft(layers, separation) {
    const widths = {
      '1': [0],
      '2': [-0.3, 0.3],
      '3': [-0.5, 0, 0.5],
      '4': [-0.7, -0.35, 0.35, 0.7],
    };

    // Set Nodes
    let max = 0;
    let prevlayer;
    for (let layer of layers) {
      // Calculate widest layer
      max = max < layer.length ? layer.length : max;
      for (let i = 0; i < layer.length; i++) {
        if (layer.length < max) {
          const prevIndex = prevlayer.findIndex(node => node.id === layer[i].data.parentIds[0]);
          layer[i].x = widths[max][prevIndex];
        } else {
          layer[i].x = widths[max][i];
        }
      }
      prevlayer = layer;
    }
    return layers;
  }
  return coordLeft;
}