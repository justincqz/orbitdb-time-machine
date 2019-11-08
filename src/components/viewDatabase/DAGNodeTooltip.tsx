import React, { useRef } from 'react';
import FormStyles from './DAGNodeTooltip.module.css';

const DAGNodeTooltip: React.FC<{nodeInfo: any, rect: ClientRect}> = ({nodeInfo, rect}) => {

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
        Added by { nodeInfo.identity.id }
      </div>
      {
        Object.keys(nodeInfo.payload)
        .filter((key) => nodeInfo.payload[key] != null)
        .map((key) => (
          <div key={key}>
            {key}: {nodeInfo.payload[key]}
          </div>
        ))
      }
    </div>
  );
};

export default DAGNodeTooltip;
