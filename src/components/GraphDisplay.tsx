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
  const [viewportOffset, setViewportOffset] = useState(0);

  // TODO calculate this dynamically
  const heads = 1;
  const sequentialNodes = 1

  const viewWidth = 300 * sequentialNodes;
  const viewHeight = heads * 100;

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
    .size([0.8 * viewHeight, viewWidth])
    .coord(leftAlign());
    // .coord(d3Dag.coordGreedy());

    // Apply layout to computed data
    layout(data);

    // Draw edges to graph
    const line = d3.line()
    .curve(d3.curveMonotoneX)
    .x(d => d.y)
    .y(d => d.x + viewHeight / 2);

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
      .attr('transform', ({x, y}) => `translate(${y}, ${x + viewHeight / 2})`);

    // Plot node circles
    nodes.append('circle')
      .attr('r', 20)
      .attr('id', d => d.id)
      .attr('fill', nodeColour)
      .on('mouseenter', (d, i, e) => { handleMouseEnter(d, e[i]) })
      .on('mouseleave', handleMouseLeave);

    return svgDom;
  }

  function scrollSvg(e) {
    const svgWidth = document.getElementsByClassName(graphStyles.graphContainer)[0].clientWidth;
    let offset = viewportOffset + e.deltaY
    // // return if the svg is smaller than the viewport
    // if (svgWidth + svgWidth / 2 > viewWidth) {
    //   return;
    // }
    if (offset < 0) {
      offset = 0;
    } else if (offset > viewWidth) {
      offset = viewWidth
    }
    console.log(viewWidth - svgWidth);
    setViewportOffset(offset);
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
        (<svg id='graph' width='100%' height='100%' viewBox={`${viewportOffset} 0 1000 300`} onWheel={scrollSvg}></svg>) :
        (<div className={graphStyles.emptyGraph}>No Logs Found!</div>)
      )}
    </div>
  );
}

export default GraphDisplay;
