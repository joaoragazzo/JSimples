import React, { useEffect, useRef, useState } from "react";
import Tree from "react-d3-tree";

export const GraphicView = ({ syntaxTree }) => {
  const containerRef = useRef(null);
  const [translate, setTranslate] = useState({x: 0, y: 0})
  
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setTranslate({ 
        x: width / 2,
        y: height / 2
      });
    }
  }, []);

  return (
    <div ref={containerRef} style={{border: "1px black solid"}}>
      <Tree orientation="vertical" pathFunc="straight" 
        data={syntaxTree} 
        translate={translate}
        scaleExtent={{ min: 0.1, max: 3 }} 
        zoom={0.8} 
        enableLegacyTransitions={true}
      />
    </div>
  );
};
