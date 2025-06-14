import { Button, Col, Row, Slider, Table } from "antd";
import { FaArrowRight } from "react-icons/fa";
import styled from "styled-components";
import { useAppData } from "../../contexts/AppContext";
import { useRef } from "react";
import { AiFillCaretRight } from "react-icons/ai";
import { VscDebugRestart } from "react-icons/vsc";

const ArrowCell = styled.div`
  text-align: center;
`;

const StyledTable = styled(Table)`
  overflow-y: auto;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const ControlBar = styled.div`
  margin: 20px 0px;
  display: flex;
  gap: 15px;
  flex-direction: column;
`;

export const MVSViewer = () => {
  const containerRef = useRef(null);
  const controlBarRef = useRef(null);
  const { parserResponse, mvsState, vmRef, resetVm, setMvsState } = useAppData();
  const columns = [
    {
      title: "",
      dataIndex: "key",
      width: 30,
      render: (_, record, index) =>
        index === mvsState.instructionPointer ? (
          <ArrowCell>
            <FaArrowRight />
          </ArrowCell>
        ) : null,
    },
    {
      title: "Rótulo",
      dataIndex: "label",
      width: 100,
    },
    {
      title: "Instrução",
      dataIndex: "instruction",
      width: 120,
    },
    {
      title: "Parâmetro",
      dataIndex: "parameter",
    },
  ];

  return (
    <Container ref={containerRef}>
      <StyledTable
        columns={columns}
        dataSource={parserResponse.mvs}
        pagination={false}
        size="small"
        rowKey="key"
        scroll={{ y: 450 }}
        virtual
      />

      <ControlBar ref={controlBarRef}>
        <Row gutter={24} align={"center"}>
          <Col>
            <Button onClick={resetVm}>
              <VscDebugRestart />
              Reiniciar
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() => {
                setMvsState(vmRef.current?.next());
              }}
            >
              Próxima instrução
              <AiFillCaretRight />
            </Button>
          </Col>
        </Row>
      </ControlBar>
    </Container>
  );
};
