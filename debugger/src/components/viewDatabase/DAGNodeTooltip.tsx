import React, { useRef } from 'react';
import FormStyles from './DAGNodeTooltip.module.css';

const DAGNodeTooltip: React.FC<{
  title: string,
  message: string,
  rect: ClientRect
}> = ({title="Title", message="Message", rect}) => {

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
      style={calculatePositionStyle()}
    >
      <div className={FormStyles.nameDiv}>
        {title}
      </div>
      <div className={FormStyles.msgDiv}>
        {message}
      </div>
    </div>
  );
};

export default DAGNodeTooltip;
