import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import FormStyles from './Hoverable.module.css';
import DAGNode from '../model/DAGNode';
import DAGNodeTooltip from './DAGNodeTooltip';

const Hoverable: React.FC = () => {

  const toolTipRef = useRef();

  const node = new DAGNode("Test", []);

  const [toolTipState, setTooltipState] = useState({
    toolTipHidden: true,
    targetRect: null
  });

  const handleMouseEnter = (e) => {
    console.log("Mouse enter!!!");
    console.log(e.target.getBoundingClientRect());
    setTooltipState({
      ...toolTipState,
      toolTipHidden: false,
      targetRect: e.target.getBoundingClientRect()
    });
  };
  
  const handleMouseLeave = (e) => {
    console.log("Mouse leave!!!");
    setTooltipState({
      ...toolTipState,
      toolTipHidden: true,
      targetRect: null
    });
  };

  return (
    <div>
      {
        !toolTipState.toolTipHidden && (
          <DAGNodeTooltip toolTipText="Lorem ipsum" rect={toolTipState.targetRect}/>
        )
      }
      <div
        className={FormStyles.container}
        onMouseEnter={(e) => handleMouseEnter(e)}
        onMouseLeave={(e) => handleMouseLeave(e)}>
      </div>
    </div>
  );
};

export default Hoverable;
