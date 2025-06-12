import React, { useEffect, useRef, useState } from "react";
import Tree from "react-d3-tree";
import { useAppData } from "@/contexts/AppContext";
import styled from "styled-components";
import { ViewContainer } from "@/components/atomic/ViewContainer";
import '@/styles/Tree.css';

const TreeContainer = styled.div`
  flex: 1;
  border: 2px solid #e1e8ed;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
`;

export const SyntaxTree = () => {
  const { completeSyntaxTree, simplifiedSyntaxTree, tab } = useAppData();
  const containerRef = useRef(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setTranslate({
        x: width / 2,
        y: height / 6,
      });
    }
  }, []);

  return (
    <ViewContainer id="viewContainer">
      <TreeContainer ref={containerRef}>
        <Tree
          orientation="vertical"
          pathFunc="straight"
          data={ tab === 'syntaxTree' ? simplifiedSyntaxTree : completeSyntaxTree}
          translate={translate}
          scaleExtent={{ min: 0.3, max: 4 }}
          zoom={0.8}
          nodeSize={{ x: 200, y: 100 }}
          rootNodeClassName="node__root"
          branchNodeClassName="node__branch"
          leafNodeClassName="node__leaf"
        />
      </TreeContainer>
    </ViewContainer>
  );
};