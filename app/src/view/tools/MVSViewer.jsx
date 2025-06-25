import { Button, Col, List, Row, Table } from "antd";
import { FaArrowRight } from "react-icons/fa";
import styled from "styled-components";
import { useAppData } from "../../contexts/AppContext";
import { useEffect, useRef, useState } from "react";
import { AiFillCaretRight } from "react-icons/ai";
import { VscDebugRestart } from "react-icons/vsc";
import { IoWarning } from "react-icons/io5";
import { useWindowSize } from "../../utils/useWindowSize";

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

const TableWrapper = styled.div`
  display:flex;
  flex-direction: column;
  gap: 30px;
`
const MarginRightArrow = styled(FaArrowRight)`
  margin-right: 30px;
`

const JustExecutedArrow = styled(MarginRightArrow)`
  fill: rgb(30, 95, 214);
`

const NextToExecuteArrow = styled(MarginRightArrow)`
  fill: rgb(233, 39, 39);
`

const Warning = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`

const WarningWrapper = styled.div`
  padding: 15px;
  background-color: oklch(95.4% 0.038 75.164);
  color: oklch(55.3% 0.195 38.402);
  border-radius: 10px;
  border: 1px solid oklch(55.3% 0.195 38.402);
`

export const MVSViewer = () => {
  const containerRef = useRef(null);
  const controlBarRef = useRef(null);
  const legendRef = useRef(null);
  const [lastExecuted, setLastExecuted] = useState(-1);
  const [executed, setExecuted] = useState(0);
  const [tableHeight, setTableHeight] = useState();
  const { parserResponse, mvsState, vmRef, resetVm, setMvsState } = useAppData();
  const { height, width } = useWindowSize();



  useEffect(() => {
    setLastExecuted(executed);
    setExecuted(mvsState.instructionPointer);
  }, [mvsState.instructionPointer])

  useEffect(() => {
    const updateTableHeight = () => {
      if (!containerRef.current || !controlBarRef.current || !legendRef.current) return;
      if (width > 768) {
        const containerHeight = containerRef.current.offsetHeight;
        const controlHeight = controlBarRef.current.offsetHeight;
        const legendHeight = legendRef.current.offsetHeight;
        
        const calculatedHeight = containerHeight - controlHeight - legendHeight - 200; // 40px de margem extra
        setTableHeight(calculatedHeight);
      } else {
        setTableHeight(800)
      }
    };
    updateTableHeight();
    window.addEventListener('resize', updateTableHeight);
    return () => window.removeEventListener('resize', updateTableHeight);
  }, [height, width]);
  

  const columns = [
    {
      title: "",
      dataIndex: "key",
      width: 30,
      render: (_, record, index) =>
        index === executed ? (
          <ArrowCell>
            <NextToExecuteArrow />
          </ArrowCell>
        ) : index === lastExecuted ? <ArrowCell>
          <JustExecutedArrow />
        </ArrowCell> : null
    },
    {
      title: "Rótulo",
      dataIndex: "label",
      width: 65,
    },
    {
      title: "Instrução",
      dataIndex: "instruction",
      width: 85,
    },
    {
      title: "Parâmetro",
      dataIndex: "parameter",
      width: 93
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

  const caption = [
    <div><NextToExecuteArrow /> Ponteiro para a próxima instrução</div>,
    <div><JustExecutedArrow /> Última instrução executada</div>
  ]

  return (
    <Container ref={containerRef}>
      <TableWrapper>
        <StyledTable
          columns={columns}
          dataSource={parserResponse.mvs}
          pagination={false}
          size="small"
          rowKey="key"
          scroll={{ y: tableHeight }}
        />
          
      </TableWrapper>
      

      <ControlBar ref={controlBarRef}>
        <WarningWrapper>
          {!parserResponse?.mvs?.length && <Warning><IoWarning size={30}/><strong>Atenção: </strong>Não existe nenhum código MVS para ser executado. É necessário compilar o algoritmo primeiro.</Warning>}
        </WarningWrapper>
        <List ref={legendRef} header={<strong>Legenda</strong>} dataSource={caption} bordered renderItem={(item) => <List.Item>{item}</List.Item>} size="small" />
        <Row gutter={24} align={"center"}>
          <Col>
            <Button onClick={resetVm} disabled={!parserResponse?.mvs?.length}>
              <VscDebugRestart />
              Reiniciar
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() => {
                setMvsState(vmRef.current?.next());
              }}
              disabled={!parserResponse?.mvs?.length}
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
