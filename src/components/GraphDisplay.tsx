import React, { useEffect, useState } from 'react';
import * as d3Dag from 'd3-dag';
import * as d3 from 'd3';
import { D3Data } from '../model/D3Data';
import leftAlign from '../utils/NodePlotter';
import { Color } from 'csstype';
import graphStyles from './GraphDisplay.module.css';
import DAGNodeTooltip from './DAGNodeTooltip';

const GraphDisplay: React.FC<{ 
  inputData: D3Data, 
  nodeColour?: Color, 
  lineColour?: Color 
}> = ({ inputData, nodeColour, lineColour }) => {
  nodeColour = nodeColour ? nodeColour : '#555577FF';
  lineColour = lineColour ? lineColour : '#7766BBFF';

  const [toolTipState, setTooltipState] = useState({
    toolTipHidden: true,
    targetRect: null
  });

  function handleMouseEnter() {
    setTooltipState({
      ...toolTipState,
      toolTipHidden: false,
      targetRect: this.getBoundingClientRect()
    });
  };
  
  function handleMouseLeave() {
    setTooltipState({
      ...toolTipState,
      toolTipHidden: true,
      targetRect: null
    });
  };

  function cleanUpSvg(dom) {
    while (dom.firstChild)
      dom.removeChild(dom.firstChild);
    return () => {};
  }

  // Draw graph to screen
  function renderSvg(input) {
    // D3 Setup
    const data = d3Dag.dagStratify()(input);
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
      .attr('fill', nodeColour)
      .on('mouseenter', handleMouseEnter)
      .on('mouseleave', handleMouseLeave);

    return svgDom;
  }

  useEffect(() => {
    const svgDom = renderSvg(inputData);
    return () => {
      cleanUpSvg(svgDom);
    };
    // https://github.com/facebook/create-react-app/issues/6880
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputData]);

  return (
    <div className={graphStyles.graphContainer}>
      <DAGNodeTooltip toolTipText="Tool tip text" rect={toolTipState.targetRect}/>
      {(inputData[0].id !== "EMPTY" ? 
        (<svg id='graph' width='80%' height='100%' viewBox='-20 -20 1040 340'></svg>) :
        (<div className={graphStyles.emptyGraph}>No Logs Found!</div>)
      )}
    </div>
  );
}

export default GraphDisplay;
