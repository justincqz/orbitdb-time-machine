import React, { useEffect, useState } from 'react';
import * as d3Dag from 'd3-dag';
import * as d3 from 'd3';
import { D3Data, getNumberOfLeaves, getDepth } from '../model/D3Data';
import { Color } from 'csstype';
import graphStyles from './GraphDisplay.module.css';
import DAGNodeTooltip from './DAGNodeTooltip';
import { NodeProvider } from "../providers/NodeProvider";
import leftAlign from '../utils/NodePlotter';

// TODO: Maybe pass in a JSON object that has all mouse events.
const GraphDisplay: React.FC<{
  onMouseClick(d3dataID: string, DOMElem: Element): void,
  onMouseEnter(d3dataID: string, DOMElem: Element): void,
  onMouseLeave(d3dataID: string, DOMElem: Element): void,
  inputData: D3Data,
  nodeColour?: Color,
  lineColour?: Color,
}> = ({ 
  onMouseClick = undefined,
  onMouseEnter = undefined,
  onMouseLeave = undefined,
  inputData,
  nodeColour,
  lineColour 
}) => {
  nodeColour = nodeColour ? nodeColour : '#555577FF';
  lineColour = lineColour ? lineColour : '#7766BBFF';

  const [viewportOffset, setViewportOffset] = useState(0);

  // TODO calculate this dynamically
  const heads = getNumberOfLeaves(inputData);
  const sequentialNodes = getDepth(inputData);

  const viewWidth = 300 * sequentialNodes;
  const viewHeight = heads * 100;

  // TODO: Find out types for d.
  function handleMouseEnter(d, domElement: Element) {
    if (onMouseEnter != undefined) {
      onMouseEnter(d.id, domElement);
    }
  };

  function handleMouseLeave(d, domElement: Element) {
    if (onMouseLeave != undefined) {
      onMouseLeave(d.id, domElement);
    }
  };

  function handleOnClick(d, domElement: Element) {
    if (onMouseClick != undefined) {
      onMouseClick(d.id, domElement);
    }
  };

  function cleanUpSvg(dom) {
    if(dom._groups[0][0] == null) {
      return;
    }
    while (dom._groups[0][0].children[0]) {
      dom._groups[0][0].children[0].remove();
    }
  }

  // Draw graph to screen
  function renderSvg(input) {
    // D3 Setup
    const data = d3Dag.dagHierarchy()(input);
    const layout = d3Dag.sugiyama()
    .size([0.8 * viewHeight, viewWidth])
    .coord(leftAlign());

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
      .on('mouseleave', (d, i, e) => { handleMouseLeave(d, e[i]) })
      .on('click', (d, i, e) => { handleOnClick(d, e[i]) });
    return svgDom;
  }

  function scrollSvg(e) {
    // const svgWidth = document.getElementsByClassName(graphStyles.graphContainer)[0].clientWidth;
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
      {(inputData.id !== "EMPTY" ?
        (<svg id='graph' width='100%' height='100%' viewBox={`${viewportOffset} 0 1000 300`} onWheel={scrollSvg}></svg>) :
        (<div className={graphStyles.emptyGraph}>No Logs Found!</div>)
      )}
    </div>
  );
}

export default GraphDisplay;
