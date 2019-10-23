import React, { useEffect, useState } from 'react';
import * as d3Dag from 'd3-dag';
import * as d3 from 'd3';
import { D3Data } from '../model/D3Data';
import leftAlign from '../utils/NodePlotter';
import { Color } from 'csstype';
import graphStyles from './GraphDisplay.module.css';
import DAGNodeTooltip from './DAGNodeTooltip';
import { NodeProvider } from "../providers/NodeProvider";

const GraphDisplay: React.FC<{ 
  nodeProvider: NodeProvider,
  inputData: D3Data, 
  nodeColour?: Color, 
  lineColour?: Color 
}> = ({ nodeProvider, inputData, nodeColour, lineColour }) => {
  nodeColour = nodeColour ? nodeColour : '#555577FF';
  lineColour = lineColour ? lineColour : '#7766BBFF';

  const [toolTipState, setTooltipState] = useState({
    nodeInfo: null,
    toolTipHidden: true,
    targetRect: null
  });

  function handleMouseEnter(d, domElement) {
    try {
      nodeProvider.getNodeInfoFromHash(d.id).then((nodeInfo) => {
        // let text = JSON.stringify(nodeInfo.payload);
        setTooltipState({
          ...toolTipState,
          nodeInfo: nodeInfo,
          toolTipHidden: false,
          targetRect: domElement.getBoundingClientRect()
        });
      });
    } catch (e) {
      // TODO: Error handling.
      console.log("Something went terribly wrong...");
    }    
  };
  
  function handleMouseLeave() {
    setTooltipState({
      ...toolTipState,
      nodeInfo: null,
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
    .size([300, 1000]);
    // .coord(leftAlign);

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
      .attr('id', d => d.id)
      .attr('fill', nodeColour)
      .on('mouseenter', (d, i, e) => { handleMouseEnter(d, e[i]) })
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
      <DAGNodeTooltip nodeInfo={toolTipState.nodeInfo} rect={toolTipState.targetRect}/>
      {(inputData[0].id !== "EMPTY" ? 
        (<svg id='graph' width='80%' height='100%' viewBox='-20 -20 1040 340'></svg>) :
        (<div className={graphStyles.emptyGraph}>No Logs Found!</div>)
      )}
    </div>
  );
}

export default GraphDisplay;
