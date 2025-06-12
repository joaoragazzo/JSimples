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
import { Header } from "../components/Header";

const MainWrapper = styled.div`
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Container = styled.div`
  box-sizing: border-box;
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; 
`;

const ExtendedRow = styled(Row)`
  flex: 1;
  min-height: 0; 
`;

const StyledCard = styled.div`
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  background: rgba(255, 255, 255);
  height: 100%;
  min-height: 0; 
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  min-height: 0; 
`;

const ButtonRow = styled(Row)`
  flex-shrink: 0; 
`;

const CodeInputWrapper = styled.div`
  flex: 1;
  min-height: 0; 
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  flex: 1;
  min-height: 0; 
  display: flex;
  flex-direction: column;
`;

export const Main = () => {
  const { parse, runAlgorithm, tab, isRunning, stopAlgorithm } = useAppData();
  
  return (
    <MainWrapper>
      <Header />
      <Container>
        <ExtendedRow gutter={12}>
          <Col span={12}>
            <StyledCard>
              <InputSection>
                <CodeInputWrapper>
                  <CodeInput />
                </CodeInputWrapper>
                <ButtonRow gutter={24}>
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
                </ButtonRow>
              </InputSection>
            </StyledCard>
          </Col>
          <Col span={12}>
            <StyledCard>
              <ViewsTab />
              <ContentWrapper>
                {(tab === "syntaxTree" || tab === "derivationTree") && (
                  <SyntaxTree />
                )}
                {tab === "terminal" && <Terminal />}
              </ContentWrapper>
            </StyledCard>
          </Col>
        </ExtendedRow>
      </Container>
    </MainWrapper>
  );
};