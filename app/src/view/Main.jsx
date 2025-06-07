import { Col, Row } from "antd";
import { CodeInput } from "../components/CodeInput";
import { Terminal } from "./Terminal";
import { useAppData } from "../contexts/AppContext";
import { TbBinaryTreeFilled } from "react-icons/tb";
import { PlayCircleOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { JSButton } from "../components/atomic/JSButton";
import { ViewsTab } from "../components/ViewsTab";
import { SyntaxTree } from "./SyntaxTree";
import logo from "../assets/logo.png";

const Container = styled.div`
  height: 100vh;
  box-sizing: border-box;
  padding: 20px;
  background: #e0e0e0;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  gap: 20px;
  min-height: 0;
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

const SectionTitle = styled.h2`
  margin: 0;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Main = () => {
  const { parse, runAlgorithm, tab } = useAppData();

  return (
    <Container>
      <Content>
        <div style={{ flex: 1, maxWidth: "33%" }}>
          <StyledCard>
            <InputSection>
              <SectionTitle><img src={logo} width={130}/></SectionTitle>

              <CodeInput />
              <Row gutter={24}>
                <Col span={12}>
                  <JSButton
                    type="primary"
                    onClick={parse}
                    icon={<TbBinaryTreeFilled />}
                    size="large"
                  >
                    Gerar Árvore Sintática
                  </JSButton>
                </Col>
                <Col span={12}>
                  <JSButton
                    type="primary"
                    onClick={runAlgorithm}
                    icon={<PlayCircleOutlined />}
                    size="large"
                  >
                    Executar código
                  </JSButton>
                </Col>
              </Row>
            </InputSection>
          </StyledCard>
        </div>

        <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
          <StyledCard>
            <ViewsTab />
            {(tab === "syntaxTree" || tab === "derivationTree") && (
              <SyntaxTree />
            )}
            {tab === "terminal" && <Terminal />}
          </StyledCard>
        </div>
      </Content>
    </Container>
  );
};
