import { Row, Col } from "antd";
import { PlayCircleOutlined, StopOutlined } from "@ant-design/icons";
import { JSButton } from "@/components/atomic/JSButton";
import { CodeInput } from "@/components/CodeInput";
import { useAppData } from "../../contexts/AppContext";
import styled from "styled-components";
import { FaGear } from "react-icons/fa6";
import { useRef } from "react";

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
  const { compile, runAlgorithm, isRunning, stopAlgorithm, parserResponse } = useAppData();
  const codeCanvaRef = useRef(null);

  return (
    <InputSection>
      <CodeInputWrapper ref={codeCanvaRef}>
        <CodeInput codeWrapperRef={codeCanvaRef} />
      </CodeInputWrapper>
      <ButtonRow gutter={24}>
        <Col span={12}>
          <JSButton
            onClick={compile}
            icon={<FaGear />}
            type="primary"
          >
            Compilar
          </JSButton>
        </Col>
        <Col span={12}>
          <JSButton
            onClick={isRunning ? stopAlgorithm : runAlgorithm}
            icon={isRunning ? <StopOutlined /> : <PlayCircleOutlined />}
            danger={isRunning ? true : false}
            disabled={!parserResponse.finished}
          >
            {isRunning ? "Parar execução" : "Executar código"}
          </JSButton>
        </Col>
      </ButtonRow>
    </InputSection>
  );
};
