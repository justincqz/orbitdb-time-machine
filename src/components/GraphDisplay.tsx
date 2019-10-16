import React, { useEffect } from 'react';
import * as d3Dag from 'd3-dag';
import * as d3 from 'd3';
import { D3Data } from '../model/D3Data';
import leftAlign from '../utils/NodePlotter';

const GraphDisplay: React.FC<{inputData: D3Data}> = ({ inputData }) => {
  const nodeColour = '#555577EE';
  const lineColour = '#7766BBEE';

  // Draw graph to screen
  function renderSvg() {
    // D3 Setup
    const data = d3Dag.dagStratify()(inputData);
    const layout = d3Dag.sugiyama()
    .size([300, 1000])
    .coord(leftAlign);

    // Apply layout to computed data
    layout(data);

    // Draw edges to graph
    const line = d3.line()
    .curve(d3.curveMonotoneX)
    .x(d => d.y)
    .y(d => d.x);

    const svgDom = d3.select('#graph');
    const defs = svgDom.append('defs');

    // Plot edges
    svgDom.append('g')
    .selectAll('path')
    .data(data.links())
    .enter()
    .append('path')
    .attr('d', ({ data }) => line(data.points))
    .attr('fill', 'none')
    .attr('stroke-width', 3)
    .attr('stroke', lineColour);

    // Select nodes
    const nodes = svgDom.append('g')
      .selectAll('g')
      .data(data.descendants())
      .enter()
      .append('g')
      .attr('transform', ({x, y}) => `translate(${y}, ${x})`);

    // Plot node circles
    nodes.append('circle')
      .attr('r', 20)
      .attr('id', d => JSON.stringify(d.id))
      .attr('fill', nodeColour);

    // Add text to nodes
    nodes.append('text')
      .text(data => data.id)
      .attr('font-weight', 'bold')
      .attr('font-family', 'sans-serif')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('fill', 'white');
  }

  useEffect(() => {
    renderSvg();
  });

  return (
    <div className='graph'>
      <svg id='graph' width='1000' height='400' viewBox='-20 -20 1040 340'></svg>
    </div>
  );
}

export default GraphDisplay;
