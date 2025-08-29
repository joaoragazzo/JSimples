import { Button, Col, List, Row, Table } from "antd";
import { useAppData } from "@/contexts/AppContext";
import styled from "styled-components";
import { Stack } from "@/components/Stack";
import "@/styles/Table.css";
import { FaArrowRight } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { IoWarning } from "react-icons/io5";
import { AiFillCaretRight } from "react-icons/ai";
import { VscDebugRestart } from "react-icons/vsc";
import { Pointer } from "../../components/Pointer";

const Container = styled.div`
`;

const SectionCard = styled.div`
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BigSectionCard = styled(SectionCard)`
  padding: 8px 10px;
  border: 1px solid #e8e8e8;
  height: 200px;
`

const PointersCard = styled(SectionCard)`
  padding: 8px 0px;
  height: max-content;
  width: 100%;
  margin-bottom: 10px;
  flex-direction: row; 
  
  align-items: center;
  justify-content: center;
  display: flex;
`

const PointersTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #262626;
  margin-right: 25px;
`


const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #262626;
`;

const StyledTable = styled(Table)`
  width: 250px;

  .ant-table-thead > tr > th {
    background: #fafafa;
    font-weight: 500;
    border-bottom: 1px solid #e8e8e8;
  }
  
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f0f0f0;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px;
  color: #8c8c8c;
  font-size: 14px;
`;

const MemoryInfo = styled.div`
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 8px;
`;

const SecondarySection = styled.div`
  background: #fff;
  margin-top: 16px;
  border-radius: 8px;
  display: flex;
  height: 310px;
  width: 100%;
  flex-direction: column;
  align-items: center;
`

const ArrowCell = styled.div`
  text-align: center;
`;

const StyledTableInstructions = styled(Table)`
  overflow-y: auto;
`;

const ControlBar = styled.div`
  margin: 20px 0px;
  display: flex;
  gap: 15px;
  flex-direction: column;
  width: 100%;
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

const PointersContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`

export const MachineStateViewer = () => {
  const controlBarRef = useRef(null);
  const legendRef = useRef(null);
  const [lastExecuted, setLastExecuted] = useState(-1);
  const [executed, setExecuted] = useState(0);
  const { mvsState, parserResponse, vmRef, resetVm, setMvsState } = useAppData();
  
  useEffect(() => {
      setLastExecuted(executed);
      setExecuted(mvsState.instructionPointer);
    }, [mvsState.instructionPointer])
    
  
    const columnsInstructions = [
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
        width: 250,       
        ellipsis: true,  
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
  
  const columns = [
    {
      title: "Endereço",
      dataIndex: "address",
      width: 100,
    },
    {
      title: "Valor",
      dataIndex: "value",
      render: (value) => value ?? 0,
    },
  ];

  const memoryData = mvsState.memory?.map((value, index) => ({
    key: index,
    address: index,
    value,
  })) || [];


  return (
    <Container>
        <Row>
          <PointersCard>
            <PointersTitle>Ponteiros:</PointersTitle>
            <PointersContainer >
              <Pointer value={mvsState?.instructionPointer} label={"I"}/>
              <Pointer value={mvsState?.stack.length + (mvsState?.memory?.length || 0)} label={"S"}/>
              <Pointer value={-1} label={"D"}/>
            </PointersContainer>
          </PointersCard>
        </Row>
        <Row gutter={16}>
          <Col span={14}>
            <BigSectionCard>
              <SectionTitle>Tabela de variáveis</SectionTitle>
              {memoryData.length > 0 ? (
                <>
                  <StyledTable
                    dataSource={memoryData}
                    columns={columns}
                    pagination={false}
                    size="small"
                    scroll={{y: 100}}
                    
                  />
                  <MemoryInfo>
                    {memoryData.length} posições alocadas
                  </MemoryInfo>
                </>
              ) : (
                <EmptyState>
                  Nenhuma variável alocada
                </EmptyState>
              )}
            </BigSectionCard>
          </Col>
          
          <Col span={10}>
            <BigSectionCard>
              <SectionTitle>Pilha (Stack)</SectionTitle>
              <Stack variables={mvsState?.memory || []} data={mvsState?.stack} />
            </BigSectionCard>
          </Col>
        </Row>

        <Row>
          <SecondarySection>
            <TableWrapper>
              <StyledTableInstructions
                columns={columnsInstructions}
                dataSource={parserResponse.mvs}
                pagination={false}
                size="small"
                rowKey="key"
                scroll={{ y: 230 }}
              />   
          </TableWrapper>
        
          <ControlBar ref={controlBarRef}>
            {!parserResponse?.mvs?.length && <WarningWrapper><Warning><IoWarning size={30}/><strong>Atenção: </strong>Não existe nenhum código MVS para ser executado. É necessário compilar o algoritmo primeiro.</Warning></WarningWrapper>}
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
                  Executar Instrução
                  <AiFillCaretRight />
                </Button>
              </Col>
            </Row>
          </ControlBar>
            {/* <CodeEditor stepByStep={true}/> */}
          </SecondarySection>
        </Row>

    </Container>
  );
};