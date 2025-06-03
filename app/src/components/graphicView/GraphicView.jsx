import React, { use, useEffect, useRef, useState } from "react";
import Tree from "react-d3-tree";
import { useAppData } from "../../contexts/AppContext";
import styled from "styled-components";
import { FaGear } from "react-icons/fa6";
import { Checkbox, Tooltip } from "antd";

const Canva = styled.div`
  border: 1px solid black;
  height: 100%;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
`;

const GraphicWrapper = styled.div`
  flex-grow: 1;
  position: relative;
  overflow: hidden;
`;

const Toolbar = styled.div`
  background-color: #f8f8f8;
  width: 100%;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 10px 20px;
  border-radius: 7px 7px 0px 0px;
  font-size: 20px;
`;

const Tools = styled.div`
  background-color: rgb(243, 243, 243);
  width: 100%;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 10px 20px;
`;

const Config = styled(Tooltip)`
    cursor: pointer;
`
export const GraphicView = () => {
  const { completeSyntaxTree, simplifiedSyntaxTree } = useAppData();
  const containerRef = useRef(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isToolsVisible, setIsToolsVisible] = useState(false);
  const [removeUnitaryDerivation, setRemoveUnitaryDerivation] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();

      setTranslate({
        x: width / 2,
        y: height / 2,
      });
    }
  }, []);

  return (
    <>
      <Canva>
        <Toolbar>
          Visualização da árvore sintática
          <Config  title="Configurações" placement="bottom">
            <FaGear
              size={20}
              onClick={() => setIsToolsVisible(!isToolsVisible)}
            />
          </Config>
        </Toolbar>

        {isToolsVisible && (
          <Tools>
            <Checkbox
              checked={removeUnitaryDerivation}
              onChange={(e) => {
                setRemoveUnitaryDerivation(e.target.checked);
              }}
            >
              Remover derivações unitárias
            </Checkbox>
          </Tools>
        )}

        <GraphicWrapper ref={containerRef}>
          <Tree
            orientation="vertical"
            pathFunc="straight"
            data={
              removeUnitaryDerivation
                ? simplifiedSyntaxTree
                : completeSyntaxTree
            }
            translate={translate}
            scaleExtent={{ min: 0.5, max: 3 }}
            zoom={0.8}
          />
        </GraphicWrapper>
      </Canva>
    </>
  );
};
