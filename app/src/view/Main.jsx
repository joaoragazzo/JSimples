import { Button, Col, Row, Card } from "antd";
import { CodeInput } from "../components/CodeInput";
import { GraphicView } from "../components/graphicView/GraphicView";
import { Terminal } from "../components/Terminal"; 
import { useAppData } from "../contexts/AppContext";
import { TbBinaryTreeFilled } from "react-icons/tb";
import { PlayCircleOutlined, CodeOutlined } from "@ant-design/icons";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TopSection = styled(Row)`
  flex: 1;
  gap: 20px;
  min-height: 0; 
`;

const BottomSection = styled.div`
  height: 300px; 
`;

const StyledCard = styled(Card)`
  height: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  border: none;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);

  .ant-card-body {
    padding: 24px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

const TerminalCard = styled(StyledCard)`
  background: rgba(45, 55, 72, 0.95);

  .ant-card-body {
    padding: 0;
  }
`;

const StyledButton = styled(Button)`
  height: 50px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
  }

  &:active {
    transform: translateY(0);
  }
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
`;

const SectionTitle = styled.h2`
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TerminalTitle = styled(SectionTitle)`
  color: #e2e8f0;
  padding: 16px 24px 0;
`;

export const Main = () => {
  const { parse, runAlgorithm } = useAppData();

  return (
    <Container>
      <TopSection>
        <Col span={8}>
          <StyledCard>
            <InputSection>
              <SectionTitle>📝 Editor de Código</SectionTitle>
              <CodeInput />
              <Row gutter={24}>
                <Col span={12}>
                  <StyledButton
                    type="primary"
                    onClick={parse}
                    icon={<TbBinaryTreeFilled />}
                    size="large"
                  >
                    Gerar Árvore Sintática
                  </StyledButton>
                </Col>
                <Col span={12}>
                  <StyledButton
                    type="primary"
                    onClick={runAlgorithm}
                    icon={<PlayCircleOutlined />}
                    size="large"
                  >
                    Executar código
                  </StyledButton>
                </Col>
              </Row>
            </InputSection>
          </StyledCard>
        </Col>

        <Col flex="auto">
          <StyledCard>
            <GraphicView />
          </StyledCard>
        </Col>
      </TopSection>

      <BottomSection>
        <TerminalCard>
          <TerminalTitle>
            <CodeOutlined />
            Terminal de Saída
          </TerminalTitle>
          <Terminal />
        </TerminalCard>
      </BottomSection>
    </Container>
  );
};
