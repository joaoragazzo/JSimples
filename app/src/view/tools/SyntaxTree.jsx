import { useEffect, useRef, useState } from "react";
import Tree from "react-d3-tree";
import { Tree as DirectoryTree, Switch } from "antd";
import { useAppData } from "@/contexts/AppContext";
import styled from "styled-components";
import { ViewContainer } from "@/components/atomic/ViewContainer";
import "@/styles/Tree.css";
import { IoWarning } from "react-icons/io5";
import { FaGear } from "react-icons/fa6";
import { renderCustomNode } from "@/components/TreeNode";
import { convertToAntdTree } from "@/utils/syntaxTreeUtils.jsx";

const TreeContainer = styled.div`
  flex-grow: 1;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 -10px 10px -10px rgba(0, 0, 0, 0.1),
    inset 0 10px 10px -10px rgba(0, 0, 0, 0.1);
  display: ${({ hidden }) => (hidden ? "none" : "block")};
`;

const TreeViewSettings = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fafafa;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 14px;
  color: #595959;
  margin-bottom: 16px;
  justify-content: center;
`;

const ViewLabel = styled.span`
  font-weight: ${(props) => (props.active ? "600" : "400")};
  color: ${(props) => (props.active ? "#1890ff" : "#595959")};
  transition: all 0.2s ease;
`;

const DirectoryView = styled.div`
  height: 620px;
  overflow: auto;
  border: 1px solid #d9d9d9;
  padding: 10px;
  border-radius: 8px;
  box-shadow: inset 0 -10px 10px -10px rgba(0, 0, 0, 0.1),
    inset 0 10px 10px -10px rgba(0, 0, 0, 0.1);
`;

const NothingCompiledWarning = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
`;

const WarningText = styled.div`
  max-width: 300px;
  text-align: center;
`;

const CompileInstructionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TREE_CONFIG = {
  orientation: "vertical",
  pathFunc: "straight",
  separation: { siblings: 1.8, nonSiblings: 1.2 },
  zoom: 0.8,
  nodeSize: { x: 100, y: 100 },
};

/**
 * Componente para visualização de árvores sintáticas
 */
export const SyntaxTree = () => {
  const { completeSyntaxTree, simplifiedSyntaxTree, tab } = useAppData();
  const [treeVisualization, setTreeVisualization] = useState(true);
  const containerRef = useRef(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  // Calcula a posição inicial da árvore quando o container é montado
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setTranslate({
        x: width / 2,
        y: height / 6,
      });
    }
  }, []);

  const nothingCompiled = Object.keys(completeSyntaxTree).length === 0;
  const currentTree = tab === "syntaxTree" ? simplifiedSyntaxTree : completeSyntaxTree;

  return (
    <ViewContainer id="viewContainer">
      <TreeViewSettings>
        <ViewLabel active={treeVisualization}>Visualização em árvore</ViewLabel>
        <Switch
          disabled={nothingCompiled}
          onChange={() => {
            setTreeVisualization(!treeVisualization);
          }}
          checked={!treeVisualization}
        />
        <ViewLabel active={!treeVisualization}>Visualização em diretório</ViewLabel>
      </TreeViewSettings>

      {!treeVisualization && (
        <DirectoryView>
          <DirectoryTree treeData={convertToAntdTree(currentTree)} showLine />
        </DirectoryView>
      )}

      {treeVisualization && (
        <TreeContainer ref={containerRef} hidden={nothingCompiled}>
          <Tree
            orientation={TREE_CONFIG.orientation}
            pathFunc={TREE_CONFIG.pathFunc}
            data={currentTree}
            translate={translate}
            separation={TREE_CONFIG.separation}
            renderCustomNodeElement={renderCustomNode}
            zoom={TREE_CONFIG.zoom}
            nodeSize={TREE_CONFIG.nodeSize}
            rootNodeClassName="node__root"
            branchNodeClassName="node__branch"
            leafNodeClassName="node__leaf"
          />
        </TreeContainer>
      )}

      {nothingCompiled && (
        <NothingCompiledWarning>
          <IoWarning size={32} />
          <WarningText>
            Não existe nada compilado no momento! <br />
            <CompileInstructionContainer>
              Clique em <FaGear style={{ marginLeft: "7px", marginRight: "2px" }} /> Compilar
            </CompileInstructionContainer>
          </WarningText>
        </NothingCompiledWarning>
      )}
    </ViewContainer>
  );
};
