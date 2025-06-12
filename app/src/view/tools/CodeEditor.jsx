import { Row, Col } from "antd";
import { TbBinaryTreeFilled } from "react-icons/tb";
import { PlayCircleOutlined, StopOutlined } from "@ant-design/icons";
import { JSButton } from "@/components/atomic/JSButton";
import { CodeInput } from "@/components/CodeInput";
import { useAppData } from "../../contexts/AppContext";
import styled from "styled-components";

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

export const CodeEditor = () => {
  const { parse, runAlgorithm, isRunning, stopAlgorithm } = useAppData();
  
  return (
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
  );
};
