import React, { useRef } from 'react';
import FormStyles from './DAGNodeTooltip.module.css';

const DAGNodeTooltip: React.FC<{toolTipText: String, rect: ClientRect}> = ({toolTipText, rect}) => {
  
  const toolTipRef = useRef<HTMLDivElement>(null);
  
  // Calculates the position of tooltip and returns a stylesheet describing it.
  const calculatePositionStyle = () => {

    let centerX = (rect.right + rect.left) / 2;
    let centerY = (rect.top + rect.bottom) / 2; 

    return { top: centerY, left: centerX };
  }

  if (rect === null) {
    return null;
  }

  return (
    <div 
      ref={toolTipRef}
      className={FormStyles.container}
      style={calculatePositionStyle()}>
        {toolTipText}
    </div>
  );
};

export default DAGNodeTooltip;
