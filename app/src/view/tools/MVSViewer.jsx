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
      width: 100,
    },
    {
      title: "Parâmetro",
      dataIndex: "parameter",
      width: 100
    },
    {
      title: "Descrição",
      dataIndex: "description",
      render: (_, record, index) => {
        switch (record.instruction) {
          case `INPP`:
            return `Inicia o programa principal`
          case `FIMP`:
            return `Fim do programa`
          case `AMEM`:
            return `Aloca ${record.parameter} espaços na memória`
          case `CRCT`:
            return `Carrega o valor ${record.parameter} na pilha`
          case `CRVG`:
            return `Carrega a variável global do endereço ${record.parameter}`
          case `ARZG`:
            return `Armazena uma variável global no endereço ${record.parameter}`
          case `DSVS`:
            return `Desvia para ${record.parameter} sempre`
          case `DSVF`:
            return `Desvia para ${record.parameter} se falso`
          case `LEIA`:
            return `Leitura`
          case `ESCR`:
            return `Escrita`
          case `CMMA`:
            return `Compara se maior`
          case `CMME`:
            return `Compara se menor`
          case `CMIG`:
            return `Compara se igual`
          case `DISJ`:
            return `Disjunção`
          case `CONJ`: 
            return `Conjução`
          case `NEGA`:
            return `Negação`
          case `SOMA`:
            return `Soma`
          case `SUBT`:
            return `Subtração`
          case `MULT`:
            return `Multiplicação`
          case `NADA`:
            return `Não faz nada`
          case `DMEM`:
            return `Desaloca ${record.parameter} espaços na memória`
        }
      }
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
