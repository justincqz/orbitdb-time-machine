import React, { useRef, useEffect } from 'react';
import FormStyles from './DAGNodeTooltip.module.css';

const DAGNodeTooltip: React.FC<{toolTipText: String, rect: ClientRect}> = ({toolTipText, rect}) => {

  const toolTipRef = useRef<HTMLDivElement>(null);

  // Calculates the position of tooltip and returns a stylesheet describing it.
  const calculatePositionStyle = () => {

    let centerX = (rect.right + rect.left) / 2;
    let centerY = (rect.top + rect.bottom) / 2; 

    // If node too low, do bottom and left instead.
    let windowThresholdY = window.innerHeight / 2;
    let windowThresholdX = window.innerWidth / 2;

    if (centerX < windowThresholdX) {
      
      if (centerY < windowThresholdY) {
        return { top: centerY, left: centerX }
      } else {
        return { bottom: window.innerHeight - centerY, left: centerX }
      }

    } else {

      if (centerY < windowThresholdY) {
        return { top: centerY, right: centerX }
      } else {
        return { bottom: window.innerHeight - centerY, right: centerX }
      }

    }
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
