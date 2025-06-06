import React, { useEffect, useRef, useState } from "react";
import Tree from "react-d3-tree";
import { useAppData } from "../../contexts/AppContext";
import styled from "styled-components";
import { SettingOutlined, EyeOutlined } from "@ant-design/icons";
import { Checkbox, Tooltip, Switch, Card } from "antd";

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin: 0;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ConfigButton = styled.div`
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: #667eea;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1); 
  }
`;

const RotatingConfigIcon = styled(SettingOutlined)`
  transition: all 0.3s ease;
  &:hover {
    transform: rotate(90deg);
  }
`

const TreeContainer = styled.div`
  flex: 1;
  border: 2px solid #e1e8ed;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const ToolsPanel = styled(Card)`
  margin-bottom: 16px;
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  
  .ant-card-body {
    padding: 16px 20px;
  }
`;

const ToolsContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StyledCheckbox = styled(Checkbox)`
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #667eea;
    border-color: #667eea;
  }
  
  .ant-checkbox:hover .ant-checkbox-inner {
    border-color: #667eea;
  }
`;

export const GraphicView = () => {
  const { completeSyntaxTree, simplifiedSyntaxTree } = useAppData();
  const containerRef = useRef(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isToolsVisible, setIsToolsVisible] = useState(false);
  const [removeUnitaryDerivation, setRemoveUnitaryDerivation] = useState(true);

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setTranslate({
        x: width / 2,
        y: height / 6,
      });
    }
  }, []);

  const customNodeStyle = {
    fill: '#667eea',
    stroke: '#4c63d1',
    strokeWidth: 2,
  };

  const customLinkStyle = {
    stroke: '#8b9dc3',
    strokeWidth: 2,
  };

  return (
    <Container>
      <Header>
        <Title>
          <EyeOutlined />
          Visualização da Árvore Sintática
        </Title>
        <Tooltip title="Configurações" placement="bottom">
          <ConfigButton onClick={() => setIsToolsVisible(!isToolsVisible)}>
            <RotatingConfigIcon style={{ fontSize: '20px' }} />
          </ConfigButton>
        </Tooltip>
      </Header>

      {isToolsVisible && (
        <ToolsPanel>
          <ToolsContent>
            <StyledCheckbox
              checked={removeUnitaryDerivation}
              onChange={(e) => setRemoveUnitaryDerivation(e.target.checked)}
            >
              Remover derivações unitárias
            </StyledCheckbox>
          </ToolsContent>
        </ToolsPanel>
      )}

      <TreeContainer ref={containerRef}>
        <Tree
          orientation="vertical"
          pathFunc="straight"
          data={removeUnitaryDerivation ? simplifiedSyntaxTree : completeSyntaxTree}
          translate={translate}
          scaleExtent={{ min: 0.3, max: 4 }}
          zoom={0.8}
          nodeSize={{ x: 200, y: 100 }}
          separation={{ siblings: 1, nonSiblings: 2 }}
          styles={{
            nodes: {
              node: {
                circle: customNodeStyle,
                name: {
                  fill: '#2c3e50',
                  fontSize: '14px',
                  fontWeight: '600',
                },
                attributes: {
                  fill: '#7f8c8d',
                  fontSize: '12px',
                },
              },
              leafNode: {
                circle: {
                  ...customNodeStyle,
                  fill: '#27ae60',
                  stroke: '#229954',
                },
                name: {
                  fill: '#2c3e50',
                  fontSize: '14px',
                  fontWeight: '600',
                },
              },
            },
            links: customLinkStyle,
          }}
        />
      </TreeContainer>
    </Container>
  );
};