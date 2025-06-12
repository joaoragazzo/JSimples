import { Col, Row } from "antd";
import { CodeInput } from "@/components/CodeInput";
import { Terminal } from "./Terminal";
import { useAppData } from "@/contexts/AppContext";
import { TbBinaryTreeFilled } from "react-icons/tb";
import { PlayCircleOutlined, StopOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { JSButton } from "@/components/atomic/JSButton";
import { ViewsTab } from "@/components/ViewsTab";
import { SyntaxTree } from "./SyntaxTree";
import logo from "@/assets/Logo-JSimples.svg";

const Container = styled.div`
  height: 100vh;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

const StyledCard = styled.div`
  padding: 24px;
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  background: rgba(255, 255, 255);
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
`;

export const Main = () => {
  const { parse, runAlgorithm, tab, isRunning, stopAlgorithm } = useAppData();

  return (
    <Container>
      <StyledCard>
        <InputSection>
          <img src={logo} width={130} />
          <CodeInput />
          <Row gutter={24}>
            <Col span={12}>
              <JSButton
                onClick={isRunning ? stopAlgorithm : runAlgorithm}
                icon={isRunning ? <StopOutlined /> : <PlayCircleOutlined />}
                type="primary"
                danger={isRunning ? true : false}
              >
                {isRunning ? "Parar execução" : "Executar código"}
              </JSButton>
            </Col>
            <Col span={12}>
              <JSButton
                onClick={parse}
                icon={<TbBinaryTreeFilled />}
                type="default"
              >
                Gerar Árvore Sintática
              </JSButton>
            </Col>
          </Row>
        </InputSection>
      </StyledCard>
      <StyledCard>
        <ViewsTab />
        {(tab === "syntaxTree" || tab === "derivationTree") && <SyntaxTree />}
        {tab === "terminal" && <Terminal />}
      </StyledCard>
    </Container>
  );
};
