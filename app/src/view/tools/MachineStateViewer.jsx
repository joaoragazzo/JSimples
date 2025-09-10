import { Button, Col, List, Row, Switch, Table } from "antd";
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
  height: 740px;
`;

const SectionCard = styled.div`

  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

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

const ControlBar = styled.div`
  margin: 20px 0px;
  display: flex;
  gap: 15px;
  flex-direction: column;
  width: 100%;
`;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  width: 100%;
  justify-content: center;
`

const StackWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
        width: 40,
      },
      {
        title: "Instrução",
        dataIndex: "instruction",
        width: 40,
      },
      {
        title: "Parâmetro",
        dataIndex: "parameter",
        width: 93
      },      
    ];
  
    const caption = [
      <div><NextToExecuteArrow /> Ponteiro para a próxima instrução</div>,
      <div><JustExecutedArrow /> Última instrução executada</div>
    ]
  return (
    <Container>
        <Row>
          <PointersCard>
            <PointersTitle>Registradores:</PointersTitle>
            <PointersContainer >
              <Pointer value={mvsState?.instructionPointer} label={"I"}/>
              <Pointer value={mvsState?.stack.length + (mvsState?.memory?.length || 0)} label={"S"}/>
              <Pointer value={mvsState?.dPointer || -1} label={"D"}/>
              
            </PointersContainer>
          </PointersCard>
        </Row>

        <Row>
          <SecondarySection>

            {parserResponse?.mvs?.length > 0 && 
              <TableWrapper>
                <Table
                  columns={columnsInstructions}
                  dataSource={parserResponse.mvs}
                  pagination={false}
                  size="small"
                  rowKey="key"
                  scroll={{ y: 460 }}

                />
                
                <StackWrapper>
                  <SectionTitle>Pilha (Stack)</SectionTitle>
                  <Stack variables={mvsState?.memory || []} data={mvsState?.stack} />
                </StackWrapper>   
            </TableWrapper>
            }
            
        
          <ControlBar ref={controlBarRef}>
            {
              !parserResponse?.mvs?.length && 
              <WarningWrapper>
                <Warning>
                  <IoWarning size={30}/>
                  <strong>Atenção: </strong>Não existe nenhum código MVS para ser executado. É necessário compilar o algoritmo primeiro.
                </Warning>
              </WarningWrapper>
            }
            {
              parserResponse?.mvs?.length > 0 && 
              <List 
                ref={legendRef} 
                header={<strong>Legenda</strong>} 
                dataSource={caption} 
                bordered 
                renderItem={(item) => <List.Item>{item}</List.Item>} 
                size="small" 
              />
            }
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