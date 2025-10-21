import { useEffect, useRef, useState } from "react";

const CustomNode = ({ nodeDatum, toggleNode }) => {
  const textRef = useRef(null);
  const [textBBox, setTextBBox] = useState(null);

  useEffect(() => {
    if (textRef.current) {
      const bbox = textRef.current.getBBox();
      setTextBBox(bbox);
    }
  }, [nodeDatum.name]);

  const padding = 5;

  return (
    <g>
      <circle r="15" fill="#0084ffff" onClick={toggleNode} />
      
      <text
        ref={textRef}
        fill="black"
        strokeWidth="0.5"
        x="0"
        y="-25"
        textAnchor="middle"
        style={{ fontSize: '14px' }}
      >
        {nodeDatum.name}
      </text>

      {textBBox && (
        <rect
          x={textBBox.x - padding}
          y={textBBox.y - padding}
          width={textBBox.width + padding * 2}
          height={textBBox.height + padding * 2}
          fill="white"
          stroke="#ccc"
          strokeWidth="0.5"
          rx="3"
        />
      )}

      <text
        fill="black"
        strokeWidth="0.5"
        x="0"
        y="-25"
        textAnchor="middle"
        style={{ fontSize: '14px' }}
      >
        {nodeDatum.name}
      </text>
    </g>
  );
};

export const renderCustomNode = (props) => <CustomNode {...props} />;