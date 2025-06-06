import { Button, Col, Row, Card } from "antd";
import { CodeInput } from "../components/CodeInput";
import { GraphicView } from "../components/graphicView/GraphicView";
import { useAppData } from "../contexts/AppContext";
import { PlayCircleOutlined } from "@ant-design/icons";
import styled from "styled-components";

const StyledRow = styled(Row)`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  gap: 20px;
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

const StyledButton = styled(Button)`
  height: 50px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  
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

export const Main = () => {
  const { parse } = useAppData();
  
  return (
    <StyledRow>
      <Col span={7}>
        <StyledCard>
          <InputSection>
            <SectionTitle>
              📝 Editor de Código
            </SectionTitle>
            <CodeInput />
            <StyledButton 
              type="primary" 
              onClick={parse}
              icon={<PlayCircleOutlined />}
              size="large"
            >
              Gerar Árvore Sintática
            </StyledButton>
          </InputSection>
        </StyledCard>
      </Col>
      <Col flex="auto">
        <StyledCard>
          <GraphicView />
        </StyledCard>
      </Col>
    </StyledRow>
  );
};